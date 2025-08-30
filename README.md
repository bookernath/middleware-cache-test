# Cached Middleware Fetch Demo

A Next.js demonstration application showcasing the capabilities of [`cached-middleware-fetch-next`](https://www.npmjs.com/package/cached-middleware-fetch-next) - a fetch wrapper that enables caching in Next.js edge middleware using Vercel's Runtime Cache.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/bookernath/middleware-cache-test)

## 🚀 Live Demo

**[View Live Demo](https://middleware-cache-test-rosy.vercel.app/)** - Experience real-time caching behavior with performance metrics and cache status indicators.

## 🎯 What This Demo Shows

This application demonstrates how middleware-level caching can dramatically improve performance by caching slow API responses. The demo includes:

- **SWR (Stale-While-Revalidate) Caching**: Serves cached data instantly while refreshing in the background
- **Performance Metrics**: Real-time comparison of cached vs uncached response times
- **Cache Status Visibility**: Clear indicators showing HIT, MISS, or STALE cache states
- **Background Refresh**: Non-blocking cache updates using Vercel's `waitUntil()`

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Request  │───▶│   Middleware     │───▶│   Slow API      │
│   (Browser)     │    │   (cachedFetch)  │    │   (1000ms delay)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  Vercel Runtime  │
                       │      Cache       │
                       └──────────────────┘
```

### Components

1. **Middleware** (`middleware.ts`): Intercepts requests to `/` and fetches from the demo API with caching
2. **Demo API** (`/api/demo`): Simulates a slow external service with a 1000ms delay
3. **Cache Layer**: Uses Vercel Runtime Cache for persistence across requests

## 🧪 Testing the Cache Behavior

### First Visit (Cache MISS)
- **Cache Status**: `MISS`
- **Response Time**: ~1000ms (full API delay)
- **Behavior**: Fresh data fetched from API

### Immediate Refresh (Cache HIT)
- **Cache Status**: `HIT` 
- **Response Time**: ~0-5ms (served from cache)
- **Behavior**: Cached data served instantly

### After Revalidation Time (Cache STALE)
- **Cache Status**: `STALE`
- **Response Time**: ~0-5ms (stale data served instantly)
- **Behavior**: Background refresh triggered via `waitUntil()`

### After Expiry Time (Cache MISS)
- **Cache Status**: `MISS`
- **Response Time**: ~1000ms (cache expired, fresh fetch required)
- **Behavior**: Cache completely expired, new data fetched

## ⚙️ Cache Configuration

The demo uses the following caching strategy:

```typescript
const response = await cachedFetch('/api/demo', {
  next: {
    revalidate: 5,    // Consider stale after 5 seconds
    expires: 30,      // Absolute expiry after 30 seconds
    tags: ['demo-api']
  }
});
```

- **Fresh Period**: 0-5 seconds (instant cache hits)
- **Stale Period**: 5-30 seconds (instant response + background refresh)
- **Expired**: After 30 seconds (fresh fetch required)

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/middleware-cache-test.git
cd middleware-cache-test

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the demo.

### Environment Variables

The demo can optionally use a custom API hostname:

```bash
# .env.local (optional)
API_HOSTNAME=your-custom-api-host.com
```

If not set, defaults to the production demo API.

## 📊 Performance Impact

| Scenario | Response Time | Cache Status | User Experience |
|----------|---------------|--------------|-----------------|
| First Visit | ~1000ms | MISS | Initial delay |
| Cached Response | ~0-5ms | HIT | Instant response |
| Stale Response | ~0-5ms | STALE | Instant response + background refresh |
| Expired Cache | ~1000ms | MISS | Fresh fetch required |

**Performance Improvement**: Up to **200x faster** response times for cached requests.

## 🔍 Cache Headers

The demo exposes cache information through response headers:

- `X-Cache-Status`: Cache hit status (`HIT`, `MISS`, `STALE`)
- `X-Cache-Age`: Age of cached data in seconds
- `X-Cache-Expires-In`: Time until cache expires (if applicable)

## 📚 Related Resources

- **Package Documentation**: [cached-middleware-fetch-next](https://www.npmjs.com/package/cached-middleware-fetch-next)
- **Next.js Middleware**: [Official Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- **Vercel Runtime Cache**: [Edge Functions Documentation](https://vercel.com/docs/functions/edge-functions/edge-runtime#cache-api)

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs or issues
- Suggest improvements to the demo
- Submit pull requests

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.