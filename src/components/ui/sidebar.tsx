"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const Sidebar = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"aside">
>(({ className, ...props }, ref) => (
  <aside
    ref={ref}
    className={cn("fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex", className)}
    {...props}
  />
))
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-14 items-center justify-center border-b px-2 lg:h-[60px] lg:px-4", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarMenu = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"nav">
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("flex flex-1 flex-col items-center gap-4 overflow-y-auto px-2 sm:py-5", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentProps<typeof Slot> & {
    tooltip: string
    isActive?: boolean
  }
>(({ tooltip, isActive, ...props }, ref) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Slot
          ref={ref}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
            isActive && "bg-accent text-accent-foreground"
          )}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent side="right">{tooltip}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
))
SidebarMenuItem.displayName = "SidebarMenuItem"


const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-auto flex flex-col items-center gap-4 px-2 sm:py-5", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

export {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
}
