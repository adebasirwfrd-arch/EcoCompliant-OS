"use client"

import Link from "next/link"
import { ShieldCheck, Trees } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
            <Card className="w-[400px] shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2 font-bold text-2xl text-emerald-600">
                            <Trees className="h-8 w-8" />
                            <span>EcoCompliant OS</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Sign in</CardTitle>
                    <CardDescription>
                        Enter your credentials to access the Environmental Management System
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="specialist@company.com" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                        <Link href="/dashboard">Sign In</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
