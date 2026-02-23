"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Download, Search, FileText, ChevronDown, ListFilter, Leaf, CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { type GhgEmissionInput, deleteGhgEmission } from "@/app/actions/environmental"
import { DeleteButton } from "./delete-button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { GhgForm } from "./ghg-form"

type GhgEmissionRecord = GhgEmissionInput & { id: string, co2e: number };

export function GhgClient({ initialData }: { initialData: GhgEmissionRecord[] }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [scopeFilter, setScopeFilter] = useState<string>("All")
    const [yearFilter, setYearFilter] = useState<string>("All")
    const [isFormOpen, setIsFormOpen] = useState(false)

    const availableYears = Array.from(new Set(initialData.map(d => new Date(d.date).getFullYear().toString()))).sort((a, b) => b.localeCompare(a))

    const filteredData = initialData.filter(item => {
        const matchesSearch = item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.notes || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesScope = scopeFilter === "All" || item.scope.toString() === scopeFilter;
        const matchesYear = yearFilter === "All" || new Date(item.date).getFullYear().toString() === yearFilter;
        return matchesSearch && matchesScope && matchesYear;
    })

    const handleExportCSV = () => {
        // SRN PPI Standard Format Mapping
        const headers = ["ID", "Activity Date", "Scope", "Activity Category", "Source", "Value", "Unit", "Emission Factor", "tCO2e (Calculated)", "Evidence Link", "Methodology Notes"]
        const csvContent = [
            headers.join(","),
            ...filteredData.map(r => [
                r.id,
                format(new Date(r.date), 'yyyy-MM-dd'),
                `Scope ${r.scope}`,
                `"${r.category}"`,
                `"${r.source}"`,
                r.value,
                r.unit,
                r.emissionFactor,
                r.co2e.toFixed(3),
                `"${r.evidenceUrl || 'N/A'}"`,
                `"${(r.notes || '').replace(/"/g, '""')}"`
            ].join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `SRN_PPI_Emissions_Export_${format(new Date(), 'yyyyMMdd')}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const getScopeBadge = (scope: number) => {
        switch (scope) {
            case 1: return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Scope 1</Badge>;
            case 2: return <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">Scope 2</Badge>;
            case 3: return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Scope 3</Badge>;
            default: return <Badge variant="outline">Unknown</Badge>;
        }
    }

    return (
        <Card className="shadow-sm border-slate-200">
            <CardContent className="p-0">
                {/* Custom Table Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 bg-slate-50 border-b border-slate-100 rounded-t-xl">
                    <div className="flex flex-col gap-1">
                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                            <Leaf className="h-5 w-5 text-emerald-600" />
                            Corporate Emission Inventory
                        </h3>
                        <p className="text-sm text-slate-500">Filter and export to SIGN SMART & SRN PPI portal formats.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search source, category..."
                                className="pl-9 bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filter Selects */}
                        <Select onValueChange={setScopeFilter} value={scopeFilter}>
                            <SelectTrigger className="w-[140px] bg-white text-slate-600 border-slate-200">
                                <SelectValue placeholder="All Scopes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Scopes</SelectItem>
                                <SelectItem value="1">Scope 1</SelectItem>
                                <SelectItem value="2">Scope 2</SelectItem>
                                <SelectItem value="3">Scope 3</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select onValueChange={setYearFilter} value={yearFilter}>
                            <SelectTrigger className="w-[120px] bg-white text-slate-600 border-slate-200">
                                <SelectValue placeholder="All Years" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Years</SelectItem>
                                {availableYears.map(year => (
                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="outline" className="gap-2 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border-emerald-200" onClick={handleExportCSV}>
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">SRN Export</span>
                        </Button>

                        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-slate-900 hover:bg-slate-800 text-white">Record Emission</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <div className="p-2">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <Leaf className="h-6 w-6 text-emerald-500" />
                                        Log New GHG Emission
                                    </h2>
                                    <GhgForm onSuccess={() => setIsFormOpen(false)} />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50 text-slate-600">
                            <TableRow>
                                <TableHead className="w-[120px]">Date</TableHead>
                                <TableHead>Scope</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead className="text-right">Value</TableHead>
                                <TableHead className="text-right font-bold text-emerald-700">tCO2e</TableHead>
                                <TableHead className="w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <FileText className="h-8 w-8 text-slate-300" />
                                            <p>No emission records found matching the criteria.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredData.map((record) => (
                                    <TableRow key={record.id} className="hover:bg-slate-50 transition-colors">
                                        <TableCell className="font-medium text-slate-700">
                                            {format(new Date(record.date), 'dd MMM yyyy')}
                                        </TableCell>
                                        <TableCell>{getScopeBadge(record.scope)}</TableCell>
                                        <TableCell className="text-slate-600 truncate max-w-[200px]" title={record.category}>
                                            {record.category}
                                        </TableCell>
                                        <TableCell className="text-slate-600 font-medium">
                                            {record.source}
                                        </TableCell>
                                        <TableCell className="text-right text-slate-600 whitespace-nowrap">
                                            {record.value.toLocaleString()} <span className="text-xs text-slate-400">{record.unit}</span>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-emerald-600 bg-emerald-50/30">
                                            {record.co2e.toFixed(3)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DeleteButton
                                                id={record.id}
                                                onDelete={deleteGhgEmission}
                                                entityName="Emission Record"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {filteredData.length > 0 && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-sm text-slate-500">
                        <div>Showing {filteredData.length} of {initialData.length} records</div>
                        <div className="font-semibold text-slate-700 flex gap-2 items-center">
                            Total Filtered:
                            <span className="text-emerald-600 text-base">
                                {filteredData.reduce((acc, curr) => acc + curr.co2e, 0).toFixed(3)} tCO2e
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
