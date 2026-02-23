"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart as PieChartIcon } from "lucide-react"

export function ComplianceDonut({
    pending,
    submitted,
    approved,
    overdue,
    onSegmentClick
}: {
    pending: number,
    submitted: number,
    approved: number,
    overdue: number,
    onSegmentClick?: (status: string) => void
}) {
    const data = [
        { name: "Approved", value: approved, color: "#10b981" }, // Emerald
        { name: "Pending", value: pending, color: "#f59e0b" },  // Amber
        { name: "Submitted", value: submitted, color: "#3b82f6" }, // Blue
        { name: "Overdue", value: overdue, color: "#ef4444" },  // Red
    ].filter(item => item.value > 0); // Hide empty slices

    return (
        <Card className="h-full shadow-sm border-slate-200">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <PieChartIcon className="h-5 w-5 text-emerald-500" />
                    SIMPEL Submission Status
                </CardTitle>
                <CardDescription>
                    YTD breakdown of obligatory regulatory document statuses.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
                {data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400">
                        No report data available
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontWeight: 'bold' }}
                            />
                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={65}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                onClick={(data) => {
                                    if (onSegmentClick && data && data.name) {
                                        // Mapping the chart names back to the DB statuses (or 'Overdue')
                                        onSegmentClick(data.name);
                                    }
                                }}
                                className={onSegmentClick ? "cursor-pointer" : ""}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        stroke="none"
                                        className={onSegmentClick ? "hover:opacity-80 transition-opacity" : ""}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}
