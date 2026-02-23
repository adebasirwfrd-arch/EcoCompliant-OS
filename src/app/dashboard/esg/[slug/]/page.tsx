import { EsgAssessmentStepper } from "@/components/shared/esg-assessment-stepper";

export default function EsgDatasetDetailPage({ params }: { params: { slug: string } }) {
    return (
        <main className="min-h-screen bg-slate-50">
            <EsgAssessmentStepper datasetSlug={params.slug} />
        </main>
    );
}
