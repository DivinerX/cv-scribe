"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for applications chart
const dayData = [
  { date: "May 1", applications: 12 },
  { date: "May 2", applications: 19 },
  { date: "May 3", applications: 15 },
  { date: "May 4", applications: 8 },
  { date: "May 5", applications: 22 },
  { date: "May 6", applications: 17 },
  { date: "May 7", applications: 10 },
]

const weekData = [
  { date: "Week 1", applications: 65 },
  { date: "Week 2", applications: 78 },
  { date: "Week 3", applications: 92 },
  { date: "Week 4", applications: 87 },
  { date: "Week 5", applications: 105 },
  { date: "Week 6", applications: 120 },
  { date: "Week 7", applications: 98 },
  { date: "Week 8", applications: 110 },
]

const monthData = [
  { date: "Jan", applications: 220 },
  { date: "Feb", applications: 240 },
  { date: "Mar", applications: 290 },
  { date: "Apr", applications: 310 },
  { date: "May", applications: 350 },
]

export function ApplicationsChart({ timeRange }) {
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
        applications: {
          label: "Applications",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="applications"
            stroke="var(--color-applications)"
            activeDot={{ r: 8 }}
            name="Applications"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
