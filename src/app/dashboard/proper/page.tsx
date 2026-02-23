import {
    getProperAssessments,
    getProperDetailedAssessment,
    getProperCriteria,
    getProperCommunityPrograms
} from "@/app/actions/proper"
import { PROPERDashboardClient } from "@/components/shared/proper-client"

export default async function ProperDashboard() {
    const assessments = await getProperAssessments()

    // For the "God-Tier" refactor, we focus on the most recent assessment
    const latest = assessments[0]

    let criteria: any[] = []
    let comDev: any[] = []
    let detailedAssessment: any = null

    if (latest) {
        detailedAssessment = await getProperDetailedAssessment(latest.id)
        criteria = await getProperCriteria(latest.id)
        comDev = await getProperCommunityPrograms(latest.id)
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <PROPERDashboardClient
                assessments={assessments}
                currentAssessment={detailedAssessment}
                criteria={criteria}
                comDev={comDev}
            />
        </div>
    )
}
