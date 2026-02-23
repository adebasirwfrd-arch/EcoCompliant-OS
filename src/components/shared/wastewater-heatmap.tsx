"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Grid, Info, ShieldCheck } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type WastewaterLog = {
    id: string;
    logDate: Date;
    isViolation: boolean | null;
    phLevel: number;
    codLevel: number;
    tssLevel: number;
    ammoniaLevel: number;
};

export function WastewaterHeatmap({ logs }: { logs: WastewaterLog[] }) {
    // Generate an array of the last 365 days
    const today = new Date();
    const daysArray = Array.from({ length: 365 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (364 - i));
        return d;
    });

    // Map logs to dates
    const logMap = new Map<string, WastewaterLog>();
    logs.forEach(log => {
        logMap.set(new Date(log.logDate).toDateString(), log);
    });

    // Group days by week (7 days per column)
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    // Fill leading empty days if necessary to align week starting day (optional, keeping it simple sequence for now)
    daysArray.forEach(day => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    return (
        <Card className="shadow-lg border-slate-200 mt-6 overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-4 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Grid className="h-5 w-5 text-blue-600" />
                        365-Day SPARING Compliance Matrix
                    </CardTitle>
                    <CardDescription className="mt-1">
                        Continuous IPAL Monitoring. Visualizing daily limits for pH (6-9) and standard BMAL.
                    </CardDescription>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-slate-100 border"></div> No Data</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-emerald-400"></div> Safe</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-red-500"></div> BMAL Exceeded</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 overflow-x-auto">
                <div className="min-w-[800px] flex gap-1">
                    {weeks.map((week, wIdx) => (
                        <div key={wIdx} className="flex flex-col gap-1">
                            {week.map((date, dIdx) => {
                                const log = logMap.get(date.toDateString());

                                let colorClass = "bg-slate-100 hover:bg-slate-200 border border-slate-200/50 cursor-pointer"; // Default Blank
                                if (log) {
                                    if (log.isViolation) {
                                        colorClass = "bg-red-500 hover:bg-red-600 cursor-pointer shadow-sm";
                                    } else {
                                        colorClass = "bg-emerald-400 hover:bg-emerald-500 cursor-pointer";
                                    }
                                }

                                return (
                                    <Popover key={dIdx}>
                                        <PopoverTrigger asChild>
                                            <div
                                                className={`w-4 h-4 rounded-sm transition-colors ${colorClass}`}
                                            />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64 p-3 shadow-lg border-slate-200" side="top">
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-sm border-b pb-2 flex justify-between">
                                                    {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                    {log ? (
                                                        log.isViolation ?
                                                            <span className="text-red-500 font-bold text-xs uppercase">Violation</span> :
                                                            <span className="text-emerald-500 font-bold text-xs uppercase flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Compliant</span>
                                                    ) : <span className="text-slate-400 text-xs">No Data</span>}
                                                </h4>
                                                {log ? (
                                                    <div className="grid grid-cols-2 gap-y-1 text-sm pt-1">
                                                        <span className="text-muted-foreground">pH:</span>
                                                        <span className={log.phLevel < 6 || log.phLevel > 9 ? "text-red-600 font-bold" : "text-emerald-600"}>{log.phLevel}</span>
                                                        <span className="text-muted-foreground">COD:</span>
                                                        <span>{log.codLevel} mg/L</span>
                                                        <span className="text-muted-foreground">TSS:</span>
                                                        <span>{log.tssLevel} mg/L</span>
                                                        <span className="text-muted-foreground">Amonia:</span>
                                                        <span>{log.ammoniaLevel} mg/L</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">No IPAL SPARING log recorded for this date. Ensure operator logs are synced.</p>
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
