import { NextResponse } from "next/server"
import { supabaseServerClient } from "@/utils/supabase/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = requestUrl.searchParams.get('next') ?? '/'
  
  // Check for hash fragment that might contain tokens
  const hasHashFragment = requestUrl.hash && requestUrl.hash.length > 1
  console.log("code:", code)
  if (code) {
    const supabase = await supabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${requestUrl.origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${requestUrl.origin}${next}`)
      }
    }
    console.error("Auth error:", error)
  } else if (hasHashFragment) {
    // If we have a hash fragment with tokens but no code, try to handle it directly
    try {
      const supabase = await supabaseServerClient()
      // Redirect to home page after setting session
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    } catch (err) {
      console.error("Error handling hash fragment:", err)
    }
  }
  
  // return the user to an error page with instructions
  return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
}
