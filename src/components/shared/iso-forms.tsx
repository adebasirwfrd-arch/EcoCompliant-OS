"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ISOAspectInput, ISOLegalInput, ISOCAPAInput, ISOObjectiveInput } from "@/app/actions/iso14001"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Info } from "lucide-react"
import { format } from "date-fns"

export function ISOAspectForm({ initialData, onSubmit, onCancel }: { initialData?: any, onSubmit: (data: ISOAspectInput) => void, onCancel: () => void }) {
    const [formData, setFormData] = useState<ISOAspectInput>(initialData || {
        activity: "", aspect: "", impact: "", condition: "Normal", severity: 3, probability: 3, controlMeasures: "", status: "Active"
    });

    const significance = formData.severity * formData.probability;
    const isSignificant = significance >= 12;

    return (
        <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Activity / Process</Label>
                    <Input value={formData.activity} onChange={(e) => setFormData({ ...formData, activity: e.target.value })} placeholder="e.g. Chemical Storage" className="h-9 text-xs" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Environmental Aspect</Label>
                    <Input value={formData.aspect} onChange={(e) => setFormData({ ...formData, aspect: e.target.value })} placeholder="e.g. Accidental Spillage" className="h-9 text-xs" />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Potential Environmental Impact</Label>
                <Textarea value={formData.impact} onChange={(e) => setFormData({ ...formData, impact: e.target.value })} placeholder="e.g. Ground water contamination" className="text-xs min-h-[60px]" />
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-6">
                <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-700">Significance Scoring (Clause 6.1.2)</Label>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${isSignificant ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-500 text-white'}`}>
                        Score: {significance} {isSignificant ? '(Significant)' : '(Low Risk)'}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                            <span>Severity (Impact)</span>
                            <span className="text-slate-900">{formData.severity} / 5</span>
                        </div>
                        <Slider
                            value={[formData.severity]}
                            max={5} min={1} step={1}
                            onValueChange={([v]: number[]) => setFormData({ ...formData, severity: v })}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                            <span>Probability (Likelihood)</span>
                            <span className="text-slate-900">{formData.probability} / 5</span>
                        </div>
                        <Slider
                            value={[formData.probability]}
                            max={5} min={1} step={1}
                            onValueChange={([v]: number[]) => setFormData({ ...formData, probability: v })}
                        />
                    </div>
                </div>
            </div>

            {isSignificant && (
                <Alert className="bg-red-50 border-red-100 py-3">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-xs font-bold text-red-700">Audit-Critical Aspect</AlertTitle>
                    <AlertDescription className="text-[10px] text-red-600">
                        Significant aspects MUST have defined operational controls and monitoring targets.
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Operational Controls</Label>
                <Textarea value={formData.controlMeasures || ""} onChange={(e) => setFormData({ ...formData, controlMeasures: e.target.value })} placeholder="Spill kits, Bunding, Bi-weekly inspections..." className="text-xs min-h-[60px]" />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
                <Button size="sm" onClick={() => onSubmit(formData)} className="bg-slate-900 text-white hover:bg-slate-800">
                    {initialData ? "Update Aspect" : "Finalize Aspect Entry"}
                </Button>
            </div>
        </div>
    )
}

export function ISOLegalForm({ initialData, onSubmit, onCancel }: { initialData?: any, onSubmit: (data: ISOLegalInput) => void, onCancel: () => void }) {
    const [formData, setFormData] = useState<ISOLegalInput>(initialData || {
        regulationName: "", clause: "", summary: "", relevance: "", complianceStatus: "Compliant"
    });

    return (
        <div className="space-y-4 py-2">
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Regulation Name</Label>
                <Input value={formData.regulationName} onChange={(e) => setFormData({ ...formData, regulationName: e.target.value })} placeholder="e.g. PP 22 Tahun 2021" className="h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Applicable Clause(s)</Label>
                    <Input value={formData.clause || ""} onChange={(e) => setFormData({ ...formData, clause: e.target.value })} placeholder="Clause 4, Annex 3..." className="h-9 text-xs" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Compliance Status</Label>
                    <Select value={formData.complianceStatus} onValueChange={(v: "Compliant" | "Non-Compliant" | "N/A") => setFormData({ ...formData, complianceStatus: v })}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Compliant">Compliant</SelectItem>
                            <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                            <SelectItem value="N/A">N/A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Legal Relevance / Commitment</Label>
                <Textarea value={formData.relevance} onChange={(e) => setFormData({ ...formData, relevance: e.target.value })} placeholder="How does this apply to our operations?" className="text-xs min-h-[80px]" />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
                <Button size="sm" onClick={() => onSubmit(formData)} className="bg-slate-900 text-white hover:bg-slate-800">
                    Save Regulation
                </Button>
            </div>
        </div>
    )
}

export function ISOContextIssueForm({ initialData, onSubmit, onCancel }: { initialData?: any, onSubmit: (data: any) => void, onCancel: () => void }) {
    const [formData, setFormData] = useState(initialData || { type: "External", requirement: "General", issue: "", impact: "", status: "Active" });
    return (
        <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Issue Category</Label>
                    <Select value={formData.requirement} onValueChange={(v) => setFormData({ ...formData, requirement: v })}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Internal">Internal (Strength/Weakness)</SelectItem>
                            <SelectItem value="External">External (Opportunity/Threat)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Context Label</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Political">Political</SelectItem>
                            <SelectItem value="Economic">Economic</SelectItem>
                            <SelectItem value="Social">Social</SelectItem>
                            <SelectItem value="Technological">Technological</SelectItem>
                            <SelectItem value="Environmental">Environmental</SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Issue Description (SWOT/PESTLE)</Label>
                <Input value={formData.issue} onChange={(e) => setFormData({ ...formData, issue: e.target.value })} placeholder="e.g. Tightening regional emissions regulations" className="h-9 text-xs" />
            </div>
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Strategic Impact on EMS</Label>
                <Textarea value={formData.impact} onChange={(e) => setFormData({ ...formData, impact: e.target.value })} placeholder="How does this factor influence our ability to achieve environmental outcomes?" className="text-xs min-h-[80px]" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
                <Button size="sm" onClick={() => onSubmit(formData)} className="bg-slate-900 text-white hover:bg-slate-800">Save Issue</Button>
            </div>
        </div>
    )
}

export function ISOInterestedPartyForm({ initialData, onSubmit, onCancel }: { initialData?: any, onSubmit: (data: any) => void, onCancel: () => void }) {
    const [formData, setFormData] = useState(initialData || { party: "", needs: "", expectations: "", isLegalObligation: false });
    return (
        <div className="space-y-4 py-2">
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Interested Party (Stakeholder)</Label>
                <Input value={formData.party} onChange={(e) => setFormData({ ...formData, party: e.target.value })} placeholder="e.g. Local Community, Investors, Regulators" className="h-9 text-xs" />
            </div>
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Needs & Requirements</Label>
                <Textarea value={formData.needs} onChange={(e) => setFormData({ ...formData, needs: e.target.value })} placeholder="What do they mandatory require from us?" className="text-xs min-h-[60px]" />
            </div>
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Expectations</Label>
                <Textarea value={formData.expectations} onChange={(e) => setFormData({ ...formData, expectations: e.target.value })} placeholder="What are their voluntary expectations?" className="text-xs min-h-[60px]" />
            </div>
            <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <input type="checkbox" checked={formData.isLegalObligation} onChange={(e) => setFormData({ ...formData, isLegalObligation: e.target.checked })} id="legal" className="h-4 w-4 rounded border-slate-300" />
                <Label htmlFor="legal" className="text-xs font-bold text-slate-700">This is a Mandatory Legal Obligation</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
                <Button size="sm" onClick={() => onSubmit(formData)} className="bg-slate-900 text-white hover:bg-slate-800">Save Party</Button>
            </div>
        </div>
    )
}

export function ISOOperationalControlForm({ initialData, onSubmit, onCancel }: { initialData?: any, onSubmit: (data: any) => void, onCancel: () => void }) {
    const [formData, setFormData] = useState(initialData || { procedureName: "", department: "", controlMethod: "Engineering", frequency: "Daily", pic: "" });
    return (
        <div className="space-y-4 py-2">
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Procedure Name (OCP)</Label>
                <Input value={formData.procedureName} onChange={(e) => setFormData({ ...formData, procedureName: e.target.value })} placeholder="e.g. Hazardous Waste Storage Management" className="h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Control Hierarchy</Label>
                    <Select value={formData.controlMethod} onValueChange={(v) => setFormData({ ...formData, controlMethod: v })}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Elimination">Elimination</SelectItem>
                            <SelectItem value="Substitution">Substitution</SelectItem>
                            <SelectItem value="Engineering">Engineering Controls</SelectItem>
                            <SelectItem value="Administrative">Administrative Controls</SelectItem>
                            <SelectItem value="PPE">PPE</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Review Frequency</Label>
                    <Input value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value })} placeholder="e.g. Quarterly" className="h-9 text-xs" />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Person in Charge (PIC)</Label>
                <Input value={formData.pic} onChange={(e) => setFormData({ ...formData, pic: e.target.value })} placeholder="e.g. EHS Coordinator" className="h-9 text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
                <Button size="sm" onClick={() => onSubmit(formData)} className="bg-slate-900 text-white hover:bg-slate-800">Save OCP</Button>
            </div>
        </div>
    )
}

