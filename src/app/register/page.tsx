"use client"

import Link from "next/link"
import { Trees, UserPlus, Mail, Lock, User, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { authClient } from "@/lib/auth"
import { toast } from "sonner"

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulating registration
        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const email = formData.get("email") as string
        const name = formData.get("name") as string
        const role = formData.get("role") as string

        await authClient.signUp({ email, name, role })
        toast.success("Account created successfully!")
        setIsLoading(false)
        // In a real app, redirect after success
    }

    return (
        <div className="flex min-h-screen w-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-[450px] shadow-2xl border-none bg-white/80 backdrop-blur-xl">
                <CardHeader className="space-y-1 text-center pb-8 border-b border-slate-100 mb-6">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2 font-black text-3xl text-emerald-600 tracking-tighter">
                            <Trees className="h-10 w-10" />
                            <span>EcoCompliant OS</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900">Create Account</CardTitle>
                    <CardDescription className="text-slate-500 font-medium italic">
                        Join the Environmental Management & Compliance Platform
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input id="name" name="name" placeholder="John Doe" className="pl-10 rounded-xl bg-slate-50/50 border-slate-200" required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input id="email" name="email" type="email" placeholder="specialist@company.com" className="pl-10 rounded-xl bg-slate-50/50 border-slate-200" required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role" className="text-xs font-bold uppercase tracking-widest text-slate-500">System Role</Label>
                            <Select name="role" defaultValue="specialist">
                                <SelectTrigger className="rounded-xl bg-slate-50/50 border-slate-200 h-11">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="admin">Administrator</SelectItem>
                                    <SelectItem value="specialist">Compliance Specialist</SelectItem>
                                    <SelectItem value="supervisor">Project Supervisor</SelectItem>
                                    <SelectItem value="auditor">Environmental Auditor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input id="password" name="password" type="password" className="pl-10 rounded-xl bg-slate-50/50 border-slate-200" required />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 mt-6">
                        <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold shadow-lg shadow-emerald-200" disabled={isLoading}>
                            {isLoading ? "Creating Account..." : "Create Account"}
                            <UserPlus className="ml-2 h-5 w-5" />
                        </Button>
                        <div className="text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link href="/login" className="text-emerald-600 font-bold hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
