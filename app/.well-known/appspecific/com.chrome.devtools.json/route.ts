import { NextResponse } from 'next/server'

// Chrome DevTools tries to fetch this file for debugging configurations
// Return an empty object to prevent 404 errors in logs
export async function GET() {
  return NextResponse.json({})
}
