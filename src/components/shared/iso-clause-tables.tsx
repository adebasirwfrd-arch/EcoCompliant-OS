"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit2, ExternalLink, Calendar, User, Scale, Target, History, AlertTriangle, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

type Aspect = {
    id: string;
    activity: string;
    aspect: string;
    impact: string;
    condition: string;
    significanceScore: number;
    isSignificant: boolean;
    status: string;
};

export function ISOAspectTable({ data, onEdit }: { data: Aspect[], onEdit: (a: Aspect) => void }) {
    return (
        <Table>
            <TableHeader className="bg-slate-50/50">
                <TableRow>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Activity / Aspect</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Environmental Impact</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Condition</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Score</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Status</TableHead>
                    <TableHead className="text-right text-[11px] font-bold uppercase text-slate-500">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item) => (
                    <TableRow key={item.id} className="group transition-colors">
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900">{item.aspect}</span>
                                <span className="text-[10px] text-slate-500">{item.activity}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 max-w-[200px] truncate">{item.impact}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className="text-[10px] font-bold px-1.5 py-0 bg-white">
                                {item.condition}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold">{item.significanceScore}</span>
                                {item.isSignificant && (
                                    <Badge className="text-[9px] bg-red-100 text-red-700 border-red-200 hover:bg-red-200 uppercase font-black px-1 leading-none">
                                        Significant
                                    </Badge>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge className={item.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}>
                                {item.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="h-8 w-8 p-0 group-hover:bg-slate-100">
                                <Edit2 className="h-4 w-4 text-slate-400 group-hover:text-slate-900" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

type Legal = {
    id: string;
    regulationName: string;
    relevance: string;
    complianceStatus: string;
    nextReviewDate: Date | null;
};

export function ISOLegalTable({ data, onEdit }: { data: Legal[], onEdit: (l: Legal) => void }) {
    return (
        <Table>
            <TableHeader className="bg-slate-50/50">
                <TableRow>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Regulation</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Relevance</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Status</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Next Review</TableHead>
                    <TableHead className="text-right text-[11px] font-bold uppercase text-slate-500">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item) => (
                    <TableRow key={item.id} className="group">
                        <TableCell className="max-w-[250px]">
                            <div className="flex items-start gap-2">
                                <Scale className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                <span className="text-xs font-bold text-slate-900">{item.regulationName}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-[11px] text-slate-600 italic">"{item.relevance}"</TableCell>
                        <TableCell>
                            <Badge className={item.complianceStatus === 'Compliant' ? 'bg-emerald-100 text-emerald-800 border-none' : 'bg-red-100 text-red-800 border-none'}>
                                {item.complianceStatus}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {item.nextReviewDate && (
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(item.nextReviewDate), 'MMM d, yyyy')}
                                </div>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="h-8 w-8 p-0">
                                <Edit2 className="h-4 w-4 text-slate-400" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export function ISOObjectiveTable({ data, onEdit }: { data: any[], onEdit: (o: any) => void }) {
    return (
        <Table>
            <TableHeader className="bg-slate-50/50">
                <TableRow>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Environmental Objective</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Target & Indicator</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Progress</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Status</TableHead>
                    <TableHead className="text-right text-[11px] font-bold uppercase text-slate-500">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item) => (
                    <TableRow key={item.id} className="group">
                        <TableCell>
                            <div className="flex items-start gap-2">
                                <Target className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-900">{item.objective}</span>
                                    <span className="text-[10px] text-slate-400 capitalize">{item.department}</span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-slate-700">{item.targetValue}</span>
                                <span className="text-[9px] text-slate-500 uppercase">{item.indicator}</span>
                            </div>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                            <div className="flex flex-col gap-1 mt-1">
                                <div className="flex justify-between text-[9px] font-bold">
                                    <span>{item.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${item.progress}%` }} />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0">
                                {item.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="h-8 w-8 p-0">
                                <Edit2 className="h-4 w-4 text-slate-400" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export function ISOCapaTable({ data, onEdit }: { data: any[], onEdit: (c: any) => void }) {
    return (
        <Table>
            <TableHeader className="bg-slate-50/50">
                <TableRow>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">NC Description & Source</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Type</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Root Cause & Action</TableHead>
                    <TableHead className="text-[11px] font-bold uppercase text-slate-500">Status</TableHead>
                    <TableHead className="text-right text-[11px] font-bold uppercase text-slate-500">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item) => (
                    <TableRow key={item.id} className="group">
                        <TableCell className="max-w-[200px]">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-900 leading-tight">{item.description}</span>
                                    <span className="text-[10px] text-slate-400 mt-1 italic">Source: {item.source}</span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge className={item.ncType === 'Major' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}>
                                {item.ncType}
                            </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-slate-600 line-clamp-1 font-medium">RC: {item.rootCause}</span>
                                <span className="text-[10px] text-blue-600 line-clamp-1 font-bold">CA: {item.correctiveAction}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge className={item.status === 'Closed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                                {item.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="h-8 w-8 p-0">
                                <Edit2 className="h-4 w-4 text-slate-400" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
