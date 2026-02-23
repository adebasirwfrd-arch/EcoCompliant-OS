"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, BarChart4, ClipboardCheck, BookOpen, TrendingUp, AlertCircle, FileText, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

export function ISOPerformanceModule({ monitoring, audits, reviews, onAddMonitoring, onAddAudit, onAddReview }: any) {
    return (
        <div className="space-y-6">
            {/* KPI TRACKER */}
            <Card className="border-none shadow-sm bg-white">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
                    <div className="space-y-1">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <BarChart4 className="h-4 w-4 text-blue-500" />
                            Monitoring & Measurement (Cl. 9.1)
                        </CardTitle>
                        <CardDescription className="text-[10px]">Key Performance Indicators & Environmental Targets</CardDescription>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold" onClick={onAddMonitoring}>
                        <Plus className="h-3 w-3 mr-1" /> Add Indicator
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 pl-6">KPI Indicator</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400">Baseline</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400">Target</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400">Current</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400">Performance</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {monitoring.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-40 text-center text-slate-400">
                                        <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                        <p className="text-xs">No monitoring indicators defined.</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                monitoring.map((item: any) => {
                                    const percentage = (item.currentValue / item.targetValue) * 100;
                                    const isGood = percentage <= 100; // Assuming lower is better for most env metrics
                                    return (
                                        <TableRow key={item.id} className="group transition-colors hover:bg-slate-50/50">
                                            <TableCell className="pl-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-slate-900">{item.indicatorName}</span>
                                                    <span className="text-[9px] text-slate-400">{item.unit}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-[10px] font-bold text-slate-600">{item.baselineValue}</TableCell>
                                            <TableCell className="text-[10px] font-bold text-blue-600">{item.targetValue}</TableCell>
                                            <TableCell className="text-[10px] font-black text-slate-900">{item.currentValue}</TableCell>
                                            <TableCell className="min-w-[120px]">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between text-[8px] font-bold uppercase">
                                                        <span className={isGood ? 'text-emerald-600' : 'text-amber-600'}>
                                                            {percentage.toFixed(1)}% of Target
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 h-1 rounded-full">
                                                        <div className={`h-1 rounded-full ${isGood ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.3)]' : 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.3)]'}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`text-[8px] font-black uppercase px-2 py-0 border-none ${item.status === 'On Track' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                                    }`}>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* INTERNAL AUDITS */}
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <ClipboardCheck className="h-4 w-4 text-emerald-500" />
                                Internal Audit Programme (Cl. 9.2)
                            </CardTitle>
                            <CardDescription className="text-[10px]">Registry of formal EMS audits and findings</CardDescription>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold" onClick={onAddAudit}>
                            <Plus className="h-3 w-3 mr-1" /> New Audit
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400 pl-6">Audit Title</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Date</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400 text-center">NC (M/m)</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {audits.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-40 text-center text-slate-400">
                                            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-xs">No internal audits recorded.</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    audits.map((audit: any) => (
                                        <TableRow key={audit.id} className="group transition-colors hover:bg-slate-50/50">
                                            <TableCell className="pl-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-slate-900">{audit.auditTitle}</span>
                                                    <span className="text-[9px] text-slate-400">{audit.auditorName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-[10px] font-bold text-slate-500">
                                                {format(new Date(audit.auditDate), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center gap-1">
                                                    <Badge className="bg-red-50 text-red-700 border-none text-[9px] px-1 py-0">{audit.majorNC}</Badge>
                                                    <Badge className="bg-amber-50 text-amber-700 border-none text-[9px] px-1 py-0">{audit.minorNC}</Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`text-[8px] font-black uppercase px-2 py-0 ${audit.status === 'Completed' ? 'border-emerald-200 text-emerald-700' : 'border-slate-200 text-slate-400'
                                                    }`}>
                                                    {audit.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* MANAGEMENT REVIEW */}
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-slate-600" />
                                Management Review (Cl. 9.3)
                            </CardTitle>
                            <CardDescription className="text-[10px]">Executive review of EMS effectiveness</CardDescription>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold" onClick={onAddReview}>
                            <Plus className="h-3 w-3 mr-1" /> Log Review
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400 pl-6">Meeting Date</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Chairperson</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Decisions</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviews.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-40 text-center text-slate-400">
                                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-xs">No management reviews logged.</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reviews.map((row: any) => (
                                        <TableRow key={row.id} className="group transition-colors hover:bg-slate-50/50">
                                            <TableCell className="pl-6 text-[11px] font-black text-slate-900">
                                                {format(new Date(row.meetingDate), 'MMM dd, yyyy')}
                                            </TableCell>
                                            <TableCell className="text-[10px] font-bold text-slate-600">{row.chairperson}</TableCell>
                                            <TableCell className="text-[10px] text-slate-400 line-clamp-1 max-w-[150px]">
                                                {row.decisionsAndActions}
                                            </TableCell>
                                            <TableCell>
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <div className="p-6 bg-slate-50/50 mt-auto border-t border-slate-100 italic text-[10px] text-slate-400">
                        * All reviews must cover inputs from Clause 9.3.2 and generate outputs according to 9.3.3.
                    </div>
                </Card>
            </div>
        </div>
    )
}
