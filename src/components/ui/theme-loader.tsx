"use client";

import * as React from "react";
import { Moon, Sun, Flower, Loader2, Skull, Leaf } from "lucide-react";

interface ThemeLoaderProps {
  isVisible: boolean;
  targetTheme: string | undefined;
}

const themeMessages: Record<string, string> = {
  light: "Brightening things up for you ☀️",
  dark: "Summoning the shadows... 🌙",
  pookie: "Sprinkling pookie magic ✨💗",
  gothic: "Waking the ancient spirits ☠️",
  natural: "Growing something fresh 🌱",
  system: "Syncing with your device ⚙️",
};

export function ThemeLoader({ isVisible, targetTheme }: ThemeLoaderProps) {
  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-md transition-all duration-500
      ${targetTheme === "gothic" ? "bg-black/95" : "bg-background/80"}
    `}
    >
      <div className="relative flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
        {/* Animation Container */}
        <div className="relative h-24 w-24 flex items-center justify-center">
          {/* Light Theme */}
          {targetTheme === "light" && (
            <div className="relative">
              <Sun className="h-16 w-16 text-orange-500 animate-[spin_3s_linear_infinite]" />
              <div className="absolute inset-0 bg-orange-400/20 blur-xl rounded-full animate-pulse" />
            </div>
          )}

          {/* Dark Theme */}
          {targetTheme === "dark" && (
            <div className="relative">
              <Moon className="h-16 w-16 text-slate-200 animate-bounce duration-[2000ms]" />
              <div className="absolute inset-0 bg-slate-400/20 blur-xl rounded-full" />
            </div>
          )}

          {/* Pookie Theme */}
          {targetTheme === "pookie" && (
            <div className="relative">
              <Flower className="h-16 w-16 text-pink-500 animate-[spin_4s_linear_infinite]" />
              <div className="absolute -top-2 -right-2">
                <span className="flex h-3 w-3 animate-ping rounded-full bg-pink-400 opacity-75"></span>
              </div>
              <div className="absolute inset-0 bg-pink-400/30 blur-xl rounded-full animate-pulse" />
            </div>
          )}

          {/* Gothic Theme */}
          {targetTheme === "gothic" && (
            <div className="relative">
              <Skull className="h-16 w-16 text-red-700 animate-pulse duration-[1500ms]" />
              {/* Deep Red Glow */}
              <div className="absolute inset-0 bg-red-900/40 blur-2xl rounded-full animate-pulse" />
              <div className="absolute -bottom-2 w-full h-1 bg-purple-800/50 blur-md" />
            </div>
          )}

          {/* Natural Theme */}
          {targetTheme === "natural" && (
            <div className="relative">
              <Leaf className="h-16 w-16 text-green-600 animate-[bounce_3s_infinite]" />
              <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-full" />
              {/* Little floating particles */}
              <div className="absolute top-0 right-0 h-2 w-2 bg-yellow-400/60 rounded-full animate-ping delay-75" />
              <div className="absolute bottom-0 left-0 h-2 w-2 bg-green-400/60 rounded-full animate-ping delay-300" />
            </div>
          )}

          {/* Fallback/System */}
          {(targetTheme === "system" || !targetTheme) && (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          )}
        </div>

        {/* Loading Text */}
        <p
          className={`text-lg font-medium animate-pulse ${
            targetTheme === "gothic" ? "text-purple-200" : "text-foreground/80"
          }`}
        >
          {themeMessages[targetTheme ?? "system"] ?? "Loading your vibe..."}
        </p>
      </div>
    </div>
  );
}
