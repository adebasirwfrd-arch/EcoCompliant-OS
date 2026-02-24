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
    ArrowUpDown
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
import { ScrollArea } from "@/components/ui/scroll-area"
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
        <div className="space-y-6 pb-20">
            {/* God-Tier Dashboard Header */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white/50 backdrop-blur-sm border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Legal Registers</CardTitle>
                        <Scale className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">{totalRegs}</div>
                        <p className="text-xs text-slate-500 font-medium mt-1">Foundational standards</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/50 backdrop-blur-sm border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Implementation Avg</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">{complianceRate}%</div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                                style={{ width: `${complianceRate}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white/50 backdrop-blur-sm border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-amber-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Upcoming Reviews</CardTitle>
                        <Clock className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">{nextReviews}</div>
                        <p className="text-xs text-slate-500 font-medium mt-1">Due within 30 days</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/50 backdrop-blur-sm border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-purple-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Acts (UU)</CardTitle>
                        <FileText className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-slate-900">{actRegs}</div>
                        <p className="text-xs text-slate-500 font-medium mt-1">Supreme regulations</p>
                    </CardContent>
                </Card>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="flex items-center w-full md:w-auto gap-3">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by title, clause, or subject..."
                            className="pl-9 rounded-xl border-slate-200 bg-slate-50/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-xl border-slate-200">
                                <Filter className="mr-2 h-4 w-4" />
                                {filterRegulator}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48 rounded-xl">
                            <DropdownMenuLabel>Filter by Regulator</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {regulators.map(reg => (
                                <DropdownMenuItem key={reg || "unknown"} onClick={() => setFilterRegulator(reg || "All")}>
                                    {reg}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Button
                    className="w-full md:w-auto rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 shadow-lg shadow-slate-200"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Regulation
                </Button>
            </div>

            {/* Main Table Container */}
            <Card className="rounded-2xl border-slate-200 shadow-xl overflow-hidden bg-white/50 backdrop-blur-xl">
                <ScrollArea className="h-[calc(100vh-400px)]">
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
                                    <TableRow key={item.id} className="group hover:bg-slate-50/80 transition-colors border-slate-100">
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
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-200">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl">
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

                    <DialogFooter className="p-6 bg-slate-50/50">
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
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
