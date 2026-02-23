"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LayoutDashboard, BookOpen, Target, Settings, BarChart3, ShieldAlert, History } from "lucide-react"

export function ISOClauseTabs({ children }: { children: React.ReactNode }) {
    return (
        <Tabs defaultValue="overview" className="space-y-4">
            <div className="flex items-center justify-between bg-slate-100/50 p-1.5 rounded-lg border border-slate-200 shadow-sm">
                <TabsList className="grid grid-cols-4 lg:grid-cols-7 bg-transparent h-auto gap-1">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-3 text-xs font-semibold">
                        <LayoutDashboard className="h-3.5 w-3.5 mr-2" /> Overview
                    </TabsTrigger>
                    <TabsTrigger value="context" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-3 text-xs font-semibold">
                        <BookOpen className="h-3.5 w-3.5 mr-2" /> Context (Cl. 4)
                    </TabsTrigger>
                    <TabsTrigger value="aspects" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-3 text-xs font-semibold">
                        <BarChart3 className="h-3.5 w-3.5 mr-2" /> Aspects (Cl. 6)
                    </TabsTrigger>
                    <TabsTrigger value="legal" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-3 text-xs font-semibold">
                        <ShieldAlert className="h-3.5 w-3.5 mr-2" /> Legal (Cl. 6)
                    </TabsTrigger>
                    <TabsTrigger value="objectives" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-3 text-xs font-semibold">
                        <Target className="h-3.5 w-3.5 mr-2" /> Objectives (Cl. 6)
                    </TabsTrigger>
                    <TabsTrigger value="operations" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-3 text-xs font-semibold">
                        <Settings className="h-3.5 w-3.5 mr-2" /> Operations (Cl. 8)
                    </TabsTrigger>
                    <TabsTrigger value="capa" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-3 text-xs font-semibold">
                        <History className="h-3.5 w-3.5 mr-2" /> CAPA (Cl. 10)
                    </TabsTrigger>
                </TabsList>
            </div>
            {children}
        </Tabs>
    )
}
