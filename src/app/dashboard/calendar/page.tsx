import { getCalendarEvents } from "@/app/actions/dashboard"
import { DashboardCalendar } from "@/components/shared/dashboard-calendar"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function CalendarPage() {
    const events = await getCalendarEvents()

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl shadow-sm" asChild>
                        <Link href="/dashboard">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Environmental <span className="text-indigo-600">Calendar</span></h1>
                        <p className="text-sm text-slate-500 font-medium">Monitoring all compliance and monitoring activities across modules</p>
                    </div>
                </div>
            </div>

            <div className="h-[calc(100vh-200px)] min-h-[700px]">
                <DashboardCalendar events={events} />
            </div>
        </div>
    )
}
