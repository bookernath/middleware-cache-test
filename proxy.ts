import { NextRequest, NextResponse } from 'next/server';
import { cachedFetch } from 'cached-middleware-fetch-next';

/**
 * Demo proxy showcasing cached-middleware-fetch-next features:
 * - SWR (Stale-While-Revalidate) caching strategy
 * - Cache status headers (X-Cache-Status, X-Cache-Age, X-Cache-Expires-In)
 * - Background refresh using waitUntil() for non-blocking updates
 * - Separate revalidate and expires times for optimal performance
 */
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only process the root path for our demo
  if (pathname === '/') {
    try {
      // Measure fetch performance
      const startTime = performance.now();
      
      // Fetch from our demo API with caching
      // Uses SWR (Stale-While-Revalidate) strategy:
      // - Data is fresh for 5 seconds
      // - After 5 seconds, serve stale data instantly while refreshing in background
      // - After 30 seconds, cache expires completely
      // Use localhost for development, external URL for production
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000/api/demo'
        : `https://${process.env.API_HOSTNAME ?? 'cached-middleware-fetch-next-example.vercel.app'}/api/demo`;
      
      const response = await cachedFetch(
        apiUrl,
        {
          next: {
            revalidate: 5, // Consider stale after 5 seconds
            expires: 30,   // Absolute expiry after 30 seconds
            tags: ['demo-api'],
          },
        }
      );

      const endTime = performance.now();
      const fetchDuration = endTime - startTime;

      // Parse the response
      const data = await response.json();
      
      // Get cache status from response headers
      const cacheStatus = response.headers.get('X-Cache-Status') || 'UNKNOWN';
      const cacheAge = parseInt(response.headers.get('X-Cache-Age') || '0', 10);
      const cacheExpiresIn = response.headers.get('X-Cache-Expires-In');

      // Create an HTML response with the cache information
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cached Middleware Fetch Demo</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
      margin-bottom: 2rem;
    }
    .info-grid {
      display: grid;
      gap: 1.5rem;
    }
    .info-item {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid #0070f3;
    }
    .info-item strong {
      display: block;
      color: #666;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }
    .info-item .value {
      font-size: 1.125rem;
      color: #333;
    }
    .cache-hit {
      border-left-color: #10b981;
    }
    .cache-miss {
      border-left-color: #ef4444;
    }
    .cache-stale {
      border-left-color: #f59e0b;
    }
    .cache-unknown {
      border-left-color: #6b7280;
    }
    .refresh-button {
      margin-top: 2rem;
      padding: 0.75rem 1.5rem;
      background: #0070f3;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .refresh-button:hover {
      background: #0051cc;
    }
    .description {
      margin-top: 2rem;
      padding: 1rem;
      background: #e7f3ff;
      border-radius: 4px;
      font-size: 0.875rem;
      line-height: 1.6;
    }
    .view-code-link {
      display: inline-block;
      margin-bottom: 1.5rem;
      padding: 0.5rem 1rem;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      color: #0070f3;
      text-decoration: none;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    .view-code-link:hover {
      background: #e9ecef;
      border-color: #0070f3;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Cached Middleware Fetch Demo</h1>
    <a href="https://github.com/bookernath/middleware-cache-test/blob/main/proxy.ts" class="view-code-link" target="_blank">View Code ↗</a>
    
    <div class="info-grid">
      <div class="info-item ${
        cacheStatus === 'HIT' ? 'cache-hit' : 
        cacheStatus === 'STALE' ? 'cache-stale' : 
        cacheStatus === 'MISS' ? 'cache-miss' : 'cache-unknown'
      }">
        <strong>Cache Status</strong>
        <div class="value">${cacheStatus}${cacheStatus === 'STALE' ? ' (Background Refresh)' : ''}</div>
      </div>
      
      <div class="info-item">
        <strong>cachedFetch() Duration</strong>
        <div class="value">${fetchDuration.toFixed(2)}ms</div>
      </div>
      
      <div class="info-item">
        <strong>API Response Timestamp</strong>
        <div class="value">${data.timestamp}</div>
      </div>
      
      <div class="info-item">
        <strong>Random Value (to verify cache)</strong>
        <div class="value">${data.randomValue?.toFixed(6) || 'N/A'}</div>
      </div>
      
      <div class="info-item">
        <strong>Cache Age</strong>
        <div class="value">${cacheAge} seconds</div>
      </div>
      
      ${cacheExpiresIn ? `
      <div class="info-item">
        <strong>Cache Expires In</strong>
        <div class="value">${cacheExpiresIn} seconds</div>
      </div>
      ` : ''}
      
      <div class="info-item">
        <strong>Current Time</strong>
        <div class="value">${new Date().toISOString()}</div>
      </div>
    </div>
    
    <button class="refresh-button" onclick="window.location.reload()">
      Refresh Page
    </button>
    
    <div class="description">
      <p><strong>How it works:</strong></p>
      <ul>
        <li>The proxy fetches from an API endpoint that has a 1000ms delay</li>
        <li>Uses SWR (Stale-While-Revalidate) caching strategy with separate revalidate and expiry times</li>
        <li><strong>Cache HIT:</strong> Fresh cached data served instantly (~0-5ms)</li>
        <li><strong>Cache STALE:</strong> Cached data served instantly, background refresh triggered via waitUntil() (~0-5ms)</li>
        <li><strong>Cache MISS:</strong> No cached data available, full API delay incurred (~1000ms)</li>
        <li>Data is fresh for 5 seconds (revalidate time)</li>
        <li>After 5 seconds, data becomes stale but is served instantly while refreshing in background</li>
        <li>After 30 seconds, cache expires completely and requires a fresh fetch</li>
        <li>The random value helps verify when the cache is actually being used</li>
        <li>Cache status provided via response headers: X-Cache-Status, X-Cache-Age, X-Cache-Expires-In</li>
      </ul>
    </div>
  </div>
</body>
</html>
      `;

      // Return the HTML response
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
          'X-Cache-Demo-Status': cacheStatus,
          'X-Cache-Demo-Duration': `${fetchDuration.toFixed(2)}ms`,
          'X-Cache-Demo-Age': cacheAge.toString(),
          ...(cacheExpiresIn && { 'X-Cache-Demo-Expires-In': cacheExpiresIn }),
        },
      });
    } catch (error) {
      console.error('Proxy error:', error);
      // Fall through to normal Next.js handling on error
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
