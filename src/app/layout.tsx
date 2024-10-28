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

        // Clarity
        const clarityScript = document.createElement('script');
        clarityScript.type = 'text/javascript';
        clarityScript.async = true;
        clarityScript.innerHTML = `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "ops9kqtlnr");
        `;
        document.head.appendChild(clarityScript);

        // CRISP
        // @ts-ignore
        if (typeof window !== "undefined" && !window.$crisp) {
            // @ts-ignore
            window.$crisp = [];
            // @ts-ignore
            window.CRISP_WEBSITE_ID = "c59b82fb-cbc5-4c3c-897a-05c0e8825907"; // Replace with your Crisp website ID

            // Load Crisp script
            (function () {
                const d = document;
                const s = d.createElement("script");
                s.src = "https://client.crisp.chat/l.js";
                s.async = true;
                d.getElementsByTagName("head")[0].appendChild(s);
            })();
        }
    }, [])

    return (
        <html lang="en">
        <Head>
            <link rel="icon" href="/favicon.ico" sizes="any"/>
        </Head>
        <SessionProvider>
            <body>
            {children}
            <Toaster/>
            </body>
        </SessionProvider>
        </html>
    );
}
