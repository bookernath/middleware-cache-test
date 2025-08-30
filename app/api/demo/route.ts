import { NextResponse } from 'next/server';

// Simulate a slow API response
async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET() {
  // Add 1000ms delay to simulate slow API
  await sleep(1000);

  // Return response with current timestamp
  const responseData = {
    timestamp: new Date().toISOString(),
    serverTime: Date.now(),
    message: 'This response was generated after a 1000ms delay',
    randomValue: Math.random(), // To verify when cache is actually refreshed
  };

  return NextResponse.json(responseData, {
    headers: {
      'Cache-Control': 'no-store', // Ensure the API itself doesn't cache
      'X-Response-Time': '1000ms',
    },
  });
}
