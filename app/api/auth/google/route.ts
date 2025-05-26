import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  
  // Generate a random state parameter for security
  const state = crypto.randomUUID()
  
  googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!)
  googleAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXTAUTH_URL}/api/auth/callback/google`)
  googleAuthUrl.searchParams.set('response_type', 'code')
  googleAuthUrl.searchParams.set('scope', 'openid email profile')
  googleAuthUrl.searchParams.set('state', state)
  
  // Store state in a cookie for verification
  const response = NextResponse.redirect(googleAuthUrl.toString())
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600 // 10 minutes
  })
  
  return response
}
