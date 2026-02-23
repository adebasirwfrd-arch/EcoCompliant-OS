"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import { Truck, PackageOpen } from "lucide-react";
import { format, subMonths, isSameMonth } from "date-fns";

type WasteRecord = {
    id: string;
    manifestNumber: string;
    wasteType: string;
    weight: number;
    unit: string | null;
    generatorDate: Date;
    status: string | null;
};

export function WasteCharts({ records }: { records: WasteRecord[] }) {
    // Generate last 6 months data for the chart
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(new Date(), 5 - i);
        return {
            month: format(d, 'MMM yyyy'),
            rawDate: d,
            generated: 0,
            transported: 0
        };
    });

    // Aggregate data
    records.forEach(req => {
        const genDate = new Date(req.generatorDate);
        const targetMonth = last6Months.find(m => isSameMonth(m.rawDate, genDate));

        if (targetMonth) {
            // Convert to consistent unit for chart (assumes base is Ton)
            const weightInTons = req.unit === 'kg' ? req.weight / 1000 : req.weight;

            targetMonth.generated += weightInTons;
            if (req.status === 'transported' || req.status === 'processed') {
                targetMonth.transported += weightInTons;
            }
        }
    });

    // Formatting Tooltips
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-200 shadow-md rounded-md">
                    <p className="font-bold text-slate-700 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm font-medium flex justify-between gap-4">
                            <span>{entry.name}:</span>
                            <span>{entry.value.toFixed(2)} Ton</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="shadow-sm border-none bg-white">
            <CardHeader className="pb-4 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <PackageOpen className="h-5 w-5 text-amber-500" />
                            Waste Generation vs Transported (6 Months)
                        </CardTitle>
                        <CardDescription>Neraca Limbah B3 analysis comparing generated volume against transferred volume to third parties.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 pl-0">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={last6Months}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                tickFormatter={(val) => `${val} T`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                            <Bar
                                dataKey="generated"
                                name="Generated (Limba Dihasilkan)"
                                fill="#f59e0b"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                            <Line
                                type="monotone"
                                dataKey="transported"
                                name="Transported (Limba Diserahkan)"
                                stroke="#0ea5e9"
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
