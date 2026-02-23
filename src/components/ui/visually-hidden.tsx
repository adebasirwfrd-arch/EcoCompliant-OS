"use client"

import * as React from "react"
import { Root } from "@radix-ui/react-visually-hidden"

export function VisuallyHidden({ children }: { children: React.ReactNode }) {
    return <Root>{children}</Root>
}
