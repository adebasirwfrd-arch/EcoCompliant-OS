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
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { upsertPROPERAssessment } from "@/app/actions/proper"
import { Card, CardContent } from "@/components/ui/card"

const properFormSchema = z.object({
    id: z.string().optional(),
    year: z.coerce.number().min(2000).max(2100),
    status: z.enum(["Draft", "Self-Assessed", "Verified", "Final"]).default("Draft"),
})

type ProperFormValues = z.infer<typeof properFormSchema>

export function ProperAssessmentForm({
    initialData,
    onSuccess
}: {
    initialData?: any,
    onSuccess?: () => void
}) {
    const [loading, setLoading] = useState(false)

    const form = useForm<ProperFormValues>({
        resolver: zodResolver(properFormSchema) as any,
        defaultValues: {
            id: initialData?.id,
            year: initialData?.year || new Date().getFullYear(),
            status: initialData?.status || "Draft",
        }
    })

    async function onSubmit(values: ProperFormValues) {
        setLoading(true)
        try {
            const result = await upsertPROPERAssessment(values)
            if (result.success) {
                toast.success("Assessment saved successfully", {
                    description: `Period ${values.year} has been updated.`
                })
                onSuccess?.()
            }
        } catch (error) {
            toast.error("Failed to save assessment")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
                <Card className="border-none shadow-none bg-transparent">
                    <CardContent className="p-0 space-y-4">
                        <FormField
                            control={form.control}
                            name="year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase text-slate-500">Assessment Year</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} className="h-11 border-slate-200 focus:ring-blue-500" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase text-slate-500">Current Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 border-slate-200">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Draft">Draft</SelectItem>
                                            <SelectItem value="Self-Assessed">Self-Assessed</SelectItem>
                                            <SelectItem value="Verified">Verified</SelectItem>
                                            <SelectItem value="Final">Final</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11 font-bold shadow-lg shadow-blue-100" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData?.id ? "Update Period" : "Initialize Period"}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
