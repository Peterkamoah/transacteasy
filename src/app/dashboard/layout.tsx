
"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { LoginOverlay } from "@/components/dashboard/login-overlay";
import { AppProvider } from "@/context/app-context";
import { Header } from "@/components/dashboard/header";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Logo } from "@/components/dashboard/logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [isMounted, setIsMounted] = React.useState(false);

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
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Logo />
              </div>
              <div className="flex-1 py-4">
                <SidebarNav />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <Header />
            <main className="flex-1 p-4 sm:px-6 sm:py-4">
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
