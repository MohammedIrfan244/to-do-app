// app/components/AppLayout.tsx
"use client";

import { useState } from "react";
import Header from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar open={sidebarOpen} />

      <div className="flex-1 flex flex-col">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}