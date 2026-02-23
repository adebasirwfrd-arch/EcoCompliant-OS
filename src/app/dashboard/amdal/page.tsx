import { db } from "@/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, CalendarRange, AlertTriangle, PlusCircle, Factory, Droplets, CheckCircle2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AmdalForm } from "@/components/shared/amdal-form"
import { AmdalClient } from "@/components/shared/amdal-client"
import { AmdalHeatmap } from "@/components/shared/amdal-heatmap"
import { AmdalCalendar } from "@/components/shared/amdal-calendar"
import { isBefore, addDays } from "date-fns"

export default async function AmdalPage() {
    const requirements = await db.query.amdalRequirements.findMany({
        orderBy: (reqs, { asc }) => [asc(reqs.nextDueDate)],
    });

    // Calculate Metrics
    const totalRequirements = requirements.length;
    const compliantCount = requirements.filter(r => r.status === 'Compliant').length;
    const nonCompliantCount = requirements.filter(r => r.status === 'Non-Compliant').length;

    // Calculate Upcoming and Overdue
    const today = new Date();
    const overdueCount = requirements.filter(r => r.status !== 'Compliant' && isBefore(new Date(r.nextDueDate), today)).length;
    const approachingCount = requirements.filter(r =>
        r.status !== 'Compliant' &&
        isBefore(new Date(r.nextDueDate), addDays(today, 30)) &&
        !isBefore(new Date(r.nextDueDate), today)
    ).length;

    const complianceRate = totalRequirements > 0 ? Math.round((compliantCount / totalRequirements) * 100) : 100;

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">AMDAL Management</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Factory className="h-4 w-4" />
                        Comprehensive tracking for EIA, RKL, and RPL implementation parameters.
                    </p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm font-semibold">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Requirement
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>New AMDAL/UKL-UPL Requirement</DialogTitle>
                            <DialogDescription>
                                Track a specific environmental management or monitoring parameter mandated by your environmental documents.
                            </DialogDescription>
                        </DialogHeader>
                        <AmdalForm />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-l-4 border-l-indigo-500 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-slate-500">Tracked Parameters</p>
                            <div className="bg-indigo-50 p-2 rounded-full">
                                <ShieldCheck className="h-4 w-4 text-indigo-500" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold text-slate-800">{totalRequirements}</div>
                            <div className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">RKL & RPL</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-slate-500">Compliance Rate</p>
                            <div className="bg-emerald-50 p-2 rounded-full">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold text-slate-800">{complianceRate}%</div>
                            <div className="text-xs text-emerald-600 font-semibold">{compliantCount} Compliant</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-slate-500">Upcoming Implementations</p>
                            <div className="bg-amber-50 p-2 rounded-full">
                                <CalendarRange className="h-4 w-4 text-amber-500" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold text-slate-800">{approachingCount}</div>
                            <div className="text-xs text-amber-600 font-semibold">Due in &lt; 30 Days</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-slate-500">Overdue / Non-Compliant</p>
                            <div className="bg-red-50 p-2 rounded-full">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold text-red-600">{overdueCount + nonCompliantCount}</div>
                            <div className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">Requires Attention</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dashboard Main Visuals Layer */}
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                {/* Advisory Card */}
                <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl overflow-hidden relative col-span-1 lg:col-span-1 border-none">
                    <div className="absolute -top-4 -right-4 p-4 opacity-10">
                        <ShieldCheck className="h-32 w-32" />
                    </div>
                    <CardHeader className="pb-3 border-b border-white/10 relative z-10">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-indigo-400" />
                            AMDAL Advisory
                        </CardTitle>
                        <CardDescription className="text-indigo-200/80">Compliance status & action items.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4 relative z-10">
                        {overdueCount > 0 && (
                            <div className="flex gap-3 items-start p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-red-200">Critical Priority</p>
                                    <p className="text-sm text-white/90 leading-snug">{overdueCount} parameters are currently overdue for monitoring/reporting.</p>
                                </div>
                            </div>
                        )}
                        {approachingCount > 0 && (
                            <div className="flex gap-3 items-start p-3 bg-white/10 border border-white/10 rounded-lg">
                                <CalendarRange className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-amber-200">Upcoming Duty</p>
                                    <p className="text-sm text-white/90 leading-snug">{approachingCount} parameters require monitoring action within the next 30 days.</p>
                                </div>
                            </div>
                        )}
                        {overdueCount === 0 && approachingCount === 0 && (
                            <div className="flex gap-3 items-start p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">All Clear</p>
                                    <p className="text-sm text-white/90 leading-snug">All RKL-RPL obligations are currently up to date.</p>
                                </div>
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2 text-sm text-indigo-200">
                                <Droplets className="h-4 w-4" />
                                Next Semester Report: <strong>July 2026</strong>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Calendar Component */}
                <div className="col-span-1 lg:col-span-3">
                    <AmdalCalendar requirements={requirements} />
                </div>
            </div>

            {/* Heatmap Matrix Layer */}
            <AmdalHeatmap requirements={requirements} />

            {/* Data Table Repository Layer */}
            <Card className="shadow-sm border-none bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-6 border-b">
                    <div className="space-y-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Factory className="h-5 w-5 text-indigo-500" />
                            Requirements Repository
                        </CardTitle>
                        <CardDescription>Manage, track, and update specific Environmental Implementation Requirements.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <AmdalClient requirements={requirements} />
                </CardContent>
            </Card>

        </div>
    )
}
