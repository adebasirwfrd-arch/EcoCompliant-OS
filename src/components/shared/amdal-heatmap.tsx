"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Grid, Info } from "lucide-react"

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

export function AmdalHeatmap({ requirements }: { requirements: AmdalReq[] }) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    // Group requirements by their type
    const rklReqs = requirements.filter(r => r.type === 'RKL');
    const rplReqs = requirements.filter(r => r.type === 'RPL');

    const renderHeatmapCells = (req: AmdalReq) => {
        const dueMonth = new Date(req.nextDueDate).getMonth();
        return months.map((_, index) => {
            const isDueMonth = index === dueMonth;

            // Simplified logic for showing repeating frequencies across the year based on the single nextDueDate
            let isActive = false;
            if (req.frequency === 'Monthly') isActive = true;
            else if (req.frequency === 'Quarterly' && (index % 3 === dueMonth % 3)) isActive = true;
            else if (req.frequency === 'Semester' && (index % 6 === dueMonth % 6)) isActive = true;
            else if (req.frequency === 'Annual' && index === dueMonth) isActive = true;

            let colorClass = "bg-transparent";
            if (isActive) {
                // Determine color based on type and status
                if (req.status === 'Compliant') colorClass = "bg-emerald-500 rounded-md shadow-sm";
                else if (req.status === 'Non-Compliant') colorClass = "bg-red-500 rounded-md shadow-sm";
                else {
                    // Pending colors based on RKL vs RPL
                    colorClass = req.type === 'RKL' ? "bg-amber-400 rounded-md shadow-sm" : "bg-sky-400 rounded-md shadow-sm";
                }
            }

            return (
                <div key={index} className="flex items-center justify-center p-1 border-r border-slate-100 last:border-0 h-14">
                    <div className={`w-full h-4 ${colorClass} transition-all duration-300 hover:scale-105 hover:opacity-80`} title={isActive ? `${req.parameter} Due` : ''}></div>
                </div>
            );
        });
    };

    return (
        <Card className="shadow-lg border-slate-200 col-span-full overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-4 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Grid className="h-5 w-5 text-indigo-500" />
                        RKL-RPL Implementation Matrix
                    </CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                        Timeline of environmental management (RKL) and monitoring (RPL) obligations.
                    </p>
                </div>
                <span title="Amber = Pending RKL (Management), Sky Blue = Pending RPL (Monitoring), Emerald = Compliant, Red = Non-Compliant">
                    <Info className="h-5 w-5 text-slate-400 cursor-help" />
                </span>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
                <div className="min-w-[1000px]">
                    <div className="grid grid-cols-[300px_repeat(12,1fr)] bg-white border-b sticky top-0 z-10">
                        <div className="p-3 text-xs font-bold text-slate-400 uppercase tracking-widest border-r">
                            Parameter / Activity
                        </div>
                        {months.map(month => (
                            <div key={month} className="p-3 text-xs font-bold text-slate-600 text-center border-r border-slate-100 last:border-0">
                                {month}
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-50 border-y border-slate-200 px-4 py-2 text-xs font-bold text-indigo-700 uppercase tracking-wider sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10 w-full flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-400"></div> RKL (Pengelolaan Lingkungan)
                    </div>
                    {rklReqs.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-400 italic">No RKL parameters defined.</div>
                    ) : (
                        rklReqs.map(req => (
                            <div key={req.id} className="grid grid-cols-[300px_repeat(12,1fr)] border-b last:border-0 hover:bg-slate-50 group transition-colors">
                                <div className="p-3 border-r flex flex-col justify-center bg-white group-hover:bg-slate-50 transition-colors">
                                    <span className="text-sm font-semibold text-slate-800 line-clamp-1" title={req.parameter}>{req.parameter}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{req.frequency}</span>
                                </div>
                                {renderHeatmapCells(req)}
                            </div>
                        ))
                    )}

                    <div className="bg-slate-50 border-y border-slate-200 px-4 py-2 text-xs font-bold text-sky-700 uppercase tracking-wider sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10 w-full flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-sky-400"></div> RPL (Pemantauan Lingkungan)
                    </div>
                    {rplReqs.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-400 italic">No RPL parameters defined.</div>
                    ) : (
                        rplReqs.map(req => (
                            <div key={req.id} className="grid grid-cols-[300px_repeat(12,1fr)] border-b last:border-0 hover:bg-slate-50 group transition-colors">
                                <div className="p-3 border-r flex flex-col justify-center bg-white group-hover:bg-slate-50 transition-colors">
                                    <span className="text-sm font-semibold text-slate-800 line-clamp-1" title={req.parameter}>{req.parameter}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{req.frequency}</span>
                                </div>
                                {renderHeatmapCells(req)}
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
