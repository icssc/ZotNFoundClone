"use client";

import Link from "next/link";
import { InfoIcon, UserIcon, BellIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BookmarkModal } from "@/components/BookmarkModal";
import Image from "next/image";
import { authClient, signInWithGoogle } from "@/lib/auth-client";
import { SearchBar } from "./SearchBar";
import { useSharedContext } from "./ContextProvider";

export default function Navbar() {
  const { user, setUser } = useSharedContext();
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
      await authClient.signOut();
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
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
        <div className="flex-1 px-4 max-w-xl">
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
              {user.picture && (
                <Image
                  src={user.picture}
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
