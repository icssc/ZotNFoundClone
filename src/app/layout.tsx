import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import localFont from "next/font/local";
import { SessionProvider } from "@/components/SessionProvider";
import { PostHogPageView } from "@/components/PostHogPageView";
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
      <body
        className={`${geistSans.variable} ${CustomFont.className} antialiased bg-neutral-950`}
      >
        <Suspense fallback={null}>
          <SessionProvider>
            <PostHogPageView />
            <Navbar />
            {children}
          </SessionProvider>
        </Suspense>
        <Toaster position="bottom-center" theme="dark" />
      </body>
    </html>
  );
}
