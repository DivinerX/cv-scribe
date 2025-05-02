import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()

    // Exchange the code for a session
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)
    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user!.id)
    console.log("error: ", error)
    if (data && data?.length > 0) {
      let profile = data[0]
      console.log("profile:", profile)
      if (profile.status === "not_allowed") {
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL('/not_allowed', request.url))
      }
    } else {
      console.log("no profile")
      const { data, error } = await supabase.from('profiles').insert({ user_id: user!.id, name: user!.user_metadata.name, email: user!.email, phone: user!.user_metadata.phone })
      console.log("error: ", error)
      console.log("data: ", data)
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/not_allowed', request.url))
    }
    console.log("data: ", user)
  }

  // Redirect to the dashboard or home page after successful authentication
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
