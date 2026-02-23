"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart as PieChartIcon, Info } from "lucide-react"

export function GhgDonut({ scope1, scope2, scope3 }: { scope1: number, scope2: number, scope3: number }) {
    const data = [
        { name: "Scope 1 (Direct)", value: scope1, color: "#6366f1" },  // Indigo
        { name: "Scope 2 (Indirect - Energy)", value: scope2, color: "#14b8a6" }, // Teal 
        { name: "Scope 3 (Value Chain)", value: scope3, color: "#f59e0b" },  // Amber
    ].filter(item => item.value > 0);

    const total = scope1 + scope2 + scope3;

    return (
        <Card className="h-full shadow-sm border-slate-200">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChartIcon className="h-5 w-5 text-indigo-500" />
                        Emissions by Scope
                    </CardTitle>
                    <Info className="h-4 w-4 text-slate-400" />
                </div>
                <CardDescription>
                    Distribution of GHG emissions according to SRN PPI standard classification.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
                {data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 flex-col gap-2">
                        <PieChartIcon className="h-8 w-8 opacity-20" />
                        <span>No emission data available</span>
                    </div>
                ) : (
                    <div className="relative h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip
                                    formatter={(value: number) => [`${value.toFixed(2)} tCO2e`, "Emissions"]}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center text showing Total */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8 text-center">
                            <span className="text-3xl font-extrabold text-slate-700">{total.toFixed(1)}</span>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">tCO2e</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
