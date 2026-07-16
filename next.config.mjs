import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Initialize Cloudflare local environment simulation (D1, KV, R2) for next dev
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

export default nextConfig;
