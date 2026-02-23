"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Edit } from "lucide-react"
import { ComplianceForm } from "./compliance-form"
import { type ComplianceReportInput } from "@/app/actions/environmental"

export function EditComplianceDialog({ report }: { report: any }) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Details
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Compliance Submission</DialogTitle>
                    <DialogDescription>Update the metadata or status of this regulatory record.</DialogDescription>
                </DialogHeader>
                <ComplianceForm
                    initialData={report}
                    onSuccess={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}
