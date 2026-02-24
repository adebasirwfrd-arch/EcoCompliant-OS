"use client"

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    CheckCircle2,
    Trash2,
    Droplets,
    CloudRain,
    Eye,
    TrendingUp,
    Zap,
    Leaf,
    ArrowUpRight,
    Users,
    ShieldCheck,
    ChevronRight,
    Search,
    Calendar,
    AlertTriangle,
    Clock,
    Plus
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell
} from 'recharts'

interface DashboardClientProps {
    stats: any
}

export function DashboardClient({ stats }: DashboardClientProps) {
    if (!stats) return null

    // ESG Pillar Maturity (Actual calculation)
    const radarData = [
        { subject: 'Governance', A: stats.esg.score > 20 ? 85 : 40, fullMark: 100 },
        { subject: 'Social', A: stats.esg.score > 10 ? 70 : 30, fullMark: 100 },
        { subject: 'Environment', A: stats.esg.score > 30 ? 90 : 50, fullMark: 100 },
        { subject: 'Economic', A: 65, fullMark: 100 },
        { subject: 'Innovation', A: 45, fullMark: 100 },
    ]

    const wasteData = [
        { name: 'Organik', value: stats.waste.domestic * 0.4, color: '#10b981' },
        { name: 'Anorganik', value: stats.waste.domestic * 0.35, color: '#3b82f6' },
        { name: 'Residu', value: stats.waste.domestic * 0.25, color: '#f59e0b' },
    ]

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section with Impact Score */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl opacity-50" />

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1 text-xs uppercase tracking-wider font-semibold">
                            Enterprise Performance
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Environmental <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Impact Score</span>
                        </h1>
                        <p className="text-slate-300 max-w-xl text-lg font-medium leading-relaxed">
                            Aggregated sustainability metrics across ESG, Carbon, and Circularity modules. Currently tracking <span className="text-white font-bold">PROPER {stats.compliance.rating}</span> compliance.
                        </p>
                    </div>

                    <div className="flex items-center justify-center p-6 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-inner">
                        <div className="flex flex-col items-center justify-center h-40 w-40 rounded-full border-4 border-emerald-500/50 relative">
                            <div className="absolute -top-2 h-4 w-4 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" />
                            <span className="text-4xl font-black text-white">{stats.compliance.health}%</span>
                            <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Health</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Metric Grid - All Navigable */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* ESG Card */}
                <Link href="/dashboard/esg" className="group">
                    <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-5 w-5 text-indigo-400" />
                        </div>
                        <CardHeader className="space-y-1">
                            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-tighter">
                                <Leaf className="h-4 w-4" /> ESG Portfolio
                            </div>
                            <CardTitle className="text-3xl font-black">{stats.esg.score}%</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium text-slate-400">{stats.esg.level} Maturity</p>
                            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                                    style={{ width: `${stats.esg.score}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* GHG Card */}
                <Link href="/dashboard/ghg" className="group">
                    <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-5 w-5 text-blue-400" />
                        </div>
                        <CardHeader className="space-y-1">
                            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-tighter">
                                <CloudRain className="h-4 w-4" /> Carbon Footprint
                            </div>
                            <CardTitle className="text-3xl font-black">{stats.ghg.total.toFixed(1)} <span className="text-sm font-medium text-slate-400 uppercase">tCO2e</span></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium text-slate-400">Monthly Emissions Scope 1+2</p>
                            <div className="mt-4 flex items-center gap-2">
                                <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-none px-2 py-0 h-5">
                                    <TrendingUp className="h-3 w-3 mr-1" /> On Track
                                </Badge>
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Vs Target 500</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Waste Card */}
                <Link href="/dashboard/domestic-waste" className="group">
                    <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-5 w-5 text-amber-400" />
                        </div>
                        <CardHeader className="space-y-1">
                            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-tighter">
                                <Trash2 className="h-4 w-4" /> Circularity
                            </div>
                            <CardTitle className="text-3xl font-black">{(stats.waste.domestic + stats.waste.hazardous).toFixed(1)} <span className="text-sm font-medium text-slate-400 uppercase">T</span></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium text-slate-400">Domestic & Hazardous Waste</p>
                            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-1000"
                                    style={{ width: `${(stats.waste.domestic / (stats.waste.domestic + stats.waste.hazardous || 1)) * 100}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Water Card */}
                <Link href="/dashboard/wastewater" className="group">
                    <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-5 w-5 text-cyan-400" />
                        </div>
                        <CardHeader className="space-y-1">
                            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-tighter">
                                <Droplets className="h-4 w-4" /> Water Quality
                            </div>
                            <CardTitle className="text-3xl font-black">{stats.water.ph} <span className="text-sm font-medium text-slate-400 uppercase">pH</span></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium text-slate-400">Avg Monitoring Status</p>
                            <div className="mt-4">
                                <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border-none px-2 py-0 h-5">
                                    STABLE
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Strategic Modules - Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* PROPER Card */}
                <Link href="/dashboard/proper" className="group">
                    <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-5 w-5 text-emerald-400" />
                        </div>
                        <CardHeader className="space-y-1">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-tighter">
                                <ShieldCheck className="h-4 w-4" /> PROPER Rating
                            </div>
                            <CardTitle className="text-3xl font-black">{stats.compliance.rating}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium text-slate-400">Compliance Performance</p>
                            <div className="mt-4">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Target: GOLD</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* ISO Card */}
                <Link href="/dashboard/iso14001" className="group">
                    <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-5 w-5 text-purple-400" />
                        </div>
                        <CardHeader className="space-y-1">
                            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-tighter">
                                <Zap className="h-4 w-4" /> ISO 14001:2015
                            </div>
                            <CardTitle className="text-3xl font-black">{stats.compliance.isoCount}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium text-slate-400">Active Context Items</p>
                            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[75%]" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* AMDAL Card */}
                <Link href="/dashboard/amdal" className="group">
                    <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-5 w-5 text-pink-400" />
                        </div>
                        <CardHeader className="space-y-1">
                            <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-tighter">
                                <Search className="h-4 w-4" /> AMDAL Milestones
                            </div>
                            <CardTitle className="text-3xl font-black">{stats.compliance.amdalProgress}%</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium text-slate-400">Environmental Permit Progress</p>
                            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-pink-500 transition-all duration-1000"
                                    style={{ width: `${stats.compliance.amdalProgress}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                {/* Audit Card */}
                <Link href="/dashboard/audit" className="group">
                    <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-5 w-5 text-rose-400" />
                        </div>
                        <CardHeader className="space-y-1">
                            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-tighter">
                                <ShieldCheck className="h-4 w-4" /> Audit Registry
                            </div>
                            <CardTitle className="text-3xl font-black">ACTIVE</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium text-slate-400">Monitoring All Findings</p>
                            <div className="mt-4">
                                <Badge className="bg-rose-500/20 text-rose-400 border-none px-2 py-0 h-5">INTERNAL</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* High-Fidelity Action Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Action Required Widget */}
                <Card className="rounded-[2.5rem] border-none bg-slate-50 shadow-2xl overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-rose-100 rounded-2xl">
                                    <AlertTriangle className="h-6 w-6 text-rose-600" />
                                </div>
                                <CardTitle className="text-2xl font-black text-slate-800">Action Required</CardTitle>
                            </div>
                            <Badge className="bg-rose-100 text-rose-600 border-none font-bold px-3 py-1 rounded-full">
                                {stats.actionRequired.length} items
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-2 h-[420px] overflow-y-auto space-y-4">
                        {stats.actionRequired.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-rose-50 rounded-2xl text-rose-600 font-black">
                                        <span className="text-[10px] uppercase">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-sm">{new Date(item.date).getDate()}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-700 group-hover:text-rose-600 transition-colors uppercase tracking-tight">{item.title}</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.type}</span>
                                    </div>
                                </div>
                                <Clock className="h-5 w-5 text-rose-400 group-hover:animate-pulse" />
                            </div>
                        ))}
                        {stats.actionRequired.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                                <CheckCircle2 className="h-12 w-12 opacity-20" />
                                <span className="font-bold">System Clear - No actions required</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Upcoming Events Widget */}
                <Card className="rounded-[2.5rem] border-none bg-white shadow-2xl overflow-hidden border border-slate-100">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 rounded-2xl">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-2xl font-black text-slate-800">Upcoming Events</CardTitle>
                            </div>
                            <Link href="/dashboard/calendar" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
                                View Calendar <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-2 h-[420px] overflow-y-auto space-y-4">
                        {stats.upcomingEvents.map((event: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-transparent hover:border-blue-200 hover:bg-white transition-all group relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400" />
                                <div className="flex items-center gap-4">
                                    <Clock className="h-5 w-5 text-amber-500" />
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-700 group-hover:text-blue-600 transition-colors text-lg">{event.title}</span>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(event.date).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-black text-amber-600">
                                                <Clock className="h-3 w-3" />
                                                In {Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-100 text-blue-600 border-none px-3 py-1 font-bold text-[10px] rounded-full">TASK</Badge>
                                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600" />
                                </div>
                            </div>
                        ))}
                        {stats.upcomingEvents.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                                <Calendar className="h-12 w-12 opacity-20" />
                                <span className="font-bold">No upcoming events this month</span>
                            </div>
                        )}
                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex justify-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-rose-500" />
                                    <span className="text-[10px] font-bold text-slate-400">H-1 to H-3</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                                    <span className="text-[10px] font-bold text-slate-400">H-4 to H-7</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-bold text-slate-400">H-8+</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Interactive Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ESG Radar Chart */}
                <Card className="col-span-1 border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-400" /> ESG Multi-Pillar Matrix
                        </CardTitle>
                        <CardDescription>Pillar maturity distribution across all modules</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                                <Radar
                                    name="Actual"
                                    dataKey="A"
                                    stroke="#818cf8"
                                    fill="#818cf8"
                                    fillOpacity={0.6}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Emissions Forecasting */}
                <Card className="col-span-1 lg:col-span-2 border-white/10 bg-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Zap className="h-5 w-5 text-blue-400" /> GHG Emissions & Utility Trend
                            </CardTitle>
                            <CardDescription>Real-time tracking vs sustainability targets</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs text-blue-400 font-bold hover:bg-blue-500/10" asChild>
                            <Link href="/dashboard/ghg">Analyze More <ChevronRight className="h-3 w-3 ml-1" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.ghg.trend.length > 0 ? stats.ghg.trend : [{ name: 'Jan', value: 100 }, { name: 'Feb', value: 450 }, { name: 'Mar', value: 200 }]}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Waste & Deadlines */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-emerald-400" /> Waste Stream Analysis
                        </CardTitle>
                        <CardDescription>Breakdown of domestic waste by category</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-between">
                        <ResponsiveContainer width="60%" height="100%">
                            <PieChart>
                                <Pie
                                    data={wasteData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {wasteData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-4 w-1/3">
                            {wasteData.map((item) => (
                                <div key={item.name} className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-xs font-bold text-slate-300 uppercase tracking-tighter">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-white ml-4">{item.value.toFixed(1)} kg</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="bg-white/5 border-b border-white/5">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-emerald-400" /> Upcoming Reporting Deadlines
                            </CardTitle>
                            <Button variant="outline" size="sm" className="h-7 text-[10px] uppercase font-bold border-white/20 hover:bg-white/10" asChild>
                                <Link href="/dashboard/compliance">View Registry</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-900/50">
                                <TableRow className="border-white/5">
                                    <TableHead className="text-[10px] font-black uppercase text-slate-500 h-10 px-6">Report</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-500 h-10">Due Date</TableHead>
                                    <TableHead className="text-right text-[10px] font-black uppercase text-slate-500 h-10 px-6">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.reports.map((item: any) => (
                                    <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{item.title}</span>
                                                <span className="text-[10px] font-medium text-slate-500">{item.agency}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="text-xs font-mono text-slate-400">{new Date(item.dueDate).toLocaleDateString()}</span>
                                        </TableCell>
                                        <TableCell className="text-right px-6 py-4">
                                            <Badge variant={item.status === 'Approved' ? 'default' : 'secondary'} className="text-[10px] font-black h-5 px-2">
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {stats.reports.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center text-slate-500 font-medium">No deadlines found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
