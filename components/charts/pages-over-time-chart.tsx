"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TimelineData {
  week: string
  pages: number
}

interface PagesOverTimeChartProps {
  data: TimelineData[]
}

export function PagesOverTimeChart({ data }: PagesOverTimeChartProps) {
  if (data.length === 0) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>Reading Pace</CardTitle>
          <CardDescription>Pages read per week</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No data available yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle>Reading Pace</CardTitle>
        <CardDescription>Pages read per week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pages"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
              activeDot={{ r: 6 }}
              name="Pages Read"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
