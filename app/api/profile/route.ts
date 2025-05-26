import { getProfileByUserId, upsertProfile } from '@/utils/db'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  // Get user ID from session
  const session = await getCurrentSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  try {
    // Get profile data
    const profile = await getProfileByUserId(userId)

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ data: profile })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  // Get user ID from session
  const session = await getCurrentSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const profileData = await request.json()

  try {
    // Update profile data
    const updatedProfile = await upsertProfile(userId, {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
      birthday: profileData.birthday,
      github: profileData.github,
      linkedin: profileData.linkedin,
      website: profileData.website,
      education: profileData.education,
      skills: profileData.skills,
      projects: profileData.projects,
      experience: profileData.experience
    })

    return NextResponse.json({ data: updatedProfile })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
