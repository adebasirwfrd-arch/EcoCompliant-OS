"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Settings, AlertTriangle, ShieldCheck, Flame, Droplets, UserCheck, Search } from "lucide-react"
import { format } from "date-fns"

export function ISOOperationsModule({ controls, emergencyPrep, onAddControl, onAddEmergency }: any) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Settings className="h-4 w-4 text-slate-600" />
                                Operational Controls (Cl. 8.1)
                            </CardTitle>
                            <CardDescription className="text-[10px]">Methods to mitigate significant environmental aspects</CardDescription>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold" onClick={onAddControl}>
                            <Plus className="h-3 w-3 mr-1" /> New OCP
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400 pl-6">Procedure / OCP</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Method</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Owner</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Ref</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {controls.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-40 text-center text-slate-400">
                                            <Settings className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-xs">No operational controls defined.</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    controls.map((item: any) => (
                                        <TableRow key={item.id} className="group transition-colors hover:bg-slate-50/50">
                                            <TableCell className="pl-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-slate-900">{item.procedureName}</span>
                                                    <span className="text-[9px] text-slate-400">{item.department}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`text-[8px] font-black uppercase px-1 py-0 ${item.controlMethod === 'Engineering' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        item.controlMethod === 'Elimination' ? 'bg-red-50 text-red-700 border-red-100' :
                                                            'bg-slate-50 text-slate-700 border-slate-100'
                                                    }`}>
                                                    {item.controlMethod}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-[10px] font-bold text-slate-600">{item.pic || 'TBD'}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-slate-900">
                                                    <Search className="h-3 w-3" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                Emergency Prep (Cl. 8.2)
                            </CardTitle>
                            <CardDescription className="text-[10px]">Scenarios, Response Plans, and Training Drills</CardDescription>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold" onClick={onAddEmergency}>
                            <Plus className="h-3 w-3 mr-1" /> Log Scenario
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-4 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-full">
                                    <Flame className="h-4 w-4 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-amber-900 uppercase">Next Major Drill</p>
                                    <p className="text-xs font-bold text-amber-700">Fire Response - Chemical Yard</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-amber-900 uppercase">Countdown</p>
                                <p className="text-xs font-bold text-amber-700 underline underline-offset-2">12 Days</p>
                            </div>
                        </div>
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400 pl-6">Scenario</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Last Drill</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {emergencyPrep.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-40 text-center text-slate-400">
                                            <Droplets className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-xs">No emergency scenarios defined.</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    emergencyPrep.map((item: any) => (
                                        <TableRow key={item.id} className="group transition-colors hover:bg-slate-50/50">
                                            <TableCell className="pl-6 text-[11px] font-bold text-slate-900">{item.scenario}</TableCell>
                                            <TableCell className="text-[10px] text-slate-500">
                                                {item.lastDrillDate ? format(new Date(item.lastDrillDate), 'MMMM dd, yyyy') : 'Never'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`text-[8px] font-black uppercase px-2 py-0 border-none ${item.status === 'Ready' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                                                    }`}>
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <UserCheck className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">Contractor & Outsourced Oversight</CardTitle>
                            <CardDescription className="text-xs text-slate-400">Managing lifecycle impacts from external providers</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 relative group overflow-hidden">
                            <ShieldCheck className="absolute -right-2 -bottom-2 h-16 w-16 opacity-5 rotate-12 group-hover:scale-110 transition-transform" />
                            <p className="text-[10px] font-black text-slate-400 uppercase">Active Contractors</p>
                            <h4 className="text-2xl font-black text-slate-900 mt-1">14</h4>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-[10px] font-bold">
                                    <span className="text-slate-500">Screened/Approved</span>
                                    <span className="text-emerald-600">100%</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1 rounded-full">
                                    <div className="bg-emerald-500 h-1 rounded-full w-full" />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 relative group overflow-hidden">
                            <Search className="absolute -right-2 -bottom-2 h-16 w-16 opacity-5 rotate-12 group-hover:scale-110 transition-transform" />
                            <p className="text-[10px] font-black text-slate-400 uppercase">Field Inspections</p>
                            <h4 className="text-2xl font-black text-slate-900 mt-1">8</h4>
                            <p className="text-[10px] text-slate-500 mt-1">Conducted this month</p>
                            <Button size="sm" variant="link" className="p-0 h-auto text-[10px] mt-4 font-black uppercase text-blue-600">View Audit Reports &rarr;</Button>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-center items-center text-center space-y-2 border-dashed">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Clause 8 Compliance Summary</p>
                            <div className="flex gap-1">
                                <Badge className="text-[8px] bg-slate-900 text-white border-none">PLAN</Badge>
                                <Badge className="text-[8px] bg-slate-900 text-white border-none">DO</Badge>
                                <Badge className="text-[8px] bg-slate-400 text-white border-none">CHECK</Badge>
                            </div>
                            <p className="text-[9px] text-slate-400 italic">Continuous improvement loop active</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
