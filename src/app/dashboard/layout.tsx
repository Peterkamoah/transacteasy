"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserType } from "@/lib/types";

function LoginOverlay() {
  const { login } = useAuth();
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-[380px] shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to TransactEasy</CardTitle>
          <CardDescription>Select a user role to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button onClick={() => login('Importer')} size="lg">Sign in as Importer</Button>
            <Button onClick={() => login('Supplier')} variant="secondary" size="lg">Sign in as Supplier</Button>
            <Button onClick={() => login('Admin')} variant="outline" size="lg">Sign in as Admin</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <SidebarProvider className="relative">
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
      {!user && <LoginOverlay />}
    </SidebarProvider>
  );
}
