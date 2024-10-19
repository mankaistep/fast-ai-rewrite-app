"use client";

import "./globals.css";
import {SessionProvider} from "next-auth/react"
import {Toaster} from "@/components/ui/toaster"
import {useEffect} from "react";
import Head from "next/head";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    useEffect(() => {
        document.title = 'FastAI Rewrite - AI Writing Assistant';
    }, [])

    return (
        <html lang="en">
            <Head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </Head>
            <SessionProvider>
                <body>
                    {children}
                    <Toaster />
                </body>
            </SessionProvider>
        </html>
    );
}
