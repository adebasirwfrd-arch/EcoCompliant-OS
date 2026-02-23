"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Calendar, Check } from "lucide-react"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Adjusted active months to represent typical deadline months (e.g. Semester 2 is due in Jan, Q3 in Oct)
const REPORTING_DATA = [
    {
        agency: "KLHK",
        reports: [
            { name: "RKL-RPL Semester", months: [1, 7], type: "Semester" },
            { name: "SIMPEL (Monitoring)", months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], type: "Monthly" },
            { name: "Laporan Limbah B3", months: [1, 4, 7, 10], type: "Quarterly" },
            { name: "PROPER Self-Assess", months: [10], type: "Annual" },
        ]
    },
    {
        agency: "ESDM",
        reports: [
            { name: "RKAB Submission", months: [11, 12], type: "Annual" },
            { name: "Laporan Bulanan", months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], type: "Monthly" },
            { name: "Teknik & Lingkungan", months: [1, 7], type: "Semester" },
            { name: "Laporan Triwulan", months: [1, 4, 7, 10], type: "Quarterly" },
        ]
    },
    {
        agency: "SKK Migas",
        reports: [
            { name: "Operational Report", months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], type: "Monthly" },
            { name: "UKL-UPL Monitoring", months: [1, 7], type: "Semester" },
            { name: "HSE Performance", months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], type: "Monthly" },
            { name: "Annual Work Plan", months: [11], type: "Annual" },
        ]
    },
    {
        agency: "DLH Regional",
        reports: [
            { name: "Laporan Semesteran", months: [1, 7], type: "Semester" },
            { name: "Izin Pembuangan", months: [1, 4, 7, 10], type: "Quarterly" },
            { name: "Limbah Domestik", months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], type: "Monthly" },
        ]
    }
]

interface ComplianceHeatmapProps {
    reports?: any[];
}

function isReportMatch(dbReport: any, groupAgency: string, rowName: string) {
    if (dbReport.agency !== groupAgency) return false;

    const dbTitle = dbReport.title.toLowerCase();
    const rowNameLower = rowName.toLowerCase();
    const dbCategory = dbReport.category;

    if (rowNameLower.includes("simpel") && dbCategory === "SIMPEL") return true;
    if (rowNameLower.includes("rkab") && dbCategory === "RKAB") return true;
    if (rowNameLower.includes("rkl-rpl") && dbCategory === "RKL-RPL") return true;
    if (rowNameLower.includes("ukl-upl") && dbCategory === "UKL-UPL") return true;
    if (rowNameLower.includes("rkl-rpl") && dbTitle.includes("rkl-rpl")) return true;
    if (rowNameLower.includes("limbah b3") && dbTitle.includes("limbah b3")) return true;

    if (dbTitle.includes(rowNameLower)) return true;
    if (rowName === "Laporan Bulanan" && dbTitle.includes("bulanan")) return true;
    if (rowName === "Laporan Triwulan" && dbTitle.includes("triwulan")) return true;

    return false;
}

export function ComplianceHeatmap({ reports = [] }: ComplianceHeatmapProps) {
    return (
        <Card className="shadow-xl border-none bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b pb-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-indigo-600" />
                            Reporting Heatmap Matrix
                        </CardTitle>
                        <CardDescription className="text-xs">Regulatory cycle visualization across agencies.</CardDescription>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">Colored cells indicate required reporting months.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="w-full overflow-hidden">
                    <table className="w-full border-collapse table-fixed">
                        <thead>
                            <tr className="bg-slate-50/30">
                                <th className="p-3 text-left text-[10px] font-black uppercase tracking-tight text-slate-400 border-b border-r w-[240px]">Agency / Report</th>
                                {MONTHS.map(m => (
                                    <th key={m} className="p-2 text-center text-[10px] font-black uppercase tracking-tight text-slate-400 border-b border-r last:border-r-0">
                                        {m}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {REPORTING_DATA.map((group) => (
                                <React.Fragment key={group.agency}>
                                    <tr className="bg-slate-50/50">
                                        <td colSpan={13} className="px-3 py-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                            {group.agency}
                                        </td>
                                    </tr>
                                    {group.reports.map((report) => (
                                        <tr key={report.name} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="p-3 border-r overflow-hidden text-ellipsis whitespace-nowrap" title={report.name}>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors truncate">
                                                        {report.name}
                                                    </span>
                                                    <span className="text-[9px] text-slate-400 uppercase font-bold">{report.type}</span>
                                                </div>
                                            </td>
                                            {Array.from({ length: 12 }).map((_, i) => {
                                                const monthIdx = i + 1
                                                const isActive = report.months.includes(monthIdx)

                                                const activeClass =
                                                    report.type === "Monthly" ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.2)]" :
                                                        report.type === "Quarterly" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]" :
                                                            report.type === "Semester" ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.2)]" :
                                                                "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.2)]" // Annual

                                                const approvedReport = reports?.find(r =>
                                                    r.status === "Approved" &&
                                                    new Date(r.dueDate).getMonth() + 1 === monthIdx &&
                                                    isReportMatch(r, group.agency, report.name)
                                                );

                                                return (
                                                    <td key={i} className="p-0.5 border-r last:border-r-0">
                                                        {isActive ? (
                                                            <div className={`h-4 w-full rounded-sm flex items-center justify-center ${activeClass} transition-all hover:scale-105 cursor-pointer`}>
                                                                {approvedReport && <Check className="h-3 w-3 text-white drop-shadow-md" />}
                                                            </div>
                                                        ) : (
                                                            <div className="h-4 w-full rounded-sm flex items-center justify-center bg-slate-50/50">
                                                                {approvedReport && <Check className="h-3 w-3 text-indigo-400 opacity-30" />}
                                                            </div>
                                                        )}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-3 bg-slate-50 border-t flex flex-wrap gap-3 items-center justify-center">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase">
                        <div className="h-2 w-2 rounded-full bg-indigo-500" /> Monthly
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" /> Quarterly
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase">
                        <div className="h-2 w-2 rounded-full bg-amber-500" /> Semester
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase">
                        <div className="h-2 w-2 rounded-full bg-rose-500" /> Annual
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
