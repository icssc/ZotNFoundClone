import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Script from "next/script";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/ContextProvider";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZotNFound",
  description: "Helping UCI students locate and recover lost belongings",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await auth.api.getSession({ headers: await headers() });
  const initialUser: string | null = data?.user?.email || null;
  console.log("Initial user from server:", initialUser);
  return (
    <html lang="en">
      {/* <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </head> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-900`}
      >
        <Providers initialUser={initialUser}>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
