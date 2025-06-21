
"use client";

import {
  SidebarHeader,
  SidebarMenu,
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
import { Button } from "@/components/ui/button";

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
        <SidebarMenu className="flex-1 overflow-y-auto p-4">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5 mr-2" />
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </SidebarMenu>
        <SidebarFooter className="p-4">
            <Button asChild variant={pathname === '/dashboard/settings' ? 'secondary' : 'ghost'} className="w-full justify-start">
              <Link href="/dashboard/settings">
                <Settings className="h-5 w-5 mr-2" />
                <span>Settings</span>
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="ghost" onClick={logout}>
                <LogOut className="h-5 w-5 mr-2" />
                <span>Logout</span>
            </Button>
        </SidebarFooter>
    </>
  );
}
