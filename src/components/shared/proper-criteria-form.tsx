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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { upsertPROPERCriteria } from "@/app/actions/proper"

const criteriaFormSchema = z.object({
    id: z.string().optional(),
    assessmentId: z.string().min(1, "Assessment ID is required"),
    category: z.enum(["Air", "Water", "B3 Waste", "Land", "Energy", "Biodiversity", "Global Warming"]),
    parameter: z.string().min(3, "Parameter name is required"),
    fulfillment: z.enum(["Yes", "No", "N/A"]),
    score: z.coerce.number().min(0).max(100),
    evidenceUrl: z.string().optional(),
    remarks: z.string().optional(),
})

type CriteriaFormValues = z.infer<typeof criteriaFormSchema>

export function PROPERCriteriaForm({
    assessmentId,
    initialData,
    onSuccess
}: {
    assessmentId: string,
    initialData?: any,
    onSuccess?: () => void
}) {
    const [loading, setLoading] = useState(false)

    const form = useForm<CriteriaFormValues>({
        resolver: zodResolver(criteriaFormSchema) as any,
        defaultValues: {
            id: initialData?.id,
            assessmentId: assessmentId,
            category: initialData?.category || "Air",
            parameter: initialData?.parameter || "",
            fulfillment: initialData?.fulfillment || "No",
            score: initialData?.score || 0,
            evidenceUrl: initialData?.evidenceUrl || "",
            remarks: initialData?.remarks || "",
        }
    })

    async function onSubmit(values: CriteriaFormValues) {
        setLoading(true)
        try {
            await upsertPROPERCriteria(values)
            toast.success("Criteria updated", {
                description: `${values.parameter} has been saved.`
            })
            onSuccess?.()
        } catch (error) {
            toast.error("Failed to save criteria")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-400">Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-10 border-slate-200">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {["Air", "Water", "B3 Waste", "Land", "Energy", "Biodiversity", "Global Warming"].map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fulfillment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-400">Fulfillment</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-10 border-slate-200">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Yes">Yes (Taat)</SelectItem>
                                        <SelectItem value="No">No (Tidak Taat)</SelectItem>
                                        <SelectItem value="N/A">N/A</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="parameter"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase text-slate-400">Parameter Name</FormLabel>
                            <FormControl>
                                <Input {...field} className="h-10 border-slate-200" placeholder="e.g. Izin Pembuangan Air Limbah" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="score"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase text-slate-400">Score (%)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} className="h-10 border-slate-200" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="evidenceUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase text-slate-400">Evidence Link</FormLabel>
                            <FormControl>
                                <Input {...field} className="h-10 border-slate-200" placeholder="https://..." />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase text-slate-400">Remarks</FormLabel>
                            <FormControl>
                                <Textarea {...field} className="border-slate-200 resize-none" rows={3} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800 h-11 font-bold shadow-lg" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Criteria
                </Button>
            </form>
        </Form>
    )
}
