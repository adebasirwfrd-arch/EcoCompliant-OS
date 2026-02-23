"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Eye, Edit, FileSpreadsheet, Search, ShieldCheck, ShieldAlert } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DeleteButton } from "@/components/shared/delete-button"
import { deleteWastewaterLog } from "@/app/actions/environmental"
import Link from "next/link"

type WastewaterLog = {
    id: string;
    logDate: Date;
    phLevel: number;
    codLevel: number;
    bodLevel: number;
    tssLevel: number;
    ammoniaLevel: number;
    debitOutfall: number;
    notes: string | null;
    isViolation: boolean | null;
    popalId: string | null;
}

export function WastewaterClient({ logs }: { logs: WastewaterLog[] }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterYear, setFilterYear] = useState<string>("all")
    const [filterStatus, setFilterStatus] = useState<string>("all")

    const uniqueYears = Array.from(new Set(logs.map(r => new Date(r.logDate).getFullYear().toString()))).sort((a, b) => b.localeCompare(a))

    const filteredLogs = logs.filter(log => {
        // Search Term (Notes)
        const matchesSearch = log.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const matchesSearchFallback = searchTerm === "";

        // Filter Year
        const logYear = new Date(log.logDate).getFullYear().toString();
        const matchesYear = filterYear === "all" || logYear === filterYear;

        // Filter Status
        let matchesStatus = true;
        if (filterStatus === "compliant") matchesStatus = log.isViolation === false;
        if (filterStatus === "violation") matchesStatus = log.isViolation === true;

        return (matchesSearch || matchesSearchFallback) && matchesYear && matchesStatus;
    });

    const handleDownloadCSV = () => {
        const headers = ["ID", "Measurement Date", "pH (6-9)", "COD mg/L (<100)", "BOD mg/L (<50)", "TSS mg/L (<50)", "Amonia mg/L", "Debit m3/day", "Status", "Notes"]
        const csvRows = [headers.join(",")]

        filteredLogs.forEach(log => {
            const statusStr = log.isViolation ? "VIOLATION" : "COMPLIANT";
            const row = [
                log.id,
                format(new Date(log.logDate), "yyyy-MM-dd HH:mm"),
                log.phLevel,
                log.codLevel,
                log.bodLevel,
                log.tssLevel,
                log.ammoniaLevel,
                log.debitOutfall,
                statusStr,
                `"${log.notes || ""}"`
            ]
            csvRows.push(row.join(","))
        })

        const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"))
        const link = document.createElement("a")
        link.setAttribute("href", csvContent)
        link.setAttribute("download", `SIMPEL_IPAL_Logs_${format(new Date(), "yyyyMMdd")}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Card className="mt-6 shadow-sm">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <CardTitle className="text-xl">SPARING Measurement Repository</CardTitle>
                    <CardDescription>Historical database of daily/weekly parameter testing.</CardDescription>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="border-emerald-500 text-emerald-700 hover:bg-emerald-50" onClick={handleDownloadCSV}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Export format SIMPEL (CSV)
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1 md:max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by notes or abnormalities..."
                            className="pl-8 bg-slate-50 border-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Select value={filterYear} onValueChange={setFilterYear}>
                        <SelectTrigger className="w-[140px] bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            {uniqueYears.map(year => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[180px] bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Compliance Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="compliant">Compliant (BMAL)</SelectItem>
                            <SelectItem value="violation">Violations / Over Limit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-md border border-slate-200 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[150px]">Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>pH</TableHead>
                                <TableHead>COD / BOD</TableHead>
                                <TableHead>TSS</TableHead>
                                <TableHead>Debit (m&sup3;/d)</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map(log => (
                                <TableRow key={log.id} className="hover:bg-slate-50/80 transition-colors">
                                    <TableCell className="font-medium text-slate-700">
                                        {format(new Date(log.logDate), "dd MMM yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        {log.isViolation ? (
                                            <Badge variant="destructive" className="flex w-fit items-center gap-1"><ShieldAlert className="h-3 w-3" /> EXCEEDS</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 flex w-fit items-center gap-1"><ShieldCheck className="h-3 w-3" /> BMAL OK</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className={`font-semibold ${log.phLevel < 6 || log.phLevel > 9 ? 'text-red-500' : 'text-slate-700'}`}>
                                        {log.phLevel}
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        <span className={log.codLevel > 100 ? 'text-red-500 font-bold' : ''}>{log.codLevel}</span> / <span className={log.bodLevel > 50 ? 'text-red-500 font-bold' : ''}>{log.bodLevel}</span>
                                        <span className="text-xs ml-1 text-slate-400">mg/L</span>
                                    </TableCell>
                                    <TableCell className={log.tssLevel > 50 ? 'text-red-500 font-bold' : 'text-slate-700'}>
                                        {log.tssLevel} <span className="text-xs text-slate-400">mg/L</span>
                                    </TableCell>
                                    <TableCell className="text-slate-700">
                                        {log.debitOutfall}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <DeleteButton
                                                id={log.id}
                                                onDelete={deleteWastewaterLog}
                                                entityName="SPARING Log"
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredLogs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                        No IPAL measurement logs found matching the filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
