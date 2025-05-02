import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Get users from auth.users table
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()

  // Get profiles data
  const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*')

  // Combine users and profiles data
  let usersWithProfile = users.map((user) => {
    const profile = profiles?.find((profile) => profile.user_id === user.id)
    return {
      ...user,
      ...profile,
    }
  })

  return NextResponse.json({
    users: usersWithProfile || [],
    error: authError || profilesError
  })
}