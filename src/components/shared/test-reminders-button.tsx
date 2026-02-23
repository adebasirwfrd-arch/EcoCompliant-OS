"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Loader2 } from "lucide-react"

export function TestRemindersButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleTestReminders = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/cron/reminders?test=true', {
                method: 'GET'
            })

            const data = await response.json()

            if (data.success) {
                alert(`Test Executed: Processed ${data.reportsProcessed} reports. Sent ${data.results?.filter((r: any) => r.status === 'sent').length || 0} emails.`);
            } else {
                throw new Error(data.error || "Unknown error occurred")
            }
        } catch (error: any) {
            console.error("Test reminder failed:", error)
            alert("Test Failed: " + (error.message || "Failed to trigger automated reminders"));
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            className="font-medium border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            onClick={handleTestReminders}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Mail className="mr-2 h-4 w-4" />
            )}
            Test Email Reminders
        </Button>
    )
}
