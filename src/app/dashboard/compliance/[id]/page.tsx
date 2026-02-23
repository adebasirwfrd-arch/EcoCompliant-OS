import { db } from "@/db"
import { complianceReports, complianceComments } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Calendar,
    ArrowLeft,
    Download,
    Send,
    Edit,
    ExternalLink,
    Clock,
    MessageSquare,
    AlertTriangle,
    Flag,
    User,
    CheckCircle2
} from "lucide-react"
import Link from "next/link"
import { EditComplianceDialog } from "@/components/shared/edit-compliance-dialog"
import { FinalizeSubmitButton } from "@/components/shared/finalize-submit-button"
import { SimpelIntegrationForm } from "@/components/shared/simpel-form"
import { RkabSubmissionForm } from "@/components/shared/rkab-form"
import { ComplianceComments } from "@/components/shared/compliance-comments"

export default async function ComplianceDetailPage({ params }: { params: { id: string } }) {
    const reportId = (await params).id;
    const report = await db.query.complianceReports.findFirst({
        where: eq(complianceReports.id, reportId),
        with: {
            simpelRecord: true,
            rkabSubmission: true,
        }
    });

    if (!report) {
        notFound();
    }

    const userEmail = "admin@env-management.app";



    const dbComments = await db.query.complianceComments.findMany({
        where: eq(complianceComments.reportId, reportId),
        orderBy: [desc(complianceComments.createdAt)],
        with: { user: true } // Need user for the email/name
    });

    // Map comments to the component's required interface, preferring user.email or user.name, falling back to userId
    const uiComments = dbComments.map(c => ({
        id: c.id,
        userId: c.user?.email || c.user?.name || c.userId,
        content: c.content,
        createdAt: c.createdAt
    }));

    const getPriorityBadge = (priority: string | null) => {
        switch (priority) {
            case 'Urgent': return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Urgent</Badge>;
            case 'High': return <Badge className="bg-orange-500 hover:bg-orange-600">High Priority</Badge>;
            case 'Medium': return <Badge className="bg-blue-500 hover:bg-blue-600">Medium Priority</Badge>;
            case 'Low': return <Badge variant="secondary">Low Priority</Badge>;
            default: return <Badge variant="outline">Normal Priority</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href="/dashboard/compliance">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">{report.title}</h1>
                            {getPriorityBadge(report.priority)}
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <Badge variant="outline">{report.agency}</Badge>
                            <span>{report.category || 'General Compliance'} Tracking</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <EditComplianceDialog report={report} />
                    <FinalizeSubmitButton
                        reportId={report.id}
                        disabled={report.status === 'Approved' || report.status === 'Submitted'}
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <div className="md:col-span-3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mandate Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Reporting Period</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-indigo-500" />
                                        <span className="font-semibold">{report.periodYear} {report.periodValue}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Deadline</p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-orange-500" />
                                        <span className="font-semibold text-orange-700">{new Date(report.dueDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={report.status === 'Approved' ? 'default' : 'secondary'}>
                                            {report.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Description & Scope</p>
                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {report.description || 'No detailed description provided for this submission.'}
                                </p>
                            </div>

                            {report.remarks && (
                                <div className="rounded-lg bg-amber-50 border border-amber-100 p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Flag className="h-4 w-4 text-amber-600" />
                                        <span className="text-sm font-semibold text-amber-900">Official Remarks</span>
                                    </div>
                                    <p className="text-sm text-amber-800 italic">&quot;{report.remarks}&quot;</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-indigo-500" />
                                Internal Review Comments
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[430px]">
                            <ComplianceComments
                                reportId={report.id}
                                initialComments={uiComments}
                                currentUserEmail={userEmail}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Evidence & Links</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {report.attachmentUrl ? (
                                <Button variant="outline" className="w-full justify-start text-indigo-600 border-indigo-200 bg-indigo-50/50" asChild>
                                    <a href={report.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        View Submission File
                                    </a>
                                </Button>
                            ) : (
                                <p className="text-xs text-muted-foreground italic px-2">No attachment link provided.</p>
                            )}
                            <Button variant="ghost" className="w-full justify-start text-slate-600" disabled>
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF Draft
                            </Button>
                        </CardContent>
                    </Card>

                    {report.category === 'SIMPEL' && (
                        <SimpelIntegrationForm
                            reportId={report.id}
                            initialData={(report as any).simpelRecord}
                        />
                    )}

                    {report.category === 'RKAB' && (
                        <RkabSubmissionForm
                            reportId={report.id}
                            initialData={(report as any).rkabSubmission}
                        />
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Compliance Checklist</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-emerald-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Input Data Validated</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-emerald-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Lab Results Attached</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Clock className="h-4 w-4" />
                                <span>Management Approval</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
