"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import { finalizeAndSubmitComplianceReport } from "@/app/actions/environmental"
import { toast } from "sonner"

export function FinalizeSubmitButton({ reportId, disabled }: { reportId: string, disabled?: boolean }) {
    const [loading, setLoading] = useState(false)

    async function handleFinalize() {
        setLoading(true)
        try {
            const result = await finalizeAndSubmitComplianceReport(reportId)
            if (result.success) {
                toast.success("Report finalized and approval email sent to manager!")
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to finalize report")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={handleFinalize}
            disabled={loading || disabled}
        >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Finalize & Submit
        </Button>
    )
}
