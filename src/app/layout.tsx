"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <SessionProvider>
            <body>
                {children}
                <Toaster />
            </body>
        </SessionProvider>
    </html>
  );
}
