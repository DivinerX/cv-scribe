import { NextRequest, NextResponse } from 'next/server'

// This route is no longer needed with NextAuth.js
// NextAuth.js handles the OAuth callback automatically
export async function GET(request: NextRequest) {
  // Redirect to the dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
