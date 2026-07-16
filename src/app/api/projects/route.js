import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  try {
    const db = getDb();
    
    // Select all projects, sorted by creation date
    const { results } = await db.prepare(
      "SELECT * FROM projects ORDER BY active DESC, name ASC"
    ).all();
    
    return NextResponse.json({
      success: true,
      projects: results
    });

  } catch (error) {
    console.error("List projects API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
