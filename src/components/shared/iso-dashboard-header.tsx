"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, AlertTriangle, Target, Scale, Activity, ClipboardCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type ISOMetrics = {
    auditReadiness: number;
    significantAspects: number;
    legalComplianceRate: number;
    openNCs: number;
    objectivesProgress: number;
};

export function ISODashboardHeader({ metrics }: { metrics: ISOMetrics }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-none shadow-sm bg-white overflow-hidden group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Audit Readiness</CardTitle>
                    <ShieldCheck className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-900">{metrics.auditReadiness}%</div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div
                                className="bg-emerald-500 h-1.5 rounded-full"
                                style={{ width: `${metrics.auditReadiness}%` }}
                            />
                        </div>
                    </div>
                    <p className="text-[10px] text-emerald-600 font-bold mt-2 uppercase tracking-wider">Clause Compliance Secure</p>
                </CardContent>
                <div className="h-1 bg-emerald-500/20" />
            </Card>

            <Card className="border-none shadow-sm bg-white overflow-hidden group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Significant Aspects</CardTitle>
                    <Activity className="h-5 w-5 text-amber-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-900">{metrics.significantAspects}</div>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Impacts requiring mitigation</p>
                    <Badge className="mt-2 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 font-bold">
                        Clause 6.1.2 Active
                    </Badge>
                </CardContent>
                <div className="h-1 bg-amber-500/20" />
            </Card>

            <Card className="border-none shadow-sm bg-white overflow-hidden group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Legal Compliance</CardTitle>
                    <Scale className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-900">{metrics.legalComplianceRate}%</div>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-blue-600 uppercase">
                        <ClipboardCheck className="h-3 w-3" /> All obligations reviewed
                    </div>
                </CardContent>
                <div className="h-1 bg-blue-500/20" />
            </Card>

            <Card className="border-none shadow-sm bg-white overflow-hidden group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Non-Conformities</CardTitle>
                    <AlertTriangle className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-900">{metrics.openNCs}</div>
                    <p className="text-[10px] text-red-600 font-bold mt-1 uppercase tracking-wider">CAPA Action Required</p>
                    <div className="mt-2 flex gap-1">
                        <Badge variant="outline" className="text-[9px] border-red-100 bg-red-50 text-red-700">0 Major</Badge>
                        <Badge variant="outline" className="text-[9px] border-amber-100 bg-amber-50 text-amber-700">{metrics.openNCs} Minor</Badge>
                    </div>
                </CardContent>
                <div className="h-1 bg-red-500/20" />
            </Card>
        </div>
    )
}
