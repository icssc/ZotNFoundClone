import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Script from "next/script";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { Providers } from "@/components/ContextProvider";


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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-900`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <Toaster position="bottom-center" theme="dark" />
      </body>
    </html>
  );
}
