"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for application status distribution
const statusData = [
  { name: "Initial Reply", value: 35, color: "#93c5fd" },
  { name: "Intro Call", value: 25, color: "#c4b5fd" },
  { name: "Assessment", value: 20, color: "#fde68a" },
  { name: "Technical Interview", value: 15, color: "#fdba74" },
  { name: "Final Round", value: 5, color: "#86efac" },
]

export function ApplicationStatusChart() {
  return (
    <ChartContainer
      config={{
        status: {
          label: "Application Status",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
