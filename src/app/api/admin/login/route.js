import { NextResponse } from 'next/server';
import { sha256 } from '@/lib/auth';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    if (password === adminPassword) {
      const hashedSession = await sha256(adminPassword);
      
      const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });
      
      // Set secure cookie
      response.headers.append(
        'Set-Cookie',
        `admin_session=${hashedSession}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax`
      );

      return response;
    }

    return NextResponse.json({ success: false, error: 'Incorrect credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
