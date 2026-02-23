"use client"

import { useState } from "react"
import {
    Plus,
    Trash2,
    Edit2,
    Download,
    Filter,
    ChevronRight,
    Recycle,
    Truck,
    Building2,
    TrendingUp,
    BarChart3,
    PieChart as PieChartIcon,
    Calendar,
    Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts"
import { format } from "date-fns"
import { DomesticWasteForm } from "./domestic-waste-form"
import { deleteWasteLog, upsertWastePartner, deleteWastePartner, upsertWasteSource, deleteWasteSource } from "@/app/actions/domestic-waste"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { convertToCSV, downloadCSV } from "@/lib/export-utils"

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

export function DomesticWasteDashboardClient({
    logs = [],
    partners = [],
    sources = [],
    analytics
}: {
    logs: any[],
    partners: any[],
    sources: any[],
    analytics: any
}) {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    // Partner/Source States
    const [isPartnerFormOpen, setIsPartnerFormOpen] = useState(false)
    const [editingPartner, setEditingPartner] = useState<any>(null)
    const [isSourceFormOpen, setIsSourceFormOpen] = useState(false)
    const [editingSource, setEditingSource] = useState<any>(null)

    const filteredLogs = logs.filter(log =>
        log.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.source?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            const result = await deleteWasteLog(itemToDelete);
            if (result.success) {
                toast.success("Log deleted successfully");
                setIsDeleteDialogOpen(false);
                setItemToDelete(null);
            }
        } catch (error) {
            toast.error("Failed to delete log");
        }
    }

    const exportLogsCSV = () => {
        const headers = ["Date", "Category", "Source", "Destination", "Amount", "Unit", "Vehicle", "Status", "Notes"];
        const data = logs.map(log => ({
            Date: format(new Date(log.date), 'yyyy-MM-dd'),
            Category: log.category,
            Source: log.source?.name || "N/A",
            Destination: log.destination?.name || "Internal",
            Amount: log.unit === 'kg' ? log.weight : log.volume,
            Unit: log.unit,
            Vehicle: log.vehiclePlate || "-",
            Status: log.status,
            Notes: log.notes || ""
        }));
        const csv = convertToCSV(data, headers);
        downloadCSV(csv, `domestic_waste_logs_${format(new Date(), 'yyyyMMdd')}.csv`);
    };

    const exportSourcesCSV = () => {
        const headers = ["Source", "TotalWeight_kgEq", "Percentage"];
        const data = analytics.sourceData.map((s: any) => ({
            Source: s.name,
            TotalWeight_kgEq: s.weight.toFixed(2),
            Percentage: `${s.percentage.toFixed(1)}%`
        }));
        const csv = convertToCSV(data, headers);
        downloadCSV(csv, `waste_sources_report_${format(new Date(), 'yyyyMMdd')}.csv`);
    };

    const exportPartnersCSV = () => {
        const headers = ["Name", "Type", "License", "Contact", "Vehicle", "Status"];
        const data = partners.map(p => ({
            Name: p.name,
            Type: p.type,
            License: p.licenseNumber || "-",
            Contact: p.contactPerson || "-",
            Vehicle: p.vehiclePlate || "-",
            Status: p.status
        }));
        const csv = convertToCSV(data, headers);
        downloadCSV(csv, `waste_partners_${format(new Date(), 'yyyyMMdd')}.csv`);
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Domestic Waste</h1>
                    <p className="text-slate-500 font-medium">Monitoring non-hazardous waste generation and recycling efficiency.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl border-slate-200" onClick={exportLogsCSV}>
                        <Download className="h-4 w-4 mr-2" /> Export Audit Report
                    </Button>
                    <Button
                        onClick={() => {
                            setEditingItem(null);
                            setIsFormOpen(true);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-100"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Log Generation
                    </Button>
                </div>
            </div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="h-5 w-5 opacity-80" />
                            <Badge className="bg-white/20 text-white border-0">Total</Badge>
                        </div>
                        <div className="text-3xl font-black">{analytics.totalWeight.toFixed(1)} <span className="text-sm font-normal">kgEquivalent</span></div>
                        <div className="text-xs font-medium opacity-80 mt-1">Total Generation this year</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Recycle className="h-5 w-5 text-emerald-600" />
                            <Badge variant="outline" className="border-emerald-100 text-emerald-700 bg-emerald-50">Diverted</Badge>
                        </div>
                        <div className="text-3xl font-black text-slate-900">{analytics.diversionRate.toFixed(1)}%</div>
                        <div className="text-xs font-semibold text-slate-500 mt-1">Waste Diversion Rate</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all" onClick={() => {
                    const el = document.querySelector('[value="partners"]') as HTMLElement;
                    el?.click();
                }}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Truck className="h-5 w-5 text-blue-600" />
                            <Badge variant="outline" className="border-blue-100 text-blue-700 bg-blue-50">Active</Badge>
                        </div>
                        <div className="text-3xl font-black text-slate-900">{partners.length}</div>
                        <div className="text-xs font-semibold text-slate-500 mt-1">Licensed Waste Partners</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white cursor-pointer hover:ring-2 hover:ring-violet-500 transition-all" onClick={() => {
                    const el = document.querySelector('[value="by-source"]') as HTMLElement;
                    el?.click();
                }}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Building2 className="h-5 w-5 text-violet-600" />
                            <Badge variant="outline" className="border-violet-100 text-violet-700 bg-violet-50">Sources</Badge>
                        </div>
                        <div className="text-3xl font-black text-slate-900">{sources.length}</div>
                        <div className="text-xs font-semibold text-slate-500 mt-1">Monitored Waste Sources</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-none shadow-sm bg-white rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-sm font-black flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-emerald-600" /> GENERATION TREND
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 pb-6 pr-6">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.trendData}>
                                    <defs>
                                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-sm font-black flex items-center gap-2">
                            <PieChartIcon className="h-4 w-4 text-emerald-600" /> WASTE COMPOSITION
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analytics.compositionData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {analytics.compositionData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="all-logs" className="w-full">
                <TabsList className="bg-slate-100/50 p-1 rounded-xl mb-6">
                    <TabsTrigger value="all-logs" className="text-xs font-bold px-6 py-2">Generation Logs</TabsTrigger>
                    <TabsTrigger value="by-source" className="text-xs font-bold px-6 py-2">Breakdown by Source</TabsTrigger>
                    <TabsTrigger value="partners" className="text-xs font-bold px-6 py-2">Waste Partners (Vendors)</TabsTrigger>
                </TabsList>

                <TabsContent value="all-logs">
                    <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-6 py-4">
                            <div className="flex items-center gap-4">
                                <div className="relative w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search records..."
                                        className="pl-9 h-9 border-slate-200 rounded-lg text-xs"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" size="sm" className="h-9 rounded-lg border-slate-200 text-xs font-bold" onClick={exportLogsCSV}>
                                    <Download className="h-3.5 w-3.5 mr-2" /> Download CSV
                                </Button>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold"><Filter className="h-3 w-3 mr-1" /> Advance Filter</Button>
                        </CardHeader>
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="text-[10px] font-black tracking-wider uppercase text-slate-500 pl-6">Date</TableHead>
                                    <TableHead className="text-[10px] font-black tracking-wider uppercase text-slate-500">Category</TableHead>
                                    <TableHead className="text-[10px] font-black tracking-wider uppercase text-slate-500">Source</TableHead>
                                    <TableHead className="text-[10px] font-black tracking-wider uppercase text-slate-500">Destination</TableHead>
                                    <TableHead className="text-[10px] font-black tracking-wider uppercase text-slate-500">Amount</TableHead>
                                    <TableHead className="text-[10px] font-black tracking-wider uppercase text-slate-500">Vehicle</TableHead>
                                    <TableHead className="text-[10px] font-black tracking-wider uppercase text-slate-500">Status</TableHead>
                                    <TableHead className="text-[10px] font-black tracking-wider uppercase text-slate-500 text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-32 text-center text-slate-400 font-medium">No waste records found</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                    <span className="text-xs font-bold text-slate-700">{format(new Date(log.date), 'dd MMM yyyy')}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 text-[10px] px-2">
                                                    {log.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs font-semibold text-slate-600">{log.source?.name}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs font-medium text-slate-500 italic">{log.destination?.name || "Internal Storage"}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs font-black text-slate-900">{log.unit === 'kg' ? log.weight : log.volume} <span className="text-[10px] font-normal text-slate-400 uppercase">{log.unit}</span></span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs font-mono text-slate-500">{log.vehiclePlate || "-"}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`
                                                    ${log.status === 'Processed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                        log.status === 'Transported' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            'bg-orange-50 text-orange-700 border-orange-100'} 
                                                    text-[9px] px-1.5 py-0 rounded font-black
                                                `}>
                                                    {log.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                                        onClick={() => {
                                                            setEditingItem(log);
                                                            setIsFormOpen(true);
                                                        }}
                                                    >
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => {
                                                            setItemToDelete(log.id);
                                                            setIsDeleteDialogOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="by-source">
                    <div className="flex justify-end mb-4">
                        <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-200 text-xs font-bold bg-white" onClick={exportSourcesCSV}>
                            <Download className="h-3.5 w-3.5 mr-2" /> Download CSV Report
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {analytics.sourceData?.map((source: any, index: number) => {
                            const sourceObj = sources.find(s => s.name === source.name);
                            return (
                                <Card key={source.name} className="border-none shadow-sm bg-white rounded-2xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-slate-200 transition-all group" onClick={() => {
                                    setEditingSource(sourceObj);
                                    setIsSourceFormOpen(true);
                                }}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-2 rounded-xl ${index % 4 === 0 ? 'bg-emerald-100 text-emerald-600' :
                                                index % 4 === 1 ? 'bg-blue-100 text-blue-600' :
                                                    index % 4 === 2 ? 'bg-violet-100 text-violet-600' :
                                                        'bg-orange-100 text-orange-600'
                                                }`}>
                                                <Building2 className="h-5 w-5" />
                                            </div>
                                            <Badge variant="outline" className="border-slate-100 text-slate-500 font-bold group-hover:bg-slate-50">
                                                {source.percentage.toFixed(1)}%
                                            </Badge>
                                        </div>
                                        <h3 className="text-sm font-black text-slate-900 mb-1 uppercase tracking-tight">{source.name}</h3>
                                        <div className="flex items-baseline gap-1 mb-4">
                                            <span className="text-2xl font-black text-slate-900">{source.weight.toFixed(1)}</span>
                                            <span className="text-xs font-bold text-slate-400 uppercase">kgEq</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${index % 4 === 0 ? 'bg-emerald-500' :
                                                    index % 4 === 1 ? 'bg-blue-500' :
                                                        index % 4 === 2 ? 'bg-violet-500' :
                                                            'bg-orange-500'
                                                    }`}
                                                style={{ width: `${source.percentage}%` }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                        <Card className="border-2 border-dashed border-slate-200 bg-slate-50/30 flex items-center justify-center p-8 hover:bg-slate-50 transition-colors cursor-pointer group rounded-2xl" onClick={() => {
                            setEditingSource(null);
                            setIsSourceFormOpen(true);
                        }}>
                            <div className="text-center">
                                <Plus className="h-8 w-8 text-slate-300 mx-auto mb-2 group-hover:text-violet-500 group-hover:scale-110 transition-all" />
                                <p className="text-xs font-black text-slate-500 uppercase">Add Waste Source</p>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="partners">
                    <div className="flex justify-end mb-4">
                        <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-200 text-xs font-bold bg-white" onClick={exportPartnersCSV}>
                            <Download className="h-3.5 w-3.5 mr-2" /> Download CSV Report
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {partners.map(p => (
                            <Card key={p.id} className="border-none shadow-sm bg-white overflow-hidden group cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all rounded-2xl" onClick={() => {
                                setEditingPartner(p);
                                setIsPartnerFormOpen(true);
                            }}>
                                <CardContent className="p-0">
                                    <div className="p-6 bg-slate-50/50 border-b border-slate-100 group-hover:bg-emerald-50/30 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-black text-slate-800">{p.name}</h3>
                                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 uppercase text-[9px]">{p.type}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-slate-500 line-clamp-1">{p.licenseNumber || "License: Pend. Validation"}</p>
                                            {p.vehiclePlate && <Badge variant="outline" className="text-[8px] font-mono">{p.vehiclePlate}</Badge>}
                                        </div>
                                    </div>
                                    <div className="p-4 flex gap-4">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Contact</p>
                                            <p className="text-xs font-semibold text-slate-600">{p.contactPerson || "N/A"}</p>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                            <Badge variant="outline" className={`text-[9px] ${p.status === 'Active' ? 'border-emerald-200 text-emerald-700' : 'border-slate-200 text-slate-500'}`}>
                                                {p.status === 'Active' ? 'CERTIFIED' : 'INACTIVE'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        <Card className="border-2 border-dashed border-slate-200 bg-slate-50/30 flex items-center justify-center p-8 hover:bg-slate-50 transition-colors cursor-pointer group rounded-2xl" onClick={() => {
                            setEditingPartner(null);
                            setIsPartnerFormOpen(true);
                        }}>
                            <div className="text-center">
                                <Plus className="h-8 w-8 text-slate-300 mx-auto mb-2 group-hover:text-emerald-500 group-hover:scale-110 transition-all" />
                                <p className="text-xs font-black text-slate-500 uppercase">Onboard Partner</p>
                            </div>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Modals */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                    <div className="bg-emerald-600 p-6 text-white">
                        <DialogTitle className="text-xl font-black">{editingItem ? "Edit Generation Log" : "New Generation Log"}</DialogTitle>
                        <DialogDescription className="text-xs text-emerald-100 opacity-90">Log daily waste data for compliance and diversion metrics.</DialogDescription>
                    </div>
                    <div className="p-6">
                        <DomesticWasteForm
                            initialData={editingItem}
                            partners={partners}
                            sources={sources}
                            onSuccess={() => setIsFormOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isPartnerFormOpen} onOpenChange={setIsPartnerFormOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                    <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
                        <div>
                            <DialogTitle className="text-xl font-black">{editingPartner ? "Partner Profile" : "Onboard New Partner"}</DialogTitle>
                            <DialogDescription className="text-xs text-emerald-100 opacity-90">Manage environmental service providers and licenses.</DialogDescription>
                        </div>
                        {editingPartner && (
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={async () => {
                                if (confirm("Delete this partner?")) {
                                    await deleteWastePartner(editingPartner.id);
                                    setIsPartnerFormOpen(false);
                                    toast.success("Partner removed");
                                }
                            }}>
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                    <form className="p-6 space-y-4" onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const data = Object.fromEntries(formData.entries());
                        await upsertWastePartner({ id: editingPartner?.id, ...data });
                        setIsPartnerFormOpen(false);
                        toast.success("Partner saved");
                    }}>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-500">Partner Name</Label>
                                <Input name="name" defaultValue={editingPartner?.name} className="rounded-xl border-slate-200 h-11 font-bold" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-black uppercase text-slate-500">Provider Type</Label>
                                    <Select name="type" defaultValue={editingPartner?.type || "Recycler"}>
                                        <SelectTrigger className="rounded-xl border-slate-200 h-11 font-bold"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Recycler">Recycler</SelectItem>
                                            <SelectItem value="TPS3R">TPS3R</SelectItem>
                                            <SelectItem value="Landfill">Landfill</SelectItem>
                                            <SelectItem value="Collector">Collector</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-black uppercase text-slate-500">License Number</Label>
                                    <Input name="licenseNumber" defaultValue={editingPartner?.licenseNumber} className="rounded-xl border-slate-200 h-11 font-bold" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-black uppercase text-slate-500">Contact Person</Label>
                                    <Input name="contactPerson" defaultValue={editingPartner?.contactPerson} className="rounded-xl border-slate-200 h-11 font-bold" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-black uppercase text-slate-500">Vehicle Plate (Default)</Label>
                                    <Input name="vehiclePlate" defaultValue={editingPartner?.vehiclePlate} className="rounded-xl border-slate-200 h-11 font-bold" placeholder="B 1234 XYZ" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-500">Address</Label>
                                <Input name="address" defaultValue={editingPartner?.address} className="rounded-xl border-slate-200 h-11 font-bold" />
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 rounded-xl font-black text-white shadow-lg shadow-emerald-100 uppercase tracking-wider">Save Partner Details</Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isSourceFormOpen} onOpenChange={setIsSourceFormOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                    <div className="bg-violet-600 p-6 text-white flex justify-between items-center">
                        <div>
                            <DialogTitle className="text-xl font-black">{editingSource ? "Source Profile" : "Add Waste Source"}</DialogTitle>
                            <DialogDescription className="text-xs text-violet-100 opacity-90">Define point of generation for accurate monitoring.</DialogDescription>
                        </div>
                        {editingSource && (
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={async () => {
                                if (confirm("Delete this source?")) {
                                    await deleteWasteSource(editingSource.id);
                                    setIsSourceFormOpen(false);
                                    toast.success("Source removed");
                                }
                            }}>
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                    <form className="p-6 space-y-4" onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const data = Object.fromEntries(formData.entries());
                        await upsertWasteSource({ id: editingSource?.id, ...data });
                        setIsSourceFormOpen(false);
                        toast.success("Source saved");
                    }}>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-500">Source Name</Label>
                                <Input name="name" defaultValue={editingSource?.name} className="rounded-xl border-slate-200 h-11 font-bold" required />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-500">Location / Department</Label>
                                <Input name="location" defaultValue={editingSource?.location} className="rounded-xl border-slate-200 h-11 font-bold" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-500">Status</Label>
                                <Select name="status" defaultValue={editingSource?.status || "Active"}>
                                    <SelectTrigger className="rounded-xl border-slate-200 h-11 font-bold"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 h-11 rounded-xl font-black text-white shadow-lg shadow-violet-100 uppercase tracking-wider">Save Source</Button>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black text-slate-900">Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium text-slate-500">
                            This will permanently remove the waste generation record. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="rounded-xl border-slate-200 font-bold">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-100 font-bold"
                            onClick={handleDelete}
                        >
                            Delete Record
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
