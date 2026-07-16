import { NextResponse } from 'next/server';
import { sha256 } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    let adminPassword = 'admin';
    try {
      const context = getRequestContext();
      adminPassword = context.env.ADMIN_PASSWORD || adminPassword;
    } catch (err) {
      console.warn("login API: Could not load request context, using fallback.", err.message);
    }

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
