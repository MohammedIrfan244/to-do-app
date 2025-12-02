"use client";

import { LogOut, Mail, Menu, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useState } from "react";
import { navItems } from "@/lib/nav";
import { formatName } from "@/lib/nameFormatter";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const item = navItems.find((i) => i.url === pathname);
  const title = item?.label || "";
  const description = item?.description || "";
  const color = item?.color || "text-slate-900";

  const username = formatName(session?.user?.name || "User");
  

  return (
    <header className="border-b rounded-md border-slate-200 bg-white sticky top-0 z-40">
      <div className="px-8 py-4 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-slate-100 cursor-pointer rounded-lg transition-all duration-200 hover:scale-105"
          >
            <Menu
              size={20}
              className={`menu-rotate ${
                sidebarOpen ? "open" : "closed"
              }`}
            />
          </button>

            <div className="flex items-center gap-2">
              <h1 style={{background:`${color}30`, border:`1px solid ${color}`}} className="text-sm py-1 px-2 rounded-md font-semibold text-slate-900 tracking-tight transition-all duration-200 hover:px-3 hover:shadow-sm cursor-default">
                {title}
              </h1>
              <p className="text-sm font-bold">:</p>
            {description && (
              <p className="text-[13px] text-slate-500 mt-[3px] leading-tight">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT — USER DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{background:`${color}30` , border:`1px solid ${color}`}}
            className="text-sm text-slate-600 cursor-pointer py-1 px-2 rounded-md font-semibold hover:text-slate-900 transition-all duration-200 hover:px-3"
          >
            {username}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-3 w-48">
              <div className="flex items-center justify-between text-sm text-slate-700 font-medium border-b pb-2 mb-2">
                <User size={16} className="text-slate-500 mr-2" />
                <p>{session?.user?.name}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3 truncate">
                <Mail size={16} className="text-slate-500 mr-2" />
                <p>{session?.user?.email}</p>
              </div>
              <button
                onClick={() => setConfirmLogout(true)}
                className="w-full text-sm text-left text-red-500 hover:bg-red-50 px-2 py-1 flex items-center justify-between cursor-pointer rounded transition-all duration-200 hover:scale-[1.02]"
              >
                Logout <LogOut size={16} className="ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
      <ConfirmModal
        open={confirmLogout}
        title="Logout?"
        description="Are you sure you want to log out of your account?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        onConfirm={() => signOut({ callbackUrl: "/auth/login" })}
        onCancel={() => setConfirmLogout(false)}
      />
    </header>
  );
}