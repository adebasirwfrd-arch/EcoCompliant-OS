import { db } from "@/db"
import { ISO14001Client } from "@/components/shared/iso-client"

export default async function ISO14001Page() {
    // 1. Fetch Real Data
    const aspects = await db.query.isoAspects.findMany({
        orderBy: (aspects, { desc }) => [desc(aspects.updatedAt)],
    });

    const legal = await db.query.isoLegalRegistry.findMany();
    const objectives = await db.query.isoObjectives.findMany();
    const risks = await db.query.isoRisks.findMany();
    const capa = await db.query.isoCAPA.findMany();

    // New Extended Data
    const interestedParties = await db.query.isoInterestedParties.findMany();
    const controls = await db.query.isoOperationalControls.findMany();
    const emergencyPrep = await db.query.isoEmergencyPrep.findMany();
    const monitoring = await db.query.isoPerformanceMonitoring.findMany();
    const audits = await db.query.isoInternalAudits.findMany();

    // 2. Calculate Metrics
    const significantAspects = aspects.filter(a => (a.severity * a.probability) >= 12).length;
    const openNCs = capa.filter(c => c.status === 'Open').length;

    const legalComplianceRate = legal.length > 0
        ? Math.round((legal.filter(l => l.complianceStatus === 'Compliant').length / legal.length) * 100)
        : 85; // Default for demo if empty

    const objectivesProgress = objectives.length > 0
        ? Math.round(objectives.reduce((acc, curr) => acc + (curr.progress || 0), 0) / objectives.length)
        : 75;

    // Audit Readiness Logic: Enhanced with new components
    const auditReadiness = Math.min(100, Math.round(
        (legalComplianceRate * 0.3) +
        (objectivesProgress * 0.2) +
        ((capa.length > 0 ? (capa.filter(c => c.status !== 'Open').length / capa.length) * 100 : 90) * 0.2) +
        ((audits.length > 0 ? 100 : 50) * 0.15) + // Audit programme existence
        ((controls.length > 0 ? 100 : 40) * 0.15) // Operational control coverage
    ));

    const metrics = {
        auditReadiness,
        significantAspects,
        legalComplianceRate,
        openNCs,
        objectivesProgress,
    };

    // 3. Mock Intelligence Data (Trends) - Enhanced
    const intel = {
        objectives: objectives.length > 0 ? objectives.map(o => ({
            department: o.department || "General",
            progress: o.progress || 0,
            target: o.targetValue
        })) : [
            { department: "HSE", progress: 85, target: "Waste Reduction" },
            { department: "Ops", progress: 62, target: "Energy Mix" },
            { department: "HR", progress: 100, target: "Awareness" }
        ],
        ncStatus: [
            { name: "Major NC", value: audits.reduce((acc, curr) => acc + (curr.majorNC || 0), 0) },
            { name: "Minor NC", value: audits.reduce((acc, curr) => acc + (curr.minorNC || 0), 0) },
            { name: "OFI", value: audits.reduce((acc, curr) => acc + (curr.ofi || 0), 0) },
            { name: "Closed", value: capa.filter(c => c.status !== 'Open').length || 10 },
        ],
        legalReviews: [
            { month: "Sep", reviews: 2 },
            { month: "Oct", reviews: 5 },
            { month: "Nov", reviews: 3 },
            { month: "Dec", reviews: 8 },
            { month: "Jan", reviews: 4 },
            { month: "Feb", reviews: legal.length || 6 },
        ]
    };

    return (
        <ISO14001Client
            aspects={aspects}
            legal={legal}
            objectives={objectives}
            risks={risks}
            capa={capa}
            metrics={metrics}
            intel={intel}
            interestedParties={interestedParties}
            controls={controls}
            emergencyPrep={emergencyPrep}
            monitoring={monitoring}
            audits={audits}
            strategicIssues={[]} // Logic for this table if needed
        />
    );
}
