"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { upsertRkabSubmission } from "@/app/actions/environmental"
import { Loader2, HardHat, DollarSign, Target, FileText } from "lucide-react"

const rkabFormSchema = z.object({
    year: z.number().min(2000).max(2100),
    productionTarget: z.number().min(0).optional(),
    salesTarget: z.number().min(0).optional(),
    explorationCost: z.number().min(0).optional(),
    environmentalBudget: z.number().min(0).optional(),
    technicalDocLink: z.string().url().optional().or(z.literal("")),
})

type RkabFormValues = z.infer<typeof rkabFormSchema>

interface RkabSubmissionFormProps {
    reportId: string
    initialData?: any
}

export function RkabSubmissionForm({ reportId, initialData }: RkabSubmissionFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<RkabFormValues>({
        resolver: zodResolver(rkabFormSchema),
        defaultValues: {
            year: initialData?.year || new Date().getFullYear() + 1,
            productionTarget: initialData?.productionTarget || 0,
            salesTarget: initialData?.salesTarget || 0,
            explorationCost: initialData?.explorationCost || 0,
            environmentalBudget: initialData?.environmentalBudget || 0,
            technicalDocLink: initialData?.technicalDocLink || "",
        },
    })

    const onFormSubmit = async (values: RkabFormValues) => {
        setIsSubmitting(true)
        try {
            await upsertRkabSubmission({
                id: initialData?.id,
                reportId,
                ...values,
            })
            toast.success("RKAB submission data saved")
        } catch (error) {
            console.error(error)
            toast.error("Failed to save RKAB data")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="border-t-4 border-t-blue-500">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <HardHat className="h-5 w-5 text-blue-500" />
                    ESDM RKAB Readiness
                </CardTitle>
                <CardDescription>Mining Activity & Budget Plan tracking for the upcoming cycle</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reporting Year (RKAB Cycle)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="productionTarget"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <Target className="h-3.5 w-3.5" />
                                            Production Target (Tons)
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="salesTarget"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <DollarSign className="h-3.5 w-3.5" />
                                            Sales Target (USD/IDR)
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="environmentalBudget"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Environmental Budget (YTD)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormDescription>Budget allocated for RKL-RPL execution</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="explorationCost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Planned Exploration Cost</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="technicalDocLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <FileText className="h-3.5 w-3.5" />
                                            Technical Document URL
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://drive.google.com/..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Finalize RKAB Entry
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
