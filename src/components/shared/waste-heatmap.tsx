"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Grid, Info, CheckCircle2 } from "lucide-react"
import { addDays, differenceInDays } from "date-fns"

type WasteRecord = {
    id: string;
    manifestNumber: string | null;
    wasteCode: string;
    wasteCategory: string;
    wasteType: string;
    weight: number;
    unit: string | null;
    generatorDate: Date;
    maxStorageDays: number;
    status: string | null;
};

export function WasteHeatmap({ records }: { records: WasteRecord[] }) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const today = new Date();

    // 1. Group records by wasteCode
    const groups = records.reduce((acc, curr) => {
        if (!acc[curr.wasteCode]) {
            acc[curr.wasteCode] = {
                wasteCode: curr.wasteCode,
                wasteType: curr.wasteType,
                wasteCategory: curr.wasteCategory,
                records: []
            };
        }
        acc[curr.wasteCode].records.push(curr);
        return acc;
    }, {} as Record<string, { wasteCode: string, wasteType: string, wasteCategory: string, records: WasteRecord[] }>);

    const groupList = Object.values(groups);

    const renderHeatmapCells = (group: { wasteCode: string, wasteCategory: string, records: WasteRecord[] }) => {
        const storedRecords = group.records.filter((r) => r.status === 'stored');
        const transportedRecords = group.records.filter((r) => r.status === 'transported' || r.status === 'processed');

        // Calculate timeline for stored records based on the OLDEST generation date (FIFO)
        let startDate: Date | null = null;
        let endDate: Date | null = null;
        let isOverdue = false;
        let isWarning = false;

        if (storedRecords.length > 0) {
            const oldestRecord = storedRecords.reduce((oldest, curr) =>
                new Date(curr.generatorDate) < new Date(oldest.generatorDate) ? curr : oldest
            );
            startDate = new Date(oldestRecord.generatorDate);
            endDate = addDays(startDate, oldestRecord.maxStorageDays);

            const daysLeft = differenceInDays(endDate, today);
            if (daysLeft < 0) isOverdue = true;
            else if (daysLeft <= 30) isWarning = true;
        }

        // Get months with transported activities (to draw Checkmarks ✔️)
        const transportedMonths = new Set(transportedRecords.map((r) => new Date(r.generatorDate).getMonth()));

        return months.map((monthName, index) => {
            const hasChecklist = transportedMonths.has(index);

            let isActiveStored = false;
            let isEndingMonth = false;
            let isStartingMonth = false;

            if (startDate && endDate) {
                const mapDate = new Date(today.getFullYear(), index, 15);

                // Approximate rollover for visual matrix
                if (endDate.getFullYear() > startDate.getFullYear() && index < startDate.getMonth()) {
                    mapDate.setFullYear(endDate.getFullYear());
                } else {
                    mapDate.setFullYear(startDate.getFullYear());
                }

                if (mapDate >= startDate && mapDate <= endDate) {
                    isActiveStored = true;
                }

                if (index === endDate.getMonth() && mapDate.getFullYear() === endDate.getFullYear()) {
                    isActiveStored = true;
                    isEndingMonth = true;
                }
                if (index === startDate.getMonth()) {
                    isActiveStored = true;
                    isStartingMonth = true;
                }
            }

            let colorClass = "bg-transparent";
            let opacityClass = "opacity-40";
            let zIndexClass = "z-0";

            if (isActiveStored) {
                colorClass = group.wasteCategory === "1" ? "bg-red-400" : "bg-amber-400";

                if (isEndingMonth) {
                    opacityClass = "opacity-100 rounded-r-md shadow-sm";
                    if (isOverdue) colorClass = "bg-red-600";
                    else if (isWarning) colorClass = "bg-amber-500";
                    else colorClass = "bg-emerald-500";
                } else if (isStartingMonth) {
                    opacityClass = "opacity-100 rounded-l-md";
                }
            }

            return (
                <div key={index} className="flex items-center justify-center p-1 border-r border-slate-100 last:border-0 h-14 relative group/cell cursor-pointer">
                    {isActiveStored && (
                        <div className={`absolute left-0 right-0 h-4 ${colorClass} ${opacityClass} mx-1 transition-all duration-300 group-hover/cell:scale-y-150 ${zIndexClass}`} title={startDate ? `Active TPS Timeline: ${startDate.toLocaleDateString()} - ${endDate?.toLocaleDateString()}` : ''}></div>
                    )}
                    {hasChecklist && (
                        <div className="z-10 bg-white rounded-full shadow-sm p-0.5 hover:scale-110 transition-transform" title="Manifest issued / Transported this month">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 drop-shadow-sm" />
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <Card className="shadow-lg border-slate-200 col-span-full overflow-hidden mt-6">
            <CardHeader className="bg-slate-50 border-b pb-4 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Grid className="h-5 w-5 text-amber-600" />
                        Storage Timeline Matrix
                    </CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                        Consolidated TPS limits mapping Generation month to Deadline month (FIFO logic), with Transport Checkmarks.
                    </p>
                </div>
                <span title="Solid bar = Deadline month. Green = Safe, Amber = < 30 Days, Red = Overdue. Checkmark = Transported.">
                    <Info className="h-5 w-5 text-slate-400 cursor-help" />
                </span>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
                <div className="min-w-[1000px]">
                    <div className="grid grid-cols-[300px_repeat(12,1fr)] bg-white border-b sticky top-0 z-10">
                        <div className="p-3 text-xs font-bold text-slate-400 uppercase tracking-widest border-r">
                            Waste Category Group
                        </div>
                        {months.map(month => (
                            <div key={month} className="p-3 text-xs font-bold text-slate-600 text-center border-r border-slate-100 last:border-0">
                                {month}
                            </div>
                        ))}
                    </div>

                    {groupList.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-400 italic bg-white">No waste records found.</div>
                    ) : (
                        groupList.map(group => {
                            const totalStoredWeight = group.records
                                .filter(r => r.status === 'stored')
                                .reduce((acc, curr) => acc + (curr.unit === 'kg' ? curr.weight / 1000 : curr.weight), 0);

                            return (
                                <div key={group.wasteCode} className="grid grid-cols-[300px_repeat(12,1fr)] border-b last:border-0 hover:bg-amber-50/30 group transition-colors bg-white">
                                    <div className="p-3 border-r flex flex-col justify-center transition-colors">
                                        <span className="text-sm font-semibold text-slate-800 line-clamp-1">{group.wasteType}</span>
                                        <div className="flex gap-2 items-center mt-1">
                                            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">{group.wasteCode}</span>
                                            {totalStoredWeight > 0 ? (
                                                <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.5 rounded">TPS: {totalStoredWeight.toFixed(2)} Ton</span>
                                            ) : (
                                                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">TPS Empty</span>
                                            )}
                                        </div>
                                    </div>
                                    {renderHeatmapCells(group)}
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
