"use client";

import Link from "next/link";
import { InfoIcon, UserIcon, BellIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BookmarkModal } from "@/components/BookmarkModal";
import Image from "next/image";
import { signInWithGoogle } from "@/lib/auth-client";

export default function Navbar() {
  const handleSignIn = async () => {
    try {
      const data = await signInWithGoogle();
      // Handle successful sign-in
      console.log("Signed in successfully:", data);
    } catch (error) {
      // Handle sign-in error
      console.error("Sign-in error:", error);
    }
  };

  return (
    <nav className="bg-black text-white w-full py-4 px-4 md:px-6">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="ZotNFound"
            width={32}
            height={32}
            className="rounded-full"
          />
          <Link href="/" className="text-xl font-bold">
            ZotNFound
          </Link>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/about"
            className="hover:text-gray-300 flex items-center gap-1"
          >
            <InfoIcon className="h-4 w-4" />
            <span>About</span>
          </Link>
          <Link
            href="/updates"
            className="hover:text-gray-300 flex items-center gap-1"
          >
            <BellIcon className="h-4 w-4" />
            <span>Updates</span>
          </Link>

          <BookmarkModal />

          {/* Sign In/Profile */}
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-white hover:text-black text-white bg-black transition-colors duration-250"
            onClick={handleSignIn}
          >
            <UserIcon className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
}
