"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "../theme-provider";

function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        themes={["light", "dark", "pookie", "system"]}
        enableSystem
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}

export default SessionProviderWrapper;
