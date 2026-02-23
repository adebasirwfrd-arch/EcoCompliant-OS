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
import { Input } from "@/components/ui/input"
import { Edit, Search, CalendarClock, Download, Truck, ShieldCheck, AlertCircle } from "lucide-react"
import { DeleteButton } from "@/components/shared/delete-button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { deleteWasteManifest } from "@/app/actions/environmental"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { WasteForm } from "./waste-form"

type WasteRecord = {
    id: string;
    manifestNumber: string | null;
    festronikId: string | null;
    wasteCode: string;
    wasteCategory: "1" | "2";
    wasteType: string;
    weight: number;
    unit: string | null;
    generatorDate: Date;
    maxStorageDays: number;
    status: "stored" | "transported" | "processed" | null;
    transporterName?: string | null;
    transporterLicense?: string | null;
    vehiclePlate?: string | null;
    destinationFacility?: string | null;
    handlingMethod?: string | null;
    notes?: string | null;
};

export function WasteClient({ records }: { records: WasteRecord[] }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterYear, setFilterYear] = useState<string>("all")
    const [filterCode, setFilterCode] = useState<string>("all")
    const [filterCategory, setFilterCategory] = useState<string>("all")

    const [editingRecord, setEditingRecord] = useState<WasteRecord | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Extract unique options
    const uniqueYears = Array.from(new Set(records.map(r => new Date(r.generatorDate).getFullYear().toString()))).sort((a, b) => b.localeCompare(a))
    const uniqueCodes = Array.from(new Set(records.map(r => r.wasteCode))).filter(c => c !== "").sort()
    const uniqueCategories = Array.from(new Set(records.map(r => r.wasteCategory))).sort()

    // Filter logic
    const filteredRecords = records.filter(req => {
        const manifestMatches = req.manifestNumber ? req.manifestNumber.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const typeMatches = req.wasteType.toLowerCase().includes(searchTerm.toLowerCase());
        const codeMatchesSearch = req.wasteCode.toLowerCase().includes(searchTerm.toLowerCase());

        const searchMatch = manifestMatches || typeMatches || codeMatchesSearch;

        const yearMatch = filterYear === "all" || new Date(req.generatorDate).getFullYear().toString() === filterYear;
        const codeMatch = filterCode === "all" || req.wasteCode === filterCode;
        const categoryMatch = filterCategory === "all" || req.wasteCategory === filterCategory;

        return searchMatch && yearMatch && codeMatch && categoryMatch;
    })

    const getStatusBadge = (status: string | null) => {
        if (status === 'processed') return (
            <Badge className="bg-emerald-500 hover:bg-emerald-600 gap-1.5 px-2 py-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Processed
            </Badge>
        )
        if (status === 'transported') return (
            <Badge className="bg-sky-500 hover:bg-sky-600 gap-1.5 px-2 py-1">
                <Truck className="h-3.5 w-3.5" /> Manifested
            </Badge>
        )
        return (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 gap-1.5 px-2 py-1">
                <AlertCircle className="h-3.5 w-3.5" /> Stored TPS
            </Badge>
        )
    }

    const handleEditClick = (record: WasteRecord) => {
        setEditingRecord(record)
        setIsEditModalOpen(true)
    }

    const handleDownloadCSV = () => {
        const headers = ["Festronik / Manifest", "Waste Type", "Waste Code", "Waste Category", "Amount", "Unit", "Generator Date", "Max Storage Days", "Status"]
        const csvRows = [headers.join(",")]

        filteredRecords.forEach(req => {
            const row = [
                req.manifestNumber || "No Manifest",
                `"${req.wasteType}"`,
                req.wasteCode,
                req.wasteCategory,
                req.weight,
                req.unit || "ton",
                format(new Date(req.generatorDate), "yyyy-MM-dd"),
                req.maxStorageDays,
                req.status || "stored"
            ]
            csvRows.push(row.join(","))
        })

        const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"))
        const link = document.createElement("a")
        link.setAttribute("href", csvContent)
        link.setAttribute("download", `waste_records_${format(new Date(), "yyyyMMdd")}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-4 p-4">
            <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
                <div className="relative w-full xl:w-72 shrink-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search manifest or waste type..."
                        className="pl-8 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select value={filterYear} onValueChange={setFilterYear}>
                        <SelectTrigger className="w-[120px] bg-white">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            {uniqueYears.map(year => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filterCode} onValueChange={setFilterCode}>
                        <SelectTrigger className="w-[150px] bg-white">
                            <SelectValue placeholder="Waste Code" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Codes</SelectItem>
                            {uniqueCodes.map(code => (
                                <SelectItem key={code} value={code}>{code}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-[150px] bg-white">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {uniqueCategories.map(cat => (
                                <SelectItem key={cat} value={cat}>Cat {cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="gap-2 text-emerald-700 border-emerald-200 hover:bg-emerald-50 ml-auto xl:ml-2" onClick={handleDownloadCSV}>
                        <Download className="h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </div>

            <div className="rounded-md border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                        <TableRow>
                            <TableHead className="w-[180px]">Festronik / Manifest</TableHead>
                            <TableHead>Waste Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Gen. Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRecords.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No records matched your search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRecords.map((req) => (
                                <TableRow key={req.id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="font-semibold text-slate-700">{req.manifestNumber}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-800">{req.wasteType}</span>
                                            <span className="text-xs text-muted-foreground font-mono">{req.wasteCode} (Cat {req.wasteCategory})</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-slate-50 font-mono">
                                            {req.weight} {req.unit}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                                            <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
                                            <span className="font-semibold text-slate-700">{format(new Date(req.generatorDate), "dd MMM yyyy")}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(req.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:text-amber-800 hover:bg-amber-50" onClick={() => handleEditClick(req)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <DeleteButton
                                                id={req.id}
                                                onDelete={deleteWasteManifest}
                                                entityName="Manifest"
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
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Edit Waste Manifest</DialogTitle>
                    </DialogHeader>
                    {editingRecord && (
                        <WasteForm
                            initialData={{
                                ...editingRecord,
                                manifestNumber: editingRecord.manifestNumber || "",
                                festronikId: (editingRecord as any).festronikId || "",
                                wasteId: editingRecord.wasteCode,
                                weight: editingRecord.weight.toString(),
                                unit: editingRecord.unit || "ton",
                                isLargeGenerator: editingRecord.maxStorageDays === 90 ? "yes" : "no",
                                status: editingRecord.status || "stored",
                                transporterName: editingRecord.transporterName || "",
                                transporterLicense: editingRecord.transporterLicense || "",
                                vehiclePlate: editingRecord.vehiclePlate || "",
                                destinationFacility: editingRecord.destinationFacility || "",
                                handlingMethod: (editingRecord.handlingMethod as any) || "Recovery",
                                notes: editingRecord.notes || "",
                                generatorDate: new Date(editingRecord.generatorDate)
                            }}
                            onSuccess={() => setIsEditModalOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
