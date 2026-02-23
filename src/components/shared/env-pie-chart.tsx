"use client"

import {
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    Cell,
} from "recharts"

interface EnvPieChartProps {
    data: { name: string; value: number; color: string }[];
}

export function EnvPieChart({ data }: EnvPieChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    )
}
