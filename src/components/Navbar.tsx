"use client";

import Link from "next/link";
import { InfoIcon, UserIcon, BellIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BookmarkModal } from "@/components/BookmarkModal";
import Image from "next/image";
import { signInWithGoogle } from "@/lib/auth-client";
import { SearchBar } from "./SearchBar";
import { useSharedContext } from "./ContextProvider";
import { Instrument_Serif } from "next/font/google";
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
});

export default function Navbar() {
  const { user, signOut } = useSharedContext();
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      // successful redirect
    } catch (error) {
      // Handle redirect error
      console.error("Redirect error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <nav className="bg-black text-white py-3 px-4 border-b-zinc-800 shadow-border shadow-2xl/20 border-b-2 md:rounded-2xl mt-1 md:mx-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3 justify-between w-full md:w-auto md:justify-start">
          <Image
            src="/logo.png"
            alt="ZotNFound"
            width={40}
            height={40}
            loading="eager"
            className="rounded-full w-9 h-9 md:w-10 md:h-10"
          />
          <Link
            href="/"
            className={`text-2xl w-full md:text-4xl font-extrabold tracking-tight ${instrumentSerif.className}`}
          >
            ZotNFound
          </Link>

          {/* Mobile-only: put the link icons on the same line as the logo */}
          <div className="flex items-center gap-3 md:hidden ml-3">
            <Link
              href="/about"
              className="p-1 rounded hover:text-gray-300"
              aria-label="About"
            >
              <InfoIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/updates"
              className="p-1 rounded hover:text-gray-300"
              aria-label="Updates"
            >
              <BellIcon className="h-5 w-5" />
            </Link>
            <BookmarkModal />
          </div>
        </div>
        {/* Center Search (desktop only) */}
        <div className="hidden md:flex flex-1 px-4 max-w-xl">
          <SearchBar />
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
          {user ? (
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-white hover:text-black text-white bg-black transition-colors duration-250"
              onClick={handleSignOut}
            >
              {user.image && (
                <Image
                  src={user.image}
                  alt="User Profile Picture"
                  width={16}
                  height={16}
                  className="rounded-full mr-2"
                />
              )}
              Sign Out
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-white hover:text-black text-white bg-black transition-colors duration-250"
              onClick={handleSignIn}
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
      {/* Mobile second row: search on the left and sign-in on the right */}
      <div className="md:hidden mt-3 flex items-center justify-between gap-3">
        <div className="flex-1">
          <SearchBar />
        </div>

        <div>
          {user ? (
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-white hover:text-black text-white bg-black transition-colors duration-250"
              onClick={handleSignOut}
            >
              {user.image && (
                <Image
                  src={user.image}
                  alt="User Profile Picture"
                  width={16}
                  height={16}
                  className="rounded-full mr-2"
                />
              )}
              Sign Out
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-white hover:text-black text-white bg-black transition-colors duration-250"
              onClick={handleSignIn}
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
