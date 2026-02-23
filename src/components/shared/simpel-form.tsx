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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { upsertSimpelRecord } from "@/app/actions/environmental"
import { Loader2, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"

const formSchema = z.object({
    properRating: z.enum(["GOLD", "GREEN", "BLUE", "RED", "BLACK"]),
    waterStatus: z.enum(["Compliant", "Non-Compliant", "N/A"]),
    airStatus: z.enum(["Compliant", "Non-Compliant", "N/A"]),
    wasteStatus: z.enum(["Compliant", "Non-Compliant", "N/A"]),
})

type SimpelFormValues = z.infer<typeof formSchema>

interface SimpelIntegrationFormProps {
    reportId: string
    initialData?: any
}

export function SimpelIntegrationForm({ reportId, initialData }: SimpelIntegrationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<SimpelFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            properRating: initialData?.properRating || "BLUE",
            waterStatus: initialData?.waterStatus || "Compliant",
            airStatus: initialData?.airStatus || "Compliant",
            wasteStatus: initialData?.wasteStatus || "Compliant",
        },
    })

    async function onSubmit(values: SimpelFormValues) {
        setIsSubmitting(true)
        try {
            await upsertSimpelRecord({
                id: initialData?.id,
                reportId,
                ...values,
                lastSyncDate: new Date(),
            })
            toast.success("SIMPEL record updated successfully")
        } catch (error) {
            console.error(error)
            toast.error("Failed to update SIMPEL record")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="border-t-4 border-t-emerald-500">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">SIMPEL KLHK Integration</CardTitle>
                        <CardDescription>Manage environmental portal synchronization and PROPER status</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Syncing with KLHK portal...")}>
                        <RefreshCw className="h-3.5 w-3.5" />
                        Sync Now
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="properRating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PROPER Rating (Predicted)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select rating" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="GOLD" className="text-yellow-600 font-bold">GOLD</SelectItem>
                                                <SelectItem value="GREEN" className="text-emerald-600 font-bold">GREEN</SelectItem>
                                                <SelectItem value="BLUE" className="text-blue-600 font-bold">BLUE</SelectItem>
                                                <SelectItem value="RED" className="text-red-600 font-bold">RED</SelectItem>
                                                <SelectItem value="BLACK" className="text-slate-900 font-bold">BLACK</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="waterStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Wastewater Compliance (PPA)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Compliant">Compliant</SelectItem>
                                                <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                                                <SelectItem value="N/A">N/A</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="airStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Emission Compliance (PPU)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Compliant">Compliant</SelectItem>
                                                <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                                                <SelectItem value="N/A">N/A</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="wasteStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>B3 Waste Compliance (PLB3)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Compliant">Compliant</SelectItem>
                                                <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                                                <SelectItem value="N/A">N/A</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
                            {initialData?.lastSyncDate ? (
                                <><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Last synchronized on {new Date(initialData.lastSyncDate).toLocaleString()}</>
                            ) : (
                                <><AlertCircle className="h-3 w-3 text-amber-500" /> Never synchronized with central portal</>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save SIMPEL Data
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
