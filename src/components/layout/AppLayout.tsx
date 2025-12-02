"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const authPages = ["/auth/login"];

  if (authPages.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="bg-slate-50 flex h-screen overflow-hidden"> 
      <Sidebar open={sidebarOpen} /> 
      <div className="flex-1 flex flex-col overflow-hidden"> 
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> 
        <main className="flex-1 overflow-y-auto hide-scrollbar-on-main">
          {children}
        </main>
      </div>
    </div>
  );
}