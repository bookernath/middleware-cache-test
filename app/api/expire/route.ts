import { NextResponse } from 'next/server';
import { expireTag } from 'cached-middleware-fetch-next';

/**
 * On-demand cache expiry by tag.
 *
 * Entries created by cachedFetch() with `next: { tags: ['demo-api'] }` are
 * tagged in Vercel Runtime Cache, so a single expireTag() call evicts them in
 * every region. Next's revalidateTag() does not affect Runtime Cache; this is
 * the equivalent for proxy-level caching.
 */
export async function POST() {
  await expireTag('demo-api');
  return NextResponse.json({ expired: ['demo-api'], at: new Date().toISOString() });
}
