"use client"

import { useMemo } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Scale, Package, MoveRight, CheckCircle2 } from "lucide-react"

type WasteRecord = {
    id: string;
    wasteCode: string;
    wasteType: string;
    wasteCategory: string;
    weight: number;
    unit: string | null;
    status: string | null;
};

interface WasteBalanceTableProps {
    records: WasteRecord[];
}

export function WasteBalanceTable({ records }: WasteBalanceTableProps) {
    // Generate Balance Sheet Data
    const balanceData = useMemo(() => {
        const grouped = new Map<string, {
            code: string;
            name: string;
            category: string;
            generated: number;
            transferred: number;
            stored: number;
            unit: string;
        }>();

        records.forEach(r => {
            const key = r.wasteCode;
            if (!grouped.has(key)) {
                grouped.set(key, {
                    code: r.wasteCode,
                    name: r.wasteType,
                    category: r.wasteCategory,
                    generated: 0,
                    transferred: 0,
                    stored: 0,
                    unit: r.unit || "ton"
                });
            }

            const item = grouped.get(key)!;
            const weight = r.weight;

            // In a real scenario, we'd also handle initial stock from previous periods.
            // Here we assume this period's generation vs transfer.
            item.generated += weight;
            if (r.status === 'transported' || r.status === 'processed') {
                item.transferred += weight;
            } else {
                item.stored += weight;
            }
        });

        return Array.from(grouped.values()).sort((a, b) => a.code.localeCompare(b.code));
    }, [records]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2 px-1">
                <Scale className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-lg text-slate-800">Neraca Limbah B3 (Waste Balance)</h3>
                <Badge variant="outline" className="ml-2 bg-indigo-50 text-indigo-700 border-indigo-200">
                    PP 22/2021 Compliant
                </Badge>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-b">
                            <TableHead className="w-[120px]">Waste Code</TableHead>
                            <TableHead>Waste Type</TableHead>
                            <TableHead className="text-center bg-indigo-50/30">
                                <span className="flex items-center justify-center gap-1.5 text-indigo-700">
                                    <Package className="h-3.5 w-3.5" /> Generated
                                </span>
                            </TableHead>
                            <TableHead className="text-center bg-amber-50/30">
                                <span className="flex items-center justify-center gap-1.5 text-amber-700">
                                    <MoveRight className="h-3.5 w-3.5" /> Transferred
                                </span>
                            </TableHead>
                            <TableHead className="text-center bg-emerald-50/30 font-bold">
                                <span className="flex items-center justify-center gap-1.5 text-emerald-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> TPS Balance
                                </span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {balanceData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    No waste transaction data available for this period.
                                </TableCell>
                            </TableRow>
                        ) : (
                            balanceData.map((row) => (
                                <TableRow key={row.code} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-mono font-bold text-slate-600">{row.code}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900">{row.name}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Category {row.category}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-semibold text-slate-700">
                                        {row.generated.toFixed(3)} <span className="text-[10px] font-normal text-muted-foreground">{row.unit}</span>
                                    </TableCell>
                                    <TableCell className="text-center font-semibold text-slate-700">
                                        {row.transferred.toFixed(3)} <span className="text-[10px] font-normal text-muted-foreground">{row.unit}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none px-3 font-bold">
                                            {row.stored.toFixed(3)} {row.unit}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                    <div className="bg-white p-2 rounded-md shadow-sm">
                        <Package className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Total Generation</p>
                        <p className="text-sm font-bold text-slate-700">
                            {balanceData.reduce((acc, curr) => acc + curr.generated, 0).toFixed(2)} Tons
                        </p>
                    </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                    <div className="bg-white p-2 rounded-md shadow-sm">
                        <MoveRight className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Outbound Flow</p>
                        <p className="text-sm font-bold text-slate-700">
                            {balanceData.reduce((acc, curr) => acc + curr.transferred, 0).toFixed(2)} Tons
                        </p>
                    </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                    <div className="bg-white p-2 rounded-md shadow-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Inventory Status</p>
                        <p className="text-sm font-bold text-slate-700">
                            {balanceData.reduce((acc, curr) => acc + curr.stored, 0).toFixed(2)} Tons
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
