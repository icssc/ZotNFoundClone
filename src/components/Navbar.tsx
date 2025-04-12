import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.png";
import {
  BellIcon,
  BookmarkIcon,
  BookOpenIcon,
  InfoIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="bg-black text-white">
      <div className="w-full px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-start">
            <div className="flex shrink-0 items-center">
              <Image src={logo} alt="ZotNFound logo" width={50} height={50} />
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-3xl font-bold text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                ZotNFound
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:block px-3">
            <div className="flex items-center">
              <Link
                href="#"
                className="flex gap-1 items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <InfoIcon />
                About
              </Link>
              <Link
                href="#"
                className="flex gap-1 items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <BellIcon />
                Updates
              </Link>
              <Link
                href="#"
                className="flex gap-1 items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <BookOpenIcon />
                Tutorial
              </Link>
              <Link
                href="#"
                className="flex gap-1 items-center rounded-md px-3 y-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <BookmarkIcon />
                Bookmarks
              </Link>
            </div>
          </div>
            <Button
              variant="outline"
              className="bg-black">
              <UserIcon />
              Sign In
            </Button>
          </div>
        </div>
    </nav>
  );
}
