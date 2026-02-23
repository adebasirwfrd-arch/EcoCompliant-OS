"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { WasteForm } from "@/components/shared/waste-form"

export function WasteAddDialog() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-700 shadow-sm font-semibold">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Log New Waste Entry
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Log B3 Waste Generation or Manifest</DialogTitle>
                    <DialogDescription>
                        Fill in the details for generated hazardous waste or manifest transport below.
                    </DialogDescription>
                </DialogHeader>
                <WasteForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}
