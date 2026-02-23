"use client"

import { useState, useMemo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Calculator, AlertCircle, Save } from "lucide-react"
import { format } from "date-fns"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { upsertGhgEmission } from "@/app/actions/environmental"

// --- Standardized Emission Factors (Dummy references to SRN PPI / IPCC) ---
const CATEGORIES = {
    "1": [
        { label: "Stationary Combustion (Genset/Boiler)", factorId: "diesel_inds" },
        { label: "Mobile Combustion (Company Vehicles)", factorId: "gasoline_veh" },
        { label: "Fugitive Emissions (Refrigerants)", factorId: "hfc_134a" },
    ],
    "2": [
        { label: "Purchased Electricity (PLN Grid)", factorId: "pln_grid" },
    ],
    "3": [
        { label: "Business Travel (Flights)", factorId: "flight_eco" },
        { label: "Waste Disposal", factorId: "waste_landfill" },
    ]
};

const EMISSION_FACTORS: Record<string, { factor: number; unit: string; desc: string }> = {
    diesel_inds: { factor: 0.00268, unit: "Liters", desc: "Diesel Fuel (Industrial) - 2.68 kg CO2/L" },
    gasoline_veh: { factor: 0.00231, unit: "Liters", desc: "Motor Gasoline - 2.31 kg CO2/L" },
    hfc_134a: { factor: 1.430, unit: "kg", desc: "HFC-134a Refrigerant - 1430 kg CO2/kg" }, // Simplification for UI
    pln_grid: { factor: 0.00087, unit: "kWh", desc: "PLN National Grid - 0.87 kg CO2/kWh" },
    flight_eco: { factor: 0.00015, unit: "km", desc: "Short Haul Flight - 0.15 kg CO2/km" },
    waste_landfill: { factor: 0.450, unit: "tons", desc: "Solid Waste Landfilling - 450 kg CO2/ton" },
};

type GhgFormProps = {
    initialData?: any;
    onSuccess?: () => void;
};

const formSchema = z.object({
    id: z.string().optional(),
    date: z.date(),
    scope: z.enum(["1", "2", "3"]),
    category: z.string().min(1, "Category is required"),
    factorId: z.string().min(1, "Source / Emission Factor must be selected"),
    value: z.number().min(0, "Value cannot be negative"),
    notes: z.string().optional(),
    evidenceUrl: z.string().optional().or(z.literal("")),
});

export function GhgForm({ initialData, onSuccess }: GhgFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: initialData?.id as string | undefined,
            date: initialData?.date ? new Date(initialData.date) : new Date(),
            scope: (initialData?.scope?.toString() as "1" | "2" | "3") || "1",
            category: (initialData?.category as string) || "",
            factorId: (initialData?.source as string) || "",
            value: Number(initialData?.value || 0),
            notes: (initialData?.notes as string) || "",
            evidenceUrl: (initialData?.evidenceUrl as string) || "",
        },
    })

    const { watch, setValue } = form;
    const watchScope = watch("scope");
    const watchFactorId = watch("factorId");
    const watchValue = watch("value");

    // Reset subordinate fields when parent changes
    useEffect(() => {
        setValue("category", "");
        setValue("factorId", "");
    }, [watchScope, setValue]);

    const activeFactorDef = watchFactorId ? EMISSION_FACTORS[watchFactorId] : null;

    // Auto Calculate tCO2e
    const calculatedCo2e = useMemo(() => {
        if (!activeFactorDef || isNaN(watchValue)) return 0;
        return watchValue * activeFactorDef.factor;
    }, [watchValue, activeFactorDef]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            const factorDef = EMISSION_FACTORS[values.factorId];

            const reqData = {
                id: values.id,
                date: values.date,
                scope: parseInt(values.scope),
                category: values.category,
                source: values.factorId, // Storing ID for simplicity mapback
                value: values.value,
                unit: factorDef.unit,
                emissionFactor: factorDef.factor,
                notes: values.notes,
                evidenceUrl: values.evidenceUrl,
            };

            const result = await upsertGhgEmission(reqData);

            if (result.success) {
                toast.success("GHG Emission Recorded", {
                    description: `Successfully logged ${calculatedCo2e.toFixed(3)} tCO2e.`,
                    icon: <Save className="h-4 w-4" />
                })
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            toast.error("Failed to save Emission Data");
            console.error(error);
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">

                {/* Dynamic CO2e Calculator Banner */}
                <div className="bg-slate-900 border border-slate-700 text-white p-4 rounded-xl shadow-inner flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
                            <Calculator className="h-6 w-6 text-indigo-400" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                                Auto CO<sub className="text-[10px]">2</sub>e Calculation
                            </div>
                            <div className="text-sm text-slate-300">
                                {activeFactorDef ? `Value × ${activeFactorDef.factor}` : 'Select a source to calculate'}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-mono font-bold text-emerald-400">
                            {calculatedCo2e.toFixed(3)}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">tCO2e (Tonnes)</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control as any}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Activity Date</FormLabel>
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
                        control={form.control as any}
                        name="scope"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Emissions Scope (Protocol)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Scope" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1">Scope 1 (Direct)</SelectItem>
                                        <SelectItem value="2">Scope 2 (Indirect - Purchased Energy)</SelectItem>
                                        <SelectItem value="3">Scope 3 (Other Indirect - Value Chain)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control as any}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                                <FormLabel>Emission Activity / Category</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={!watchScope}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category based on Scope..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {CATEGORIES[watchScope as keyof typeof CATEGORIES]?.map(cat => (
                                            <SelectItem key={cat.factorId} value={cat.label}>{cat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Render sub-source & custom input once Category is picked */}
                {watch("category") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl border border-indigo-100 bg-indigo-50/50">
                        <FormField
                            control={form.control as any}
                            name="factorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Emission Factor Set (IPCC/Gov)</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="Select specific source factor..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {/* Auto-filter factors based on selected category map */}
                                            {CATEGORIES[watchScope as keyof typeof CATEGORIES]
                                                .filter(c => c.label === watch("category"))
                                                .map(c => (
                                                    <SelectItem key={c.factorId} value={c.factorId}>
                                                        {EMISSION_FACTORS[c.factorId].desc}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    {activeFactorDef && (
                                        <FormDescription className="text-indigo-600 font-medium text-xs mt-1">
                                            Multiplication Factor: {activeFactorDef.factor} tCO2e / {activeFactorDef.unit}
                                        </FormDescription>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Activity Value / Quantity</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="Enter amount..."
                                                {...field}
                                                className="pr-16 bg-white"
                                                disabled={!watchFactorId}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-muted-foreground font-medium">
                                                {activeFactorDef ? activeFactorDef.unit : '-'}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                    <FormField
                        control={form.control as any}
                        name="evidenceUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Link to Evidence / PLN Bill (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://drive.google.com/..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    Required for SRN PPI Verification Audits.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control as any}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Methodology Notes</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Provide operational context..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting || calculatedCo2e === 0}>
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                            Calculating...
                        </span>
                    ) : (
                        "Save & Accumulate to Net Zero Record"
                    )}
                </Button>
            </form>
        </Form>
    )
}
