"use client";

import { LogOut, Mail, User, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { navItems } from "@/lib/nav";
import { formatName } from "@/lib/nameFormatter";
import { ModeToggle } from "../ui/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [confirmLogout, setConfirmLogout] = useState(false);

  const item = navItems.find((i) => i.url === pathname);
  const title = item?.label || "";
  const description = item?.description || "";
  const color = item?.color || "#aaa";

  const username = formatName(session?.user?.name || "User");

  return (
    <header className="border-b border-border bg-background sticky top-0 z-40">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="p-1.5 rounded-lg border border-transparent hover:bg-accent hover:text-accent-foreground" />

          <div className="flex items-center gap-2">
            <h1
              style={{ border: `1px solid ${color}` }}
              className="text-sm py-1 px-2 rounded-md font-semibold text-foreground tracking-tight"
            >
              {title}
            </h1>
            <p className="text-sm font-bold text-muted-foreground">:</p>
            {description && (
              <p className="text-sm text-muted-foreground mt-[2px] leading-tight">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT USER DROPDOWN */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger className="px-3 cursor-pointer text-foreground py-1.5 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium">
              {username}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              {/* USER PROFILE INFO (no click) */}
              <div className="pb-2 mb-2 ml-2 space-y-2 border-b border-border">
                <p className="text-sm font-semibold text-foreground flex items-center">
                  <span>
                    <User size={16} className="mr-2" />
                  </span>{" "}
                  {session?.user?.name}
                </p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <span>
                    <Mail size={16} className="mr-2" />
                  </span>{" "}
                  {session?.user?.email}
                </p>
              </div>

              {/* SETTINGS — page redirect */}
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => (window.location.href = "/settings")}
              >
                <Settings size={16} className="mr-2" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* LOGOUT */}
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={() => setConfirmLogout(true)}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* LOGOUT CONFIRMATION */}
      <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
