import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data for applications table
const applications = [
  {
    id: 1,
    user: "Alex Johnson",
    company: "Google",
    role: "Senior Software Engineer",
    date: "2023-05-01",
    status: "reply",
  },
  {
    id: 2,
    user: "Sarah Williams",
    company: "Amazon",
    role: "Product Manager",
    date: "2023-05-02",
    status: "intro",
  },
  {
    id: 3,
    user: "Michael Brown",
    company: "Microsoft",
    role: "UX Designer",
    date: "2023-05-03",
    status: "test",
  },
  {
    id: 4,
    user: "Emily Davis",
    company: "Apple",
    role: "iOS Developer",
    date: "2023-05-04",
    status: "tech",
  },
  {
    id: 5,
    user: "David Wilson",
    company: "Netflix",
    role: "Backend Engineer",
    date: "2023-05-05",
    status: "back",
  },
]

export function ApplicationsTable() {
  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
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
        return status
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app.id}>
            <TableCell className="font-medium">{app.user}</TableCell>
            <TableCell>{app.company}</TableCell>
            <TableCell>{app.role}</TableCell>
            <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(app.status)}>{getStatusLabel(app.status)}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
