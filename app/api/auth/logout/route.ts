import { NextRequest, NextResponse } from 'next/server'
import { deleteSession, clearSessionCookie } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value
    
    if (sessionToken) {
      // Delete session from database
      await deleteSession(sessionToken)
    }
    
    // Clear session cookie
    await clearSessionCookie()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
