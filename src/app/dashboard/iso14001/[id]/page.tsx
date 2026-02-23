import { db } from "@/db"
import { isoAudits } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ClipboardList } from "lucide-react"
import Link from "next/link"

export default async function ISOAuditDetailPage({ params }: { params: { id: string } }) {
    const id = (await params).id;
    const audit = await db.query.isoAudits.findFirst({
        where: eq(isoAudits.id, id)
    });

    if (!audit) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/iso14001">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">{audit.auditType}</h1>
                    <p className="text-muted-foreground">ISO 14001:2015 Compliance Audit</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Audit Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Audit Date</span>
                            <span className="font-bold">{new Date(audit.auditDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant={audit.status === 'Closed' ? 'default' : 'secondary'}>
                                {audit.status}
                            </Badge>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Total Findings</span>
                            <span className="font-bold text-lg">{(audit.findingsCount ?? 0)} NC/OFI</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-emerald-500" />
                            Corrective Actions (CAPA)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {(audit.findingsCount ?? 0) > 0
                                ? "Corrective action plans have been submitted for all minor non-conformities. Evidence of implementation is awaiting external auditor verification."
                                : "Zero non-conformities. Observation for improvement (OFI) recorded for waste segregation efficiency."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
