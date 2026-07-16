import { getRequestContext } from '@cloudflare/next-on-pages';

/**
 * Hashing helper using standard Web Crypto API (fully compatible with Cloudflare Edge).
 */
export async function sha256(message) {
  if (!message) return '';
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Checks if the request contains a valid admin_session cookie matching the hashed ADMIN_PASSWORD.
 */
export async function verifyAuth(request) {
  let adminPassword = 'admin';
  try {
    const context = getRequestContext();
    adminPassword = context.env.ADMIN_PASSWORD || adminPassword;
  } catch (err) {
    console.warn("verifyAuth: Could not load request context, using fallback.", err.message);
  }

  const expectedHash = await sha256(adminPassword);

  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies['admin_session'];

  return sessionToken === expectedHash;
}

/**
 * Basic helper to parse cookies from headers.
 */
function parseCookies(cookieString) {
  const list = {};
  if (!cookieString) return list;

  cookieString.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const name = parts.shift().trim();
    const val = parts.join('=').trim();
    if (name) {
      list[name] = decodeURIComponent(val);
    }
  });

  return list;
}