export function ISOEmergencyPrepForm({ initialData, onSubmit, onCancel }: { initialData?: any, onSubmit: (data: any) => void, onCancel: () => void }) {
    const [formData, setFormData] = useState(initialData || { scenario: "", responsePlan: "", equipmentRequired: "", status: "Ready" });
    return (
        <div className="space-y-4 py-2">
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Emergency Scenario</Label>
                <Input value={formData.scenario} onChange={(e) => setFormData({ ...formData, scenario: e.target.value })} placeholder="e.g. Major Chemical Leak in Phase 2" className="h-9 text-xs" />
            </div>
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Brief Response Plan</Label>
                <Textarea value={formData.responsePlan} onChange={(e) => setFormData({ ...formData, responsePlan: e.target.value })} placeholder="Evacuation, shutdown procedure..." className="text-xs min-h-[60px]" />
            </div>
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Critical Equipment Status</Label>
                <Textarea value={formData.equipmentRequired} onChange={(e) => setFormData({ ...formData, equipmentRequired: e.target.value })} placeholder="Spill kits (12), Gas masks (5), Eyewash..." className="text-xs min-h-[60px]" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
                <Button size="sm" onClick={() => onSubmit(formData)} className="bg-slate-900 text-white hover:bg-slate-800">Finalize Scenario</Button>
            </div>
        </div>
    )
}

