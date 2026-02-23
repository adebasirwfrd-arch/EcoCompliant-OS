import { db } from "@/db"
import { BatteryWarning, AlertTriangle, PlusCircle, Droplets, UserCheck, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PopalCard } from "@/components/shared/popal-card"
import { WastewaterHeatmap } from "@/components/shared/wastewater-heatmap"
import { WastewaterCharts } from "@/components/shared/wastewater-charts"
import { WastewaterClient } from "@/components/shared/wastewater-client"
import { WastewaterForm } from "@/components/shared/wastewater-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default async function WastewaterPage() {
    // 1. Fetch POPAL profiles - get the active one
    const popals = await db.query.popalProfiles.findMany({
        orderBy: (p, { desc }) => [desc(p.validityStart)]
    });
    const activePopal = popals.find(p => p.status === 'active' && new Date(p.validityEnd) > new Date()) || popals[0] || null;

    // 2. Fetch Wastewater / SPARING Logs
    const logs = await db.query.wastewaterLogs.findMany({
        orderBy: (l, { desc }) => [desc(l.logDate)]
    });

    const recentLogs = logs.slice(0, 30); // Last 30 days for immediate advisory
    const today = new Date();

    // Auto-Advisory Logic
    const violationCount = recentLogs.filter(l => l.isViolation).length;
    let advisoryAlert = null;

    if (violationCount > 0) {
        if (violationCount >= 3) {
            advisoryAlert = (
                <div className="bg-red-600 text-white p-4 rounded-lg shadow-md mb-6 flex items-start gap-4 animate-in slide-in-from-top-4">
                    <ShieldAlert className="h-8 w-8 mt-1 shrink-0" />
                    <div>
                        <h3 className="font-bold text-lg">CRITICAL: Multiple BMAL Violations Detected</h3>
                        <p className="text-red-100 mt-1 shadow-sm">
                            The IPAL system has recorded {violationCount} violations in the last 30 days. Immediate corrective action is legally required under PP 22/2021. Review the SPARING logs immediately.
                        </p>
                    </div>
                </div>
            )
        } else {
            advisoryAlert = (
                <div className="bg-amber-500 text-amber-950 p-4 rounded-lg shadow-md mb-6 flex items-start gap-4">
                    <AlertTriangle className="h-8 w-8 mt-1 shrink-0" />
                    <div>
                        <h3 className="font-bold text-lg">Warning: Recent Parameter Exceedance</h3>
                        <p className="text-amber-900 mt-1">
                            An anomaly was detected exceeding Regulatory limits. Please verify the automated SPARING records against lab test results.
                        </p>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Wastewater (IPAL) & POPAL</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Droplets className="h-4 w-4" />
                        Manage IPAL BMAL compliance, daily SPARING logs, and certified POPAL operators.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm font-semibold">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Record SPARING Data
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-xl text-blue-700">
                                    <Droplets className="h-5 w-5" />
                                    Input Daily IPAL Log
                                </DialogTitle>
                                <DialogDescription>
                                    Record daily output parameter limits. Input values will be cross-checked with BMAL regulations in real-time.
                                </DialogDescription>
                            </DialogHeader>
                            <WastewaterForm activePopalId={activePopal?.id} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {advisoryAlert}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <PopalCard profile={activePopal} violationCount={violationCount} />
                </div>

                <div className="lg:col-span-3">
                    <WastewaterCharts logs={recentLogs} />
                </div>
            </div>

            <WastewaterHeatmap logs={logs} />
            <WastewaterClient logs={logs} />
        </div>
    )
}
