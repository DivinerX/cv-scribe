"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Search, Filter, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"

export default function Applications() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  // Mock application data
  const [applications, setApplications] = useState([
    {
      id: 1,
      company: "Google",
      role: "Senior Software Engineer",
      url: "google.com/careers",
      appliedDate: "2023-04-28",
      status: "reply",
      statusHistory: [
        { status: "applied", date: "2023-04-28T10:30:00Z" },
        { status: "reply", date: "2023-05-02T14:45:00Z" },
      ],
    },
    {
      id: 2,
      company: "Amazon",
      role: "Product Manager",
      url: "amazon.com/jobs",
      appliedDate: "2023-04-25",
      status: "intro",
      statusHistory: [
        { status: "applied", date: "2023-04-25T09:15:00Z" },
        { status: "reply", date: "2023-04-27T11:20:00Z" },
        { status: "intro", date: "2023-05-01T15:30:00Z" },
      ],
    },
    {
      id: 3,
      company: "Microsoft",
      role: "UX Designer",
      url: "microsoft.com/careers",
      appliedDate: "2023-04-20",
      status: "test",
      statusHistory: [
        { status: "applied", date: "2023-04-20T08:45:00Z" },
        { status: "reply", date: "2023-04-22T13:10:00Z" },
        { status: "intro", date: "2023-04-25T16:20:00Z" },
        { status: "test", date: "2023-04-30T10:00:00Z" },
      ],
    },
    {
      id: 4,
      company: "Apple",
      role: "iOS Developer",
      url: "apple.com/jobs",
      appliedDate: "2023-04-15",
      status: "tech",
      statusHistory: [
        { status: "applied", date: "2023-04-15T11:30:00Z" },
        { status: "reply", date: "2023-04-18T14:15:00Z" },
        { status: "intro", date: "2023-04-22T09:45:00Z" },
        { status: "test", date: "2023-04-26T13:30:00Z" },
        { status: "tech", date: "2023-05-01T15:00:00Z" },
      ],
    },
    {
      id: 5,
      company: "Netflix",
      role: "Backend Engineer",
      url: "netflix.com/jobs",
      appliedDate: "2023-04-10",
      status: "back",
      statusHistory: [
        { status: "applied", date: "2023-04-10T10:00:00Z" },
        { status: "reply", date: "2023-04-12T11:45:00Z" },
        { status: "intro", date: "2023-04-15T14:30:00Z" },
        { status: "test", date: "2023-04-20T09:15:00Z" },
        { status: "tech", date: "2023-04-25T16:00:00Z" },
        { status: "back", date: "2023-05-01T13:30:00Z" },
      ],
    },
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-gray-100 text-gray-800"
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
      case "applied":
        return "Applied"
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
        return status
    }
  }

  const handleStatusChange = (applicationId, newStatus) => {
    setApplications(
      applications.map((app) => {
        if (app.id === applicationId) {
          // Add the new status to history
          const updatedHistory = [...app.statusHistory, { status: newStatus, date: new Date().toISOString() }]

          return {
            ...app,
            status: newStatus,
            statusHistory: updatedHistory,
          }
        }
        return app
      }),
    )

    toast({
      title: "Status Updated",
      description: "Application status has been updated successfully",
    })
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.url.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Application History</h1>
        <Button asChild>
          <Link href="/resume/create">Log New Application</Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Filter Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company, role, or URL..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="reply">Initial Reply</SelectItem>
                <SelectItem value="intro">Intro Call</SelectItem>
                <SelectItem value="test">Assessment</SelectItem>
                <SelectItem value="tech">Technical Interview</SelectItem>
                <SelectItem value="back">Final Round</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">URL</TableHead>
                <TableHead className="hidden md:table-cell">Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <Collapsible key={app.id} asChild>
                  <>
                    <TableRow>
                      <TableCell className="font-medium">{app.company}</TableCell>
                      <TableCell>{app.role}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <a
                          href={`https://${app.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {app.url}
                        </a>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Select value={app.status} onValueChange={(value) => handleStatusChange(app.id, value)}>
                          <SelectTrigger className="h-7 w-[130px]">
                            <Badge className={getStatusColor(app.status)}>{getStatusLabel(app.status)}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="reply">Initial Reply</SelectItem>
                            <SelectItem value="intro">Intro Call</SelectItem>
                            <SelectItem value="test">Assessment</SelectItem>
                            <SelectItem value="tech">Technical Interview</SelectItem>
                            <SelectItem value="back">Final Round</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <ChevronDown className="h-4 w-4" />
                            <span className="sr-only">Toggle status history</span>
                          </Button>
                        </CollapsibleTrigger>
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent asChild>
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={6} className="p-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Status History</h4>
                            <div className="space-y-2">
                              {app.statusHistory.map((history, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <Badge className={getStatusColor(history.status)}>
                                    {getStatusLabel(history.status)}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(history.date).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
