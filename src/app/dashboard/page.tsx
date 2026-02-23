import { getDashboardStats } from "@/app/actions/dashboard"
import { DashboardClient } from "@/components/shared/dashboard-client"

export default async function DashboardOverview() {
    const stats = await getDashboardStats();

    if (!stats) {
        return (
            <div className="flex h-[400px] items-center justify-center rounded-3xl border border-dashed text-slate-500">
                Failed to load enterprise metrics. Please try again later.
            </div>
        )
    }

    return <DashboardClient stats={stats} />
}
