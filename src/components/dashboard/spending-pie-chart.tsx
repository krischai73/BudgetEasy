"use client"

import * as React from "react"
import type { PieConfig } from 'recharts';
import { Pie, PieChart as RechartsPieChart, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { SpendingByCategory } from "@/lib/types";

interface SpendingPieChartProps {
  data: SpendingByCategory[];
}

export function SpendingPieChart({ data }: SpendingPieChartProps) {
    const totalSpending = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.totalSpending, 0)
  }, [data])

  const chartData = React.useMemo(() => {
     // Filter out categories with zero spending for cleaner chart
    return data.filter(item => item.totalSpending > 0).map(item => ({
      name: item.name,
      value: item.totalSpending,
      fill: item.color, // Use the color from the category data
    }));
  }, [data]);

   const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    data.forEach(item => {
      if (item.totalSpending > 0) { // Only include categories with spending in the config
          config[item.name] = {
              label: item.name,
              color: item.color,
          };
      }
    });
    return config;
  }, [data]);


  if (!chartData.length) {
    return <div className="flex items-center justify-center h-60 text-muted-foreground">No spending data to display.</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-square">
      <RechartsPieChart>
        <RechartsTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="name" />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
          labelLine={false}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
            const percentage = (percent * 100).toFixed(0);

            // Only show label if percentage is significant enough
            if (parseFloat(percentage) < 5) return null;

            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-xs font-semibold fill-primary-foreground"
              >
                {`${percentage}%`}
              </text>
            );
          }}
        >
           {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
         <RechartsLegend
            content={({ payload }) => {
                if (!payload) return null;
                return (
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-4 text-sm text-muted-foreground">
                    {payload.map((entry, index) => {
                        const configEntry = chartConfig[entry.value as string];
                        if (!configEntry) return null; // Skip if not in config (e.g., zero spending)
                        return (
                            <li key={`item-${index}`} className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: configEntry.color }} />
                                {configEntry.label}
                            </li>
                        );
                    })}
                    </ul>
                )
            }}
         />
      </RechartsPieChart>
    </ChartContainer>
  )
}
