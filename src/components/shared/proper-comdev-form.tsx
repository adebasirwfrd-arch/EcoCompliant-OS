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
import { upsertPROPERCommunityDev } from "@/app/actions/proper"

const comDevFormSchema = z.object({
    id: z.string().optional(),
    assessmentId: z.string().min(1, "Assessment ID is required"),
    programName: z.string().min(3, "Program name is required"),
    budget: z.coerce.number().min(0),
    beneficiaries: z.coerce.number().min(0),
    sroiScore: z.coerce.number().optional(),
    innovationType: z.enum(["Process", "Product", "Social"]).optional(),
    status: z.enum(["Planned", "Active", "Completed"]).default("Active"),
})

type ComDevFormValues = z.infer<typeof comDevFormSchema>

export function PROPERComDevForm({
    assessmentId,
    initialData,
    onSuccess
}: {
    assessmentId: string,
    initialData?: any,
    onSuccess?: () => void
}) {
    const [loading, setLoading] = useState(false)

    const form = useForm<ComDevFormValues>({
        resolver: zodResolver(comDevFormSchema) as any,
        defaultValues: {
            id: initialData?.id,
            assessmentId: assessmentId,
            programName: initialData?.programName || "",
            budget: initialData?.budget || 0,
            beneficiaries: initialData?.beneficiaries || 0,
            sroiScore: initialData?.sroiScore || 0,
            innovationType: initialData?.innovationType || "Social",
            status: initialData?.status || "Active",
        }
    })

    async function onSubmit(values: ComDevFormValues) {
        setLoading(true)
        try {
            await upsertPROPERCommunityDev(values)
            toast.success("Program saved", {
                description: `${values.programName} has been updated.`
            })
            onSuccess?.()
        } catch (error) {
            toast.error("Failed to save program")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="programName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase text-slate-400">Program Name</FormLabel>
                            <FormControl>
                                <Input {...field} className="h-10 border-slate-200" placeholder="e.g. Mangrove CSR Restoration" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-400">Budget (IDR)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} className="h-10 border-slate-200" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="beneficiaries"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-400">Beneficiaries</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} className="h-10 border-slate-200" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="sroiScore"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-400">SROI Ratio</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" {...field} className="h-10 border-slate-200" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="innovationType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-400">Innovation Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-10 border-slate-200">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Process">Process</SelectItem>
                                        <SelectItem value="Product">Product</SelectItem>
                                        <SelectItem value="Social">Social</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase text-slate-400">Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-10 border-slate-200">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Planned">Planned</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-700 h-11 font-bold shadow-lg shadow-emerald-100" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Program
                </Button>
            </form>
        </Form>
    )
}
