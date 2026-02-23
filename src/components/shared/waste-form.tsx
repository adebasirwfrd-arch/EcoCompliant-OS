"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Info, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { upsertWasteManifest } from "@/app/actions/environmental"

type WasteFormValues = {
    id?: string;
    manifestNumber: string;
    festronikId: string;
    wasteId: string;
    weight: string;
    unit: string;
    isLargeGenerator: "yes" | "no";
    generatorDate: Date;
    transporterName: string;
    transporterLicense: string;
    vehiclePlate: string;
    destinationFacility: string;
    handlingMethod: "Recycle" | "Recovery" | "Incineration" | "Landfill" | "Export" | "Other";
    managerEmail?: string;
    status: "stored" | "transported" | "processed";
    notes: string;
};

interface WasteFormProps {
    initialData?: WasteFormValues & { wasteCode?: string };
    onSuccess?: () => void;
}

// PP 22/2021 Government Database
const limbahDatabase = [
    { code: "A102d", name: "Aki / Baterai Bekas", category: "1" },
    { code: "A337-1", name: "Limbah Klinis / Medis", category: "1" },
    { code: "A108d", name: "Limbah Terkontaminasi B3", category: "1" },
    { code: "B104d", name: "Kemasan Bekas B3", category: "2" },
    { code: "B105d", name: "Minyak Pelumas / Oli Bekas", category: "2" },
    { code: "B107d", name: "Limbah Elektronik (TL/Neon)", category: "2" },
    { code: "B109d", name: "Filter Bekas", category: "2" },
    { code: "B110d", name: "Kain Majun Bekas (Rags)", category: "2" },
    { code: "B351-4", name: "Sludge IPAL", category: "2" },
];

