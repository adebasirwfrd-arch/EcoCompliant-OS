"use client"

import * as React from "react"
import { useState, useMemo, useRef, useEffect } from "react"
import {
    Globe,
    BarChart3,
    Plus,
    Info,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    ArrowRight,
    Lock,
    Search,
    Filter,
    ArrowLeft,
    Check,
    FileText,
    X,
    ChevronDown,
    Calendar,
    Mail,
    User,
    Building2,
    LayoutDashboard,
    Download,
    Eye,
    Trash2,
    RefreshCw
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area
} from 'recharts'
import { OPEN_ES_CLASSES, OpenEsQuestion } from "@/lib/esg-standards-data"
import { EsgAssessmentForm } from "./esg-assessment-form"
import { calculateNormalizedScore, getMaturityLevel, calculatePillarScore } from "@/lib/esg-scoring"
import { createEsgAssessment, getAllEsgAssessments } from "@/app/actions/esg"
import { toast } from "sonner"

export function EsgCatalogClient({
    maturityData: initialMaturityData,
    allAssessments: initialAllAssessments
}: {
    maturityData: any,
    allAssessments: any[]
}) {
    const [view, setView] = useState<"dashboard" | "class-detail">("dashboard")
    const [maturityData, setMaturityData] = useState(initialMaturityData)
    const [allAssessments, setAllAssessments] = useState(initialAllAssessments)
    const [selectedClassId, setSelectedClassId] = useState<number>(1)
    const [selectedPillarName, setSelectedPillarName] = useState<string>("Governance")
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
    const [selectedQuestion, setSelectedQuestion] = useState<OpenEsQuestion | null>(null)
    const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [contextSearch, setContextSearch] = useState("")
    const [yearFilter, setYearFilter] = useState<string>("all")
    const [isCreating, setIsCreating] = useState(false)

    // Form State for new Context Index
    const [newContext, setNewContext] = useState({
        title: "",
        companyName: "",
        year: 2026,
        sector: "Oil & Gas",
        picName: "",
        picEmail: ""
    })

    const filteredAssessments = useMemo(() => {
        return allAssessments.filter((a: any) => {
            const matchesSearch = a.title?.toLowerCase().includes(contextSearch.toLowerCase()) ||
                a.companyName?.toLowerCase().includes(contextSearch.toLowerCase())
            const matchesYear = yearFilter === "all" || a.year.toString() === yearFilter
            return matchesSearch && matchesYear
        })
    }, [allAssessments, contextSearch, yearFilter])

    const handleCreateContext = async () => {
        setIsCreating(true)
        const res = await createEsgAssessment(newContext)
        if (res.success) {
            toast.success("Context Index created successfully")
            // Refresh assessments
            const updated = await getAllEsgAssessments()
            setAllAssessments(updated)
            // Reset form
            setNewContext({
                title: "",
                companyName: "",
                year: 2026,
                sector: "Oil & Gas",
                picName: "",
                picEmail: ""
            })
        } else {
            toast.error("Failed to create context index")
        }
        setIsCreating(false)
    }

    const switchContext = (assessment: any) => {
        setMaturityData(assessment)
        toast.info(`Switched to: ${assessment.title}`)
    }

    // Analytics Data (Actual calculation across Class 1 & 2)
    const radarData = useMemo(() => {
        const pillars = ["Governance", "Social", "Environment"]
        return pillars.map(p => {
            // Calculate combined score for the pillar across Class 1 and Class 2
            const s1 = calculatePillarScore(p, 1, maturityData?.answers || [], OPEN_ES_CLASSES)
            const s2 = calculatePillarScore(p, 2, maturityData?.answers || [], OPEN_ES_CLASSES)

            // Total questions for both classes
            const totalQuestions = s1.total + s2.total
            const actualPoints = (s1.scoring * s1.total * 3 / 100) + (s2.scoring * s2.total * 3 / 100)
            const combinedScoring = totalQuestions > 0 ? Math.round((actualPoints / (totalQuestions * 3)) * 100) : 0

            return { subject: p, A: combinedScoring, fullMark: 100 }
        })
    }, [maturityData])

    const topicScrollRef = useRef<HTMLDivElement>(null)

    const lastUpdatedAt = maturityData?.updatedAt ? new Date(maturityData.updatedAt) : new Date()
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(lastUpdatedAt).replace(',', '')

    const handleDownload = (assessment: any = maturityData) => {
        const answers = assessment?.answers || []
        const csvContent = [
            ["Context Title", assessment.title || ""],
            ["Company", assessment.companyName || ""],
            ["PIC", assessment.picName || ""],
            [],
            ["Question ID", "Maturity Score", "Evidence URL", "Remarks", "Last Updated"],
            ...answers.map((a: any) => [
                a.questionId,
                a.maturityScore,
                a.evidenceUrl || "",
                (a.remarks || "").replace(/,/g, ";"),
                a.updatedAt ? new Date(a.updatedAt).toLocaleString() : ""
            ])
        ].map(e => e.join(",")).join("\n")

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `esg_context_${assessment.title || assessment.year}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const selectedClass = useMemo(() => {
        return OPEN_ES_CLASSES.find(c => c.id === selectedClassId) || OPEN_ES_CLASSES[0]
    }, [selectedClassId])

    const selectedPillar = useMemo(() => {
        return selectedClass.pillars.find(p => p.name === selectedPillarName) || selectedClass.pillars[0] || { name: selectedPillarName, topics: [] }
    }, [selectedClass, selectedPillarName])

    const handleAccessClass = (classId: number) => {
        setSelectedClassId(classId)
        setView("class-detail")
        setSelectedPillarName("Governance")
        setSelectedTopicId(null)
    }

    const scrollCarousel = (direction: "left" | "right") => {
        if (topicScrollRef.current) {
            const scrollAmount = 300
            topicScrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            })
        }
    }

    if (view === "dashboard") {
        return (
            <div className="flex flex-col h-full bg-slate-50 font-sans max-w-full overflow-x-hidden">
                {/* God Tier Header & Analytics */}
                <div className="bg-[#005A8C] text-white p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                                    <LayoutDashboard className="h-8 w-8 text-cyan-300" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black tracking-tight">ESG Performance</h1>
                                    <p className="text-cyan-100/70 text-sm font-medium">Enterprise ESG Dashboard</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                                    <div className="text-cyan-300 text-[10px] font-bold uppercase tracking-widest mb-1">Active Context</div>
                                    <div className="text-lg font-bold truncate">{maturityData?.title || 'No Context Loaded'}</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                                    <div className="text-cyan-300 text-[10px] font-bold uppercase tracking-widest mb-1">Overall Scoring</div>
                                    <div className="text-2xl font-black">{Math.round(maturityData?.overallScore || 0)}%</div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-[400px] h-[250px] bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.5)" fontSize={10} />
                                    <Radar
                                        name="Maturity"
                                        dataKey="A"
                                        stroke="#22d3ee"
                                        fill="#22d3ee"
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <main className="flex-1 p-6 overflow-y-auto w-full">
                    <div className="max-w-7xl mx-auto space-y-8 pb-12">

                        {/* Section 1: Standard Path Classes */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                    Standard Path
                                    <Badge variant="outline" className="text-[10px] font-mono border-slate-200">v1.0.OPEN-ES</Badge>
                                </h2>
                                <Button variant="ghost" size="sm" className="text-slate-500 gap-1">
                                    <Info className="h-4 w-4" /> Understanding the scoring
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {OPEN_ES_CLASSES.map((cls) => {
                                    if (cls.id > 3) return null;

                                    const classScore = { scoring: 0, progress: 0, answered: 0, total: 0 };
                                    const pillarScores = ["Governance", "Social", "Environment"].map(p => {
                                        const ps = calculatePillarScore(p, cls.id, maturityData?.answers || [], OPEN_ES_CLASSES);
                                        classScore.scoring += ps.scoring;
                                        classScore.progress += ps.progress;
                                        classScore.answered += ps.answered;
                                        classScore.total += ps.total;
                                        return { name: p, ...ps };
                                    });

                                    const avgScoring = Math.round(classScore.scoring / 3) || 0;
                                    const avgProgress = Math.round(classScore.progress / 3) || 0;

                                    return (
                                        <Card key={cls.id} className="group relative overflow-hidden border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-[#005A8C]" />
                                            <CardHeader className="text-center pb-2 pt-6">
                                                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Module {cls.id}</div>
                                                <CardTitle className="text-xl font-black text-[#005A8C]">{cls.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <Button
                                                    onClick={() => handleAccessClass(cls.id)}
                                                    variant="ghost"
                                                    className="w-full text-[#005A8C] font-bold text-sm h-12 rounded-xl bg-slate-50 hover:bg-[#005A8C] hover:text-white transition-all group-hover:shadow-inner"
                                                >
                                                    Access the class <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Button>

                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex justify-between items-end mb-1.5">
                                                            <span className="text-[11px] font-bold text-slate-500 uppercase">Performance</span>
                                                            <span className="text-xs font-black text-[#005A8C]">{avgScoring}%</span>
                                                        </div>
                                                        <Progress value={avgScoring} className="h-1.5 bg-slate-100" />
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-1">
                                                        {pillarScores.map(ps => (
                                                            <div key={ps.name} className="flex flex-col items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                                                                <div className="text-[8px] font-bold text-slate-400 uppercase truncate w-full text-center">{ps.name}</div>
                                                                <div className="text-[10px] font-black text-[#005A8C]">{ps.scoring}%</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}

                                {/* God Tier Context Index Form Card */}
                                <Card className="relative overflow-hidden border-dashed border-2 border-cyan-200 bg-gradient-to-br from-white to-cyan-50/30 group">
                                    <div className="absolute top-0 right-0 p-2">
                                        <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-100 text-[9px]">CONTEXT ENGINE</Badge>
                                    </div>
                                    <CardHeader className="pt-6">
                                        <CardTitle className="text-xl font-black text-cyan-700 flex items-center gap-2">
                                            <RefreshCw className="h-5 w-5 text-cyan-500" />
                                            Context Index
                                        </CardTitle>
                                        <CardDescription className="text-[11px] font-medium leading-tight"> Initialize a new strategic assessment container</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Assessment Title (e.g. Q4 Audit)"
                                                value={newContext.title}
                                                onChange={(e) => setNewContext({ ...newContext, title: e.target.value })}
                                                className="h-9 text-xs border-slate-200 focus:ring-cyan-500/20"
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    placeholder="Year"
                                                    type="number"
                                                    value={newContext.year}
                                                    onChange={(e) => setNewContext({ ...newContext, year: parseInt(e.target.value) })}
                                                    className="h-9 text-xs"
                                                />
                                                <Input
                                                    placeholder="Sector"
                                                    value={newContext.sector}
                                                    onChange={(e) => setNewContext({ ...newContext, sector: e.target.value })}
                                                    className="h-9 text-xs"
                                                />
                                            </div>
                                            <Input
                                                placeholder="PIC Name"
                                                value={newContext.picName}
                                                onChange={(e) => setNewContext({ ...newContext, picName: e.target.value })}
                                                className="h-9 text-xs"
                                            />
                                            <Input
                                                placeholder="PIC Email"
                                                value={newContext.picEmail}
                                                onChange={(e) => setNewContext({ ...newContext, picEmail: e.target.value })}
                                                className="h-9 text-xs"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleCreateContext}
                                            disabled={isCreating || !newContext.title}
                                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold h-10 shadow-lg shadow-cyan-600/20 disabled:opacity-50"
                                        >
                                            {isCreating ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Verify & Initialize"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Section 2: Context Management Table */}
                        <div className="space-y-4 pt-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                        <Building2 className="h-5 w-5 text-[#005A8C]" />
                                        Context Repository
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium">Manage and switch between different assessment contexts</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Search context or company..."
                                            value={contextSearch}
                                            onChange={(e) => setContextSearch(e.target.value)}
                                            className="pl-9 h-10 w-[250px] bg-white border-slate-200 text-sm"
                                        />
                                    </div>
                                    <select
                                        value={yearFilter}
                                        onChange={(e) => setYearFilter(e.target.value)}
                                        className="h-10 px-3 rounded-md border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#005A8C]/20"
                                    >
                                        <option value="all">All Years</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                    </select>
                                </div>
                            </div>

                            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Context Detail</th>
                                                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Reference Year</th>
                                                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Score</th>
                                                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                                                <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredAssessments.length > 0 ? filteredAssessments.map((a: any) => (
                                                <tr key={a.id} className={`hover:bg-slate-50/80 transition-colors ${maturityData?.id === a.id ? 'bg-cyan-50/50' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm ${maturityData?.id === a.id ? 'bg-cyan-500 text-white' : 'bg-[#005A8C]/10 text-[#005A8C]'}`}>
                                                                {a.title?.charAt(0) || 'E'}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-800 text-sm">{a.title}</div>
                                                                <div className="text-[11px] text-slate-500 font-medium">{a.companyName || 'Not specified'} · {a.sector}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Badge variant="outline" className="text-slate-600 font-bold">{a.year}</Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="text-sm font-black text-[#005A8C]">{Math.round(a.overallScore)}%</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Badge className={a.status === 'Completed' ? 'bg-emerald-500' : 'bg-orange-500'}>
                                                            {a.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                onClick={() => switchContext(a)}
                                                                variant={maturityData?.id === a.id ? "secondary" : "ghost"}
                                                                size="sm"
                                                                className="h-8 gap-1.5 font-bold text-xs"
                                                            >
                                                                {maturityData?.id === a.id ? <Check className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                                {maturityData?.id === a.id ? 'Active' : 'Load'}
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleDownload(a)}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 px-2 text-slate-400 hover:text-[#005A8C]"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                                                        No assessment contexts found matching your criteria.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 font-sans w-full max-w-full overflow-hidden box-border">
            {/* Build Marker for Verification */}
            <div className="absolute top-0 right-0 z-50 pointer-events-none opacity-0 hover:opacity-100">
                <span className="text-[10px] bg-black/80 text-white px-2 py-0.5 rounded-bl font-mono">
                    BUILD: 2026.02.24.02
                </span>
            </div>
            {/* Class Detail Header */}
            <div className="bg-white border-b border-slate-100 flex items-center h-14">
                <Button
                    variant="ghost"
                    className="h-full px-6 rounded-none text-slate-500 hover:bg-slate-50 flex items-center gap-2 border-r border-slate-100"
                    onClick={() => setView("dashboard")}
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <div className="flex flex-1">
                    {OPEN_ES_CLASSES.filter(c => c.id <= 3).map((cls) => (
                        <button
                            key={cls.id}
                            onClick={() => setSelectedClassId(cls.id)}
                            className={`
                                h-14 px-8 text-sm font-bold transition-all relative
                                ${selectedClassId === cls.id
                                    ? "text-[#005A8C]"
                                    : "text-slate-400 hover:text-slate-600"}
                            `}
                        >
                            {cls.name}
                            {selectedClassId === cls.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#005A8C]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Pillar Tabs */}
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 overflow-x-auto no-scrollbar">
                {selectedClass.pillars.map((pillar) => {
                    const isActive = selectedPillarName === pillar.name
                    const ps = calculatePillarScore(pillar.name, selectedClassId, maturityData?.answers || [], OPEN_ES_CLASSES);
                    return (
                        <button
                            key={pillar.name}
                            onClick={() => setSelectedPillarName(pillar.name)}
                            className={`
                                flex items-center gap-3 px-6 py-3 rounded-xl border transition-all whitespace-nowrap
                                ${isActive
                                    ? "bg-[#005A8C] border-[#005A8C] shadow-md text-white"
                                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"}
                            `}
                        >
                            <div className="flex flex-col items-start leading-tight">
                                <span className="text-[13px] font-bold">{pillar.name}</span>
                                <span className={`text-[10px] font-medium ${isActive ? "text-white/70" : "text-slate-400"}`}>
                                    {ps.total} Questions
                                </span>
                            </div>
                            <div className={`
                                px-2 py-0.5 rounded-full text-[10px] font-black
                                ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-[#005A8C]"}
                            `}>
                                {ps.scoring}%
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Topic Carousel */}
            <div className="px-6 py-8 bg-white overflow-hidden flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 h-10 w-10 shrink-0"
                    onClick={() => scrollCarousel("left")}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <ScrollArea className="flex-1 min-w-0" ref={topicScrollRef}>
                    <div className="flex gap-4 pb-4">
                        {selectedPillar?.topics?.map((topic) => {
                            const isTopicActive = selectedTopicId === topic.id
                            return (
                                <Card
                                    key={topic.id}
                                    onClick={() => setSelectedTopicId(topic.id)}
                                    className={`
                                        w-[260px] shrink-0 p-5 cursor-pointer transition-all border-2
                                        ${isTopicActive
                                            ? "border-[#F2C94C] ring-2 ring-[#F2C94C]/20 bg-white"
                                            : "border-slate-100 bg-slate-50 hover:border-blue-200"}
                                    `}
                                >
                                    <h4 className="text-[#005A8C] font-bold text-sm mb-4 leading-relaxed whitespace-normal h-10 line-clamp-2">
                                        {topic.name}
                                    </h4>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-[11px] font-bold text-[#005A8C]">
                                            {topic.questions.filter(q => maturityData?.answers?.some((a: any) => a.questionId === q.id)).length}/{topic.questions.length} questions
                                        </span>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 h-10 w-10 shrink-0"
                    onClick={() => scrollCarousel("right")}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            {/* Questions Table */}
            <main className="flex-1 overflow-hidden flex flex-col px-6 pb-6">
                <div className="bg-[#F1F5F9] border-t border-x border-slate-200 rounded-t-xl overflow-hidden">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search questions..."
                                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#005A8C]/20"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                {selectedTopicId ? selectedPillar.topics.find(t => t.id === selectedTopicId)?.name : "All topics"}
                                <div className="flex gap-1">
                                    <ChevronLeft className="h-4 w-4 text-slate-400 cursor-pointer" />
                                    <ChevronRight className="h-4 w-4 text-slate-400 cursor-pointer" />
                                </div>
                            </h3>
                            <div className="text-[11px] font-medium text-slate-500">
                                Reference Year: <span className="font-bold text-slate-900 border-b border-slate-900 cursor-pointer">{maturityData.year} ({maturityData.title})</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="flex-1 min-h-0 min-w-0 bg-white border border-slate-200 rounded-b-xl overflow-hidden flex flex-col">
                    <div className="grid grid-cols-12 bg-[#F8FAFC] border-b border-slate-200 p-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                        <div className="col-span-1">ID</div>
                        <div className="col-span-1">Scoring</div>
                        <div className="col-span-6">Questions</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1">Action</div>
                        <div className="col-span-1 text-center">Performance Saved</div>
                    </div>
                    <ScrollArea className="flex-1 min-h-0">
                        <div className="divide-y divide-slate-100 pb-20">
                            {(selectedTopicId
                                ? (selectedPillar?.topics || []).filter(t => t.id === selectedTopicId)
                                : (selectedPillar?.topics || [])
                            ).map(topic => {
                                const filteredQuestions = topic.questions.filter(q =>
                                    q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    q.id.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                return (
                                    <React.Fragment key={topic.id}>
                                        {filteredQuestions.map((q, idx) => {
                                            const answer = maturityData?.answers?.find((a: any) => a.questionId === q.id)
                                            const isCompleted = !!answer
                                            return (
                                                <div key={q.id} className="grid grid-cols-12 p-4 items-center text-sm group hover:bg-slate-50 transition-colors">
                                                    <div className="col-span-1 font-bold text-[#005A8C]">{q.id}</div>
                                                    <div className="col-span-1 font-black text-slate-800">
                                                        {answer ? answer.maturityScore : 0} <span className="text-slate-400 font-bold">/ 3</span>
                                                    </div>
                                                    <div className="col-span-6 font-medium text-slate-700 pr-4 break-words">{q.text}</div>
                                                    <div className="col-span-2 flex items-center gap-2">
                                                        <div className={`h-2 w-2 rounded-full ${isCompleted ? "bg-[#7EB338]" : "bg-slate-300"}`} />
                                                        <span className={`font-bold ${isCompleted ? "text-slate-600" : "text-slate-400"}`}>
                                                            {isCompleted ? "Completed" : "Empty"}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-1">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 px-3 border-slate-300 text-xs font-bold text-slate-600"
                                                            onClick={() => {
                                                                setSelectedQuestion(q)
                                                                setIsAssessmentModalOpen(true)
                                                            }}
                                                        >
                                                            Modify
                                                        </Button>
                                                    </div>
                                                    <div className="col-span-1 text-center font-bold text-slate-500">
                                                        {answer && answer.updatedAt ? new Date(answer.updatedAt).toLocaleDateString() : "-"}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </ScrollArea>
                </div>
            </main>

            <Dialog open={isAssessmentModalOpen} onOpenChange={setIsAssessmentModalOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-[#005A8C] flex items-center gap-2">
                            Question {selectedQuestion?.id}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedQuestion && (
                        <EsgAssessmentForm
                            assessmentId={maturityData?.id || "draft"}
                            topicId={selectedQuestion.id} // Reusing question ID as topic ID for simplicity
                            disclosureId={selectedQuestion.id}
                            disclosureName={selectedQuestion.text}
                            reference="Open-es Standard"
                            questionText={selectedQuestion.text}
                            onSuccess={async () => {
                                setIsAssessmentModalOpen(false)
                                // Refresh current assessment data
                                const all = await getAllEsgAssessments()
                                setAllAssessments(all)
                                const active = all.find((a: any) => a.id === maturityData.id)
                                if (active) setMaturityData(active)
                                toast.success("Assessment saved and scoring updated")
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
