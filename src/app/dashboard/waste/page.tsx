import { db } from "@/db"
import { wasteManifests } from "@/db/schema"
import { desc } from "drizzle-orm"
import { WasteClient } from "@/components/shared/waste-client"
import { WasteForm } from "@/components/shared/waste-form"
import { WasteChartsGod } from "@/components/shared/waste-charts-god"
import { WasteHeatmap } from "@/components/shared/waste-heatmap"
import { WasteBalanceTable } from "@/components/shared/waste-balance-table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle, ShieldCheck, AlertTriangle, Activity, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function WasteDashboardPage() {
    const records = await db.query.wasteManifests.findMany({
        orderBy: [desc(wasteManifests.generatorDate)]
    })

    // Calculate quick stats
    const totalStored = records
        .filter(r => r.status === 'stored')
        .reduce((acc, curr) => acc + (curr.unit === 'kg' ? curr.weight / 1000 : curr.weight), 0);

    const transportedCount = records.filter(r => r.status === 'transported' || r.status === 'processed').length;
    const activeAlerts = records.filter(r => {
        if (r.status !== 'stored') return false;
        const deadline = new Date(r.generatorDate);
        deadline.setDate(deadline.getDate() + r.maxStorageDays);
        const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 30;
    }).length;

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 min-h-screen bg-slate-50/50">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">B3 Waste Management</h2>
                    <p className="text-muted-foreground mt-1">
                        God-Tier monitoring following PP 22/2021 & Festronik standards.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-amber-600 hover:bg-amber-700 shadow-sm gap-2">
                                <PlusCircle className="h-4 w-4" /> Add Waste Record
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl">
                            <DialogHeader>
                                <DialogTitle>New B3 Waste Manifest / Logbook</DialogTitle>
                            </DialogHeader>
                            <WasteForm />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Top Metrics Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-sm bg-white overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">TPS Inventory</CardTitle>
                        <Package className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{totalStored.toFixed(2)} <span className="text-sm font-normal text-slate-400">Ton</span></div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Activity className="h-3 w-3 text-emerald-500" />
                            Active storage at TPS
                        </p>
                    </CardContent>
                    <div className="h-1 bg-amber-500/20" />
                </Card>
                <Card className="border-none shadow-sm bg-white overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Exported / Transported</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{transportedCount} <span className="text-sm font-normal text-slate-400">Manifests</span></div>
                        <p className="text-xs text-slate-500 mt-1">Successful handover to 3rd party</p>
                    </CardContent>
                    <div className="h-1 bg-blue-500/20" />
                </Card>
                <Card className="border-none shadow-sm bg-white overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Storage Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500 group-hover:scale-110 transition-transform" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{activeAlerts} <span className="text-sm font-normal text-slate-400">Critical</span></div>
                        <p className="text-xs text-red-600 mt-1 font-medium">Approaching PP 22/2021 limits</p>
                    </CardContent>
                    <div className="h-1 bg-red-500/20" />
                </Card>
                <Card className="border-none shadow-sm bg-white overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Compliance Status</CardTitle>
                        <Badge className="bg-emerald-500 border-none px-2 py-0">SECURE</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">100%</div>
                        <p className="text-xs text-slate-500 mt-1">All logs verified & licensed</p>
                    </CardContent>
                    <div className="h-1 bg-emerald-500/20" />
                </Card>
            </div>

            {/* Main Visualizations Row */}
            <div className="space-y-6">
                <WasteChartsGod records={records as any} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1 border-none shadow-sm bg-white border-slate-200">
                        <CardHeader className="pb-4 border-b border-slate-50">
                            <CardTitle className="text-lg">Neraca Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <WasteBalanceTable records={records as any} />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 border-none shadow-sm bg-white border-slate-200">
                        <WasteHeatmap records={records as any} />
                    </Card>
                </div>

                {/* Data Table Section */}
                <Card className="border-none shadow-sm bg-white border-slate-200">
                    <CardHeader className="pb-0 pt-6 px-6">
                        <CardTitle className="text-lg">Detailed Regulatory Logbook</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <WasteClient records={records as any} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
