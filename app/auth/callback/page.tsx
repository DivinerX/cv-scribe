"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { supabaseClient } from "@/utils/supabase/client"

export default function AuthErrorPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const handleAuthTokens = async () => {
      try {
        // Check if we have tokens in the URL fragment
        if (window.location.hash && window.location.hash.includes("access_token")) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get("access_token")
          const refreshToken = hashParams.get("refresh_token")
          
          if (accessToken && refreshToken) {
            const supabase = supabaseClient()
            
            // Set the session manually using the tokens
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            
            if (error) {
              console.error("Error setting session:", error)
              setStatus("error")
              setErrorMessage(error.message)
            } else {
              // Session set successfully
              setStatus("success")
              // Redirect to dashboard
              router.push("/dashboard")
            }
          } else {
            setStatus("error")
            setErrorMessage("Missing authentication tokens")
          }
        } else {
          setStatus("error")
          setErrorMessage("No authentication tokens found")
        }
      } catch (error) {
        console.error("Authentication error:", error)
        setStatus("error")
        setErrorMessage(error instanceof Error ? error.message : "Unknown authentication error")
      }
    }

    handleAuthTokens()
  }, [router])

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-80px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {status === "loading" ? "Processing Authentication" : 
             status === "success" ? "Authentication Successful" : 
             "Authentication Error"}
          </CardTitle>
          <CardDescription className="text-center">
            {status === "loading" ? "Please wait while we complete your sign-in..." : 
             status === "success" ? "You've been successfully authenticated!" : 
             "There was a problem with your authentication"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
          
          {status === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                You've been successfully signed in. Redirecting you to the dashboard... Please wait.
              </AlertDescription>
            </Alert>
          )}
          
          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Authentication Failed</AlertTitle>
              <AlertDescription>
                {errorMessage || "There was a problem processing your authentication."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {status === "error" && (
            <Button onClick={() => router.push("/signin")}>
              Return to Sign In
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}