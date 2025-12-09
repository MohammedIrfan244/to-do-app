"use client";

import * as React from "react";
import { Sun, Moon, Flower, Skull, Leaf } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeLoader } from "@/components/ui/theme-loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [isThemeLoading, setIsThemeLoading] = React.useState(false);
  const [pendingTheme, setPendingTheme] = React.useState<string | undefined>(
    undefined
  );

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const themes = [
    { key: "light", icon: Sun, label: "Sunny & Soft" },
    { key: "dark", icon: Moon, label: "Cozy Night Mode" },
    { key: "pookie", icon: Flower, label: "Pookie Glow" },
    { key: "gothic", icon: Skull, label: "Midnight Goth" },
    { key: "natural", icon: Leaf, label: "Earthy Calm" },
  ];

  const CurrentIcon = themes.find((t) => t.key === theme)?.icon || Sun;

  const handleThemeChange = (newTheme: string) => {
    if (theme === newTheme) return;

    setPendingTheme(newTheme);
    setIsThemeLoading(true);
    setTimeout(() => {
      setTheme(newTheme);
      window.location.reload();
    }, 500);
  };

  const isActive = (themeKey: string) => theme === themeKey;

  return (
    <>
      <ThemeLoader isVisible={isThemeLoading} targetTheme={pendingTheme} />

      {/* MOBILE — Dropdown (below md) */}
      <div className="md:hidden">
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
${isActive("pookie") ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
              />

              {/* Skull (Gothic) */}
              <Skull
                className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 text-purple-600 absolute
${isActive("gothic") ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
              />

              {/* Leaf (Natural) */}
              <Leaf
                className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 text-green-600 absolute
${isActive("natural") ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
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
      </div>

      {/* DESKTOP — Sliding inline (md+) */}
      <div
        data-open={open}
        className="items-center gap-2 hidden md:flex transition-all duration-300 ease-out w-12 data-[open=true]:w-64"
      >
        {/* main trigger */}
        <Button
          size="icon"
          variant="outline"
          disabled={isThemeLoading}
          onClick={() => {
            if (!isThemeLoading) setOpen(!open);
          }}
          className="
transition-all
hover:ring-2 ring ring-offset-0 ring-ring hover:ring-ring hover:ring-offset-2 hover:ring-offset-background
"
        >
          <CurrentIcon className="h-5 w-5" />
        </Button>

        {/* inline icons */}
        <div
          data-open={open}
          className="
flex items-center gap-2 transition-all duration-300 ease-out
data-[open=false]:opacity-0 data-[open=false]:scale-0
data-[open=true]:opacity-100 data-[open=true]:scale-100"
        >
          {themes.map((t) => {
            const Icon = t.icon;
            return (
              <Tooltip key={t.key}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={isThemeLoading}
                    onClick={() => handleThemeChange(t.key)}
                    className="p-2 transition-all hover:ring-2 hover:ring-ring hover:ring-offset-2 hover:ring-offset-background"
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{t.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </>
  );
}
