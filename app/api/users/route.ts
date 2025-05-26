import { getAllUsersWithProfiles } from '@/utils/db'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // Check if user is admin
  const session = await getCurrentSession()

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all users with their profiles
    const usersWithProfiles = await getAllUsersWithProfiles()

    return NextResponse.json({
      users: usersWithProfiles || []
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}