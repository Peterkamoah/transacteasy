
"use client";

import { useMemo } from "react";
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
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
           <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Logo />
          </div>
          <SidebarNav />
        </SheetContent>
      </Sheet>
      
      <div className="w-full flex-1">
         <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        <UserNav />
      </div>
    </header>
  );
}
