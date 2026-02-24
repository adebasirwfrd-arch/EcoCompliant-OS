"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Save, CheckCircle2, AlertCircle, Info, Sparkles, Trophy, Loader2 } from "lucide-react"
import { createEsgAssessment } from "@/app/actions/esg"
import { toast } from "sonner"

interface EsgAssessmentStepperProps {
    datasetSlug: string
    onComplete?: () => void
}

export function EsgAssessmentStepper({ datasetSlug, onComplete }: EsgAssessmentStepperProps) {
    const router = useRouter()
    const standard: any = { sections: [] } // Mocked until GRI data structure fully typed
    const [currentStep, setCurrentStep] = useState(0)
    const [responses, setResponses] = useState<Record<string, any>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!standard) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <AlertCircle className="h-12 w-12 text-slate-700" />
                <h3 className="text-xl font-black text-white">Standard Not Found</h3>
                <p className="text-slate-500 font-medium">This dataset assessment module is coming soon.</p>
                <Button onClick={() => router.back()} variant="outline" className="rounded-xl border-slate-800 text-slate-400">Go Back</Button>
            </div>
        )
    }

    const sections = standard?.sections || []
    const currentSection = sections[currentStep]
    const totalSteps = sections.length

    if (sections.length === 0 || !currentSection) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <AlertCircle className="h-12 w-12 text-slate-700" />
                <h3 className="text-xl font-black text-white">Assessment Sections Not Available</h3>
                <p className="text-slate-500 font-medium">No assessment content found for this module.</p>
                <Button onClick={() => router.back()} variant="outline" className="rounded-xl border-slate-800 text-slate-400">Go Back</Button>
            </div>
        )
    }

    // Calculate Score
    const currentScore = useMemo(() => {
        let score = 0
        sections.forEach((section: any) => {
            section.questions.forEach((q: any) => {
                const answer = responses[q.id]
                if (q.type === "boolean" && answer === true) {
                    score += q.points
                }
            })
        })
        return score
    }, [responses, sections])

    const maxScore = useMemo(() => {
        let max = 0
        sections.forEach((section: any) => {
            section.questions.forEach((q: any) => max += q.points)
        })
        return max
    }, [sections])

    const scorePercentage = Math.round((currentScore / maxScore) * 100) || 0
    const currentMaturity = { name: "Initial", description: "Getting Started", range: [0, 20] } // Mock default

    const handleAnswer = (questionId: string, value: any) => {
        setResponses(prev => ({ ...prev, [questionId]: value }))
    }

    const nextStep = () => {
        if (currentStep < totalSteps - 1) setCurrentStep(prev => prev + 1)
    }

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1)
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const result = await createEsgAssessment({
                title: `${datasetSlug} Assessment`,
                companyName: "Default Comp",
                sector: "Default Sector",
                picEmail: "admin@example.com",
                picName: "Admin User",
                year: 2026
            })

            if (result.success) {
                toast.success("Assessment Saved", {
                    description: `Score: ${scorePercentage}%. Maturity: ${currentMaturity?.name}`,
                })
                if (onComplete) onComplete()
                else router.push("/dashboard/esg")
            } else {
                throw new Error(result.error)
            }
        } catch (error) {
            toast.error("Error", {
                description: "Failed to save assessment. Please try again.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto py-16 px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Left: Score Card & Progress */}
                <div className="lg:col-span-1 space-y-8">
                    <Card className="bg-[#0B0F1A] border border-slate-900 shadow-2xl rounded-[40px] p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20">
                            <Sparkles className="h-10 w-10 text-emerald-400" />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Maturity Performance</h4>
                                <div className="text-7xl font-black text-emerald-500 tracking-tighter">{scorePercentage}%</div>
                            </div>

                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                    <Trophy className="h-3.5 w-3.5" /> {currentMaturity?.name} Level
                                </div>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{currentMaturity?.description}</p>
                            </div>

                            <div className="pt-6 border-t border-slate-800 space-y-4">
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <span>Section Progress</span>
                                    <span>{currentStep + 1} / {totalSteps}</span>
                                </div>
                                <div className="flex gap-1.5">
                                    {sections.map((_: any, i: number) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? "bg-emerald-500" : "bg-slate-800"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-[#0B0F1A] border border-slate-900 shadow-sm rounded-[32px] p-8 space-y-4 text-white">
                        <div className="inline-flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest">
                            <Info className="h-4 w-4 text-emerald-500" /> Compliance Notes
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Questions are aligned with <span className="text-emerald-500 font-bold">GRI 305</span> and <span className="text-emerald-500 font-bold">TCFD</span> requirements.
                            Ensure you have evidence for all positive responses.
                        </p>
                    </Card>
                </div>

                {/* Right: Question Area */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-white tracking-tighter leading-tight">
                            {currentSection.title}
                        </h2>
                        <div className="h-1 w-20 bg-emerald-500 rounded-full" />
                    </div>

                    <div className="space-y-6">
                        {currentSection?.questions?.map((q: any) => (
                            <Card key={q.id} className="p-10 bg-[#0B0F1A] border border-slate-900 rounded-[32px] shadow-sm hover:border-emerald-500/30 transition-all group">
                                <div className="space-y-8">
                                    <div className="flex justify-between items-start gap-6">
                                        <div className="space-y-3">
                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 border-emerald-500/20 bg-emerald-500/5">
                                                {q.reference}
                                            </Badge>
                                            <p className="text-xl font-bold text-white leading-tight">{q.text}</p>
                                        </div>
                                        <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest pt-1">
                                            {q.points} PTS
                                        </div>
                                    </div>

                                    {q.type === "boolean" && (
                                        <div className="flex gap-4">
                                            <Button
                                                onClick={() => handleAnswer(q.id, true)}
                                                className={`flex-1 h-20 rounded-[20px] font-black text-xs uppercase tracking-[0.2em] border-2 transition-all duration-300 ${responses[q.id] === true
                                                    ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                                                    : "bg-transparent border-slate-800 text-slate-500 hover:border-slate-700 hover:text-white"
                                                    }`}
                                            >
                                                {responses[q.id] === true && <CheckCircle2 className="h-4 w-4 mr-2" />}
                                                Compliant
                                            </Button>
                                            <Button
                                                onClick={() => handleAnswer(q.id, false)}
                                                className={`flex-1 h-20 rounded-[20px] font-black text-xs uppercase tracking-[0.2em] border-2 transition-all duration-300 ${responses[q.id] === false
                                                    ? "bg-slate-800 border-slate-700 text-white"
                                                    : "bg-transparent border-slate-800 text-slate-500 hover:border-slate-700 hover:text-white"
                                                    }`}
                                            >
                                                Non-Compliant
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-10 border-t border-slate-900">
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="rounded-xl h-12 px-8 font-bold text-xs uppercase tracking-widest border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900"
                        >
                            Previous
                        </Button>

                        {currentStep < totalSteps - 1 ? (
                            <Button
                                onClick={nextStep}
                                className="bg-white text-black hover:bg-slate-200 rounded-xl h-12 px-8 font-bold text-xs uppercase tracking-widest shadow-xl"
                            >
                                Next Section
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 px-8 font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {isSubmitting ? "Saving..." : "Submit Assessment"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
