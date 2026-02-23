"use client"

import { useState, useMemo } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Search, FilterX, Archive, AlertCircle, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { DeleteButton } from "@/components/shared/delete-button"
import { deleteComplianceReport } from "@/app/actions/environmental"

interface Report {
    id: string;
    title: string;
    agency: string;
    category: string | null;
    status: string | null;
    dueDate: Date;
    priority: string | null;
    periodYear: number | null;
    periodValue: string | null;
}

interface ComplianceClientProps {
    reports: Report[];
    initialFilterStatus?: string;
}

export function ComplianceClient({ reports, initialFilterStatus = "all" }: ComplianceClientProps) {
    const [search, setSearch] = useState("")
    const [agencyFilter, setAgencyFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState(initialFilterStatus)
    const [categoryFilter, setCategoryFilter] = useState("all")

    // Listen for external prop changes to force filter update
    useMemo(() => {
        if (initialFilterStatus !== "all") {
            setStatusFilter(initialFilterStatus);
        }
    }, [initialFilterStatus]);

    const resetFilters = () => {
        setSearch("")
        setAgencyFilter("all")
        setStatusFilter("all")
        setCategoryFilter("all")
    }

    const isOverdue = (report: Report) => {
        const today = new Date();
        return (report.status === 'Pending' || report.status === 'Submitted') && new Date(report.dueDate) < today;
    };

    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const matchesSearch = report.title.toLowerCase().includes(search.toLowerCase()) ||
                report.agency.toLowerCase().includes(search.toLowerCase());
            const matchesAgency = agencyFilter === "all" || report.agency === agencyFilter;

            // Special handling for the "Overdue" pseudo-status
            let matchesStatus = false;
            if (statusFilter === "all") {
                matchesStatus = true;
            } else if (statusFilter === "Overdue") {
                matchesStatus = isOverdue(report);
            } else {
                matchesStatus = report.status === statusFilter && !isOverdue(report);
            }

            const matchesCategory = categoryFilter === "all" || report.category === categoryFilter;

            return matchesSearch && matchesAgency && matchesStatus && matchesCategory;
        })
    }, [reports, search, agencyFilter, statusFilter, categoryFilter])

    const getPriorityBadge = (priority: string | null) => {
        switch (priority) {
            case 'Urgent': return <Badge variant="destructive">Urgent</Badge>;
            case 'High': return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>;
            case 'Medium': return <Badge className="bg-blue-500 hover:bg-blue-600">Medium</Badge>;
            case 'Low': return <Badge variant="secondary">Low</Badge>;
            default: return <Badge variant="outline">Normal</Badge>;
        }
    }

    const getStatusIcon = (status: string | null) => {
        switch (status) {
            case 'Approved': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case 'Submitted': return <Clock className="h-4 w-4 text-blue-500" />;
            case 'Rejected': return <AlertCircle className="h-4 w-4 text-red-500" />;
            default: return <Clock className="h-4 w-4 text-slate-400" />;
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search reports or agencies..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Select value={agencyFilter} onValueChange={setAgencyFilter}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Agency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Agencies</SelectItem>
                            <SelectItem value="KLHK">KLHK</SelectItem>
                            <SelectItem value="ESDM">ESDM</SelectItem>
                            <SelectItem value="SKK Migas">SKK Migas</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Submitted">Submitted</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                            <SelectItem value="Overdue" className="text-red-600 font-medium">Overdue</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="SIMPEL">SIMPEL</SelectItem>
                            <SelectItem value="RKAB">RKAB</SelectItem>
                            <SelectItem value="RKL-RPL">RKL-RPL</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={resetFilters} title="Reset Filters">
                        <FilterX className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50">
                            <TableHead className="w-[280px]">Report Details</TableHead>
                            <TableHead>Agency</TableHead>
                            <TableHead>Period</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReports.length > 0 ? (
                            filteredReports.map((item) => (
                                <TableRow key={item.id} className="group hover:bg-slate-50/50">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900 line-clamp-1">{item.title}</span>
                                            <span className="text-xs text-muted-foreground">{item.category || 'General Compliance'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.agency}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {item.periodYear ? `${item.periodYear} ${item.periodValue || ''}` : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {getPriorityBadge(item.priority)}
                                    </TableCell>
                                    <TableCell className="text-sm font-medium">
                                        {new Date(item.dueDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(item.status)}
                                            <span className="text-sm">{item.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                <Link href={`/dashboard/compliance/${item.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <DeleteButton
                                                id={item.id}
                                                onDelete={deleteComplianceReport}
                                                entityName="Compliance Report"
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Archive className="h-8 w-8 mb-2 opacity-20" />
                                        <p>No reports found matching your filters.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="text-xs text-muted-foreground px-2 italic">
                Showing {filteredReports.length} of {reports.length} regulatory submissions.
            </div>
        </div>
    )
}
