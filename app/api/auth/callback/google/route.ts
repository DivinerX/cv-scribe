import { NextRequest, NextResponse } from 'next/server'
import { query, upsertProfile } from '@/utils/db'
import { createSession, setSessionCookie } from '@/lib/auth'

interface GoogleTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  id_token: string
}

interface GoogleUserInfo {
  id: string
  email: string
  name: string
  picture?: string
  given_name?: string
  family_name?: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // Check for OAuth errors
  if (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin?error=oauth_error`)
  }

  if (!code || !state) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin?error=missing_code`)
  }

  // Verify state parameter
  const storedState = request.cookies.get('oauth_state')?.value
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin?error=invalid_state`)
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json()

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error('Failed to get user info')
    }

    const googleUser: GoogleUserInfo = await userResponse.json()

    // Check if user exists in database
    let userResult = await query('SELECT id FROM users WHERE email = $1', [googleUser.email])
    let userId: number

    if (userResult.rows.length === 0) {
      // Create new user
      const newUserResult = await query(
        'INSERT INTO users (email, name, image) VALUES ($1, $2, $3) RETURNING id',
        [googleUser.email, googleUser.name, googleUser.picture]
      )
      userId = newUserResult.rows[0].id

      // Create profile for new user
      await upsertProfile(userId, {
        name: googleUser.name,
        email: googleUser.email,
        phone: "",
        location: "",
        birthday: "",
        github: "",
        linkedin: "",
        website: "",
        education: "",
        skills: "",
        projects: "",
        experience: ""
      })
    } else {
      userId = userResult.rows[0].id

      // Update user info
      await query(
        'UPDATE users SET name = $1, image = $2 WHERE id = $3',
        [googleUser.name, googleUser.picture, userId]
      )
    }

    // Check user status
    const profileResult = await query('SELECT status FROM profiles WHERE user_id = $1', [userId])
    const status = profileResult.rows[0]?.status || 'not_allowed'

    if (status === 'not_allowed') {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/not_allowed`)
    }

    // Create session
    const sessionToken = await createSession(userId)

    // Set session cookie and redirect
    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`)

    // Set session cookie on the response
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    response.cookies.set('session-token', sessionToken, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    // Clear OAuth state cookie
    response.cookies.delete('oauth_state')

    return response

  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin?error=callback_error`)
  }
}
