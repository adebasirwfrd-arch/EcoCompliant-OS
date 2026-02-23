"use client"

import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Info } from "lucide-react"

type MonthlyGHG = {
    month: string;
    scope1: number;
    scope2: number;
    scope3: number;
    target: number;
}

export function GhgTrendChart({ data }: { data: MonthlyGHG[] }) {
    return (
        <Card className="h-full shadow-sm border-slate-200">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-indigo-500" />
                        Carbon Trajectory vs Target
                    </CardTitle>
                    <Info className="h-4 w-4 text-slate-400" />
                </div>
                <CardDescription>
                    Monthly accumulation of tCO2e across all scopes relative to the Net Zero reduction pathway.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[320px] pt-4">
                {data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 flex-col gap-2">
                        <TrendingUp className="h-8 w-8 opacity-20" />
                        <span>Not enough data to project trend</span>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="scope1Grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={1} />
                                </linearGradient>
                                <linearGradient id="scope2Grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={1} />
                                </linearGradient>
                                <linearGradient id="scope3Grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: '#f1f5f9' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '15px' }} />

                            <Bar dataKey="scope1" name="Scope 1" stackId="a" fill="url(#scope1Grad)" radius={[0, 0, 4, 4]} maxBarSize={40} />
                            <Bar dataKey="scope2" name="Scope 2" stackId="a" fill="url(#scope2Grad)" maxBarSize={40} />
                            <Bar dataKey="scope3" name="Scope 3" stackId="a" fill="url(#scope3Grad)" radius={[4, 4, 0, 0]} maxBarSize={40} />

                            {/* The Net Zero reduction target curve */}
                            <Line
                                type="monotone"
                                dataKey="target"
                                name="SRN PPI Target Limit"
                                stroke="#ef4444"
                                strokeWidth={3}
                                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}
