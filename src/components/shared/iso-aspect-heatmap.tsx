"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type AspectPoint = {
    id: string;
    aspect: string;
    severity: number;
    probability: number;
    isSignificant: boolean;
};

export function ISOAspectHeatmap({ data }: { data: AspectPoint[] }) {
    const grid = Array.from({ length: 5 }, (_, i) => 5 - i); // [5, 4, 3, 2, 1] for Y axis
    const cols = [1, 2, 3, 4, 5]; // X axis

    const getBgColor = (s: number, p: number) => {
        const score = s * p;
        if (score >= 12) return "bg-red-500/10 border-red-200";
        if (score >= 8) return "bg-amber-500/10 border-amber-200";
        return "bg-emerald-500/10 border-emerald-200";
    };

    return (
        <Card className="border-none shadow-sm bg-white">
            <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                    Aspect Significance Matrix
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-500 border-slate-200">
                        Clause 6.1.2 Intelligence
                    </Badge>
                </CardTitle>
                <CardDescription className="text-xs">Severity vs Probability distribution of environmental aspects</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative pt-6 pb-8 px-8">
                    {/* Y-Axis Label */}
                    <div className="absolute left-0 top-1/2 -rotate-90 origin-center -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        Severity (Impact)
                    </div>

                    {/* X-Axis Label */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        Probability (Likelihood)
                    </div>

                    <div className="grid grid-cols-5 gap-1 aspect-square max-w-[400px] mx-auto">
                        {grid.map((s) => (
                            cols.map((p) => {
                                const points = data.filter(d => d.severity === s && d.probability === p);
                                return (
                                    <div
                                        key={`${s}-${p}`}
                                        className={cn(
                                            "border rounded-sm relative flex items-center justify-center transition-colors group cursor-help",
                                            getBgColor(s, p)
                                        )}
                                    >
                                        <div className="absolute top-1 left-1 text-[8px] font-bold text-slate-400 group-hover:text-slate-600">
                                            {s * p}
                                        </div>
                                        <div className="flex flex-wrap gap-1 p-1 justify-center">
                                            {points.map(pt => (
                                                <div
                                                    key={pt.id}
                                                    title={pt.aspect}
                                                    className={cn(
                                                        "h-2 w-2 rounded-full",
                                                        pt.isSignificant ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-emerald-500"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                            })
                        ))}
                    </div>

                    {/* Scale Indicators */}
                    <div className="mt-6 flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-semibold text-slate-600">Low Risk</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.4)]" />
                            <span className="text-[10px] font-semibold text-slate-600">Significant Aspect</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
