"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import {
  SidebarProvider,
  Sidebar as ShadSidebar,
} from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode } ) {
  const pathname = usePathname();
  const authPages = ["/auth/login"];

  if (authPages.includes(pathname)) return <>{children}</>;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">

        <ShadSidebar variant="floating" collapsible="icon" className="border-r border-foreground/10">
          <Sidebar />
        </ShadSidebar>

        <div className="flex flex-col flex-1"> {/* FULL WIDTH */}
          <Header />
          <main className="flex-1 overflow-y-auto hide-scrollbar-on-main">
            {children}
          </main>
        </div>

      </div>
    </SidebarProvider>
  );
}
