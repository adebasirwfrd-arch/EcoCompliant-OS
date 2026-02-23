"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
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
import { upsertAmdalRequirement } from "@/app/actions/environmental"

type AmdalRequirementFormValues = {
    id?: string;
    documentType: "AMDAL" | "UKL-UPL" | "SPPL" | "DELH";
    parameter: string;
    type: "RKL" | "RPL";
    frequency: "Daily" | "Monthly" | "Quarterly" | "Semester" | "Annual";
    lastMonitoredDate?: Date | null;
    nextDueDate: Date;
    status: "Compliant" | "Non-Compliant" | "Pending";
    pic?: string;
};

interface AmdalFormProps {
    initialData?: AmdalRequirementFormValues;
    onSuccess?: () => void;
}

export function AmdalForm({ initialData, onSuccess }: AmdalFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const defaultValues: AmdalRequirementFormValues = initialData || {
        documentType: "AMDAL",
        parameter: "",
        type: "RPL",
        frequency: "Semester",
        lastMonitoredDate: null,
        nextDueDate: new Date(),
        status: "Pending",
        pic: "",
    }

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AmdalRequirementFormValues>({
        defaultValues,
    })

    const watchLastMonitored = watch("lastMonitoredDate")
    const watchNextDue = watch("nextDueDate")

    const onSubmit = async (data: AmdalRequirementFormValues) => {
        setIsSubmitting(true)
        try {
            await upsertAmdalRequirement({
                ...data,
                lastMonitoredDate: data.lastMonitoredDate || null
            })
            if (onSuccess) onSuccess()
            router.refresh()
        } catch (error) {
            console.error("Failed to save AMDAL requirement:", error)
            alert("Failed to save AMDAL requirement. See console for details.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type</Label>
                    <Select
                        defaultValue={defaultValues.documentType}
                        onValueChange={(value) => setValue("documentType", value as any)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="AMDAL">AMDAL</SelectItem>
                            <SelectItem value="UKL-UPL">UKL-UPL</SelectItem>
                            <SelectItem value="SPPL">SPPL</SelectItem>
                            <SelectItem value="DELH">DELH</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="type">Requirement Type</Label>
                    <Select
                        defaultValue={defaultValues.type}
                        onValueChange={(value) => setValue("type", value as any)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="RKL">RKL (Pengelolaan)</SelectItem>
                            <SelectItem value="RPL">RPL (Pemantauan)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2 border border-slate-200 rounded-md p-4 bg-slate-50">
                <Label htmlFor="parameter">Parameter Name / Objective</Label>
                <Input
                    id="parameter"
                    placeholder="e.g. Kualitas Udara Ambien, Kualitas Emisi Genset, Kesempatan Kerja..."
                    {...register("parameter", { required: "Parameter is required" })}
                />
                {errors.parameter && (
                    <p className="text-sm text-red-500">{errors.parameter.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="frequency">Reporting Frequency</Label>
                    <Select
                        defaultValue={defaultValues.frequency}
                        onValueChange={(value) => setValue("frequency", value as any)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                            <SelectItem value="Semester">Semester (6 Months)</SelectItem>
                            <SelectItem value="Annual">Annual</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Current Status</Label>
                    <Select
                        defaultValue={defaultValues.status}
                        onValueChange={(value) => setValue("status", value as any)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Compliant">Compliant</SelectItem>
                            <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                    <Label>Last Monitored Date (Optional)</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !watchLastMonitored && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {watchLastMonitored ? format(watchLastMonitored, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={watchLastMonitored || undefined}
                                onSelect={(date: Date | undefined) => setValue("lastMonitoredDate", date || null)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex flex-col space-y-2">
                    <Label>Next Due Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !watchNextDue && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {watchNextDue ? format(watchNextDue, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={watchNextDue}
                                onSelect={(date: Date | undefined) => date && setValue("nextDueDate", date)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="pic">Person in Charge (PIC)</Label>
                <Input
                    id="pic"
                    placeholder="e.g. John Doe / Lab External"
                    {...register("pic")}
                />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
                {onSuccess && (
                    <Button type="button" variant="outline" onClick={onSuccess}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {initialData ? 'Update Requirement' : 'Save Requirement'}
                </Button>
            </div>
        </form>
    )
}
