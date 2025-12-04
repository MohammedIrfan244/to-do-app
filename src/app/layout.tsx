// app/layout.tsx
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Pacifico,
  Lato,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AppLayout from "@/components/layout/AppLayout";
import SessionProviderWrapper from "@/components/layout/SessionProvider";

// CURRENT FONTS
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// NEW FONTS
const pacifico = Pacifico({
  variable: "--font-heading",
  weight: "400",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-body",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DURIO",
  description: "A simple Daily manager app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${pacifico.variable}
          ${lato.variable}
          antialiased
        `}
      >
        <SessionProviderWrapper>
          <AppLayout>{children}</AppLayout>
        </SessionProviderWrapper>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
