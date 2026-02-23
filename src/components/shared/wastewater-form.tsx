"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { upsertWastewaterLog } from "@/app/actions/environmental"
import { toast } from "sonner"

const formSchema = z.object({
    id: z.string().optional(),
    logDate: z.date({
        message: "A date is required.",
    }),
    phLevel: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 14, {
        message: "pH must be between 0 and 14",
    }),
    codLevel: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "COD must be a positive number",
    }),
    bodLevel: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "BOD must be a positive number",
    }),
    tssLevel: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "TSS must be a positive number",
    }),
    ammoniaLevel: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Ammonia must be a positive number",
    }),
    debitOutfall: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Debit must be a positive number",
    }),
    popalId: z.string().optional(),
    notes: z.string().optional(),
})

type WastewaterFormValues = z.infer<typeof formSchema>

export function WastewaterForm({ initialData, onSuccess, activePopalId }: { initialData?: any, onSuccess?: () => void, activePopalId?: string | null }) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<WastewaterFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: initialData?.id,
            logDate: initialData?.logDate ? new Date(initialData.logDate) : new Date(),
            phLevel: initialData?.phLevel?.toString() || "",
            codLevel: initialData?.codLevel?.toString() || "",
            bodLevel: initialData?.bodLevel?.toString() || "",
            tssLevel: initialData?.tssLevel?.toString() || "",
            ammoniaLevel: initialData?.ammoniaLevel?.toString() || "",
            debitOutfall: initialData?.debitOutfall?.toString() || "",
            popalId: initialData?.popalId || activePopalId || "",
            notes: initialData?.notes || "",
        },
    })

    // Real-time violation checker
    const watchAllFields = form.watch()
    const checkViolation = () => {
        const ph = parseFloat(watchAllFields.phLevel || "0");
        const cod = parseFloat(watchAllFields.codLevel || "0");
        const tss = parseFloat(watchAllFields.tssLevel || "0");
        // Typical BMAL: pH 6-9, COD max 100, TSS max 50
        return ph < 6 || ph > 9 || cod > 100 || tss > 50;
    }
    const isCurrentlyViolating = checkViolation();

    async function onSubmit(data: WastewaterFormValues) {
        setIsSubmitting(true)
        try {
            const isViolation = checkViolation();
            const result = await upsertWastewaterLog({
                id: data.id,
                logDate: data.logDate,
                phLevel: parseFloat(data.phLevel),
                codLevel: parseFloat(data.codLevel),
                bodLevel: parseFloat(data.bodLevel),
                tssLevel: parseFloat(data.tssLevel),
                ammoniaLevel: parseFloat(data.ammoniaLevel),
                debitOutfall: parseFloat(data.debitOutfall),
                popalId: data.popalId || null,
                notes: data.notes || null,
                isViolation
            })

            if (result.success) {
                toast.success(data.id ? "Wastewater log updated" : "Wastewater log recorded", {
                    description: isViolation ? "Warning: Recorded values exceed BMAL thresholds." : "All parameters are within safe limits."
                })
                if (!data.id) form.reset({ ...form.getValues(), phLevel: "", codLevel: "", bodLevel: "", tssLevel: "", ammoniaLevel: "", debitOutfall: "" })
                if (onSuccess) onSuccess()
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to save log")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">

                {isCurrentlyViolating && (
                    <div className="bg-red-50 text-red-800 p-3 rounded-md border border-red-200 flex items-start gap-2 text-sm shadow-sm transition-all duration-300">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        <p><strong>Warning:</strong> The current input values exceed Environmental Quality Standards (BMAL). Logging this will flag a violation.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="logDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Measurement Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="debitOutfall"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Debit Outfall (m&sup3;/day)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="e.g. 150" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border grid grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="phLevel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>pH (6.0 - 9.0)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" placeholder="7.0" {...field} className={parseFloat(field.value) < 6 || parseFloat(field.value) > 9 ? "border-red-500 bg-red-50" : ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="codLevel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>COD (mg/L)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" placeholder="Max 100" {...field} className={parseFloat(field.value) > 100 ? "border-red-500 bg-red-50" : ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bodLevel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>BOD (mg/L)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" placeholder="Max 50" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tssLevel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>TSS (mg/L)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" placeholder="Max 50" {...field} className={parseFloat(field.value) > 50 ? "border-red-500 bg-red-50" : ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ammoniaLevel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amonia (mg/L)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" placeholder="Max 1.0" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lab Notes / Remarks</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Any abnormalities during sampling?" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className={`w-full ${isCurrentlyViolating ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving SPARING Log...
                        </>
                    ) : (
                        isCurrentlyViolating ? "Warning: Save Violation Log" : "Save Compliant Log"
                    )}
                </Button>
            </form>
        </Form>
    )
}
