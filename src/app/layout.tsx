"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <Navbar />
            <main className="min-h-screen">{children}</main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
