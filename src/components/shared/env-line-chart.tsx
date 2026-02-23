"use client"

import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts"

interface EnvLineChartProps {
    data: Record<string, unknown>[];
    dataKey: string;
    xAxisKey?: string;
    color?: string;
    yDomain?: [number, number];
    hideX?: boolean;
    hideY?: boolean;
}

export function EnvLineChart({
    data,
    dataKey,
    xAxisKey,
    color = "#3b82f6",
    yDomain,
    hideX = false,
    hideY = false
}: EnvLineChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey={xAxisKey} hide={hideX} />
                <YAxis domain={yDomain} hide={hideY} />
                <Tooltip />
                <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} name="Value" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    )
}
