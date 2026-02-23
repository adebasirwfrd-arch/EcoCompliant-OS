import { DomesticWasteDashboardClient } from "@/components/shared/domestic-waste-client"
import { getWasteLogs, getWastePartners, getWasteAnalytics, getWasteSources } from "@/app/actions/domestic-waste"

export default async function DomesticWastePage() {
    const logs = await getWasteLogs()
    const partners = await getWastePartners()
    const sources = await getWasteSources()
    const analytics = await getWasteAnalytics()

    return (
        <div className="container mx-auto py-8">
            <DomesticWasteDashboardClient
                logs={logs}
                partners={partners}
                sources={sources}
                analytics={analytics}
            />
        </div>
    )
}
