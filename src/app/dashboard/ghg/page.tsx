import { Suspense } from "react"
import { db } from "@/db"
import { ghgEmissions } from "@/db/schema"
import { desc } from "drizzle-orm"
import { Building2, Leaf, Siren, AlertCircle } from "lucide-react"
import { GhgDonut } from "@/components/shared/ghg-donut"
import { GhgTrendChart } from "@/components/shared/ghg-trend-chart"
import { GhgHeatmap } from "@/components/shared/ghg-heatmap"
import { GhgClient } from "@/components/shared/ghg-client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default async function GHGPage() {
    // Fetch all records
    const records = await db.query.ghgEmissions.findMany({
        orderBy: [desc(ghgEmissions.date)],
    });

    const currentYear = new Date().getFullYear();
    const currentYearRecords = records.filter(r => new Date(r.date).getFullYear() === currentYear);

    // 1. Calculate Scope Totals for Donut
    const scope1Total = currentYearRecords.filter(r => r.scope === 1).reduce((acc, curr) => acc + curr.co2e, 0);
    const scope2Total = currentYearRecords.filter(r => r.scope === 2).reduce((acc, curr) => acc + curr.co2e, 0);
    const scope3Total = currentYearRecords.filter(r => r.scope === 3).reduce((acc, curr) => acc + curr.co2e, 0);
    const grandTotal = scope1Total + scope2Total + scope3Total;

    // Corporate Target limit threshold (e.g. 10000 tons/year = ~833 tons/month)
    const NET_ZERO_ANNUAL_TARGET = 10000;

    // 2. Prepare Monthly Trend Data
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trendData = monthNames.map((month, index) => {
        const monthRecords = currentYearRecords.filter(r => new Date(r.date).getMonth() === index);
        const s1 = monthRecords.filter(r => r.scope === 1).reduce((acc, curr) => acc + curr.co2e, 0);
        const s2 = monthRecords.filter(r => r.scope === 2).reduce((acc, curr) => acc + curr.co2e, 0);
        const s3 = monthRecords.filter(r => r.scope === 3).reduce((acc, curr) => acc + curr.co2e, 0);

        // Target limit spread linearly
        const target = (NET_ZERO_ANNUAL_TARGET / 12) * (index + 1);

        // Accumulated sums for Stacked Trend (or just monthly). We will do Monthly for clearer charting.
        // Wait, the line chart typically plots accumulated or monthly. Let's do Monthly totals vs Monthly Target.
        return {
            month,
            scope1: Number(s1.toFixed(2)),
            scope2: Number(s2.toFixed(2)),
            scope3: Number(s3.toFixed(2)),
            target: Number((NET_ZERO_ANNUAL_TARGET / 12).toFixed(2)) // Flat target line per month
        };
    });

    // Advisory Logic
    const isExceedingTarget = grandTotal > NET_ZERO_ANNUAL_TARGET;
    const isCloseToTarget = grandTotal > (NET_ZERO_ANNUAL_TARGET * 0.8) && !isExceedingTarget;

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 min-h-screen bg-slate-50/50">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                        <Leaf className="h-8 w-8 text-emerald-600" />
                        GHG Emissions (SRN PPI)
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">
                        Greenhouse Gas Inventory. Compliant with SIGN SMART and SRN PPI reporting standards.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <div className="p-2 bg-emerald-100 rounded-md text-emerald-600">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Corporate Entity</div>
                        <div className="font-bold text-slate-800">PT. ANTIGRAVITY MINERALS</div>
                    </div>
                </div>
            </div>

            {/* Advisory System */}
            {isExceedingTarget && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Siren className="h-5 w-5 text-red-600" />
                    <AlertTitle className="text-red-800 font-bold">Net Zero Target Exceeded</AlertTitle>
                    <AlertDescription className="text-red-700 mt-1">
                        Corporate emissions ({grandTotal.toFixed(2)} tCO2e) have exceeded the annual reduction target threshold of {NET_ZERO_ANNUAL_TARGET} tCO2e. Immediate mitigation strategies are required to avoid SRN PPI penalties.
                    </AlertDescription>
                </Alert>
            )}

            {isCloseToTarget && (
                <Alert className="bg-amber-50 border-amber-200 text-amber-800 animate-in fade-in slide-in-from-top-4">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <AlertTitle className="font-bold">Approaching Emission Threshold</AlertTitle>
                    <AlertDescription className="mt-1">
                        Current emissions ({grandTotal.toFixed(2)} tCO2e) are over 80% of the annual Corporate Net Zero target limit.
                    </AlertDescription>
                </Alert>
            )}

            {/* Top Grid: Donut + Trend Chart */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-1 h-[400px]">
                    <Suspense fallback={<div className="h-full w-full bg-slate-100 animate-pulse rounded-xl" />}>
                        <GhgDonut
                            scope1={scope1Total}
                            scope2={scope2Total}
                            scope3={scope3Total}
                        />
                    </Suspense>
                </div>
                <div className="md:col-span-2 h-[400px]">
                    <Suspense fallback={<div className="h-full w-full bg-slate-100 animate-pulse rounded-xl" />}>
                        <GhgTrendChart data={trendData} />
                    </Suspense>
                </div>
            </div>

            {/* Middle Section: Intensity Heatmap */}
            <div className="grid gap-6">
                <Suspense fallback={<div className="h-64 w-full bg-slate-100 animate-pulse rounded-xl" />}>
                    <GhgHeatmap records={records} />
                </Suspense>
            </div>

            {/* Bottom Section: Client Data Table */}
            <div className="grid gap-6">
                <Suspense fallback={<div className="h-96 w-full bg-slate-100 animate-pulse rounded-xl" />}>
                    <GhgClient initialData={records} />
                </Suspense>
            </div>
        </div>
    )
}
