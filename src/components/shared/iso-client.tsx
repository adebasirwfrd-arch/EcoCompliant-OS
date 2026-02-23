"use client"

import { useState } from "react"
import { ISODashboardHeader } from "./iso-dashboard-header"
import { ISOClauseTabs } from "./iso-clause-tabs"
import { ISOAspectHeatmap } from "./iso-aspect-heatmap"
import { ISOIntelligenceCharts } from "./iso-intelligence-charts"

import { ISOAspectTable, ISOLegalTable, ISOObjectiveTable, ISOCapaTable } from "./iso-clause-tables"
import {
    ISOAspectForm,
    ISOLegalForm,
    ISOContextIssueForm,
    ISOInterestedPartyForm,
    ISOOperationalControlForm,
    ISOEmergencyPrepForm,
    ISOPerformanceMonitoringForm,
    ISOInternalAuditForm,
    ISOObjectiveForm,
    ISOCAPAForm
} from "./iso-forms"
import { ISOContextModule } from "./iso-context-module"
import { ISOOperationsModule } from "./iso-operations-module"
import { ISOPerformanceModule } from "./iso-performance-module"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Download, ShieldCheck, HelpCircle, BookOpen, AlertCircle } from "lucide-react"
import { upsertISOAspect, upsertISOLegalRequirement, upsertISOObjective, upsertISOCAPA } from "@/app/actions/iso14001"
import {
    upsertInterestedParty,
    upsertOperationalControl,
    upsertEmergencyPrep,
    upsertPerformanceMonitoring,
    upsertInternalAudit
} from "@/app/actions/iso-extended"
import { toast } from "sonner"

