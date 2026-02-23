"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Grid, Info } from "lucide-react"

type GhgRecord = {
    id: string;
    date: Date;
    co2e: number;
};

export function GhgHeatmap({ records }: { records: GhgRecord[] }) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const today = new Date();

    // Create a 365-day lookup table for CO2e sums per calendar date
    const emissionMap = new Map<string, number>();

    records.forEach(r => {
        const d = new Date(r.date);
        // Reset time for strict day matching
        d.setHours(0, 0, 0, 0);
        const key = d.toISOString();
        const currentSum = emissionMap.get(key) || 0;
        emissionMap.set(key, currentSum + r.co2e);
    });

    const getIntensityColor = (co2e: number) => {
        if (co2e === 0) return "bg-slate-100 dark:bg-slate-800"; // No emissions recorded
        if (co2e < 10) return "bg-orange-200 dark:bg-orange-900/40"; // Low
        if (co2e < 50) return "bg-orange-400 dark:bg-orange-700"; // Medium
        if (co2e < 150) return "bg-red-500 dark:bg-red-600"; // High
        return "bg-slate-900 dark:bg-slate-950"; // Critical (Black/Dark Slate)
    };

    // Generate 365 days leading up to today
    const days = Array.from({ length: 365 }).map((_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (364 - i));
        date.setHours(0, 0, 0, 0);
        const key = date.toISOString();
        const totalCo2e = emissionMap.get(key) || 0;

        return {
            date,
            totalCo2e,
            color: getIntensityColor(totalCo2e)
        };
    });

    const weeks: (typeof days)[] = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Grid className="h-5 w-5 text-orange-600" />
                            365-Day Carbon Intensity Matrix
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Daily aggregation of total tCO2e. Darker blocks represent days with severe carbon footprints.
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2 overflow-x-auto pb-4 custom-scrollbar">
                    <div className="flex text-xs text-slate-400 ml-8 mb-1 min-w-[750px] justify-between pr-4">
                        {months.map(m => <span key={m}>{m}</span>)}
                    </div>

                    <div className="flex gap-[3px] min-w-[750px] relative pb-2">
                        {/* Day Labels */}
                        <div className="flex flex-col gap-[3px] text-[10px] text-slate-400 font-medium mr-2 pt-1">
                            <span className="h-[12px] flex items-center">Mon</span>
                            <span className="h-[12px]"></span>
                            <span className="h-[12px] flex items-center">Wed</span>
                            <span className="h-[12px]"></span>
                            <span className="h-[12px] flex items-center">Fri</span>
                            <span className="h-[12px]"></span>
                            <span className="h-[12px]"></span>
                        </div>

                        {/* Grid */}
                        {weeks.map((week, wIdx) => (
                            <div key={wIdx} className="flex flex-col gap-[3px]">
                                {week.map((day, dIdx) => (
                                    <div
                                        key={dIdx}
                                        className={`w-[12px] h-[12px] rounded-sm ${day.color} hover:ring-2 hover:ring-slate-400 hover:ring-offset-1 transition-all cursor-crosshair group relative`}
                                    >
                                        {/* Tooltip */}
                                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none transition-opacity shadow-xl flex gap-3 items-center">
                                            <div className="font-semibold">{day.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                            <div className="w-px h-3 bg-slate-700" />
                                            <div>
                                                <span className={`${day.totalCo2e > 0 ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                                                    {day.totalCo2e.toFixed(2)} tCO2e
                                                </span>
                                            </div>

                                            {/* Arrow pointer for tooltip */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-end gap-2 text-xs text-slate-500 mt-2 min-w-[750px]">
                        <span>Zero</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800" />
                            <div className="w-3 h-3 rounded-sm bg-orange-200 dark:bg-orange-900/40" />
                            <div className="w-3 h-3 rounded-sm bg-orange-400 dark:bg-orange-700" />
                            <div className="w-3 h-3 rounded-sm bg-red-500 dark:bg-red-600" />
                            <div className="w-3 h-3 rounded-sm bg-slate-900 dark:bg-slate-950" />
                        </div>
                        <span>Critical</span>

                        <div className="w-px h-4 bg-slate-200 mx-2" />
                        <span className="flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            Thresholds tied to Sector Averages
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
