import { EsgCatalogClient } from "@/components/shared/esg-catalog-client";
import { getEsgMaturityData, getAllEsgAssessments } from "@/app/actions/esg";

export default async function EsgPage() {
    const maturityData = await getEsgMaturityData(2026); const allAssessments = await getAllEsgAssessments();

    return (
        <main>
            <EsgCatalogClient maturityData={maturityData} allAssessments={allAssessments} />
        </main>
    );
}
