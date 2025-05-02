import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  // Get user ID from session
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const userId = user.id
  
  // Get profile data
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ data })
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  
  // Get user ID from session
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const userId = user.id
  const profileData = await request.json()
  
  // Update profile data
  const { data, error } = await supabase
    .from('profiles')
    .update({
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
    .eq('user_id', userId)
    .select()
  
  if (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ data })
}
