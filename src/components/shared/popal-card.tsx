"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCheck, ShieldCheck, ShieldAlert, FileWarning, Briefcase, CheckCircle2 } from "lucide-react"

type PopalProfile = {
    id: string;
    name: string;
    certificationNumber: string;
    certifiedBy: string;
    validityStart: Date;
    validityEnd: Date;
    status: string | null;
}

export function PopalCard({ profile, violationCount }: { profile: PopalProfile | null, violationCount: number }) {
    if (!profile) {
        return (
            <Card className="border-red-200 bg-red-50/50 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-red-700 flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5" />
                        No Active POPAL
                    </CardTitle>
                    <CardDescription className="text-red-600/80">
                        Warning: Government regulations (PP 22/2021) require a certified operator (POPAL) to manage IPAL.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const today = new Date();
    const isExpired = profile.status === "expired" || profile.status === "revoked" || new Date(profile.validityEnd) < today;
    const daysUntilExpiry = Math.ceil((new Date(profile.validityEnd).getTime() - today.getTime()) / (1000 * 3600 * 24));

    let validityBadge;
    if (isExpired) {
        validityBadge = <Badge variant="destructive">Expired</Badge>;
    } else if (daysUntilExpiry < 90) {
        validityBadge = <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Expires soon ({daysUntilExpiry} days)</Badge>;
    } else {
        validityBadge = <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Active</Badge>;
    }

    return (
        <Card className="relative overflow-hidden shadow-sm border-slate-200">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isExpired || violationCount > 3 ? 'bg-red-500' : 'bg-emerald-500'}`} />

            <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                        {profile.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-slate-700">Certified POPAL</span>
                        {validityBadge}
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                        Certification No.
                    </div>
                    <code className="text-sm bg-slate-100 px-2 py-1 rounded-md text-slate-800 font-mono">
                        {profile.certificationNumber}
                    </code>
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-between border-t pt-4 mt-2">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-slate-600">Issued by: <strong>{profile.certifiedBy}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                        {violationCount > 0 ? (
                            <>
                                <FileWarning className="h-4 w-4 text-amber-600" />
                                <span className="text-sm text-amber-700 font-medium">{violationCount} Recent Violations</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <span className="text-sm text-emerald-700 font-medium">0 Violations (Clean Record)</span>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
