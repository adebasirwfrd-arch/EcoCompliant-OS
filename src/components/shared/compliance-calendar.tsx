"use client"

import React, { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, isToday } from "date-fns"
import { ChevronLeft, ChevronRight, AlertCircle, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ComplianceCalendarProps {
    reports: any[];
}

export function ComplianceCalendar({ reports }: ComplianceCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Start Monday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const dateFormat = "d"
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    return (
        <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50/50">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-indigo-600">{format(currentDate, "MMMM")}</span>
                    <span className="text-slate-500">{format(currentDate, "yyyy")}</span>
                </h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="h-8 text-xs font-semibold">
                        Today
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-b bg-slate-100/50">
                {weekDays.map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                {days.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, monthStart)
                    const isDayToday = isToday(day)

                    // Find reports for this day
                    const dayReports = reports.filter(report => isSameDay(new Date(report.dueDate), day))

                    return (
                        <div
                            key={day.toString()}
                            className={`min-h-[100px] p-2 border-r border-b relative transition-colors ${!isCurrentMonth ? "bg-slate-50/50 text-slate-400" : "bg-white"} ${isDayToday ? "ring-2 ring-inset ring-indigo-500 bg-indigo-50/10" : "hover:bg-slate-50"}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-semibold flex items-center justify-center p-1 rounded-full w-6 h-6 ${isDayToday ? "bg-indigo-600 text-white" : ""}`}>
                                    {format(day, dateFormat)}
                                </span>
                                {dayReports.length > 0 && (
                                    <Badge variant="secondary" className="text-[9px] px-1.5 h-4 bg-slate-200 hover:bg-slate-300 pointer-events-none">
                                        {dayReports.length} Due
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-col gap-1 mt-2 overflow-y-auto max-h-[80px] pr-1 styled-scrollbar">
                                {dayReports.map(report => {
                                    const isApproved = report.status === "Approved"
                                    const isPending = report.status === "Pending"
                                    const isUrgent = report.priority === "Urgent"

                                    let bgClass = "bg-slate-100 text-slate-700 border-slate-200"
                                    if (isApproved) bgClass = "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    else if (isUrgent && isPending) bgClass = "bg-rose-50 text-rose-700 border-rose-200"
                                    else if (isPending) bgClass = "bg-amber-50 text-amber-700 border-amber-200"

                                    return (
                                        <Link key={report.id} href={`/dashboard/compliance/${report.id}`}>
                                            <div className={`text-[10px] p-1.5 rounded border border-l-2 leading-tight flex items-start gap-1 cursor-pointer hover:shadow-sm transition-all truncate ${bgClass} ${isApproved ? 'border-l-emerald-500' : isUrgent ? 'border-l-rose-500' : 'border-l-amber-500'}`} title={report.title}>
                                                <div className="flex-1 truncate font-medium">
                                                    {report.title}
                                                </div>
                                                {isApproved && <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />}
                                                {isUrgent && isPending && <AlertCircle className="h-3 w-3 shrink-0 text-rose-500" />}
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="p-4 bg-slate-50 border-t flex flex-wrap gap-4 items-center text-xs text-slate-500 font-medium justify-center">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500" /> Urgent / Overdue
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500" /> Pending Submission
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500" /> Approved
                </div>
            </div>
        </div>
    )
}
