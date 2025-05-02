import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { PlusCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  // Mock data for today's applications
  const todaysApplications = [
    { id: 1, company: "Google", role: "Software Engineer", status: "reply", date: new Date().toISOString() },
    { id: 2, company: "Amazon", role: "Product Manager", status: "applied", date: new Date().toISOString() },
    { id: 3, company: "Microsoft", role: "UX Designer", status: "test", date: new Date().toISOString() },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "reply":
        return "bg-blue-100 text-blue-800"
      case "intro":
        return "bg-purple-100 text-purple-800"
      case "test":
        return "bg-yellow-100 text-yellow-800"
      case "tech":
        return "bg-orange-100 text-orange-800"
      case "back":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "reply":
        return "Initial Reply"
      case "intro":
        return "Intro Call"
      case "test":
        return "Assessment"
      case "tech":
        return "Technical Interview"
      case "back":
        return "Final Round"
      default:
        return "Applied"
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl">Create New Resume</CardTitle>
              <CardDescription>Generate a tailored resume for your job application</CardDescription>
            </div>
            <Button asChild size="lg">
              <Link href="/resume/create">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Resume
              </Link>
            </Button>
          </CardHeader>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl">Today's Applications</CardTitle>
              <CardDescription>Applications logged today</CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/applications">
                <Clock className="mr-2 h-4 w-4" />
                View All Applications
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {todaysApplications.length > 0 ? (
              <div className="space-y-4">
                {todaysApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">
                        {app.role} at {app.company}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(app.status)}>{getStatusLabel(app.status)}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(app.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" asChild size="sm">
                      <Link href={`/applications/${app.id}`}>Details</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No applications logged today.</p>
                <Button asChild variant="link" className="mt-2">
                  <Link href="/resume/create">Create a resume and log an application</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
