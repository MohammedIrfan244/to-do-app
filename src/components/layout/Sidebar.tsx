"use client";

import { navItems } from "@/lib/nav";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { LogOut, Settings } from "lucide-react";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

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

export default function Sidebar() {
  const pathname = usePathname();
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const router = useRouter();
  const { state } = useSidebar();
  const isOpen = state === "expanded";

  return (
    <>
      <SidebarHeader>
        {isOpen ? (
          <Link href="/" className="flex flex-col border-b pb-4 pt-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              DURIO
            </h2>
            <p className="text-xs text-slate-400 mt-1 tracking-wide">
              Your personal daily companion
            </p>
          </Link>
        ) : (
          <Link
            href="/"
            className="text-2xl font-bold text-foreground tracking-tight">
            D
          </Link>
        )}
      </SidebarHeader>

      <SidebarContent className="pt-3 overflow-hidden">
        <SidebarMenu className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  tooltip={item.label}
                  isActive={isActive}
                  asChild
                >
                  <Link
                    href={item.url}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span
                      style={{
                        color: item.color,
                        opacity: isActive ? 1 : 0.9,
                      }}
                      className="flex-shrink-0"
                    >
                      {item.icon}
                    </span>

                    {isOpen && (
                      <span className="relative top-[1px]">{item.label}</span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <SidebarSeparator className="my-4" />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="text-foreground cursor-pointer hover:text-muted-foreground"
            isActive={false}
            onClick={() => router.push("/settings")}
          >
            <Settings size={18} />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="text-red-600 cursor-pointer hover:text-red-700"
            isActive={false}
            onClick={() => setShowSignOutModal(true)}
          >
            <LogOut size={18} />
            {isOpen && <span>Sign out</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>

      {/* ALERTDIALOG — REAL SHADCN */}
      <AlertDialog open={showSignOutModal} onOpenChange={setShowSignOutModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
