import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const runtime = 'edge';

function generateAccessCode(name) {
  let prefix = name
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 6);
  if (!prefix) prefix = 'DEMO';
  
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${randomPart}`;
}

// PATCH handles status toggling, code regeneration, and detail updates
export async function PATCH(request, { params }) {
  try {
    const db = getDb();
    const { id } = await params;
    const body = await request.json();

    // Check if the project exists first
    const project = await db.prepare("SELECT * FROM projects WHERE id = ?").bind(id).first();
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    // Case 1: Toggle active status
    if (body.active !== undefined) {
      const activeValue = body.active ? 1 : 0;
      await db.prepare(
        "UPDATE projects SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).bind(activeValue, id).run();
      
      return NextResponse.json({ success: true, message: `Status updated to ${body.active ? 'Enabled' : 'Disabled'}` });
    }

    // Case 2: Regenerate access code
    if (body.regenerateCode === true) {
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
        "UPDATE projects SET access_code = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).bind(accessCode, id).run();

      return NextResponse.json({ success: true, accessCode, message: "Access code regenerated successfully" });
    }

    // Case 3: Update custom access code
    if (body.accessCode !== undefined) {
      const customCode = body.accessCode.trim().toUpperCase();
      if (!customCode) {
        return NextResponse.json({ success: false, error: "Access code cannot be empty" }, { status: 400 });
      }

      // Check collision
      const collisionCheck = await db.prepare(
        "SELECT id FROM projects WHERE access_code = ? AND id != ?"
      ).bind(customCode, id).first();
      
      if (collisionCheck) {
        return NextResponse.json({ success: false, error: "This access code is already in use by another project." }, { status: 409 });
      }

      await db.prepare(
        "UPDATE projects SET access_code = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).bind(customCode, id).run();

      return NextResponse.json({ success: true, accessCode: customCode, message: "Custom access code updated successfully" });
    }

    // Case 4: Update general details
    if (body.name !== undefined || body.description !== undefined) {
      const newName = body.name !== undefined ? body.name.trim() : project.name;
      const newDesc = body.description !== undefined ? body.description.trim() : project.description;

      if (!newName) {
        return NextResponse.json({ success: false, error: "Project name cannot be empty" }, { status: 400 });
      }

      await db.prepare(
        "UPDATE projects SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
      ).bind(newName, newDesc, id).run();

      return NextResponse.json({ success: true, message: "Project metadata updated successfully" });
    }

    return NextResponse.json({ success: false, error: "No valid update operations provided" }, { status: 400 });

  } catch (error) {
    console.error("Modify project API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE removes project metadata
export async function DELETE(request, { params }) {
  try {
    const db = getDb();
    const { id } = await params;

    const project = await db.prepare("SELECT id FROM projects WHERE id = ?").bind(id).first();
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    await db.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
    return NextResponse.json({ success: true, message: "Project metadata deleted successfully" });

  } catch (error) {
    console.error("Delete project API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
