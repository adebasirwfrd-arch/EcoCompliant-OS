import { db } from "@/db"
import { waterQualityLogs } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Calendar, ShieldAlert } from "lucide-react"
import Link from "next/link"

export default async function WastewaterDetailPage({ params }: { params: { id: string } }) {
    const id = (await params).id;
    const log = await db.query.waterQualityLogs.findFirst({
        where: eq(waterQualityLogs.id, id)
    });

    if (!log) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/wastewater">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Log Entry: {log.id}</h1>
                    <p className="text-muted-foreground">IPAL Monitoring Record</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Reading Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Parameter</span>
                            <span className="font-bold">pH Level</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Value</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-xl font-bold ${log.isViolation ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {log.value} {log.unit}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant={log.isViolation ? "destructive" : "default"}>
                                {log.isViolation ? "OUT OF RANGE" : "IN COMPLIANCE"}
                            </Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Timestamp</span>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-orange-500" />
                            Technical Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {log.isViolation
                                ? "Automatic notification sent to shift supervisor. Calibrating SPARING sensors. Checking chemical dosing pumps for potential failure."
                                : "Reading within normal range. Sensors verified and calibrated. Effluent flow is stable."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
