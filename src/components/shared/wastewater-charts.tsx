"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea,
    ReferenceLine,
    Legend
} from "recharts"

export function WastewaterCharts({ logs }: { logs: any[] }) {
    // Reverse logs to show chronological order left-to-right
    const chartData = [...logs].reverse().map(log => ({
        ...log,
        dateFormatted: new Date(log.logDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));

    if (chartData.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-indigo-500" />
                        BMAL Parameter Trends
                    </CardTitle>
                    <CardDescription>No data available to plot trends.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] flex items-center justify-center text-slate-400">
                    <p>Enter daily SPARING logs to generate charts.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-indigo-500" />
                    God-Tier BMAL Dynamic Trends (PP 22/2021)
                </CardTitle>
                <CardDescription>
                    Multi-parameter tracking vs Maximum Regulatory Limits. Red lines indicate the ceiling threshold.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* pH Chart */}
                    <div className="h-[300px] w-full mt-4 flex flex-col">
                        <h3 className="text-sm font-semibold mb-4 text-slate-700 text-center">pH Level (Baku Mutu: 6.0 - 9.0)</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="dateFormatted" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                                <YAxis domain={[0, 14]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelStyle={{ fontWeight: 'bold', color: '#334155' }}
                                />

                                <ReferenceArea y1={6} y2={9} fill="#4ade80" fillOpacity={0.1} />
                                <ReferenceLine y={6} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />
                                <ReferenceLine y={9} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />

                                <Line
                                    type="monotone"
                                    dataKey="phLevel"
                                    name="pH"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2 }}
                                    activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* COD & TSS Chart */}
                    <div className="h-[300px] w-full mt-4 flex flex-col">
                        <h3 className="text-sm font-semibold mb-4 text-slate-700 text-center">COD & TSS Concentration (mg/L)</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="dateFormatted" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelStyle={{ fontWeight: 'bold', color: '#334155' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />

                                {/* Example limits: COD 100, TSS 50 */}
                                <ReferenceLine y={100} stroke="#f97316" strokeDasharray="3 3" opacity={0.5} label={{ position: 'insideTopLeft', value: 'Max COD (100)', fill: '#f97316', fontSize: 10 }} />
                                <ReferenceLine y={50} stroke="#8b5cf6" strokeDasharray="3 3" opacity={0.5} label={{ position: 'insideTopLeft', value: 'Max TSS (50)', fill: '#8b5cf6', fontSize: 10 }} />

                                <Line type="monotone" dataKey="codLevel" name="COD (mg/L)" stroke="#f97316" strokeWidth={3} dot={{ r: 3 }} />
                                <Line type="monotone" dataKey="tssLevel" name="TSS (mg/L)" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
