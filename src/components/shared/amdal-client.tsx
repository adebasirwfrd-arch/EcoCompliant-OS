"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Edit, Eye, Filter, CheckCircle2, Search, CalendarClock } from "lucide-react"
import { DeleteButton } from "@/components/shared/delete-button"
import { format, isBefore, addDays } from "date-fns"
import { deleteAmdalRequirement } from "@/app/actions/environmental"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AmdalForm } from "./amdal-form"

// Mock generic type to match DB return type
type AmdalReq = {
    id: string;
    documentType: string | null;
    parameter: string;
    type: string | null;
    frequency: string;
    lastMonitoredDate: Date | null;
    nextDueDate: Date;
    status: string | null;
    pic: string | null;
};

export function AmdalClient({ requirements }: { requirements: AmdalReq[] }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [editingRecord, setEditingRecord] = useState<AmdalReq | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Filter logic
    const filteredRequirements = requirements.filter(req => {
        const matchesSearch = req.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (req.pic && req.pic.toLowerCase().includes(searchTerm.toLowerCase()))
        return matchesSearch
    })

    const getStatusBadge = (status: string | null, dueDate: Date) => {
        if (status === 'Compliant') return <Badge className="bg-emerald-500">Compliant</Badge>
        if (status === 'Non-Compliant') return <Badge variant="destructive">Non-Compliant</Badge>

        // Check if overdue or approaching
        const isOverdue = isBefore(dueDate, new Date())
        const isApproaching = isBefore(dueDate, addDays(new Date(), 14)) && !isOverdue

        if (isOverdue) return <Badge variant="destructive">Overdue</Badge>
        if (isApproaching) return <Badge className="bg-amber-500">Due Soon</Badge>

        return <Badge variant="secondary" className="bg-slate-200 text-slate-800">Pending</Badge>
    }

    const getTypeColor = (type: string | null) => {
        if (type === 'RKL') return "bg-indigo-100 text-indigo-800 border-indigo-200"
        if (type === 'RPL') return "bg-sky-100 text-sky-800 border-sky-200"
        return ""
    }

    const handleEditClick = (record: AmdalReq) => {
        setEditingRecord(record)
        setIsEditModalOpen(true)
    }

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search parameters or PIC..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" /> Filter
                </Button>
            </div>

            <div className="rounded-md border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                        <TableRow>
                            <TableHead className="w-[300px]">Parameter (RKL/RPL)</TableHead>
                            <TableHead>Document</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Next Due</TableHead>
                            <TableHead>PIC</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRequirements.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No requirements matched your search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRequirements.map((req) => (
                                <TableRow key={req.id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-slate-700">{req.parameter}</span>
                                            <div>
                                                <Badge variant="outline" className={`text-[10px] ${getTypeColor(req.type)}`}>
                                                    {req.type === 'RKL' ? 'PENGELOLAAN' : 'PEMANTAUAN'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground font-medium">{req.documentType}</TableCell>
                                    <TableCell>{req.frequency}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                                            <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
                                            <span className="font-medium">{format(new Date(req.nextDueDate), "dd MMM yyyy")}</span>
                                        </div>
                                        {req.lastMonitoredDate && (
                                            <div className="text-[10px] text-muted-foreground mt-1">
                                                Last: {format(new Date(req.lastMonitoredDate), "dd/MM/yyyy")}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>{req.pic || <span className="text-slate-300 italic">Unassigned</span>}</TableCell>
                                    <TableCell>
                                        {getStatusBadge(req.status, new Date(req.nextDueDate))}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50" onClick={() => handleEditClick(req)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <DeleteButton
                                                id={req.id}
                                                onDelete={deleteAmdalRequirement}
                                                entityName="Requirement"
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Edit Environmental Requirement</DialogTitle>
                    </DialogHeader>
                    {editingRecord && (
                        <AmdalForm
                            initialData={{
                                ...editingRecord,
                                documentType: editingRecord.documentType as any,
                                type: editingRecord.type as any,
                                frequency: editingRecord.frequency as any,
                                status: editingRecord.status as any,
                                pic: editingRecord.pic ?? undefined,
                            }}
                            onSuccess={() => setIsEditModalOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
