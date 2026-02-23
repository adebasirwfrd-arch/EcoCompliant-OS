"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Area,
    Line, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { Truck, PackageOpen, PieChart as PieIcon, Activity, TrendingUp } from "lucide-react";
import { format, subMonths, isSameMonth } from "date-fns";

type WasteRecord = {
    id: string;
    wasteCode: string;
    wasteCategory: string;
    weight: number;
    unit: string | null;
    generatorDate: Date;
    status: string | null;
};

const COLORS = ['#fbbf24', '#f87171', '#38bdf8', '#34d399', '#818cf8'];

export function WasteChartsGod({ records }: { records: WasteRecord[] }) {
    // 1. Last 6 Months Trends (Stacked Area)
    const trendData = useMemo(() => {
        const months = Array.from({ length: 6 }).map((_, i) => {
            const d = subMonths(new Date(), 5 - i);
            return {
                month: format(d, 'MMM'),
                rawDate: d,
                cat1: 0,
                cat2: 0,
                transferred: 0
            };
        });

        records.forEach(r => {
            const d = new Date(r.generatorDate);
            const target = months.find(m => isSameMonth(m.rawDate, d));
            if (target) {
                const weight = r.unit === 'kg' ? r.weight / 1000 : r.weight;
                if (r.wasteCategory === '1') target.cat1 += weight;
                else target.cat2 += weight;

                if (r.status === 'transported' || r.status === 'processed') {
                    target.transferred += weight;
                }
            }
        });
        return months;
    }, [records]);

    // 2. Waste Composition (Pie)
    const compositionData = useMemo(() => {
        const cats = new Map<string, number>();
        records.forEach(r => {
            const weight = r.unit === 'kg' ? r.weight / 1000 : r.weight;
            cats.set(r.wasteCategory, (cats.get(r.wasteCategory) || 0) + weight);
        });
        return Array.from(cats.entries()).map(([name, value]) => ({
            name: `Category ${name}`,
            value
        }));
    }, [records]);

    // 3. Handling Efficiency (Gauge Simulation)
    const totalGenerated = trendData.reduce((acc, curr) => acc + curr.cat1 + curr.cat2, 0);
    const totalTransferred = trendData.reduce((acc, curr) => acc + curr.transferred, 0);
    const efficiency = totalGenerated > 0 ? (totalTransferred / totalGenerated) * 100 : 0;

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Generation Flow Chart */}
            <Card className="lg:col-span-2 shadow-sm border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-amber-500" />
                            Generation vs Handover Trends
                        </CardTitle>
                        <CardDescription>Comparison of generated LB3 vs handover to third parties.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(t) => `${t}T`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="top" height={36} />
                                <Area type="monotone" dataKey="cat1" name="Category 1" stackId="1" stroke="#f87171" fill="#f87171" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="cat2" name="Category 2" stackId="1" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.6} />
                                <Line type="monotone" dataKey="transferred" name="Handover (Out)" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 6 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Composition & Efficiency */}
            <div className="space-y-6">
                <Card className="shadow-sm border-slate-200 h-full">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <PieIcon className="h-4 w-4 text-emerald-500" />
                            Waste Category Split
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={compositionData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {compositionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 font-medium">Clearance Rate</span>
                                <span className="font-bold text-slate-900">{efficiency.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div
                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${efficiency}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2 italic">
                                Percentage of generated waste that has been handed over to third parties.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

import { useMemo } from "react"
