import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
// import Script from "next/script";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import localFont from "next/font/local";
import { SessionProvider } from "@/components/SessionProvider";
import { Suspense } from "react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZotNFound",
  description: "Helping UCI students locate and recover lost belongings",
};
const CustomFont = localFont({
  src: "../fonts/proximanova_regular.ttf",
});
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/*<Script
        fetchPriority="high"
        crossOrigin="anonymous"
        src="https://unpkg.com/react-scan/dist/auto.global.js"
      />*/}
      <body
        className={`${geistSans.variable} ${CustomFont.className} antialiased bg-neutral-950`}
      >
        <Suspense fallback={null}>
          <SessionProvider>
            <Navbar />
            {children}
          </SessionProvider>
        </Suspense>
        <Toaster position="bottom-center" theme="dark" />
      </body>
    </html>
  );
}
