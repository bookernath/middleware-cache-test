# Cached Middleware Fetch Demo

This Next.js app demonstrates the capabilities of `cached-middleware-fetch-next` library, showcasing how middleware-level caching works with Vercel's edge runtime.

## How It Works

1. **API Route** (`/api/demo`): Simulates a slow API with a 1000ms delay that returns:
   - Current timestamp
   - A random value (to verify cache behavior)
   - Server time

2. **Middleware**: Intercepts requests to the root path (`/`) and:
   - Fetches from the demo API using `cachedFetch`
   - Caches responses for 30 seconds (SWR behavior)
   - Measures fetch performance
   - Returns an HTML page showing cache metrics

## Testing the Demo

1. **First Visit**: 
   - Cache Status: MISS
   - Fetch Duration: ~1000ms (full API delay)
   - Note the random value

2. **Immediate Refresh** (within 30 seconds):
   - Cache Status: HIT
   - Fetch Duration: ~0-5ms (served from cache)
   - Random value remains the same (proving it's cached)

3. **After 30 seconds**:
   - Cache Status: STALE (if SWR is working)
   - The cache will serve stale data immediately
   - A background refresh will update the cache
   - Next refresh will show updated data

## Key Features Demonstrated

- ✅ Edge middleware caching
- ✅ SWR (Stale-While-Revalidate) behavior
- ✅ Performance improvement (1000ms → ~5ms)
- ✅ Cache status visibility
- ✅ Time-based revalidation (30 seconds)

## Local Development

```bash
npm run dev
```

Visit http://localhost:3000 to see the demo.

## Production

The demo is deployed at: https://cached-middleware-fetch-next-example.vercel.app/

Note: The middleware fetches from the production URL to ensure consistency.
