"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CalendarIcon, ChevronLeft, ChevronRight, Activity, TrendingDown, ClipboardCheck, Scale, FileText, AlertCircle } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from "date-fns"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export interface CalendarEvent {
    id: string
    title: string
    date: Date
    type: string
    link: string
    status: string
}

export function DashboardCalendar({ events }: { events: CalendarEvent[] }) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'AMDAL': return <Activity className="h-3 w-3 shrink-0" />
            case 'Legal': return <Scale className="h-3 w-3 shrink-0" />
            case 'Report': return <FileText className="h-3 w-3 shrink-0" />
            case 'CAPA': return <AlertCircle className="h-3 w-3 shrink-0" />
            default: return <ClipboardCheck className="h-3 w-3 shrink-0" />
        }
    }

    const getEventTypeStyles = (type: string) => {
        switch (type) {
            case 'AMDAL': return "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            case 'Legal': return "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
            case 'Report': return "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
            case 'CAPA': return "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
            default: return "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
        }
    }

    return (
        <Card className="h-full flex flex-col shadow-xl border-slate-200 rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-6 border-b bg-slate-50/50 p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 rounded-2xl">
                            <CalendarIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">Environmental Agenda</CardTitle>
                            <p className="text-sm text-slate-500 font-medium tracking-tight">Unified compliance & monitoring calendar</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100" onClick={prevMonth}>
                            <ChevronLeft className="h-5 w-5 text-slate-600" />
                        </Button>
                        <span className="text-sm font-black w-32 text-center text-slate-700 uppercase tracking-widest">
                            {format(currentMonth, "MMMM yyyy")}
                        </span>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100" onClick={nextMonth}>
                            <ChevronRight className="h-5 w-5 text-slate-600" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
                <div className="grid grid-cols-7 border-b bg-slate-50/30 text-[10px] font-black text-slate-500 text-center py-4 uppercase tracking-[0.2em]">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                    {/* Padding for start of month */}
                    {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="border-r border-b bg-slate-50/30 min-h-[120px]" />
                    ))}

                    {days.map((day, i) => {
                        const dayEvents = events.filter(event => isSameDay(new Date(event.date), day));

                        return (
                            <div
                                key={day.toString()}
                                className={cn(
                                    "min-h-[120px] p-3 border-r border-b relative transition-all duration-200",
                                    isToday(day) ? "bg-indigo-50/50" : "hover:bg-slate-50/80"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={cn(
                                        "text-xs font-black flex h-7 w-7 items-center justify-center rounded-xl transition-all",
                                        isToday(day) ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110" : "text-slate-500"
                                    )}>
                                        {format(day, "d")}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[90px] pr-1 styled-scrollbar">
                                    {dayEvents.map(event => (
                                        <Link
                                            key={event.id}
                                            href={event.link}
                                            className={cn(
                                                "text-[10px] p-2 rounded-xl border shadow-sm transition-all active:scale-95 group/event flex flex-col gap-1",
                                                getEventTypeStyles(event.type)
                                            )}
                                        >
                                            <div className="flex items-center gap-1.5 font-black uppercase tracking-tighter truncate">
                                                {getEventIcon(event.type)}
                                                <span>{event.title}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[8px] font-bold opacity-70">{event.type}</span>
                                                <Badge className="h-3 text-[7px] px-1 font-black bg-white/50 border-none text-inherit uppercase">{event.status}</Badge>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Padding for end of month */}
                    {Array.from({ length: (7 - (days.length + monthStart.getDay()) % 7) % 7 }).map((_, i) => (
                        <div key={`empty-end-${i}`} className="border-r border-b bg-slate-50/30 min-h-[120px]" />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
