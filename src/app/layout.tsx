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
  metadataBase: new URL("https://zotnfound.com"),
  title: "ZotNFound | UCI Lost and Found Map for Students",
  description:
    "Report lost items, browse found belongings, and reconnect students with their things using ZotNFound's live UCI lost and found map.",
  openGraph: {
    title: "ZotNFound | UCI Lost and Found Map for Students",
    description:
      "Report lost items, browse found belongings, and reconnect students with their things using ZotNFound's live UCI lost and found map.",
    url: "https://zotnfound.com",
    siteName: "ZotNFound",
    images: [
      {
        url: "https://zotnfound.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "ZotNFound live UCI lost and found map preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZotNFound | UCI Lost and Found Map for Students",
    description:
      "Report lost items, browse found belongings, and reconnect students with their things using ZotNFound's live UCI lost and found map.",
    images: ["https://zotnfound.com/opengraph-image.png"],
  },
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
