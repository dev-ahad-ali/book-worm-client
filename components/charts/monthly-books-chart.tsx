'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MonthlyData {
  month: string;
  count: number;
}

interface MonthlyBooksChartProps {
  data?: MonthlyData[];
}

export function MonthlyBooksChart({ data }: MonthlyBooksChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className='bg-card border-border/50'>
        <CardHeader>
          <CardTitle>Monthly Progress</CardTitle>
          <CardDescription>Books read each month</CardDescription>
        </CardHeader>
        <CardContent className='flex h-64 items-center justify-center'>
          <p className='text-muted-foreground'>No data available yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='bg-card border-border/50'>
      <CardHeader>
        <CardTitle>Monthly Progress</CardTitle>
        <CardDescription>Books read each month this year</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey='count'
              fill='hsl(var(--chart-1))'
              name='Books Read'
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
