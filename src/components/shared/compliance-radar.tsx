"use client"

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

export function ComplianceRadar() {
    // In a real scenario, this would be calculated from the backend DRKPL/PROPER assessments
    const mockData = [
        { subject: "Air Quality", score: 85, fullMark: 100 },
        { subject: "Wastewater", score: 92, fullMark: 100 },
        { subject: "Hazardous (B3)", score: 78, fullMark: 100 },
        { subject: "GHG & Energy", score: 65, fullMark: 100 },
        { subject: "CSR & Community", score: 90, fullMark: 100 },
        { subject: "Biodiversity", score: 70, fullMark: 100 },
    ];

    return (
        <Card className="h-full shadow-sm border-slate-200">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-indigo-500" />
                    Overall Compliance Vector
                </CardTitle>
                <CardDescription>
                    Multi-domain performance scoring vs Maximum limits across ESG metrics.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={mockData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                        />
                        <Radar
                            name="Current Score"
                            dataKey="score"
                            stroke="#4f46e5"
                            strokeWidth={2}
                            fill="#6366f1"
                            fillOpacity={0.2}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
