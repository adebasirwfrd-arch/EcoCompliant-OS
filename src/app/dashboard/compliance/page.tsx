import { db } from "@/db"
import { ComplianceDashboardWrapper } from "@/components/shared/compliance-dashboard-wrapper"

export default async function CompliancePage() {
    // 1. Fetch compliance data
    const reports = await db.query.complianceReports.findMany({
        orderBy: (reports, { desc }) => [desc(reports.dueDate)],
    });

    // 2. Compute Live Metrics
    const pendingCount = reports.filter(r => r.status === 'Pending').length;
    const submittedCount = reports.filter(r => r.status === 'Submitted').length;
    const approvedCount = reports.filter(r => r.status === 'Approved').length;

    // An overdue report is pending/submitted past its due date
    const today = new Date();
    const overdueCount = reports.filter(r =>
        (r.status === 'Pending' || r.status === 'Submitted') &&
        new Date(r.dueDate) < today
    ).length;

    // Fast-approaching deadlines (next 14 days)
    const upcomingDeadlines = reports.filter(r => {
        const dueDate = new Date(r.dueDate);
        const timeDiff = dueDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return (r.status === 'Pending' || r.status === 'Submitted') && daysDiff >= 0 && daysDiff <= 14;
    });

    return (
        <ComplianceDashboardWrapper
            reports={reports}
            pendingCount={pendingCount}
            submittedCount={submittedCount}
            approvedCount={approvedCount}
            overdueCount={overdueCount}
            upcomingDeadlines={upcomingDeadlines}
        />
    )
}
