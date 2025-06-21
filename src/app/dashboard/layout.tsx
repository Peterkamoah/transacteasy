
"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { useAuth } from "@/hooks/use-auth";
import { LoginOverlay } from "@/components/dashboard/login-overlay";
import { AppProvider } from "@/context/app-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
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
        <SidebarProvider>
          <Sidebar>
            <SidebarNav />
          </Sidebar>
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <LoginOverlay />
      )}
    </AppProvider>
  );
}
