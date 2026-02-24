"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    ShieldCheck,
    Droplets,
    Trash2,
    Trees,
    CloudRain,
    Settings,
    FileText,
    UserCheck,
    ClipboardList,
    Award,
    Recycle,
    Globe,
    Scale,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

const data = {
    navMain: [
        {
            title: "Core Operations",
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                    icon: LayoutDashboard,
                },
                {
                    title: "Compliance & SIMPEL",
                    url: "/dashboard/compliance",
                    icon: ShieldCheck,
                },
                {
                    title: "AMDAL Management",
                    url: "/dashboard/amdal",
                    icon: FileText,
                },
            ],
        },
        {
            title: "Environmental Control",
            items: [
                {
                    title: "IPAL & POPAL",
                    url: "/dashboard/wastewater",
                    icon: Droplets,
                },
                {
                    title: "B3 Waste Management",
                    url: "/dashboard/waste",
                    icon: Trash2,
                },
                {
                    title: "GHG Accounting",
                    url: "/dashboard/ghg",
                    icon: CloudRain,
                },
                {
                    title: "Domestic Waste",
                    url: "/dashboard/domestic-waste",
                    icon: Recycle,
                },
            ],
        },
        {
            title: "Systems & Standards",
            items: [
                {
                    title: "ISO 14001 (EMS)",
                    url: "/dashboard/iso14001",
                    icon: Trees,
                },
                {
                    title: "PROPER Assessment",
                    url: "/dashboard/proper",
                    icon: Award,
                },
                {
                    title: "ESG Intelligence",
                    url: "/dashboard/esg",
                    icon: Globe,
                },
                {
                    title: "Legal Register",
                    url: "/dashboard/legal-register",
                    icon: Scale,
                },
                {
                    title: "Audit Trail",
                    url: "/dashboard/audit",
                    icon: ClipboardList,
                },
                {
                    title: "Settings",
                    url: "/dashboard/settings",
                    icon: Settings,
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    return (
        <Sidebar {...props}>
            <SidebarHeader className="border-b px-6 py-4">
                <div className="flex items-center gap-2 font-bold text-emerald-600">
                    <Trees className="h-6 w-6" />
                    <span>EcoCompliant OS</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                {data.navMain.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={pathname === item.url}>
                                            <Link href={item.url}>
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