export function ISOPerformanceMonitoringForm({ initialData, onSubmit, onCancel }: { initialData?: any, onSubmit: (data: any) => void, onCancel: () => void }) {
    const [formData, setFormData] = useState(initialData || { indicatorName: "", unit: "", baselineValue: 0, targetValue: 0, currentValue: 0, status: "On Track" });
    return (
        <div className="space-y-4 py-2">
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">KPI Indicator Name</Label>
                <Input value={formData.indicatorName} onChange={(e) => setFormData({ ...formData, indicatorName: e.target.value })} placeholder="e.g. Hazardous Waste Generation Intensity" className="h-9 text-xs" />
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Baseline</Label>
                    <Input type="number" value={formData.baselineValue} onChange={(e) => setFormData({ ...formData, baselineValue: Number(e.target.value) })} className="h-9 text-xs" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Target</Label>
                    <Input type="number" value={formData.targetValue} onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })} className="h-9 text-xs" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Current</Label>
                    <Input type="number" value={formData.currentValue} onChange={(e) => setFormData({ ...formData, currentValue: Number(e.target.value) })} className="h-9 text-xs" />
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
                <Button size="sm" onClick={() => onSubmit(formData)} className="bg-slate-900 text-white hover:bg-slate-800">Save Indicator</Button>
            </div>
        </div>
    )
}

