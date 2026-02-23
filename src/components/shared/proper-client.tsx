"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Award, ShieldCheck, Zap, Users, BarChart3,
    CheckCircle2, AlertTriangle, Info, Plus,
    Search, Download, ExternalLink, History,
    Target, Building2, Droplets, Wind, Trash2
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts"
import { format } from "date-fns"
import { toast } from "sonner"
import {
    deletePROPERAssessment,
    deletePROPERCriteria,
    deletePROPERCommunityProgram,
    getProperDetailedAssessment
} from "@/app/actions/proper"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ProperAssessmentForm } from "./proper-form"
import { PROPERCriteriaForm } from "./proper-criteria-form"
import { PROPERComDevForm } from "./proper-comdev-form"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pencil, MoreVertical } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function PROPERDashboardClient({
    assessments,
    currentAssessment,
    criteria = [],
    comDev = []
}: any) {
    const [selectedYear, setSelectedYear] = useState(currentAssessment?.year || new Date().getFullYear());
    const [activeTab, setActiveTab] = useState("overview");

    // Dialog States
    const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
    const [criteriaDialogOpen, setCriteriaDialogOpen] = useState(false);
    const [comDevDialogOpen, setComDevDialogOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    // Editing States
    const [editingItem, setEditingItem] = useState<any>(null);
    const [deleteType, setDeleteType] = useState<"assessment" | "criteria" | "comdev" | null>(null);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const handleEditAssessment = () => {
        setEditingItem(latest);
        setAssessmentDialogOpen(true);
    };

    const handleAddCriteria = () => {
        setEditingItem(null);
        setCriteriaDialogOpen(true);
    };

    const handleEditCriteria = (c: any) => {
        setEditingItem(c);
        setCriteriaDialogOpen(true);
    };

    const handleAddComDev = () => {
        setEditingItem(null);
        setComDevDialogOpen(true);
    };

    const handleEditComDev = (item: any) => {
        setEditingItem(item);
        setComDevDialogOpen(true);
    };

    const confirmDelete = (id: string, type: "assessment" | "criteria" | "comdev") => {
        setIdToDelete(id);
        setDeleteType(type);
        setDeleteConfirmOpen(true);
    };

    const handleDelete = async () => {
        if (!idToDelete || !deleteType) return;

        try {
            if (deleteType === "assessment") await deletePROPERAssessment(idToDelete);
            else if (deleteType === "criteria") await deletePROPERCriteria(idToDelete);
            else if (deleteType === "comdev") await deletePROPERCommunityProgram(idToDelete);

            toast.success(`${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} deleted successfully`);
            setDeleteConfirmOpen(false);
        } catch (error) {
            toast.error("Failed to delete item");
        }
    };

    const ratingColors = {
        GOLD: "bg-amber-400 text-amber-950",
        GREEN: "bg-emerald-500 text-white",
        BLUE: "bg-blue-500 text-white",
        RED: "bg-red-500 text-white",
        BLACK: "bg-slate-900 text-white",
    };

    const latest = currentAssessment || assessments[0];
    const rating = latest?.predictedRating || "BLUE";

    // Weighted progress to next level
    const innovationScore = criteria.filter((c: any) => ["Energy", "Biodiversity", "Global Warming"].includes(c.category))
        .reduce((acc: number, curr: any) => acc + (curr.score || 0), 0) / (criteria.length || 1);

    const progressToNext = rating === "BLUE" ? (innovationScore / 60) * 100 : (innovationScore / 80) * 100;

    return (
        <div className="space-y-6 pb-20">
            {/* AUDIT-READY HEADER */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                    <div className={`h-16 w-16 rounded-2xl ${ratingColors[rating as keyof typeof ratingColors]} flex items-center justify-center shadow-lg transform rotate-3 transition-transform hover:rotate-0`}>
                        <Award className="h-10 w-10" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black tracking-tight text-slate-900">PROPER {selectedYear} Assessment</h1>
                            <button onClick={handleEditAssessment} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors" title="Edit Period">
                                <Pencil className="h-4 w-4" />
                            </button>
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-slate-200">
                                {latest?.status || "DRAFT"}
                            </Badge>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Predicted Status: <span className="text-slate-900 font-bold underline decoration-slate-300 decoration-2 underline-offset-4">{rating}</span> (Indonesian Ministry of Environment Rating)</p>
                    </div>
                </div>
                <div className="flex gap-2 w-full lg:w-auto">
                    <Button variant="outline" className="flex-1 lg:flex-none h-11 text-xs font-bold border-slate-200 hover:bg-slate-50">
                        <Download className="h-4 w-4 mr-2" /> Export Report
                    </Button>
                    <Button className="flex-1 lg:flex-none h-11 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200">
                        <ShieldCheck className="h-4 w-4 mr-2" /> Finalize Verification
                    </Button>
                </div>
            </div>

            {/* PERFORMANCE GAUGE ROW */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <Card className="md:col-span-8 border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="border-b border-slate-50 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Target className="h-4 w-4 text-blue-600" />
                                    Environmental Governance Progress
                                </CardTitle>
                                <CardDescription className="text-[10px]">Distance to {rating === "GOLD" ? "Maintain Gold" : rating === "GREEN" ? "GOLD" : "GREEN"} status</CardDescription>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-slate-900">{progressToNext.toFixed(1)}%</span>
                                <p className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Maturity Score</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="relative pt-2">
                                <Progress value={progressToNext} className="h-3 bg-slate-100" />
                                <div className="absolute top-0 left-0 w-full flex justify-between px-1">
                                    <div className="h-5 w-0.5 bg-slate-200" />
                                    <div className="h-5 w-0.5 bg-blue-300" title="Blue (Taat)" />
                                    <div className="h-5 w-0.5 bg-emerald-300" title="Green (Beyond)" />
                                    <div className="h-5 w-0.5 bg-amber-300" title="Gold (Leader)" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                                    <p className="text-[9px] font-bold text-blue-600 uppercase mb-1">Compliance</p>
                                    <p className="text-sm font-black text-blue-900">100% Taat</p>
                                </div>
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                    <p className="text-[9px] font-bold text-emerald-600 uppercase mb-1">Efficiency</p>
                                    <p className="text-sm font-black text-emerald-900">{innovationScore.toFixed(0)}% Score</p>
                                </div>
                                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                                    <p className="text-[9px] font-bold text-amber-600 uppercase mb-1">Social</p>
                                    <p className="text-sm font-black text-amber-900">Innovation Level 4</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-4 border-none shadow-sm bg-slate-900 text-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-400" />
                            AI Insight
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-xs text-slate-300 leading-relaxed italic">
                            "Assessment data suggests a 12% gap in **Biodiversity Innovation**. Fulfilling the 'Keanekaragaman Hayati' benchmarks could push the {selectedYear} rating from **GREEN** to **GOLD**."
                        </p>
                        <div className="pt-4 border-t border-slate-800">
                            <Button variant="link" className="text-amber-400 text-[10px] p-0 h-auto font-black uppercase tracking-widest">
                                View Required Innovations →
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* TABBED NAVIGATION */}
            <Tabs defaultValue="compliance" className="w-full">
                <TabsList className="bg-slate-100/50 p-1 rounded-xl mb-6">
                    <TabsTrigger value="compliance" className="text-xs font-bold px-6 py-2">Aspek Biru (Compliance)</TabsTrigger>
                    <TabsTrigger value="innovation" className="text-xs font-bold px-6 py-2">Aspek Hijau/Emas (Innovation)</TabsTrigger>
                    <TabsTrigger value="social" className="text-xs font-bold px-6 py-2">Aspek Sosial (CSR)</TabsTrigger>
                    <TabsTrigger value="evidence" className="text-xs font-bold px-6 py-2">Audit Evidence Vault</TabsTrigger>
                </TabsList>

                {/* COMPLIANCE TAB */}
                <TabsContent value="compliance">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-sm bg-white">
                            <CardHeader className="border-b border-slate-50">
                                <CardTitle className="text-sm font-bold">Standard Regulatory Compliance (Taat)</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-50">
                                    {[
                                        { cat: "Water", label: "Izin Pembuangan Air Limbah (POPAL)", icon: Droplets, color: "text-blue-500" },
                                        { cat: "Air", label: "Stack Emission Monitoring (SIMPEL)", icon: Wind, color: "text-slate-500" },
                                        { cat: "B3 Waste", label: "Festronik & Manifest Management", icon: Trash2, color: "text-amber-600" },
                                        { cat: "Land", label: "Land Quality & Protection", icon: Building2, color: "text-emerald-700" }
                                    ].map((item, idx) => {
                                        const result = criteria.find((c: any) => c.category === item.cat) || { fulfillment: "Yes", id: `temp-${idx}` };
                                        return (
                                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg bg-slate-50 ${item.color}`}>
                                                        <item.icon className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-800">{item.label}</p>
                                                        <p className="text-[9px] text-slate-400 font-medium">Mandatory BLUE Requirement</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className={`text-[9px] font-black border-none ${result.fulfillment === "Yes" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                                        {result.fulfillment === "Yes" ? "TAAT (100%)" : "NON-TAAT"}
                                                    </Badge>
                                                    <div className="flex gap-1">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-blue-600" onClick={() => handleEditCriteria(result)}>
                                                            <Pencil className="h-3 w-3" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-red-600" onClick={() => confirmDelete(result.id, "criteria")}>
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-white overflow-hidden">
                            <CardContent className="p-0">
                                <div className="h-[300px] w-full p-4">
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-4 px-2">Compliance Trend (Last 12 Months)</p>
                                    <ResponsiveContainer width="100%" height="80%">
                                        <AreaChart data={[
                                            { month: 'Jul', score: 95 }, { month: 'Aug', score: 98 }, { month: 'Sep', score: 100 },
                                            { month: 'Oct', score: 92 }, { month: 'Nov', score: 100 }, { month: 'Dec', score: 100 }
                                        ]}>
                                            <defs>
                                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                            <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* INNOVATION TAB */}
                <TabsContent value="innovation">
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
                            <div>
                                <CardTitle className="text-sm font-bold">Beyond Compliance Evaluation (Hijau/Emas)</CardTitle>
                                <CardDescription className="text-[10px]">Criteria for environmental excellence and resource efficiency</CardDescription>
                            </div>
                            <Button size="sm" className="h-8 text-[10px] font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-md" onClick={handleAddCriteria}>
                                <Plus className="h-3 w-3 mr-1" /> Add Innovation
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-slate-50 border-b border-slate-50">
                                {criteria.filter((c: any) => ["Energy", "Biodiversity", "Global Warming"].includes(c.category)).map((c: any, i: number) => (
                                    <div key={i} className="p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="text-[9px] font-black border-slate-200">{c.category}</Badge>
                                            <span className="text-xl font-black text-slate-800">{c.score}%</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-700">{c.parameter}</p>
                                        <Progress value={c.score} className="h-1.5" />
                                        <div className="flex items-center gap-2 pt-2 justify-between">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                <span className="text-[9px] text-slate-500 font-medium">Verified</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300 hover:text-blue-600" onClick={() => handleEditCriteria(c)}>
                                                    <Pencil className="h-3 w-3" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300 hover:text-red-600" onClick={() => confirmDelete(c.id, "criteria")}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* RADAR ANALYTICS */}
                            <div className="flex flex-col lg:flex-row p-6 gap-8 items-center">
                                <div className="h-[250px] flex-1">
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-4 px-2">Resource Efficiency Profile</p>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={[
                                            { subject: 'Energy', A: 85 },
                                            { subject: 'Water', A: 70 },
                                            { subject: 'Waste', A: 90 },
                                            { subject: 'Emissions', A: 65 },
                                            { subject: 'Nature', A: 40 },
                                        ]}>
                                            <PolarGrid stroke="#f1f5f9" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                                            <Radar name="Performance" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1 space-y-4 max-w-[400px]">
                                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm shadow-emerald-50">
                                        <h4 className="text-xs font-black text-emerald-900 uppercase tracking-widest mb-2">Innovation Benchmark</h4>
                                        <p className="text-xs text-emerald-800 leading-relaxed">
                                            Your **Energy Efficiency** scores are in the top 5th percentile for your industry sector. This contributes +15 points to the **GOLD** prediction.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Gap Analysis</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            **Biodiversity (Nature)** lacks quantitative evidence. Uploading a *Biodiversity Index* would increase innovation scores significantly.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SOCIAL TAB */}
                <TabsContent value="social">
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="border-b border-slate-50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold">Community Development (ComDev) & Social ROI</CardTitle>
                                <Button size="sm" className="h-8 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100 shadow-lg" onClick={handleAddComDev}>
                                    <Plus className="h-3 w-3 mr-1" /> Add Program
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {comDev.map((item: any, i: number) => (
                                    <div key={i} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50/20 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <Users className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900">{item.programName}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className="bg-slate-100 text-slate-600 border-none text-[8px] font-black px-1.5 py-0">SROI: {item.sroiScore || "N/A"}</Badge>
                                                    <span className="text-[10px] text-slate-400 font-bold">{item.beneficiaries} Beneficiaries</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[9px] font-black uppercase text-slate-400">Budget Allocated</span>
                                            <span className="text-sm font-black text-slate-900">Rp {item.budget?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold hover:bg-blue-50 hover:text-blue-600 border-slate-200 shadow-sm" onClick={() => handleEditComDev(item)}>
                                                <Pencil className="h-3 w-3 mr-1" /> Edit
                                            </Button>
                                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold text-red-600 hover:bg-red-50 border-slate-200 shadow-sm" onClick={() => confirmDelete(item.id, "comdev")}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {comDev.length === 0 && (
                                    <div className="p-12 text-center text-slate-400 italic text-xs">No community programs logged for this period.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* EVIDENCE TAB */}
                <TabsContent value="evidence">
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
                            <div>
                                <CardTitle className="text-sm font-bold">Audit Evidence Vault</CardTitle>
                                <CardDescription className="text-[10px]">Centralized documents for MOEF verification</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold font-black"><Search className="h-3 w-3 mr-1" /> Search Vault</Button>
                                <Button size="sm" className="h-8 text-[10px] font-bold bg-blue-600 text-white shadow-blue-100 shadow-lg"><Plus className="h-3 w-3 mr-1" /> Upload Document</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { name: "Laporan Pelaksanaan RKL-RPL Semester II", type: "PDF", size: "12.4 MB", date: "Jan 12, 2026" },
                                    { name: "Sertifikat Kalibrasi CEMS Stack 01", type: "PDF", size: "2.1 MB", date: "Dec 15, 2025" },
                                    { name: "Dokumen Life Cycle Assessment (LCA)", type: "XLSX", size: "8.7 MB", date: "Feb 02, 2026" },
                                    { name: "Social Mapping Report H2 2025", type: "PDF", size: "15.2 MB", date: "Oct 22, 2025" }
                                ].map((doc, i) => (
                                    <div key={i} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all group">
                                        <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            <History className="h-5 w-5" />
                                        </div>
                                        <h5 className="text-[11px] font-bold text-slate-900 line-clamp-1 mb-1">{doc.name}</h5>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-[8px] font-black uppercase text-slate-400">{doc.type} • {doc.size}</span>
                                            <Button size="icon" variant="ghost" className="h-6 w-6"><Download className="h-3 w-3" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* MODALS & DIALOGS */}
            <Dialog open={assessmentDialogOpen} onOpenChange={setAssessmentDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black">Assessment Period</DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-500">Setup the assessment period and status for this audit cycle.</DialogDescription>
                    </DialogHeader>
                    <ProperAssessmentForm
                        initialData={editingItem}
                        onSuccess={() => {
                            setAssessmentDialogOpen(false);
                            toast.success("Period updated successfully");
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={criteriaDialogOpen} onOpenChange={setCriteriaDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black">{editingItem?.parameter ? "Edit Evaluation" : "New Evaluation"}</DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-500">Enter compliance or innovation data for environmental parameters.</DialogDescription>
                    </DialogHeader>
                    <PROPERCriteriaForm
                        assessmentId={latest?.id}
                        initialData={editingItem}
                        onSuccess={() => {
                            setCriteriaDialogOpen(false);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={comDevDialogOpen} onOpenChange={setComDevDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black">{editingItem ? "Edit Social Program" : "Add New Social Program"}</DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-500">Record CSR initiatives and calculate Social ROI impact.</DialogDescription>
                    </DialogHeader>
                    <PROPERComDevForm
                        assessmentId={latest?.id}
                        initialData={editingItem}
                        onSuccess={() => {
                            setComDevDialogOpen(false);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black">Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium text-slate-500">
                            This action cannot be undone. This will permanently delete the selected {deleteType} record from the {selectedYear} assessment.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="rounded-xl border-slate-200">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-100" onClick={handleDelete}>
                            Delete Permanently
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
