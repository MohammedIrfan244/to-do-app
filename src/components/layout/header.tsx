"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import { 
  LogOut, 
  Mail, 
  User, 
  Settings, 
  Clock, 
  Calendar, 
  ChevronDown,
  Sparkles 
} from "lucide-react";

import { navItems } from "@/lib/nav";
import { formatName } from "@/lib/helper/name-formatter";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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

import { Card, CardContent } from "@/components/ui/card";

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [confirmLogout, setConfirmLogout] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setMounted(true);
    const updateClock = () => {
      const now = new Date();

      setTime(now.toLocaleTimeString("en-US", { 
        hour: "numeric", 
        minute: "2-digit", 
        hour12: true 
      }));

      setDate(now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }));

      const hrs = now.getHours();
      if (hrs < 12) setGreeting("Good Morning");
      else if (hrs < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const item = navItems.find((i) => i.url === pathname);
  const title = item?.label || "Page";
  const description = item?.description || "Manage your daily activities"; 
  const username = formatName(session?.user?.name || "User");

  if (!mounted) return <Card className="border bg-background h-16" />;

  return (
    <Card className="border card">
      <CardContent className="px-6 flex items-center justify-between relative">

        {/* --- LEFT SECTION: Navigation & Title --- */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Added hover scale and transition */}
          <div className="hover:scale-105 active:scale-95 transition-transform duration-300">
            <SidebarTrigger className="text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer" />
          </div>
          
          <Separator orientation="vertical" className="h-6 hidden sm:block opacity-30" />
          
          <div className="flex flex-col justify-between group cursor-default">
            {/* Added subtle color shift on hover */}
            <h1 className="text-sm md:text-base font-bold tracking-tight text-foreground/90 group-hover:text-primary transition-colors duration-300">
              {title}
            </h1>
            <p className="text-[11px] text-muted-foreground hidden lg:block font-medium truncate max-w-[200px]">
              {description}
            </p>
          </div>
        </div>

        {/* --- CENTER SECTION: Time Card --- */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center justify-center">
          {/* Added hover lift (-translate-y), shadow, and border color transition */}
          <Card className="flex flex-col items-center justify-center py-1 px-5 md:py-3 md:px-6 bg-secondary/30 border border-border/40 gap-2 
            transition-all duration-500 ease-out 
            hover:bg-secondary/50 hover:border-primary/20 hover:shadow-lg hover:-translate-y-0.5 group">
            
            {/* Greeting */}
            <div className="flex items-center gap-2 mb-0.5">
              {/* Added spin on group hover */}
              <Sparkles size={10} className="text-yellow-500/80 transition-transform duration-700 group-hover:rotate-180" />
              <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                {greeting}, {username}
              </span>
              <Sparkles size={10} className="text-yellow-500/80 transition-transform duration-700 group-hover:-rotate-180" />
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-3 text-xs font-semibold text-foreground/80">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-primary/70" /> 
                {date}
              </span>
              <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors duration-300" />
              <span className="flex items-center gap-1.5">
                <Clock size={12} className="text-primary/70" /> 
                {time}
              </span>
            </div>
          </Card>
        </div>

        {/* --- RIGHT SECTION: Actions & User --- */}
        <div className="flex items-center gap-3 shrink-0">
          
          <div className="md:hidden flex flex-col items-end mr-1">
             <span className="text-xs font-bold">{time}</span>
             <span className="text-[10px] text-muted-foreground">{date.split(',')[0]}</span>
          </div>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="h-9 pl-2 pr-3 border-border/60 flex items-center gap-2transition-all duration-300 ease-out hover:bg-accent hover:border-primary/30 hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                {/* Avatar */}
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  <User size={14} />
                </div>
                
                {/* Name */}
                <span className="text-sm font-medium hidden sm:block">
                  {username}
                </span>
                
                <ChevronDown size={12} className="text-muted-foreground/70 hidden sm:block transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 p-2 animate-in fade-in zoom-in-95 duration-200">
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none flex items-center gap-2">
                    <User size={14} className="text-primary"/> 
                    {session?.user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground flex items-center gap-2">
                    <Mail size={14} /> 
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              {/* Added 'settings-button' class to trigger your CSS animation */}
              <DropdownMenuItem 
                onClick={() => window.location.href = "/settings"} 
                className="cursor-pointer py-2.5 focus:bg-accent settings-button group"
              >
                {/* Added 'settings-icon' class */}
                <Settings size={16} className="mr-2 text-muted-foreground settings-icon group-hover:text-foreground transition-colors" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Added 'logout-button' class to trigger your CSS animation */}
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 py-2.5 logout-button"
                onClick={() => setConfirmLogout(true)}
              >
                {/* Added 'logout-icon' class */}
                <LogOut size={16} className="mr-2 logout-icon" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </CardContent>

      <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to leave?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to log out of your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}