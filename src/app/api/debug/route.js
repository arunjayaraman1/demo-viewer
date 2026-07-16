import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(request) {
  let contextData = null;
  let contextError = null;

  try {
    const context = getRequestContext();
    contextData = {
      exists: !!context,
      hasEnv: context ? !!context.env : false,
      envKeys: context && context.env ? Object.keys(context.env) : [],
    };
  } catch (err) {
    contextError = err.message;
  }

  const envKeys = Object.keys(process.env || {});

  return NextResponse.json({
    success: true,
    context: contextData,
    contextError,
    envKeys,
    nodeEnv: process.env.NODE_ENV,
  });
}
