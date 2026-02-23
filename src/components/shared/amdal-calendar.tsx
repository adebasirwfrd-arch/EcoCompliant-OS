"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CalendarIcon, ChevronLeft, ChevronRight, Activity, TrendingDown } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from "date-fns"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AmdalCalendar({ requirements }: { requirements: any[] }) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    return (
        <Card className="h-full flex flex-col shadow-sm border-slate-200">
            <CardHeader className="pb-3 border-b bg-slate-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-indigo-500" />
                        <CardTitle className="text-lg">Monitoring Agenda</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={prevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-semibold w-24 text-center">
                            {format(currentMonth, "MMM yyyy")}
                        </span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={nextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
                <div className="grid grid-cols-7 border-b bg-slate-100 text-[10px] font-bold text-slate-500 text-center py-2 uppercase tracking-wider">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                    {/* Padding for start of month */}
                    {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="border-r border-b bg-slate-50/50 min-h-[80px]" />
                    ))}

                    {days.map((day, i) => {
                        const dayReqs = requirements.filter(req => isSameDay(new Date(req.nextDueDate), day));

                        return (
                            <div
                                key={day.toString()}
                                className={cn(
                                    "min-h-[80px] p-1.5 border-r border-b relative transition-colors",
                                    isToday(day) ? "bg-indigo-50/30" : "hover:bg-slate-50"
                                )}
                            >
                                <span className={cn(
                                    "text-xs font-medium flex h-6 w-6 items-center justify-center rounded-full",
                                    isToday(day) ? "bg-indigo-600 text-white" : "text-slate-700"
                                )}>
                                    {format(day, "d")}
                                </span>

                                <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[60px] pr-1 styled-scrollbar">
                                    {dayReqs.map(req => (
                                        <div
                                            key={req.id}
                                            className={cn(
                                                "text-[9px] p-1 rounded-sm border truncate font-medium flex items-center gap-1",
                                                req.type === 'RKL' ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-sky-200 bg-sky-50 text-sky-700"
                                            )}
                                            title={req.parameter}
                                        >
                                            {req.type === 'RKL' ? <TrendingDown className="h-2.5 w-2.5 shrink-0" /> : <Activity className="h-2.5 w-2.5 shrink-0" />}
                                            {req.parameter}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Padding for end of month */}
                    {Array.from({ length: 42 - (days.length + monthStart.getDay()) }).map((_, i) => (
                        <div key={`empty-end-${i}`} className="border-r border-b bg-slate-50/50 min-h-[80px]" />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