export function ISOInternalAuditForm({ initialData, onSubmit, onCancel }: { initialData?: any, onSubmit: (data: any) => void, onCancel: () => void }) {
    const [formData, setFormData] = useState(initialData || { auditTitle: "", auditDate: format(new Date(), 'yyyy-MM-dd'), auditorName: "", majorNC: 0, minorNC: 0, ofi: 0, status: "Planned" });
    return (
        <div className="space-y-4 py-2">
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Audit Title / Scope</Label>
                <Input value={formData.auditTitle} onChange={(e) => setFormData({ ...formData, auditTitle: e.target.value })} placeholder="e.g. EMS Internal Audit H1 2026" className="h-9 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Audit Date</Label>
                    <Input type="date" value={formData.auditDate} onChange={(e) => setFormData({ ...formData, auditDate: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Auditor(s)</Label>
                    <Input value={formData.auditorName} onChange={(e) => setFormData({ ...formData, auditorName: e.target.value })} placeholder="External / Certified Internal" className="h-9 text-xs" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500 text-red-600">Major NC</Label>
                    <Input type="number" value={formData.majorNC} onChange={(e) => setFormData({ ...formData, majorNC: Number(e.target.value) })} className="h-9 text-xs" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500 text-amber-600">Minor NC</Label>
                    <Input type="number" value={formData.minorNC} onChange={(e) => setFormData({ ...formData, minorNC: Number(e.target.value) })} className="h-9 text-xs" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500 text-blue-600">OFI</Label>
                    <Input type="number" value={formData.ofi} onChange={(e) => setFormData({ ...formData, ofi: Number(e.target.value) })} className="h-9 text-xs" />
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
                <Button size="sm" onClick={() => onSubmit(formData)} className="bg-slate-900 text-white hover:bg-slate-800">Log Audit Record</Button>
            </div>
        </div>
    )
}

export function ISOObjectiveForm({ initialData, onSubmit, onCancel }: { initialData?: any, onSubmit: (data: ISOObjectiveInput) => void, onCancel: () => void }) {
    const [formData, setFormData] = useState<ISOObjectiveInput>(initialData || {
        objective: "", targetValue: "", indicator: "", baseline: "", progress: 0, deadline: format(new Date(), 'yyyy-MM-dd'), department: "", status: "On Track"
    });

    return (
        <div className="space-y-4 py-2">
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Environmental Objective (Cl. 6.2)</Label>
                <Input value={formData.objective} onChange={(e) => setFormData({ ...formData, objective: e.target.value })} placeholder="e.g. Reduce GHG emissions by 10%" className="h-9 text-xs font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Target Value</Label>
                    <Input value={formData.targetValue} onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })} placeholder="e.g. 500 Tons CO2e" className="h-9 text-xs" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">KPI Indicator</Label>
                    <Input value={formData.indicator} onChange={(e) => setFormData({ ...formData, indicator: e.target.value })} placeholder="e.g. tCO2e / Annum" className="h-9 text-xs" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Deadline</Label>
                    <Input type="date" value={typeof formData.deadline === 'string' ? formData.deadline : format(formData.deadline, 'yyyy-MM-dd')} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Department / PIC</Label>
                    <Input value={formData.department || ""} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. Operations / John Doe" className="h-9 text-xs" />
                </div>
            </div>
            <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Performance Progress</span>
                    <span className="text-slate-900 font-black">{formData.progress}%</span>
                </div>
                <Slider
                    value={[formData.progress || 0]}
                    max={100} min={0} step={1}
                    onValueChange={([v]: number[]) => setFormData({ ...formData, progress: v })}
                />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
                <Button size="sm" onClick={() => onSubmit(formData)} className="bg-slate-900 text-white hover:bg-emerald-600 transition-colors">Save Objective</Button>
            </div>
        </div>
    )
}

export function ISOCAPAForm({ initialData, onSubmit, onCancel }: { initialData?: any, onSubmit: (data: ISOCAPAInput) => void, onCancel: () => void }) {
    const [formData, setFormData] = useState<ISOCAPAInput>(initialData || {
        source: "Internal Audit", description: "", ncType: "Minor", rootCause: "", correctiveAction: "", dueDate: format(new Date(), 'yyyy-MM-dd'), status: "Open"
    });

    return (
        <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">NC Source</Label>
                    <Input value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} placeholder="e.g. Audit, Incident" className="h-9 text-xs" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Severity Type</Label>
                    <Select value={formData.ncType} onValueChange={(v: "Major" | "Minor" | "OFI") => setFormData({ ...formData, ncType: v })}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Major">Major Non-Conformity</SelectItem>
                            <SelectItem value="Minor">Minor Non-Conformity</SelectItem>
                            <SelectItem value="OFI">Opportunity for Improvement</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Description of Non-Conformity (Cl. 10.2)</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe what went wrong..." className="text-xs min-h-[60px]" />
            </div>
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Root Cause Analysis</Label>
                <Textarea value={formData.rootCause || ""} onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })} placeholder="Why did it happen?" className="text-xs min-h-[60px] bg-amber-50/20" />
            </div>
            <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500">Corrective / Preventive Action</Label>
                <Textarea value={formData.correctiveAction || ""} onChange={(e) => setFormData({ ...formData, correctiveAction: e.target.value })} placeholder="What will be done?" className="text-xs min-h-[60px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Resolution Due Date</Label>
                    <Input type="date" value={typeof formData.dueDate === 'string' ? formData.dueDate : format(formData.dueDate, 'yyyy-MM-dd')} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="h-9 text-xs" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase text-slate-500">Current Status</Label>
                    <Select value={formData.status} onValueChange={(v: "Open" | "Verified" | "Closed") => setFormData({ ...formData, status: v })}>
                        <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Open">Logged / Open</SelectItem>
                            <SelectItem value="Verified">Verified</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
                <Button size="sm" onClick={() => onSubmit(formData)} className="bg-slate-900 text-white hover:bg-slate-800">Finalize CAPA Record</Button>
            </div>
        </div>
    )
}
