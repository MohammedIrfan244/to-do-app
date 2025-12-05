"use client";

import * as React from "react";
import { Moon, Sun, Flower, Skull, Leaf } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeLoader } from "@/components/ui/theme-loader";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isThemeLoading, setIsThemeLoading] = React.useState(false);
  const [pendingTheme, setPendingTheme] = React.useState<string | undefined>(
    undefined
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    if (theme === newTheme) return;

    setPendingTheme(newTheme);
    setIsThemeLoading(true);

    setTimeout(() => {
      setTheme(newTheme);
      window.location.reload();
    }, 2500);
  };

  const isActive = (target: string) => theme === target;

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem] opacity-50" />
      </Button>
    );
  }

  return (
    <>
      <ThemeLoader isVisible={isThemeLoading} targetTheme={pendingTheme} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            disabled={isThemeLoading}
            className="
    relative cursor-pointer
    hover:ring-2 hover:ring-ring hover:ring-offset-2 hover:ring-offset-background
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
  "
          >
            {/* Sun (Light/System default) */}
            <Sun
              className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 absolute 
              ${
                theme === "light" || theme === "system" || !theme
                  ? "rotate-0 scale-100"
                  : "rotate-90 scale-0"
              }`}
            />

            {/* Moon (Dark) */}
            <Moon
              className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 absolute 
              ${isActive("dark") ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
            />

            {/* Flower (Pookie) */}
            <Flower
              className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 text-pink-400 absolute 
              ${
                isActive("pookie") ? "rotate-0 scale-100" : "rotate-90 scale-0"
              }`}
            />

            {/* Skull (Gothic) */}
            <Skull
              className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 text-purple-600 absolute 
              ${
                isActive("gothic") ? "rotate-0 scale-100" : "rotate-90 scale-0"
              }`}
            />

            {/* Leaf (Natural) */}
            <Leaf
              className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 text-green-600 absolute 
              ${
                isActive("natural") ? "rotate-0 scale-100" : "rotate-90 scale-0"
              }`}
            />

            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-foreground" align="end">
          <DropdownMenuItem onClick={() => handleThemeChange("light")}>
            Sunny & Soft
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
            Cozy Night Mode
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("pookie")}>
            Pookie Glow
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("gothic")}>
            Midnight Goth
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("natural")}>
            Earthy Calm
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("system")}>
            Follow Gut
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
