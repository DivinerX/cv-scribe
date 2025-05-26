import { cookies } from 'next/headers'
import { query } from '@/utils/db'

export interface User {
  id: number
  email: string
  name: string
  image?: string
  isAdmin: boolean
  status: string
}

export interface AuthSession {
  user: User
  expires: string
}

// Generate a secure random session token
export function generateSessionToken(): string {
  return crypto.randomUUID() + '-' + Date.now().toString(36)
}

// Create a session in the database
export async function createSession(userId: number): Promise<string> {
  const sessionToken = generateSessionToken()
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  await query(
    'INSERT INTO sessions ("sessionToken", "userId", expires) VALUES ($1, $2, $3)',
    [sessionToken, userId, expires]
  )

  return sessionToken
}

// Get session from database
export async function getSession(sessionToken: string): Promise<AuthSession | null> {
  try {
    const result = await query(`
      SELECT
        s.expires,
        u.id,
        u.email,
        u.name,
        u.image,
        p.status
      FROM sessions s
      JOIN users u ON s."userId" = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE s."sessionToken" = $1 AND s.expires > NOW()
    `, [sessionToken])

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0]
    return {
      user: {
        id: row.id,
        email: row.email,
        name: row.name,
        image: row.image,
        isAdmin: row.email === 'sittnerkalid@gmail.com',
        status: row.status || 'not_allowed'
      },
      expires: row.expires.toISOString()
    }
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

// Delete session
export async function deleteSession(sessionToken: string): Promise<void> {
  await query('DELETE FROM sessions WHERE "sessionToken" = $1', [sessionToken])
}

// Get current session from cookies
export async function getCurrentSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session-token')?.value

  if (!sessionToken) {
    return null
  }

  return getSession(sessionToken)
}

// Set session cookie
export async function setSessionCookie(sessionToken: string): Promise<void> {
  const cookieStore = await cookies()
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  cookieStore.set('session-token', sessionToken, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })
}

// Clear session cookie
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session-token')
}
