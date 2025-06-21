
"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { LoginOverlay } from "@/components/dashboard/login-overlay";
import { AppProvider } from "@/context/app-context";
import { Header } from "@/components/dashboard/header";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Logo } from "@/components/dashboard/logo";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [isMounted, setIsMounted] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-lg font-semibold text-muted-foreground">Loading TransactEasy...</div>
      </div>
    );
  }

  return (
    <AppProvider>
      {user ? (
        <div className={cn(
          "grid min-h-screen w-full transition-[grid-template-columns] duration-300 ease-in-out",
          isCollapsed ? "md:grid-cols-[68px_1fr]" : "md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
        )}>
          <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col">
              <div className={cn(
                "flex h-14 items-center justify-between border-b lg:h-[60px]",
                isCollapsed ? "px-2" : "px-4 lg:px-6"
              )}>
                <Logo isCollapsed={isCollapsed} />
                <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
                  {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </div>
              <SidebarNav isCollapsed={isCollapsed} />
            </div>
          </div>
          <div className="flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-4">
              {children}
            </main>
          </div>
        </div>
      ) : (
        <LoginOverlay />
      )}
    </AppProvider>
  );
}
