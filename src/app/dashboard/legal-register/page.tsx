import { Suspense } from "react"
import { getLegalRegisters } from "@/app/actions/legal"
import { LegalRegisterClient } from "@/components/shared/legal-register-client"
import { Scale, Loader2 } from "lucide-react"

export default async function LegalRegisterPage() {
    const records = await getLegalRegisters()

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 min-h-screen bg-slate-50/50">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                        <Scale className="h-8 w-8 text-slate-800" />
                        Legal Register & Implementation
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm md:text-base">
                        Global environmental and industrial compliance inventory for Migas.
                    </p>
                </div>
            </div>

            <Suspense fallback={
                <div className="flex flex-col items-center justify-center h-96 space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    <p className="text-slate-500 font-medium">Loading statutory records...</p>
                </div>
            }>
                <LegalRegisterClient initialData={records as any} />
            </Suspense>
        </div>
    )
}
