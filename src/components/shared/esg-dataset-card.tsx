"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowUpRight, BarChart4, ClipboardCheck, Timer } from "lucide-react"
interface CustomCardProps {
    dataset: any // Changed from EsgDatasetProps to any due to missing export
    score?: number
    onClick: () => void
    size?: "small" | "large" | "tall"
}

export function EsgDatasetCard({ dataset, score, onClick, size = "small" }: CustomCardProps) {
    const isAvailable = dataset.status === "Available"

    // Determine span classes based on size
    const sizeClasses = {
        small: "col-span-1 row-span-1",
        large: "md:col-span-2 row-span-1",
        tall: "col-span-1 row-span-2"
    }

    return (
        <Card
            onClick={onClick}
            className={`
                relative group overflow-hidden border-none bg-[#0B0F1A] text-white
                rounded-[32px] p-8 cursor-pointer transition-all duration-500
                hover:scale-[0.98] active:scale-[0.96]
                ${sizeClasses[size]}
            `}
        >
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Top Row: Meta & Icons */}
            <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="flex flex-col gap-2">
                    <Badge className={`
                        w-fit text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full
                        ${isAvailable ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" : "bg-slate-800 text-slate-500 border-transparent"}
                    `}>
                        {isAvailable ? "Verified" : "Development"}
                    </Badge>
                </div>

                <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-slate-900/50 border border-slate-800 group-hover:bg-emerald-500 group-hover:border-emerald-400 group-hover:text-white transition-all duration-300">
                    <ArrowUpRight className="h-4 w-4" />
                </div>
            </div>

            {/* Title Section */}
            <div className="relative z-10 space-y-4">
                <div className="space-y-2">
                    <h3 className={`font-black tracking-tight leading-tight ${size === "large" ? "text-3xl" : "text-xl"}`}>
                        {dataset.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
                        {dataset.description}
                    </p>
                </div>

                {/* Score or Stats Bar */}
                {isAvailable ? (
                    <div className="flex items-end justify-between pt-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Maturity Score</span>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-4xl font-black ${score ? "text-emerald-500" : "text-slate-800"}`}>
                                    {score ? Math.round(score) : "—"}
                                </span>
                                <span className="text-xs font-bold text-slate-700">/100</span>
                            </div>
                        </div>

                        {/* Interactive mini-visualization for large cards */}
                        {size === "large" && (
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-8 w-1.5 rounded-full ${score && score / 20 >= i ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-slate-800"
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="pt-6">
                        <div className="flex items-center gap-2 text-slate-700 text-[10px] font-black uppercase tracking-widest">
                            <Timer className="h-3 w-3" /> Q3 2026 RELEASE
                        </div>
                    </div>
                )}
            </div>

            {/* Standard Reference Badge (Floating bottom) */}
            <div className="absolute bottom-6 right-8 opacity-40 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] font-black tracking-widest text-slate-600 uppercase">GRI Ref. 305</span>
            </div>
        </Card>
    )
}
