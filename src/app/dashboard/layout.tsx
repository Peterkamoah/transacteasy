"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { LoginOverlay } from "@/components/dashboard/login-overlay";
import { AppProvider } from "@/context/app-context";
import { Header } from "@/components/dashboard/header";
import {
  LayoutDashboard,
  FileText,
  ArrowRightLeft,
  Wallet,
  Lightbulb,
  Building,
  Users,
  Settings,
} from "lucide-react";

const commonMenuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/transactions", label: "Transactions", icon: ArrowRightLeft },
  { href: "/dashboard/wallets", label: "Wallets", icon: Wallet },
];

const supplierMenuItems = [
  ...commonMenuItems,
  { href: "/dashboard/smart-invoice", label: "Smart Invoice", icon: Lightbulb },
];

const adminMenuItems = [
  ...commonMenuItems,
  { href: "/dashboard/admin/organizations", label: "Organizations", icon: Building },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const getMenuItems = () => {
    if (!user) return [];
    switch (user.user_type) {
      case "Admin":
        return adminMenuItems;
      case "Supplier":
        return supplierMenuItems;
      case "Importer":
      default:
        return commonMenuItems;
    }
  };

  const menuItems = getMenuItems();


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
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <Sidebar>
            <SidebarHeader>
              <Link href="/dashboard">
                 <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-accent"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                  <span className="sr-only">TransactEasy</span>
              </Link>
            </SidebarHeader>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href} tooltip={item.label} isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarFooter>
              <SidebarMenuItem tooltip="Settings" isActive={pathname === '/dashboard/settings'}>
                  <Link href="/dashboard/settings">
                      <Settings className="h-5 w-5" />
                      <span className="sr-only">Settings</span>
                  </Link>
              </SidebarMenuItem>
            </SidebarFooter>
          </Sidebar>
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
              <Header />
              <main className="flex-1">
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
