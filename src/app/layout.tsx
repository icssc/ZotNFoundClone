import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import Script from "next/script";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { Providers } from "@/components/ContextProvider";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { User } from "@/lib/types";

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
  const initialUser: User | null = data?.user
    ? {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        picture: data.user.image || null,
      }
    : null;
  console.log("Initial user from server:", initialUser?.email);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-900`}
      >
        <Providers initialUser={initialUser}>
          <Navbar />
          {children}
        </Providers>
        <Toaster position="bottom-center" theme="dark" />
      </body>
    </html>
  );
}
