import { db } from "@/db"
import { properAssessments, properInventory, properBeyondCompliance } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ShieldCheck, TrendingUp, Award, ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

export default async function ProperDetailPage({ params }: { params: { id: string } }) {
    const assessment = await db.query.properAssessments.findFirst({
        where: eq(properAssessments.id, params.id),
        with: {
            inventory: true,
            beyondCompliance: true
        }
    })

    if (!assessment) notFound()

    const ratingColors = {
        GOLD: "bg-amber-400 text-amber-950",
        GREEN: "bg-emerald-500 text-white",
        BLUE: "bg-blue-500 text-white",
        RED: "bg-red-500 text-white",
        BLACK: "bg-slate-900 text-white",
    }

    const inventoryItems = [
        { label: "Water Quality", value: assessment.inventory?.waterQualityScore || 0, icon: <CheckCircle2 className="h-4 w-4 text-blue-500" /> },
        { label: "Air Quality", value: assessment.inventory?.airQualityScore || 0, icon: <CheckCircle2 className="h-4 w-4 text-sky-500" /> },
        { label: "B3 Waste Management", value: assessment.inventory?.hazardousWasteScore || 0, icon: <CheckCircle2 className="h-4 w-4 text-amber-600" /> },
        { label: "Land & Biodiversity", value: assessment.inventory?.landQualityScore || 0, icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" /> },
    ]

    const innovationItems = [
        { label: "Energy Efficiency", value: assessment.beyondCompliance?.energyEfficiencyScore || 0 },
        { label: "Water Conservation", value: assessment.beyondCompliance?.waterConservationScore || 0 },
        { label: "Social Innovation (CSR)", value: assessment.beyondCompliance?.socialInnovationScore || 0 },
        { label: "Emission Reduction", value: assessment.beyondCompliance?.emissionReductionScore || 0 },
    ]

    return (
        <div className="flex-1 space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/proper"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">PROPER Analysis {assessment.year}</h1>
                    <p className="text-sm text-slate-500">Predicted performace based on internal self-assessment metrics.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                    Compliance Inventory (Aspek Biru)
                                </CardTitle>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                    Status: {assessment.inventory?.complianceLevel}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            {inventoryItems.map((item) => (
                                <div key={item.label} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-2 font-medium text-slate-700">
                                            {item.icon}
                                            {item.label}
                                        </div>
                                        <span className="text-sm font-bold text-slate-900">{item.value}%</span>
                                    </div>
                                    <Progress value={item.value} className="h-2 bg-slate-100" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-amber-500" />
                                Innovation & Beyond Compliance (Aspek Hijau/Emas)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {innovationItems.map((item) => (
                                    <div key={item.label} className="space-y-3 p-4 bg-slate-50 rounded-xl">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-semibold text-slate-600">{item.label}</span>
                                            <Badge variant="outline" className="bg-white border-slate-200">{item.value}/100</Badge>
                                        </div>
                                        <div className="flex gap-1 h-2">
                                            {[...Array(10)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex-1 rounded-sm ${i < item.value / 10 ? 'bg-amber-500' : 'bg-slate-200'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className={`border-none shadow-xl ${ratingColors[assessment.predictedRating as keyof typeof ratingColors]}`}>
                        <CardContent className="p-8 text-center flex flex-col items-center gap-4">
                            <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Predicted Rating</span>
                            <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/30">
                                <Award className="h-12 w-12" />
                            </div>
                            <div className="text-4xl font-black">{assessment.predictedRating}</div>
                            <p className="text-xs opacity-90 px-4">
                                {assessment.predictedRating === 'GOLD' || assessment.predictedRating === 'GREEN'
                                    ? "Excellent! Beyond compliance criteria met."
                                    : assessment.predictedRating === 'BLUE'
                                        ? "Compliant. Focused on strict adherence."
                                        : "Warning: High risk of administrative sanctions."}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                        <CardHeader><CardTitle className="text-sm">Rating Requirements</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                {assessment.inventory?.complianceLevel === 'Full' ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                                ) : (
                                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                                )}
                                <div className="space-y-1">
                                    <p className="text-sm font-bold">Full Compliance</p>
                                    <p className="text-xs text-slate-500 leading-relaxed text-balance">Must have zero violations in Water, Air, and B3 Waste aspects to transcend Biru rating.</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold">Innovation Benchmarking</p>
                                    <p className="text-xs text-slate-500 leading-relaxed text-balance">Hijau/Emas requires scores above the industry innovation baseline (typically &gt;60%).</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
