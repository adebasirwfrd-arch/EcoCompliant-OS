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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { upsertISOAudit } from "@/app/actions/environmental"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    auditType: z.string().min(2, "Audit type is required"),
    auditDate: z.string().min(1, "Audit date is required"),
    findingsCount: z.string().min(1, "Required"),
    status: z.enum(["Scheduled", "In Progress", "Closed"]),
})

type FormValues = z.infer<typeof formSchema>

export function IsoForm({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            auditType: "Internal Audit",
            auditDate: new Date().toISOString().split('T')[0],
            findingsCount: "0",
            status: "Scheduled",
        },
    })

    async function onSubmit(values: FormValues) {
        setLoading(true)
        try {
            await upsertISOAudit(values)
            toast.success("Audit record created")
            onSuccess?.()
        } catch (error) {
            toast.error("Failed to create audit record")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="auditType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Audit Type</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. ISO 14001 External Audit" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="auditDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Audit Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="findingsCount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Findings Count (NC/OFI)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
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
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Audit Entry
                </Button>
            </form>
        </Form>
    )
}
