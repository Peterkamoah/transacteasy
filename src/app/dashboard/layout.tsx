"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { useAuth } from "@/hooks/use-auth";
import { LoginOverlay } from "@/components/dashboard/login-overlay";
import { AppProvider } from "@/context/app-context";
import { Header } from "@/components/dashboard/header";

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
          <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Sidebar>
              <SidebarNav />
            </Sidebar>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
            </div>
          </div>
        </SidebarProvider>
      ) : (
        <LoginOverlay />
      )}
    </AppProvider>
  );
}
