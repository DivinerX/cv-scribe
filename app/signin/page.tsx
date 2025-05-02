"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FcGoogle } from "react-icons/fc"
import { createClient } from "@/utils/supabase/client"

export default function SignIn() {
  const supabase = createClient()

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-80px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Sign in to CV Scribe</CardTitle>
          <CardDescription>Continue with Google to access your account</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleGoogleSignIn}>
            <FcGoogle className="h-5 w-5" />
            <span>Continue with Google</span>
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <div>By continuing, you agree to our Terms of Service and Privacy Policy.</div>
        </CardFooter>
      </Card>
    </div>
  )
}
