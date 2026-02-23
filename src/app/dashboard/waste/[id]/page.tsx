import { db } from "@/db"
import { wasteManifests } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Trash2, Calendar, Truck, ArrowLeft, Download, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default async function WasteDetailPage({ params }: { params: { id: string } }) {
    const wasteId = (await params).id;
    const waste = await db.query.wasteManifests.findFirst({
        where: eq(wasteManifests.id, wasteId)
    });

    if (!waste) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/waste">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Manifest: {waste.manifestNumber}</h1>
                    <p className="text-muted-foreground">{waste.wasteType} Tracking</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Manifest Metadata</CardTitle>
                            <Badge variant={waste.status === 'stored' ? 'secondary' : 'default'}>
                                {(waste.status ?? 'stored').toUpperCase()}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Generated On</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                    <span>{new Date(waste.generatorDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Total Weight</p>
                                <div className="flex items-center gap-2">
                                    <Trash2 className="h-4 w-4 text-orange-500" />
                                    <span>{waste.weight} {waste.unit}</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <h3 className="font-semibold">Description</h3>
                            <p className="text-sm text-muted-foreground">
                                This item represents a batch of {waste.wasteType} (Code: BXXX) processed at the Main Facility.
                                Current location: TPS Block A-1.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className={waste.status === 'stored' ? 'border-orange-200 bg-orange-50' : ''}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                                Storage Limit Warning
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground mb-4">
                                B3 waste must be disposed of within 90 days.
                            </p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold">42</span>
                                <span className="text-sm text-muted-foreground">/ 90 Days</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Digital Festronik</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
