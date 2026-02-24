"use client"

import React, { useState, useMemo } from "react"
import {
    Scale,
    FileText,
    Clock,
    CheckCircle2,
    Search,
    Plus,
    Edit2,
    Trash2,
    Filter,
    ChevronDown,
    Calendar,
    AlertTriangle,
    CheckCircle,
    MoreHorizontal,
    ArrowUpDown,
    ShieldCheck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { updateLegalRegister, deleteLegalRegister, createLegalRegister } from "@/app/actions/legal"
import { format } from "date-fns"

interface LegalRegister {
    id: string
    no: number | null
    externalDocumentRegister: string | null
    regulator: string | null
    subjectMatter: string | null
    title: string | null
    clause: string | null
    descriptionOfClause: string | null
    descriptionOfCompliance: string | null
    category: string | null
    comply: string | null
    percentage: string | null
    evidence: string | null
    programOfCompliance: string | null
    lastUpdated: Date | null
    lastReviewed: Date | null
    nextReviewDate: Date | null
}

interface LegalRegisterClientProps {
    initialData: LegalRegister[]
}

export function LegalRegisterClient({ initialData }: LegalRegisterClientProps) {
    const [data, setData] = useState<LegalRegister[]>(initialData)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterRegulator, setFilterRegulator] = useState("All")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<LegalRegister | null>(null)

    // Stats Calculations
    const totalRegs = data.length
    const actRegs = data.filter(d => d.regulator?.toLowerCase() === 'act').length
    const complianceRate = useMemo(() => {
        const rates = data.map(d => {
            const p = d.percentage?.replace('%', '')
            return p && !isNaN(Number(p)) ? Number(p) : 0
        })
        return rates.length > 0 ? (rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(1) : "0"
    }, [data])

    const nextReviews = data.filter(d => {
        if (!d.nextReviewDate) return false
        const diff = new Date(d.nextReviewDate).getTime() - new Date().getTime()
        return diff > 0 && diff < (30 * 24 * 60 * 60 * 1000) // Next 30 days
    }).length

    const filteredData = data.filter(item => {
        const matchesSearch =
            (item.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (item.clause?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (item.subjectMatter?.toLowerCase() || "").includes(searchQuery.toLowerCase())

        const matchesRegulator = filterRegulator === "All" || item.regulator === filterRegulator

        return matchesSearch && matchesRegulator
    })

    const regulators = ["All", ...Array.from(new Set(data.map(d => d.regulator).filter(Boolean)))]

    const handleDelete = async (id: string) => {
        const result = await deleteLegalRegister(id)
        if (result.success) {
            setData(prev => prev.filter(item => item.id !== id))
            toast.success("Regulation deleted successfully")
        } else {
            toast.error("Failed to delete regulation")
        }
    }

    const handleUpdate = async (formData: any) => {
        if (!editingItem) return
        const result = await updateLegalRegister(editingItem.id, formData)
        if (result.success) {
            setData(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...formData } : item))
            setIsEditDialogOpen(false)
            toast.success("Regulation updated successfully")
        } else {
            toast.error("Failed to update regulation")
        }
    }

    const handleCreate = async (formData: any) => {
        const result = await createLegalRegister(formData)
        if (result.success) {
            // Re-fetch or add to state
            // For simplicity adding to state
            setData(prev => [{ ...formData, id: result.id, createdAt: new Date() }, ...prev])
            setIsAddDialogOpen(false)
            toast.success("Regulation added successfully")
        } else {
            toast.error("Failed to add regulation")
        }
    }

    return (
        <div className="space-y-6 pb-20 min-w-[1200px]">
            {/* Action Bar & Stats Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <Input
                            placeholder="Search by title, clause, or subject..."
                            className="bg-white/70 backdrop-blur-md border-slate-200 pl-10 h-12 rounded-2xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/50 shadow-sm transition-all text-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Select value={filterRegulator} onValueChange={setFilterRegulator}>
                            <SelectTrigger className="w-[180px] h-12 rounded-2xl bg-white/70 backdrop-blur-md border-slate-200 focus:ring-emerald-500/20 shadow-sm font-bold text-slate-700">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-slate-400" />
                                    <SelectValue placeholder="All Regulators" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-200 shadow-2xl">
                                {regulators.map(reg => (
                                    <SelectItem key={reg || "unknown"} value={reg || "All"} className="font-bold">
                                        {reg}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            className="h-12 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg shadow-emerald-200/50 flex items-center gap-2 transition-all active:scale-95"
                            onClick={() => setIsAddDialogOpen(true)}
                        >
                            <Plus className="h-5 w-5" />
                            Add Regulation
                        </Button>
                    </div>
                </div>

                {/* Dashboard Stats Cards */}
                <div className="grid grid-cols-4 gap-4">
                    <Card className="p-6 rounded-3xl border-slate-100 shadow-xl bg-gradient-to-br from-white to-slate-50 relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-emerald-500">
                        <div className="flex flex-col gap-1 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Legal Registers</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-900 tracking-tighter">{totalRegs}</span>
                                <Scale className="h-4 w-4 text-emerald-500 opacity-50" />
                            </div>
                            <span className="text-xs text-slate-500 font-bold">Foundational standards</span>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                            <Scale className="h-24 w-24" />
                        </div>
                    </Card>

                    <Card className="p-6 rounded-3xl border-slate-100 shadow-xl bg-gradient-to-br from-white to-slate-50 relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-blue-500">
                        <div className="flex flex-col gap-1 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Implementation Avg</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-900 tracking-tighter">{complianceRate}%</span>
                                <CheckCircle2 className="h-4 w-4 text-blue-500 opacity-50" />
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${complianceRate}%` }} />
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="h-24 w-24" />
                        </div>
                    </Card>

                    <Card className="p-6 rounded-3xl border-slate-100 shadow-xl bg-gradient-to-br from-white to-slate-50 relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-amber-500">
                        <div className="flex flex-col gap-1 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upcoming Reviews</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-900 tracking-tighter">{nextReviews}</span>
                                <Clock className="h-4 w-4 text-amber-500 opacity-50" />
                            </div>
                            <span className="text-xs text-slate-500 font-bold">Due within 30 days</span>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                            <Clock className="h-24 w-12" />
                        </div>
                    </Card>

                    <Card className="p-6 rounded-3xl border-slate-100 shadow-xl bg-gradient-to-br from-white to-slate-50 relative overflow-hidden group hover:shadow-2xl transition-all border-b-4 border-b-indigo-500">
                        <div className="flex flex-col gap-1 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Acts (UU)</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-900 tracking-tighter">{actRegs}</span>
                                <ShieldCheck className="h-4 w-4 text-indigo-500 opacity-50" />
                            </div>
                            <span className="text-xs text-slate-500 font-bold">Supreme regulations</span>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="h-24 w-24" />
                        </div>
                    </Card>
                </div>
            </div>

            {/* Main Table Container */}
            <Card className="rounded-2xl border-slate-200 shadow-xl overflow-hidden bg-white/50 backdrop-blur-xl">
                <ScrollArea className="h-[calc(100vh-450px)] w-full">
                    <div className="min-w-[1200px]">
                        <Table>
                            <TableHeader className="bg-slate-50/50 sticky top-0 z-20">
                                <TableRow className="hover:bg-transparent border-slate-100">
                                    <TableHead className="w-[60px] font-black text-slate-900 uppercase tracking-tighter text-xs text-center">No</TableHead>
                                    <TableHead className="w-[120px] font-bold text-slate-800">Regulator</TableHead>
                                    <TableHead className="w-[150px] font-bold text-slate-800">Subject</TableHead>
                                    <TableHead className="font-bold text-slate-800">Title & Clause</TableHead>
                                    <TableHead className="w-[250px] font-bold text-slate-800">Compliance Summary</TableHead>
                                    <TableHead className="w-[120px] font-bold text-slate-800 text-center">Status</TableHead>
                                    <TableHead className="w-[100px] font-bold text-slate-800 text-center">%</TableHead>
                                    <TableHead className="w-[120px] font-bold text-slate-800">Next Review</TableHead>
                                    <TableHead className="w-[80px] text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="group hover:bg-slate-50/80 transition-colors border-slate-100 cursor-pointer"
                                            onClick={() => {
                                                setEditingItem(item)
                                                setIsEditDialogOpen(true)
                                            }}
                                        >
                                            <TableCell className="text-center font-bold text-slate-400">{item.no}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="rounded-md font-bold uppercase tracking-tight text-[10px] py-0 border-slate-200 bg-white">
                                                    {item.regulator}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs font-bold text-slate-600 truncate block max-w-[140px]">
                                                    {item.subjectMatter}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="font-black text-slate-900 leading-tight">{item.title}</div>
                                                    <div className="text-xs font-medium text-slate-500 line-clamp-1 italic">{item.clause}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                                    {item.descriptionOfCompliance}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {item.comply === 'Obligation' ? (
                                                    <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 font-bold px-2 py-0.5">
                                                        Obligation
                                                    </Badge>
                                                ) : item.comply === 'Y' ? (
                                                    <div className="flex items-center justify-center text-emerald-600">
                                                        <CheckCircle className="h-5 w-5" />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center text-amber-500">
                                                        <AlertTriangle className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="font-black text-slate-900">{item.percentage === 'TBD' ? '-' : item.percentage}</div>
                                            </TableCell>
                                            <TableCell>
                                                {item.nextReviewDate ? (
                                                    <div className="flex items-center gap-1.5 text-slate-600">
                                                        <Calendar className="h-3 w-3" />
                                                        <span className="text-xs font-bold">
                                                            {format(new Date(item.nextReviewDate), 'MMM d, yyyy')}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-medium italic">Not set</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-200">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl" onClick={(e) => e.stopPropagation()}>
                                                        <DropdownMenuItem
                                                            className="font-bold cursor-pointer"
                                                            onClick={() => {
                                                                setEditingItem(item)
                                                                setIsEditDialogOpen(true)
                                                            }}
                                                        >
                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="font-bold text-red-600 focus:text-red-600 cursor-pointer"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-24 text-center text-slate-500 font-medium">
                                            No regulations found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </Card>

            {/* Dialogs */}

            {/* Add/Edit Dialog */}
            <Dialog
                open={isAddDialogOpen || isEditDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsAddDialogOpen(false)
                        setIsEditDialogOpen(false)
                        setEditingItem(null)
                    }
                }}
            >
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white/95 backdrop-blur-xl">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            {isAddDialogOpen ? <Plus className="h-6 w-6 text-emerald-600" /> : <Edit2 className="h-6 w-6 text-blue-600" />}
                            {isAddDialogOpen ? "Add New Regulation" : "Edit Regulation"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            {isAddDialogOpen ? "Enter the details of the new statutory requirement." : `Updating: ${editingItem?.title}`}
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="flex-1 p-6 pt-2">
                        <form id="reg-form" onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            const obj = Object.fromEntries(formData.entries())
                            if (isAddDialogOpen) handleCreate(obj)
                            else handleUpdate(obj)
                        }} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">No (Sort Order)</Label>
                                    <Input name="no" type="number" defaultValue={editingItem?.no || ""} className="rounded-xl border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Regulator</Label>
                                    <Input name="regulator" defaultValue={editingItem?.regulator || ""} className="rounded-xl border-slate-200" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Regulation Title</Label>
                                <Input name="title" defaultValue={editingItem?.title || ""} className="rounded-xl border-slate-200 font-bold" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Subject Matter</Label>
                                <Input name="subjectMatter" defaultValue={editingItem?.subjectMatter || ""} className="rounded-xl border-slate-200" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Clause / Section</Label>
                                <Input name="clause" defaultValue={editingItem?.clause || ""} className="rounded-xl border-slate-200" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Compliance Status</Label>
                                    <Input name="comply" defaultValue={editingItem?.comply || "Obligation"} className="rounded-xl border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Implementation %</Label>
                                    <Input name="percentage" defaultValue={editingItem?.percentage || "TBD"} className="rounded-xl border-slate-200" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description of Compliance</Label>
                                <Input name="descriptionOfCompliance" defaultValue={editingItem?.descriptionOfCompliance || ""} className="rounded-xl border-slate-200" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Program of Compliance</Label>
                                <Input name="programOfCompliance" defaultValue={editingItem?.programOfCompliance || ""} className="rounded-xl border-slate-200" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 text-amber-600">Next Review Date</Label>
                                    <Input
                                        name="nextReviewDate"
                                        type="date"
                                        defaultValue={editingItem?.nextReviewDate ? format(new Date(editingItem.nextReviewDate), 'yyyy-MM-dd') : ""}
                                        className="rounded-xl border-amber-100 bg-amber-50/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Category Tag</Label>
                                    <Input name="category" defaultValue={editingItem?.category || ""} className="rounded-xl border-slate-200" />
                                </div>
                            </div>
                        </form>
                    </ScrollArea>

                    <DialogFooter className="p-6 bg-slate-50/50 flex items-center justify-between sm:justify-between">
                        <div className="flex gap-2">
                            {isEditDialogOpen && (
                                <Button
                                    variant="destructive"
                                    className="rounded-xl font-bold px-4"
                                    onClick={() => {
                                        if (editingItem && confirm("Are you sure you want to delete this regulation?")) {
                                            handleDelete(editingItem.id)
                                            setIsEditDialogOpen(false)
                                        }
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-xl border-slate-200" onClick={() => {
                                setIsAddDialogOpen(false)
                                setIsEditDialogOpen(false)
                            }}>Cancel</Button>
                            <Button
                                type="submit"
                                form="reg-form"
                                className="rounded-xl bg-slate-900 px-8 text-white font-bold"
                            >
                                {isAddDialogOpen ? "Save Regulation" : "Update Changes"}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