export function WasteForm({ initialData, onSuccess }: WasteFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [step, setStep] = useState(1);

    // Determine initial wasteId based on initialData wasteCode
    const initialWasteMenu = initialData?.wasteCode
        ? limbahDatabase.find(l => l.code === initialData.wasteCode)?.code
        : (initialData?.wasteId || "");

    const defaultValues: WasteFormValues = {
        id: initialData?.id,
        manifestNumber: initialData?.manifestNumber || "",
        festronikId: (initialData as any)?.festronikId || "",
        wasteId: initialWasteMenu || "",
        weight: initialData?.weight || "",
        unit: initialData?.unit || "ton",
        isLargeGenerator: initialData?.isLargeGenerator || "no",
        generatorDate: initialData?.generatorDate ? new Date(initialData.generatorDate) : new Date(),
        transporterName: (initialData as any)?.transporterName || "",
        transporterLicense: (initialData as any)?.transporterLicense || "",
        vehiclePlate: (initialData as any)?.vehiclePlate || "",
        destinationFacility: (initialData as any)?.destinationFacility || "",
        handlingMethod: (initialData as any)?.handlingMethod || "Recovery",
        managerEmail: initialData?.managerEmail || "",
        status: initialData?.status || "stored",
        notes: (initialData as any)?.notes || "",
    }

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = useForm<WasteFormValues>({
        defaultValues,
    })

    const watchDate = watch("generatorDate")
    const watchWasteId = watch("wasteId")
    const watchGeneratorSize = watch("isLargeGenerator")
    const watchStatus = watch("status")

    const selectedWaste = useMemo(() => limbahDatabase.find(l => l.code === watchWasteId), [watchWasteId]);

    const maxStorageDays = useMemo(() => {
        if (!selectedWaste) return 0;
        if (watchGeneratorSize === "yes") return 90;
        return selectedWaste.category === "1" ? 180 : 365;
    }, [selectedWaste, watchGeneratorSize]);

    const onSubmit = async (data: WasteFormValues) => {
        setIsSubmitting(true)
        try {
            if (!selectedWaste) throw new Error("Please select a valid waste type.");

            await upsertWasteManifest({
                ...data,
                wasteCode: selectedWaste.code,
                wasteCategory: selectedWaste.category as "1" | "2",
                wasteType: selectedWaste.name,
                weight: parseFloat(data.weight),
                maxStorageDays,
            })
            if (onSuccess) onSuccess()
            router.refresh()
        } catch (error) {
            console.error("Failed to save waste manifest:", error)
            alert("Failed to save manifest.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const nextStep = async () => {
        let fields: any[] = [];
        if (step === 1) fields = ["wasteId", "weight", "generatorDate"];
        if (step === 2) fields = ["status"];

        const isValid = await trigger(fields as any);
        if (isValid) setStep(s => s + 1);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
            {/* Wizard Progress */}
            <div className="flex items-center justify-between mb-8 px-2">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                            step === s ? "bg-amber-600 text-white ring-4 ring-amber-100" :
                                step > s ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                        )}>
                            {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                        </div>
                        {s < 3 && <div className={cn("h-1 flex-1 mx-2 rounded", step > s ? "bg-emerald-500" : "bg-slate-200")} />}
                    </div>
                ))}
            </div>

            {/* Step 1: Genration & Logbook */}
            {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-800">1. Generation Details</h3>
                        <p className="text-sm text-slate-500">Record waste generation for the internal logbook.</p>
                    </div>

                    <div className="space-y-2 bg-slate-50 p-4 border border-slate-200 rounded-lg">
                        <Label htmlFor="wasteId" className="flex items-center gap-2 text-slate-700">Waste Reference (PP 22/2021)</Label>
                        <Select
                            defaultValue={defaultValues.wasteId}
                            onValueChange={(value) => setValue("wasteId", value)}
                        >
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select Limbah B3 Code & Type" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {limbahDatabase.map((waste) => (
                                    <SelectItem key={waste.code} value={waste.code}>
                                        <span className="font-mono font-bold text-amber-700 mr-2">{waste.code}</span>
                                        {waste.name} <span className="text-muted-foreground ml-1"> (Cat {waste.category})</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.wasteId && <p className="text-xs text-red-500">Selection is required</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight" className="text-slate-700">Weight</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register("weight", { required: "Required" })}
                                />
                                <Select defaultValue={defaultValues.unit} onValueChange={(value) => setValue("unit", value)}>
                                    <SelectTrigger className="w-24 bg-white"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ton">Ton</SelectItem>
                                        <SelectItem value="kg">Kg</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700">Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-white", !watchDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {watchDate ? format(watchDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={watchDate} onSelect={(date) => date && setValue("generatorDate", date)} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Storage & Advisory */}
            {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-800">2. Storage & PIC</h3>
                        <p className="text-sm text-slate-500">Monitor TPS storage compliance and notification.</p>
                    </div>

                    <div className="space-y-3 bg-blue-50 p-4 border border-blue-200 rounded-lg">
                        <Label className="text-blue-900">TPS Capacity Tracking</Label>
                        <RadioGroup
                            defaultValue={defaultValues.isLargeGenerator}
                            onValueChange={(v) => setValue("isLargeGenerator", v as any)}
                            className="flex gap-6 mt-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="large" />
                                <Label htmlFor="large" className="font-medium text-blue-800">&ge; 50 kg/day</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="small" />
                                <Label htmlFor="small" className="font-medium text-blue-800">&lt; 50 kg/day</Label>
                            </div>
                        </RadioGroup>
                        <div className="text-xs text-blue-700 bg-white/60 p-2 rounded border border-blue-100 italic">
                            System Advisory: Category {selectedWaste?.category} waste at this scale has a maximum <strong>{maxStorageDays} Days</strong> storage limit (PP 22/2021).
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-slate-700">Process Status</Label>
                        <Select
                            defaultValue={defaultValues.status}
                            onValueChange={(value) => setValue("status", value as any)}
                        >
                            <SelectTrigger className="border-amber-200 bg-amber-50/20">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="stored">Stored at TPS</SelectItem>
                                <SelectItem value="transported">Ready for Transport</SelectItem>
                                <SelectItem value="processed">Processed On-Site</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="managerEmail" className="text-slate-700">PIC Email for Tracking</Label>
                        <Input id="managerEmail" type="email" placeholder="manager@company.com" className="bg-white" {...register("managerEmail")} />
                    </div>
                </div>
            )}

            {/* Step 3: Transport & Festronik */}
            {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-800">3. Festronik & Handling</h3>
                        <p className="text-sm text-slate-500">Official manifest details for third-party handover.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="manifestNumber" className="text-slate-700">Logbook / Manifest No.</Label>
                            <Input id="manifestNumber" className="bg-white" {...register("manifestNumber")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="festronikId" className="text-slate-700">Festronik ID</Label>
                            <Input id="festronikId" placeholder="FES-XXXXX" className="bg-white font-mono" {...register("festronikId")} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="transporterName" className="text-slate-700">Transporter Entity</Label>
                        <Input id="transporterName" placeholder="PT. Transportasi Limbah" className="bg-white" {...register("transporterName")} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="vehiclePlate" className="text-slate-700">Vehicle Plate</Label>
                            <Input id="vehiclePlate" placeholder="B 1234 XYZ" className="bg-white" {...register("vehiclePlate")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="handlingMethod" className="text-slate-700">Final Treatment</Label>
                            <Select defaultValue={defaultValues.handlingMethod} onValueChange={(v) => setValue("handlingMethod", v as any)}>
                                <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Recycle">Recycle</SelectItem>
                                    <SelectItem value="Recovery">Recovery</SelectItem>
                                    <SelectItem value="Incineration">Incineration</SelectItem>
                                    <SelectItem value="Landfill">Landfill</SelectItem>
                                    <SelectItem value="Export">Export</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-slate-700">Internal Remarks</Label>
                        <Input id="notes" placeholder="..." className="bg-white" {...register("notes")} />
                    </div>
                </div>
            )}

            <div className="flex justify-between gap-2 pt-6 border-t mt-4">
                <Button type="button" variant="ghost" className="text-slate-500" onClick={() => step > 1 ? setStep(s => s - 1) : onSuccess?.()}>
                    {step === 1 ? 'Cancel' : 'Previous Step'}
                </Button>

                {step < 3 ? (
                    <Button type="button" className="bg-amber-600 hover:bg-amber-700 px-8" onClick={nextStep}>
                        Next Step
                    </Button>
                ) : (
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 px-8 min-w-[140px]" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                        {initialData ? 'Update Record' : 'Finalize Entry'}
                    </Button>
                )}
            </div>
        </form>
    )
}
