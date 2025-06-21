"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { UserNav } from "./user-nav";
import { SidebarNav } from "./sidebar-nav";
import { Logo } from "./logo";

export function Header() {
  const pathname = usePathname();
  const title = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length <= 1) return 'Dashboard';
    const lastSegment = segments[segments.length - 1];
    return lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs p-0">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Logo />
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <SidebarNav />
                </div>
            </div>
        </SheetContent>
      </Sheet>
      
      <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
      
      <div className="ml-auto flex items-center gap-4">
        <UserNav />
      </div>
    </header>
  );
}
