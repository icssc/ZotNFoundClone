import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import localFont from "next/font/local";
import { Providers } from "@/components/ContextProvider";
import { PostHogPageView } from "@/components/PostHogPageView";
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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${CustomFont.className} antialiased bg-background`}
      >
        <Providers>
          <PostHogPageView />
          <Navbar />
          {children}
        </Providers>
        <Toaster position="bottom-center" theme="dark" />
      </body>
    </html>
  );
}
