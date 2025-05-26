import { updateProfileStatus, getProfileByUserId } from '@/utils/db'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentSession } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check if user is admin
  const session = await getCurrentSession()

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { status } = await request.json()
  const id = (await params).id

  try {
    // Check if user exists
    const existingUser = await getProfileByUserId(parseInt(id))

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user status
    const updatedProfile = await updateProfileStatus(parseInt(id), status)

    return NextResponse.json({
      data: updatedProfile
    })
  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 })
  }
}