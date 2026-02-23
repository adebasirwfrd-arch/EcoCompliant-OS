"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts"
import { Badge } from "@/components/ui/badge"

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

type ISOIntelData = {
    objectives: { department: string; progress: number; target: string }[];
    ncStatus: { name: string; value: number }[];
    legalReviews: { month: string; reviews: number }[];
};

export function ISOIntelligenceCharts({ data }: { data: ISOIntelData }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center justify-between">
                        Objective Mastery
                        <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100">Cl. 6.2 Progress</Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">Progress vs Targets by Department</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.objectives} layout="vertical" margin={{ left: -20, right: 20 }}>
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis dataKey="department" type="category" width={80} tick={{ fontSize: 10, fontWeight: 600 }} />
                            <RechartsTooltip
                                cursor={{ fill: 'transparent' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white p-2 border border-slate-100 shadow-xl rounded-lg text-[10px]">
                                                <p className="font-bold">{payload[0].payload.department}</p>
                                                <p className="text-emerald-600">Progress: {payload[0].value}%</p>
                                                <p className="text-slate-500">Target: {payload[0].payload.target}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="progress" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center justify-between">
                        CAPA Lifecycle
                        <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-100">Cl. 10.2 Status</Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">Distribution of Non-Conformities</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.ncStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.ncStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                wrapperStyle={{ fontSize: '10px', fontWeight: 600, paddingTop: '20px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white lg:col-span-1 md:col-span-2">
                <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center justify-between">
                        Regulatory Vigilance
                        <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-100">Cl. 6.1.3 Reviews</Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">Legal registry review frequency (6 Months)</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.legalReviews} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                            />
                            <RechartsTooltip />
                            <Line
                                type="monotone"
                                dataKey="reviews"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
