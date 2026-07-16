import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export const runtime = 'edge';

// Helper to generate a unique random access code with a project name prefix
function generateAccessCode(name) {
  let prefix = name
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 6);
  if (!prefix) prefix = 'DEMO';
  
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous chars like O, 0, I, 1
  let randomPart = '';
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${randomPart}`;
}

export async function GET(request) {
  try {
    const isAuth = await verifyAuth(request);
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    
    // 1. Fetch the static projects manifest generated at build time
    const manifestUrl = new URL('/projects-manifest.json', request.url);
    const manifestRes = await fetch(manifestUrl);
    if (!manifestRes.ok) {
      throw new Error('Failed to load projects-manifest.json. Run pre-build script first.');
    }
    const manifestProjects = await manifestRes.json();

    // 2. Fetch all existing projects from Cloudflare D1 database
    const { results: dbProjects } = await db.prepare("SELECT * FROM projects").all();
    
    const dbMap = new Map(dbProjects.map(p => [p.slug, p]));
    const manifestSlugs = new Set(manifestProjects.map(p => p.slug));

    const syncSummary = {
      added: 0,
      removed: 0,
      restored: 0,
      updated: 0,
      ignored: 0
    };

    // 3. Sync manifest projects -> D1
    for (const project of manifestProjects) {
      const dbProject = dbMap.get(project.slug);
      
      if (!dbProject) {
        // Project is brand new - insert it and generate a code
        const id = crypto.randomUUID();
        
        // Generate unique access code (retry loop in case of rare collision)
        let accessCode = generateAccessCode(project.name);
        let isUnique = false;
        let retries = 0;
        
        while (!isUnique && retries < 10) {
          const collisionCheck = await db.prepare("SELECT id FROM projects WHERE access_code = ?").bind(accessCode).first();
          if (!collisionCheck) {
            isUnique = true;
          } else {
            accessCode = generateAccessCode(project.name);
            retries++;
          }
        }

        await db.prepare(
          "INSERT INTO projects (id, slug, name, description, access_code, active) VALUES (?, ?, ?, ?, ?, 1)"
        ).bind(id, project.slug, project.name, project.description || '', accessCode).run();
        
        syncSummary.added++;
      } else {
        // Project exists in DB
        let needsUpdate = false;
        
        // If it was inactive, restore it
        if (dbProject.active === 0) {
          await db.prepare("UPDATE projects SET active = 1, updated_at = CURRENT_TIMESTAMP WHERE slug = ?").bind(project.slug).run();
          syncSummary.restored++;
          needsUpdate = true;
        }

        // If metadata changed, update it
        if (dbProject.name !== project.name || dbProject.description !== project.description) {
          await db.prepare(
            "UPDATE projects SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?"
          ).bind(project.name, project.description || '', project.slug).run();
          syncSummary.updated++;
          needsUpdate = true;
        }

        if (!needsUpdate) {
          syncSummary.ignored++;
        }
      }
    }

    // 4. Handle removed projects (in DB active, but missing in manifest)
    for (const dbProject of dbProjects) {
      if (dbProject.active === 1 && !manifestSlugs.has(dbProject.slug)) {
        await db.prepare(
          "UPDATE projects SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE slug = ?"
        ).bind(dbProject.slug).run();
        syncSummary.removed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Sync operation completed successfully",
      summary: syncSummary
    });

  } catch (error) {
    console.error("Sync API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
