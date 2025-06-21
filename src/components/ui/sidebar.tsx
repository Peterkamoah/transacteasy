"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
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
    className={cn("flex flex-col items-center gap-4 px-2 sm:py-5", className)}
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


// Legacy components that are no longer used in the new responsive layout
// but kept for potential reference. They are not exported.

type LegacySidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
}

const LegacySidebarContext = React.createContext<LegacySidebarContext | null>(null)

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }
      },
      [setOpenProp, open]
    )

    const toggleSidebar = React.useCallback(() => {
      setOpen((open) => !open)
    }, [setOpen])

    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<LegacySidebarContext>(
      () => ({ state, open, setOpen, toggleSidebar }),
      [state, open, setOpen, toggleSidebar]
    )

    return (
      <LegacySidebarContext.Provider value={contextValue}>
          <div
            className={cn("group/sidebar-wrapper", className)}
            ref={ref}
            {...props}
          >
            {children}
          </div>
      </LegacySidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"


export {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarProvider,
}
