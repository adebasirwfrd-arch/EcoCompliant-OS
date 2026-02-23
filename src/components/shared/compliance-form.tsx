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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { upsertComplianceReport, type ComplianceReportInput } from "@/app/actions/environmental"
import { toast } from "sonner"
import { Loader2, FileUp } from "lucide-react"

const formSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, "Title is required"),
    agency: z.string().min(2, "Agency is required"),
    category: z.enum(["RKAB", "SIMPEL", "RKL-RPL", "UKL-UPL", "Other"]),
    periodYear: z.string().optional(),
    periodValue: z.string().optional(),
    priority: z.enum(["Low", "Medium", "High", "Urgent"]),
    status: z.enum(["Pending", "Submitted", "Approved", "Rejected"]),
    dueDate: z.string().min(1, "Due date is required"),
    description: z.string().optional(),
    remarks: z.string().optional(),
    attachmentUrl: z.string().optional(),
    managerEmail: z.string().email("Invalid email address").min(1, "Manager email is required"),
})

type FormValues = z.infer<typeof formSchema>

export function ComplianceForm({
    onSuccess,
    initialData
}: {
    onSuccess?: () => void,
    initialData?: ComplianceReportInput
}) {
    const [loading, setLoading] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: initialData?.id || undefined,
            title: initialData?.title || "",
            agency: initialData?.agency || "KLHK",
            category: initialData?.category || "Other",
            periodYear: initialData?.periodYear ? initialData.periodYear.toString() : new Date().getFullYear().toString(),
            periodValue: initialData?.periodValue || "",
            priority: initialData?.priority || "Medium",
            status: initialData?.status || "Pending",
            dueDate: initialData?.dueDate
                ? (typeof initialData.dueDate === 'string' ? initialData.dueDate.split('T')[0] : initialData.dueDate.toISOString().split('T')[0])
                : new Date().toISOString().split('T')[0],
            description: initialData?.description || "",
            remarks: initialData?.remarks || "",
            attachmentUrl: initialData?.attachmentUrl || "",
            managerEmail: initialData?.managerEmail || "",
        },
    })

    async function onSubmit(values: FormValues) {
        setLoading(true)
        try {
            await upsertComplianceReport({
                ...values,
                periodYear: values.periodYear ? parseInt(values.periodYear) : undefined,
            })
            toast.success(values.id ? "Compliance report updated" : "Compliance report created")
            onSuccess?.()
        } catch (error) {
            toast.error("Failed to save report")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Report Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Laporan Triwulan I IPAL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="agency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Regulatory Agency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select agency" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="KLHK">KLHK</SelectItem>
                                        <SelectItem value="ESDM">ESDM</SelectItem>
                                        <SelectItem value="SKK Migas">SKK Migas</SelectItem>
                                        <SelectItem value="DLH Regional">DLH Regional</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="SIMPEL">SIMPEL (KLHK)</SelectItem>
                                        <SelectItem value="RKAB">RKAB (ESDM)</SelectItem>
                                        <SelectItem value="RKL-RPL">RKL-RPL</SelectItem>
                                        <SelectItem value="UKL-UPL">UKL-UPL</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="periodYear"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reporting Year</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="periodValue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Period (Q1/H1/Month)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Q1 or Semester 1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Due Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Submitted">Submitted</SelectItem>
                                        <SelectItem value="Approved">Approved</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description / Scope</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter report description or summary of scope..."
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="attachmentUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Attachment Link / Path</FormLabel>
                            <FormControl>
                                <div className="flex gap-2">
                                    <Input placeholder="https://docs.google.com/..." {...field} />
                                    <Button type="button" variant="outline" size="icon">
                                        <FileUp className="h-4 w-4" />
                                    </Button>
                                </div>
                            </FormControl>
                            <FormDescription>Link to SIMPEL/ESDM portal or internal drive.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="managerEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Manager Email (for Approval)</FormLabel>
                            <FormControl>
                                <Input placeholder="manager@company.com" {...field} />
                            </FormControl>
                            <FormDescription>Official approval request will be sent to this address.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData?.id ? "Update Compliance Record" : "Submit Compliance Record"}
                </Button>
            </form>
        </Form>
    )
}
