"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Info, Users, Globe, Target, AlertCircle } from "lucide-react"

export function ISOContextModule({ issues, interestedParties, onAddIssue, onAddParty }: any) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">Strategic Context</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-slate-900">{issues.length}</div>
                        <p className="text-[10px] text-slate-500 font-medium">Internal & External Issues</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">Stakeholders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-slate-900">{interestedParties.length}</div>
                        <p className="text-[10px] text-slate-500 font-medium">Interested Parties Tracked</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Legal Mandates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-slate-900">
                            {interestedParties.filter((p: any) => p.isLegalObligation).length}
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">Critical Compliance Needs</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50 to-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase text-amber-600 tracking-wider">Audit Focus</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-slate-900">100%</div>
                        <p className="text-[10px] text-slate-500 font-medium">Clause 4.1 & 4.2 Coverage</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Globe className="h-4 w-4 text-blue-500" />
                                SWOT & Strategic Issues (Cl. 4.1)
                            </CardTitle>
                            <CardDescription className="text-[10px]">Internal and external factors affecting EMS</CardDescription>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold" onClick={onAddIssue}>
                            <Plus className="h-3 w-3 mr-1" /> Log Issue
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400 pl-6">Category</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Issue Description</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Risk/Impact</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {issues.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-40 text-center text-slate-400">
                                            <Info className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-xs">No strategic issues logged.</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    issues.map((issue: any) => (
                                        <TableRow key={issue.id} className="group transition-colors hover:bg-slate-50/50">
                                            <TableCell className="pl-6">
                                                <Badge className={`text-[9px] font-black uppercase px-1.5 py-0 ${issue.type === 'Internal' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                                                    {issue.requirement || 'General'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-[11px] font-bold text-slate-700 max-w-[200px]">{issue.issue}</TableCell>
                                            <TableCell className="text-[10px] text-slate-500 italic">"{issue.impact || 'N/A'}"</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-[10px] font-bold text-slate-600">{issue.status}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Users className="h-4 w-4 text-indigo-500" />
                                Interested Parties (Cl. 4.2)
                            </CardTitle>
                            <CardDescription className="text-[10px]">Needs and expectations of stakeholders</CardDescription>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold" onClick={onAddParty}>
                            <Plus className="h-3 w-3 mr-1" /> Log Stakeholder
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400 pl-6">Party</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Needs & Expectations</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Mandate</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-slate-400">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {interestedParties.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-40 text-center text-slate-400">
                                            <Users className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-xs">No interested parties registered.</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    interestedParties.map((party: any) => (
                                        <TableRow key={party.id} className="group transition-colors hover:bg-slate-50/50">
                                            <TableCell className="pl-6 text-[11px] font-black text-slate-900">{party.party}</TableCell>
                                            <TableCell className="max-w-[200px]">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[10px] font-bold text-slate-700">{party.needs}</span>
                                                    <span className="text-[9px] text-slate-400 italic line-clamp-1">{party.expectations}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {party.isLegalObligation ? (
                                                    <Badge className="text-[8px] bg-red-50 text-red-700 border-red-100 hover:bg-red-100 font-black uppercase px-1 leading-none">Legal Obligation</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-[8px] text-slate-400 border-slate-200 uppercase px-1 leading-none font-bold">Voluntary</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="ghost" className="text-[9px] font-bold text-emerald-600 bg-emerald-50/50 px-1.5 py-0">Monitoring</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <Alert className="bg-slate-900 border-none text-slate-100 rounded-xl py-6">
                <Target className="h-5 w-5 text-emerald-400" />
                <div className="ml-4">
                    <AlertCircle className="absolute right-6 top-6 h-8 w-8 opacity-10" />
                    <h5 className="font-bold text-sm">Clause 4: Audit Readiness Insight</h5>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                        The organization has determined all internal and external issues relevant to its purpose.
                        Interested parties are identified, and their needs are matched against our compliance obligations.
                        This registry is reviewed annually or during major operational changes.
                    </p>
                </div>
            </Alert>
        </div>
    )
}

function Alert({ children, className }: any) {
    return (
        <div className={`relative flex items-center p-4 border rounded-lg ${className}`}>
            {children}
        </div>
    )
}
