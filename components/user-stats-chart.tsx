"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for user stats chart
const dayData = [
  { date: "May 1", users: 25, resumes: 18 },
  { date: "May 2", users: 32, resumes: 24 },
  { date: "May 3", users: 28, resumes: 20 },
  { date: "May 4", users: 19, resumes: 15 },
  { date: "May 5", users: 35, resumes: 28 },
  { date: "May 6", users: 30, resumes: 22 },
  { date: "May 7", users: 22, resumes: 16 },
]

const weekData = [
  { date: "Week 1", users: 120, resumes: 85 },
  { date: "Week 2", users: 145, resumes: 98 },
  { date: "Week 3", users: 160, resumes: 110 },
  { date: "Week 4", users: 155, resumes: 105 },
  { date: "Week 5", users: 180, resumes: 125 },
  { date: "Week 6", users: 200, resumes: 140 },
  { date: "Week 7", users: 175, resumes: 120 },
  { date: "Week 8", users: 190, resumes: 130 },
]

const monthData = [
  { date: "Jan", users: 450, resumes: 320 },
  { date: "Feb", users: 480, resumes: 340 },
  { date: "Mar", users: 520, resumes: 380 },
  { date: "Apr", users: 550, resumes: 400 },
  { date: "May", users: 600, resumes: 450 },
]

export function UserStatsChart({ timeRange }) {
  const getChartData = () => {
    switch (timeRange) {
      case "day":
        return dayData
      case "week":
        return weekData
      case "month":
        return monthData
      default:
        return weekData
    }
  }

  return (
    <ChartContainer
      config={{
        users: {
          label: "Active Users",
          color: "hsl(var(--chart-1))",
        },
        resumes: {
          label: "Resumes Generated",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="users" fill="var(--color-users)" name="Active Users" />
          <Bar dataKey="resumes" fill="var(--color-resumes)" name="Resumes Generated" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
