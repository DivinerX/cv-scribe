import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ShieldAlert } from "lucide-react"

export default function NotAllowed() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-80px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <ShieldAlert className="h-12 w-12 text-amber-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Pending</CardTitle>
          <CardDescription>Your account is awaiting admin approval</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            Thank you for registering with CV Scribe. Your account is currently under review by our administrators.
          </p>
          <p>
            You'll receive an email notification once your account has been approved.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}