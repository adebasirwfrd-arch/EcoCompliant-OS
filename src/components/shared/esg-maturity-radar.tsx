"use client"

import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

interface EsgMaturityRadarProps {
    scores?: {
        subject: string
        score: number
    }[]
}

const DEFAULT_DATA = [
    { subject: 'Emissions', score: 72 },
    { subject: 'Waste', score: 85 },
    { subject: 'Governance', score: 65 },
    { subject: 'Equality', score: 50 },
    { subject: 'Ethics', score: 90 },
    { subject: 'Transparency', score: 78 },
]

export function EsgMaturityRadar({ scores }: EsgMaturityRadarProps) {
    const data = (scores || DEFAULT_DATA).map(s => ({
        subject: s.subject,
        A: s.score,
        fullMark: 100
    }))

    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Maturity"
                        dataKey="A"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.4}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}
