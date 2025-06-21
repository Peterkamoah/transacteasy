"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  FileText,
  ArrowRightLeft,
  Wallet,
  Lightbulb,
  Building,
  Users,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

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

export function SidebarNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

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

  return (
    <>
        <SidebarHeader className="p-4">
             <Logo />
        </SidebarHeader>
        <SidebarMenu className="flex-1 p-4">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className="justify-start"
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarFooter className="p-4">
            <SidebarMenuButton asChild className="justify-start" isActive={pathname === '/dashboard/settings'}>
              <Link href="/dashboard/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton className="w-full justify-start" onClick={logout}>
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
            </SidebarMenuButton>
        </SidebarFooter>
    </>
  );
}
