import { db } from "@/db"
import { amdalMilestones } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"

export default async function AmdalDetailPage({ params }: { params: { id: string } }) {
    const milestoneId = (await params).id;
    const milestone = await db.query.amdalMilestones.findFirst({
        where: eq(amdalMilestones.id, milestoneId)
    });

    if (!milestone) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/amdal">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">{milestone.title}</h1>
                    <p className="text-muted-foreground">AMDAL Project Lifecycle Milestone</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Milestone Status</CardTitle>
                            <Badge variant={milestone.status === 'Completed' ? 'default' : 'secondary'}>
                                {milestone.status}
                            </Badge>
                        </div>
                        <CardDescription>
                            Current progress and technical review status for this AMDAL phase.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Phase Progress</span>
                                <span className="font-bold">{milestone.progress}%</span>
                            </div>
                            <Progress value={milestone.progress ?? 0} className="h-2" />
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold">Description</h3>
                            <p className="text-sm text-muted-foreground">
                                {milestone.description ?? "This phase involves the formal technical review of the environmental impact assessment documents by the KLHK/Regional environmental board."}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Related Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm border p-2 rounded hover:bg-slate-50 cursor-pointer">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span>Technical_Report_Draft.pdf</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm border p-2 rounded hover:bg-slate-50 cursor-pointer">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span>Minutes_of_Meeting_Siding.docx</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
