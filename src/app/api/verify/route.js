import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const db = getDb();
    const { accessCode } = await request.json();

    if (!accessCode || typeof accessCode !== 'string') {
      return NextResponse.json({ success: false, error: "Access code is required." }, { status: 400 });
    }

    const cleanCode = accessCode.trim().toUpperCase();

    // Query D1 database for the matching active project code
    const project = await db.prepare(
      "SELECT slug, active FROM projects WHERE UPPER(access_code) = ?"
    ).bind(cleanCode).first();

    if (!project) {
      return NextResponse.json({ success: false, error: "Invalid access code. Please try again." }, { status: 404 });
    }

    if (project.active === 0) {
      return NextResponse.json({ success: false, error: "This presentation is currently unavailable." }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      slug: project.slug
    });

  } catch (error) {
    console.error("Verification API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
