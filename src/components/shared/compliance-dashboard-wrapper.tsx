"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ShieldCheck,
    Send,
    AlertTriangle,
    CheckCircle2,
    Clock,
    FileSpreadsheet,
    Activity,
    FileWarning,
    CalendarCheck
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ComplianceForm } from "@/components/shared/compliance-form"
import { ComplianceClient } from "@/components/shared/compliance-client"
import { ComplianceHeatmap } from "@/components/shared/compliance-heatmap"
import { TestRemindersButton } from "@/components/shared/test-reminders-button"
import { ComplianceRadar } from "@/components/shared/compliance-radar"
import { ComplianceDonut } from "@/components/shared/compliance-donut"

// This is the client wrapper that holds the God-Tier dashboard state
export function ComplianceDashboardWrapper({
    reports,
    pendingCount,
    submittedCount,
    approvedCount,
    overdueCount,
    upcomingDeadlines
}: any) {
    // State to hold the string clicked on the Donut Chart (e.g., "Overdue", "Pending")
    const [activeFilterStatus, setActiveFilterStatus] = useState<string>("all");

    const handleDonutClick = (status: string) => {
        setActiveFilterStatus(status);
        // Scroll to the table so the user sees the filtered results
        const tableElement = document.getElementById("data-table");
        if (tableElement) {
            tableElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const stats = [
        { label: "Pending Preparation", value: pendingCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
        { label: "Submitted (Under Review)", value: submittedCount, icon: Send, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Approved by Agency", value: approvedCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
        { label: "Overdue Documents", value: overdueCount, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Compliance & Regulatory Reporting</h1>
                    <p className="text-muted-foreground">
                        God-Tier monitoring of PROPER, SIMPEL, and RKL-RPL statutory obligations.
                    </p>
                </div>
                <div className="flex gap-2">
                    <TestRemindersButton />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm font-semibold">
                                <Send className="mr-2 h-4 w-4" />
                                File New Submission
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-indigo-700 text-xl flex items-center gap-2">
                                    <FileSpreadsheet className="h-5 w-5" />
                                    Environmental Due Diligence Entry
                                </DialogTitle>
                                <DialogDescription>
                                    Accurately record RKL-RPL / PROPER regulatory evidence to maintain 'BLUE' status.
                                </DialogDescription>
                            </DialogHeader>
                            <ComplianceForm />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Regulatory Advisory Section */}
            {overdueCount > 0 && (
                <div className="bg-red-600 text-white p-4 rounded-xl shadow-md flex items-start justify-between gap-4 animate-in slide-in-from-top-4">
                    <div className="flex items-start gap-4">
                        <FileWarning className="h-8 w-8 mt-1 shrink-0 text-red-100" />
                        <div>
                            <h3 className="font-bold text-lg">CRITICAL RED FLAG: {overdueCount} Overdue Submissions</h3>
                            <p className="text-red-100 mt-1">
                                You have {overdueCount} environmental reports that have breached their statutory deadline (e.g., PP 22/2021). Immediate submission to the KLHK portal is required to avoid administrative sanctions.
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        className="bg-white text-red-700 hover:bg-red-50"
                        onClick={() => handleDonutClick("Overdue")} // Wire up the action button too!
                    >
                        Resolve Now
                    </Button>
                </div>
            )}

            {overdueCount === 0 && upcomingDeadlines.length > 0 && (
                <div className="bg-amber-500 text-amber-950 p-4 rounded-xl shadow-md flex items-start gap-4">
                    <CalendarCheck className="h-8 w-8 mt-1 shrink-0" />
                    <div>
                        <h3 className="font-bold text-lg">Action Required: {upcomingDeadlines.length} Upcoming Deadlines</h3>
                        <p className="text-amber-900 mt-1">
                            Semester 1 RKL-RPL or other crucial deadlines are approaching within the next 14 days. Ensure field data is collected and verified.
                        </p>
                    </div>
                </div>
            )}

            {/* Top Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-semibold text-slate-600">{stat.label}</p>
                                <div className={`${stat.bg} p-2.5 rounded-xl shadow-sm border border-white/50`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <div className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</div>
                                <div className="text-sm font-medium text-slate-500">Documents</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Asymmetrical "God-Tier" Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Visualizations Column (2/3 width) */}
                <div className="lg:col-span-2 space-y-6 flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                        <ComplianceRadar />
                        <ComplianceDonut
                            pending={pendingCount}
                            submitted={submittedCount}
                            approved={approvedCount}
                            overdue={overdueCount}
                            onSegmentClick={handleDonutClick}
                        />
                    </div>
                </div>

                {/* Scorecard Column (1/3 width) */}
                <div className="lg:col-span-1 flex flex-col">
                    <Card className="h-full border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-3 border-b bg-slate-50">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                <CardTitle className="text-lg font-bold">SIMPEL Integration Link</CardTitle>
                            </div>
                            <CardDescription>Live sync with State Environmental Portal</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-emerald-800 text-sm">PROPER Peringkat</span>
                                    <Badge className="bg-blue-600 hover:bg-blue-700 shadow-sm border-0 font-bold tracking-widest text-white">BIRU</Badge>
                                </div>
                                <div className="text-xs text-emerald-700/80">Projected 2024-2025 Cycle</div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-slate-400" /> API Heartbeat
                                    </span>
                                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">Healthy: 24ms</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-slate-400" /> Last Sync
                                    </span>
                                    <span className="text-sm font-semibold text-slate-700 font-mono">Just Now</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-slate-400" /> Auth Token
                                    </span>
                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono border">Valid (90d)</span>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full mt-4 border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
                                Force Manual Sync
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bottom Row: Full width heatmap and table */}
            <ComplianceHeatmap reports={reports} />

            <div id="data-table">
                {/* Passed state down into ComplianceClient */}
                <ComplianceClient reports={reports} initialFilterStatus={activeFilterStatus} />
            </div>
        </div>
    )
}