export function ISO14001Client({
    aspects,
    legal,
    objectives,
    risks,
    capa,
    metrics,
    intel,
    interestedParties = [],
    controls = [],
    emergencyPrep = [],
    monitoring = [],
    audits = [],
    strategicIssues = []
}: any) {
    const [activeDialog, setActiveDialog] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleFormSubmit = async (type: string, data: any) => {
        try {
            if (type === 'aspect') await upsertISOAspect(data);
            if (type === 'legal') await upsertISOLegalRequirement(data);
            if (type === 'issue') await upsertInterestedParty({ ...data, type: 'Strategic Issue' }); // Reusing interested parties for now or creating separate table call
            if (type === 'party') await upsertInterestedParty(data);
            if (type === 'control') await upsertOperationalControl(data);
            if (type === 'emergency') await upsertEmergencyPrep(data);
            if (type === 'monitoring') await upsertPerformanceMonitoring(data);
            if (type === 'audit') await upsertInternalAudit(data);
            if (type === 'objective') await upsertISOObjective(data);
            if (type === 'capa') await upsertISOCAPA(data);

            toast.success(`${type.toUpperCase()} record updated.`);
            setActiveDialog(null);
            setSelectedItem(null);
        } catch (error) {
            toast.error("Failed to update record.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic">Super God-Tier EMS</h1>
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        ISO 14001:2015 Enterprise Governance System (Audit-Ready)
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 border-slate-200">
                        <Download className="h-4 w-4 mr-2" /> Data Export (XLS/PDF)
                    </Button>
                    <Button size="sm" className="h-9 bg-slate-900 text-white hover:bg-slate-800" onClick={() => { setSelectedItem(null); setActiveDialog('aspect'); }}>
                        <Plus className="h-4 w-4 mr-2" /> Log Aspect
                    </Button>
                </div>
            </div>

            <ISODashboardHeader metrics={metrics} />

            <ISOClauseTabs>
                <TabsContent value="overview" className="space-y-6 outline-none">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="lg:col-span-1">
                            <ISOAspectHeatmap data={aspects} />
                        </div>
                        <div className="lg:col-span-2">
                            <ISOIntelligenceCharts data={intel} />
                        </div>
                    </div>

                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900 italic">Audit-Critical Aspects Registry</CardTitle>
                                <CardDescription className="text-xs">Identified environmental impacts with high significance score</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="text-[10px] font-bold h-7 border-slate-200">View Full Annex &rarr;</Button>
                        </CardHeader>
                        <CardContent>
                            <ISOAspectTable data={aspects.filter((a: any) => (a.severity * a.probability) >= 12)} onEdit={(item: any) => { setSelectedItem(item); setActiveDialog('aspect'); }} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="context" className="outline-none">
                    <ISOContextModule
                        issues={strategicIssues}
                        interestedParties={interestedParties}
                        onAddIssue={() => { setSelectedItem(null); setActiveDialog('issue'); }}
                        onAddParty={() => { setSelectedItem(null); setActiveDialog('party'); }}
                    />
                </TabsContent>

                <TabsContent value="aspects" className="space-y-4 outline-none">
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-bold">Clause 6.1.2: Environmental Aspects</CardTitle>
                                <CardDescription className="text-xs flex items-center gap-1.5">
                                    <HelpCircle className="h-3 w-3 text-slate-400" />
                                    Identifying and evaluating organization's impact on the environment
                                </CardDescription>
                            </div>
                            <Button size="sm" onClick={() => { setSelectedItem(null); setActiveDialog('aspect'); }}>Add Aspect</Button>
                        </CardHeader>
                        <CardContent>
                            <ISOAspectTable data={aspects} onEdit={(item: any) => { setSelectedItem(item); setActiveDialog('aspect'); }} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="legal" className="space-y-4 outline-none">
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-bold">Clause 6.1.3: Compliance Obligations</CardTitle>
                                <CardDescription className="text-xs">Legal registry and evaluation of compliance</CardDescription>
                            </div>
                            <Button size="sm" onClick={() => { setSelectedItem(null); setActiveDialog('legal'); }}>Add Regulation</Button>
                        </CardHeader>
                        <CardContent>
                            <ISOLegalTable data={legal} onEdit={(item: any) => { setSelectedItem(item); setActiveDialog('legal'); }} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="objectives" className="space-y-4 outline-none">
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-bold">Clause 6.2: Environmental Objectives</CardTitle>
                                <CardDescription className="text-xs">Tracking targets and environmental performance indicators</CardDescription>
                            </div>
                            <Button size="sm" onClick={() => { setSelectedItem(null); setActiveDialog('objective'); }}>New Objective</Button>
                        </CardHeader>
                        <CardContent>
                            <ISOObjectiveTable data={objectives} onEdit={(item: any) => { setSelectedItem(item); setActiveDialog('objective'); }} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="operations" className="outline-none">
                    <ISOOperationsModule
                        controls={controls}
                        emergencyPrep={emergencyPrep}
                        onAddControl={() => { setSelectedItem(null); setActiveDialog('control'); }}
                        onAddEmergency={() => { setSelectedItem(null); setActiveDialog('emergency'); }}
                    />
                </TabsContent>

                <TabsContent value="performance" className="outline-none">
                    <ISOPerformanceModule
                        monitoring={monitoring}
                        audits={audits}
                        onAddMonitoring={() => { setSelectedItem(null); setActiveDialog('monitoring'); }}
                        onAddAudit={() => { setSelectedItem(null); setActiveDialog('audit'); }}
                    />
                </TabsContent>

                <TabsContent value="capa" className="space-y-4 outline-none">
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-bold">Clause 10.2: Non-conformity & CAPA</CardTitle>
                                <CardDescription className="text-xs italic">Corrective and Preventive Actions for EMS improvement</CardDescription>
                            </div>
                            <Button size="sm" onClick={() => { setSelectedItem(null); setActiveDialog('capa'); }}>Report NC</Button>
                        </CardHeader>
                        <CardContent>
                            <ISOCapaTable data={capa} onEdit={(item: any) => { setSelectedItem(item); setActiveDialog('capa'); }} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </ISOClauseTabs>

            <Dialog open={activeDialog !== null} onOpenChange={(open) => !open && setActiveDialog(null)}>
                <DialogContent className="max-w-xl border-none shadow-2xl rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black text-slate-900 border-l-4 border-blue-500 pl-3 uppercase tracking-tight">
                            {selectedItem ? 'Edit' : 'New'} EMS Record
                        </DialogTitle>
                        <DialogDescription className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1">
                            {activeDialog} Entry Wizard
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4">
                        {activeDialog === 'aspect' && <ISOAspectForm initialData={selectedItem} onSubmit={(d) => handleFormSubmit('aspect', d)} onCancel={() => setActiveDialog(null)} />}
                        {activeDialog === 'legal' && <ISOLegalForm initialData={selectedItem} onSubmit={(d) => handleFormSubmit('legal', d)} onCancel={() => setActiveDialog(null)} />}
                        {activeDialog === 'issue' && <ISOContextIssueForm initialData={selectedItem} onSubmit={(d) => handleFormSubmit('issue', d)} onCancel={() => setActiveDialog(null)} />}
                        {activeDialog === 'party' && <ISOInterestedPartyForm initialData={selectedItem} onSubmit={(d) => handleFormSubmit('party', d)} onCancel={() => setActiveDialog(null)} />}
                        {activeDialog === 'control' && <ISOOperationalControlForm initialData={selectedItem} onSubmit={(d) => handleFormSubmit('control', d)} onCancel={() => setActiveDialog(null)} />}
                        {activeDialog === 'emergency' && <ISOEmergencyPrepForm initialData={selectedItem} onSubmit={(d) => handleFormSubmit('emergency', d)} onCancel={() => setActiveDialog(null)} />}
                        {activeDialog === 'monitoring' && <ISOPerformanceMonitoringForm initialData={selectedItem} onSubmit={(d) => handleFormSubmit('monitoring', d)} onCancel={() => setActiveDialog(null)} />}
                        {activeDialog === 'audit' && <ISOInternalAuditForm initialData={selectedItem} onSubmit={(d) => handleFormSubmit('audit', d)} onCancel={() => setActiveDialog(null)} />}
                        {activeDialog === 'objective' && <ISOObjectiveForm initialData={selectedItem} onSubmit={(d) => handleFormSubmit('objective', d)} onCancel={() => setActiveDialog(null)} />}
                        {activeDialog === 'capa' && <ISOCAPAForm initialData={selectedItem} onSubmit={(d) => handleFormSubmit('capa', d)} onCancel={() => setActiveDialog(null)} />}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
