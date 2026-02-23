"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { EsgMaturityRadar } from "./esg-maturity-radar"
import { Trophy, ShieldCheck, Target, BarChart3 } from "lucide-react"

interface EsgMaturityDashboardProps {
    overallScore: number
    datasetScores?: any[]
    level: string
}

export function EsgMaturityDashboard({
    overallScore = 68,
    datasetScores = [],
    level = "Strategic"
}: Partial<EsgMaturityDashboardProps>) {

    // Calculate pillar averages for the radar
    const radarData = [
        { subject: 'Emissions', score: datasetScores?.find(s => s.datasetSlug === 'greenhouse-gas-ghg-emissions')?.score || 72 },
        { subject: 'Waste', score: datasetScores?.find(s => s.datasetSlug === 'waste-management-circular')?.score || 85 },
        { subject: 'Governance', score: datasetScores?.find(s => s.datasetSlug === 'corporate-governance-index')?.score || 65 },
        { subject: 'Equality', score: datasetScores?.find(s => s.datasetSlug === 'global-diversity-inclusion-dei')?.score || 50 },
        { subject: 'Economy', score: datasetScores?.find(s => s.datasetSlug === 'economic-value-generated')?.score || 90 },
        { subject: 'Climate', score: datasetScores?.find(s => s.datasetSlug === 'tcfd-climate-strategy')?.score || 78 },
    ]

    const eScore = Math.round((radarData[0].score + radarData[1].score) / 2)
    const sScore = Math.round(radarData[3].score)
    const gScore = Math.round((radarData[2].score + radarData[5].score) / 2)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            {/* Overall Score Card */}
            <Card className="lg:col-span-2 bg-[#0B0F1A] border border-slate-900 shadow-2xl rounded-[48px] p-10 relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px]" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="w-48 lg:w-64">
                        <EsgMaturityRadar scores={radarData} />
                    </div>

                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
                                <Trophy className="h-3.5 w-3.5" /> Level {level}
                            </div>
                            <h3 className="text-3xl font-black text-white leading-tight">ESG Maturity Status</h3>
                            <p className="text-slate-400 text-sm font-medium">Your organization is currently performing at a {level.toLowerCase()} level based on global standards.</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                                <span>Global Index Score</span>
                                <span>{Math.round(overallScore)}%</span>
                            </div>
                            <Progress value={overallScore} className="h-2 bg-slate-800" />
                        </div>
                    </div>
                </div>
            </Card>

            {/* E-S-G Breakdown Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Environmental", score: eScore, icon: BarChart3, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", desc: "Emissions / Waste" },
                    { label: "Social", score: sScore, icon: Target, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", desc: "DEI / Culture" },
                    { label: "Governance", score: gScore, icon: ShieldCheck, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", desc: "Board / Ethics" }
                ].map((item, i) => (
                    <Card key={i} className="bg-[#0B0F1A] border-none shadow-sm rounded-[32px] p-8 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
                        <div className="space-y-4">
                            <div className={`h-12 w-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border ${item.border}`}>
                                <item.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">{item.label}</h4>
                                <p className="text-2xl font-black text-white">{item.score}%</p>
                            </div>
                        </div>
                        <p className="text-[10px] font-medium text-slate-500 mt-4 uppercase tracking-widest">{item.desc}</p>
                    </Card>
                ))}
            </div>
        </div>
    )
}
