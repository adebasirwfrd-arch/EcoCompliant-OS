"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Save, Loader2 } from "lucide-react"
import { saveDisclosureAssessment } from "@/app/actions/esg"
import { toast } from "sonner"

const assessmentSchema = z.object({
    maturityScore: z.string(),
    evidenceUrl: z.string().url().optional().or(z.literal("")),
    remarks: z.string().optional(),
})

interface EsgAssessmentFormProps {
    assessmentId: string
    topicId: string
    disclosureId: string
    disclosureName: string
    reference: string
    questionText: string
    initialData?: {
        maturityScore: string
        evidenceUrl?: string
        remarks?: string
    }
    onSuccess?: () => void
}

export function EsgAssessmentForm({
    assessmentId,
    topicId,
    disclosureId,
    disclosureName,
    reference,
    questionText,
    initialData,
    onSuccess,
}: EsgAssessmentFormProps) {
    const [isSaving, setIsSaving] = React.useState(false)

    const form = useForm<z.infer<typeof assessmentSchema>>({
        resolver: zodResolver(assessmentSchema),
        defaultValues: {
            maturityScore: initialData?.maturityScore || "0",
            evidenceUrl: initialData?.evidenceUrl || "",
            remarks: initialData?.remarks || "",
        },
    })

    async function onSubmit(values: z.infer<typeof assessmentSchema>) {
        setIsSaving(true)
        try {
            const result = await saveDisclosureAssessment({
                assessmentId,
                questionId: disclosureId,
                maturityScore: parseInt(values.maturityScore),
                evidenceUrl: values.evidenceUrl,
                remarks: values.remarks
            })

            if (result.success) {
                toast.success("Assessment Saved", {
                    description: `${disclosureId} updated successfully.`
                })
                form.reset(values)
                if (onSuccess) onSuccess()
            } else {
                throw new Error(result.error)
            }
        } catch (error: any) {
            toast.error("Error Saving Assessment", {
                description: error.message || "Failed to save data. Please try again."
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Card className="border-teal-100 shadow-sm bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-teal-600 border-teal-200 bg-teal-50">
                        {reference}
                    </Badge>
                    {form.formState.isDirty && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                            Unsaved Changes
                        </Badge>
                    )}
                </div>
                <CardTitle className="text-lg font-semibold mt-2 text-slate-800">
                    {disclosureName}
                </CardTitle>
                <CardDescription className="text-slate-600">
                    {questionText}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="maturityScore"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-base font-medium text-slate-700">Maturity Level</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                        >
                                            <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                                                <FormControl>
                                                    <RadioGroupItem value="0" />
                                                </FormControl>
                                                <div className="space-y-1">
                                                    <FormLabel className="font-medium cursor-pointer">0: Not Reported</FormLabel>
                                                    <FormDescription>No disclosure or policy exists for this requirement.</FormDescription>
                                                </div>
                                            </FormItem>
                                            <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-teal-50/30 transition-colors">
                                                <FormControl>
                                                    <RadioGroupItem value="1" />
                                                </FormControl>
                                                <div className="space-y-1">
                                                    <FormLabel className="font-medium cursor-pointer text-teal-700">1: Partially Reported</FormLabel>
                                                    <FormDescription>Policy exists but data is incomplete or non-standardized.</FormDescription>
                                                </div>
                                            </FormItem>
                                            <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-cyan-50/30 transition-colors">
                                                <FormControl>
                                                    <RadioGroupItem value="2" />
                                                </FormControl>
                                                <div className="space-y-1">
                                                    <FormLabel className="font-medium cursor-pointer text-cyan-700">2: Fully Reported</FormLabel>
                                                    <FormDescription>Detailed data provided in reports but lacks external verification.</FormDescription>
                                                </div>
                                            </FormItem>
                                            <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-emerald-50/30 border-emerald-100 transition-colors">
                                                <FormControl>
                                                    <RadioGroupItem value="3" />
                                                </FormControl>
                                                <div className="space-y-1">
                                                    <FormLabel className="font-medium cursor-pointer text-emerald-700">3: Verified</FormLabel>
                                                    <FormDescription>Data and evidence provided and verified by external audit.</FormDescription>
                                                </div>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-6">
                            <FormField
                                control={form.control}
                                name="evidenceUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Evidence URL (Optional)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input placeholder="https://report.company.com/esg-2024#page=12" {...field} className="pr-10" />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <ExternalLink className="h-4 w-4 text-slate-400" />
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription>Link to public report, PDF, or internal evidence document.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="remarks"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Remarks & Justification</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Provide details on why this maturity level was chosen..."
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 border-slate-200 text-slate-500"
                                onClick={() => form.reset()}
                                disabled={isSaving || !form.formState.isDirty}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSaving || !form.formState.isDirty}
                                className="flex-[2] bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white shadow-md active:scale-[0.98] transition-transform"
                            >
                                {isSaving ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                {isSaving ? "Saving..." : "Save Assessment"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
