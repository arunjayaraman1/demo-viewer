import { getRequestContext } from '@cloudflare/next-on-pages';

/**
 * Resolves the Cloudflare D1 database instance.
 * Supports both local development (under next-on-pages) and remote deployment.
 */
export function getDb() {
  try {
    const context = getRequestContext();
    if (context && context.env && context.env.DB) {
      return context.env.DB;
    }
  } catch (error) {
    // getRequestContext throws if run outside of Cloudflare Edge sandbox (e.g. at build time or custom local runs)
  }

  // Fallback check for process.env
  if (process.env.DB) {
    return process.env.DB;
  }

  throw new Error("Cloudflare D1 database binding 'DB' is missing. Verify wrangler.jsonc bindings.");
}
