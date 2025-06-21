
"use client";

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
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

type NavItemProps = {
  href: string;
  label: string;
  icon: React.ElementType;
  isCollapsed: boolean;
  isActive: boolean;
};

const NavItem = ({ href, label, icon: Icon, isCollapsed, isActive }: NavItemProps) => {
  return isCollapsed ? (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            variant={isActive ? "secondary" : "ghost"}
            size="icon"
            className="w-full"
          >
            <Link href={href}>
              <Icon className="h-5 w-5" />
              <span className="sr-only">{label}</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start"
    >
      <Link href={href}>
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
};

export function SidebarNav({ isCollapsed = false }: { isCollapsed?: boolean }) {
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
    <div className="flex h-full flex-col gap-2 px-2">
      <nav className="grid items-start gap-1 text-sm font-medium">
        {menuItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isCollapsed={isCollapsed}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
      <div className="mt-auto grid gap-1">
         <NavItem
          href="/dashboard/settings"
          label="Settings"
          icon={Settings}
          isCollapsed={isCollapsed}
          isActive={pathname === '/dashboard/settings'}
        />
        {isCollapsed ? (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="w-full" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button className="w-full justify-start" variant="ghost" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
          </Button>
        )}
      </div>
    </div>
  );
}
