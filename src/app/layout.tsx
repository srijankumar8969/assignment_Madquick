"use client";

import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider><Navbar />
        <main className="min-h-screen">{children}</main></SessionProvider>
      </body>
    </html>
  );
}
