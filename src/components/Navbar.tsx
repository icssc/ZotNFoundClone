"use client";

import Link from "next/link";
import { InfoIcon, UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookmarkModal } from "@/components/BookmarkModal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { useSharedContext } from "./ContextProvider";
import { Instrument_Serif } from "next/font/google";
import { handleSignIn } from "@/lib/auth-client";
import { trackNavigationToAbout, trackNavigationToHome } from "@/lib/analytics";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
});

export default function Navbar() {
  const { user, signOut } = useSharedContext();
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <nav className="sticky top-2 z-50 mx-2 md:mx-4 mt-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20 transition-all duration-300">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/"
              onClick={() => trackNavigationToHome()}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors">
                <Image
                  src="/logo.png"
                  alt="ZotNFound"
                  fill
                  className="object-cover"
                  loading="eager"
                />
              </div>
              <span
                className={`text-2xl md:text-3xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors ${instrumentSerif.className}`}
              >
                ZotNFound
              </span>
            </Link>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden ml-18">
              <Link
                href="/about"
                onClick={() => trackNavigationToAbout()}
                className="p-2 rounded-full hover:bg-white/10 text-white hover:text-white transition-all"
              >
                <InfoIcon className="h-5 w-5" />
              </Link>
              <BookmarkModal />
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl px-4">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/about"
              onClick={() => trackNavigationToAbout()}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white hover:text-gray-400 hover:bg-white/5 transition-all"
            >
              <InfoIcon className="h-4 w-4" />
              <span>About</span>
            </Link>

            <BookmarkModal />

            {user ? (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full pl-1 pr-4 gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/10 transition-all"
                onClick={handleSignOut}
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="Profile"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full pt-0.5 bg-indigo-500 flex items-center justify-center text-xs font-bold">
                    {user.name?.[0] || "U"}
                  </div>
                )}
                <span className="font-medium">Sign Out</span>
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="rounded-full px-6 bg-white text-black hover:bg-gray-200 font-medium transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                onClick={handleSignIn}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Search & Auth Row */}
        <div className="md:hidden mt-4 flex items-center gap-3 pb-1">
          <div className="flex-1">
            <SearchBar />
          </div>

          {user ? (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-10 h-10 bg-white/5 hover:bg-white/10 text-white border border-white/5"
              onClick={handleSignOut}
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt="Profile"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="rounded-full bg-white text-black hover:bg-gray-200"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
