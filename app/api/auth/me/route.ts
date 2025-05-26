import { NextRequest, NextResponse } from 'next/server'
import { getCurrentSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    return NextResponse.json({ user: session.user })
  } catch (error) {
    console.error('Error getting current user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
