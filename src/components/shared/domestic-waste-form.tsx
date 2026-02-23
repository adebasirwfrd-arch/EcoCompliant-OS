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
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { upsertWasteLog } from "@/app/actions/domestic-waste"

const wasteFormSchema = z.object({
    id: z.string().optional(),
    date: z.string().or(z.date()),
    category: z.enum(["Organik", "Anorganik (Plastik)", "Anorganik (Kertas)", "Anorganik (Logam/Kaca)", "Residu"]),
    sourceId: z.string().min(1, "Source is required"),
    unit: z.enum(["kg", "m3"]),
    weight: z.coerce.number().optional(),
    volume: z.coerce.number().optional(),
    vehiclePlate: z.string().optional(),
    destinationId: z.string().optional(),
    status: z.enum(["Stored", "Transported", "Processed"]),
    notes: z.string().optional(),
}).refine(data => {
    if (data.unit === "kg" && (!data.weight || data.weight <= 0)) return false;
    if (data.unit === "m3" && (!data.volume || data.volume <= 0)) return false;
    return true;
}, {
    message: "Value must be greater than 0",
    path: ["weight"]
})

type WasteFormValues = z.infer<typeof wasteFormSchema>

export function DomesticWasteForm({
    initialData,
    partners = [],
    sources = [],
    onSuccess
}: {
    initialData?: any,
    partners?: any[],
    sources?: any[],
    onSuccess?: () => void
}) {
    const [loading, setLoading] = useState(false)

    const form = useForm<WasteFormValues>({
        resolver: zodResolver(wasteFormSchema) as any,
        defaultValues: {
            id: initialData?.id,
            date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            category: initialData?.category || "Organik",
            sourceId: initialData?.sourceId || (sources.length > 0 ? sources[0].id : ""),
            unit: initialData?.unit || "kg",
            weight: initialData?.weight || 0,
            volume: initialData?.volume || 0,
            vehiclePlate: initialData?.vehiclePlate || "",
            destinationId: initialData?.destinationId || "none",
            status: initialData?.status || "Stored",
            notes: initialData?.notes || "",
        }
    })

    const unit = form.watch("unit")

    async function onSubmit(values: WasteFormValues) {
        setLoading(true)
        try {
            const formattedValues = {
                ...values,
                date: new Date(values.date),
                destinationId: values.destinationId === "none" ? null : values.destinationId,
                weight: values.unit === "kg" ? values.weight : null,
                volume: values.unit === "m3" ? values.volume : null,
            }
            const result = await upsertWasteLog(formattedValues)
            if (result.success) {
                toast.success("Waste record saved")
                onSuccess?.()
            }
        } catch (error) {
            toast.error("Failed to save waste record")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-500">Log Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...(field as any)} className="h-11 border-slate-200 rounded-xl" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="sourceId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-500">Source</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-11 border-slate-200 rounded-xl">
                                            <SelectValue placeholder="Select Source" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sources.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                    <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-[10px] font-black uppercase text-slate-500">Measurement Unit</FormLabel>
                                <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                                    <Button
                                        type="button"
                                        variant={field.value === 'kg' ? 'default' : 'ghost'}
                                        onClick={() => field.onChange('kg')}
                                        className={`flex-1 rounded-lg h-9 text-xs font-bold ${field.value === 'kg' ? 'bg-emerald-600 shadow-sm' : 'text-slate-500'}`}
                                    >
                                        Weight (kg)
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={field.value === 'm3' ? 'default' : 'ghost'}
                                        onClick={() => field.onChange('m3')}
                                        className={`flex-1 rounded-lg h-9 text-xs font-bold ${field.value === 'm3' ? 'bg-emerald-600 shadow-sm' : 'text-slate-500'}`}
                                    >
                                        Volume (m³)
                                    </Button>
                                </div>
                            </FormItem>
                        )}
                    />

                    {unit === 'kg' ? (
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase text-slate-500">Weight value</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type="number" step="0.1" {...field} className="h-11 border-slate-200 rounded-xl pl-4 pr-12 font-bold" />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">KG</div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : (
                        <FormField
                            control={form.control}
                            name="volume"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase text-slate-500">Volume value</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type="number" step="0.01" {...field} className="h-11 border-slate-200 rounded-xl pl-4 pr-12 font-bold" />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">M³</div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-500">Waste Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-11 border-slate-200 rounded-xl">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Organik">Organik</SelectItem>
                                        <SelectItem value="Anorganik (Plastik)">Plastik</SelectItem>
                                        <SelectItem value="Anorganik (Kertas)">Kertas</SelectItem>
                                        <SelectItem value="Anorganik (Logam/Kaca)">Logam/Kaca</SelectItem>
                                        <SelectItem value="Residu">Residu</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="vehiclePlate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase text-slate-500">Vehicle Plate</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="B 1234 XYZ" className="h-11 border-slate-200 rounded-xl font-bold placeholder:font-normal" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="destinationId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase text-slate-500">Waste Partner / Destination</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-11 border-slate-200 rounded-xl">
                                        <SelectValue placeholder="Select Partner" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="none">None (Stored Locally)</SelectItem>
                                    {partners.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name} ({p.type})</SelectItem>
                                    ))}
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
                            <FormLabel className="text-[10px] font-black uppercase text-slate-500">Current Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-11 border-slate-200 rounded-xl">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Stored">Stored</SelectItem>
                                    <SelectItem value="Transported">Transported</SelectItem>
                                    <SelectItem value="Processed">Processed</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 font-black text-white rounded-xl shadow-lg shadow-emerald-100 transition-all hover:scale-[1.01]" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData?.id ? "Update Log Entry" : "Log Generation"}
                </Button>
            </form>
        </Form>
    )
}
