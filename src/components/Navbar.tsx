import Link from "next/link";
import {
BookmarkIcon,
InfoIcon,
// MenuIcon,
// SearchIcon,
UserIcon,
BellIcon,
BookOpenIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Navbar() {
return (
<nav className="bg-black text-white w-full py-4 px-4 md:px-6">
    <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="ZotNFound" width={32} height={32} className="rounded-full" />
            <Link href="/" className="text-xl font-bold">
            ZotNFound
            </Link>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="hover:text-gray-300 flex items-center gap-1">
            <InfoIcon className="h-4 w-4" />
            <span>About</span>
            </Link>
            <Link href="/updates" className="hover:text-gray-300 flex items-center gap-1">
            <BellIcon className="h-4 w-4" />
            <span>Updates</span>
            </Link>
            <Link href="/tutorial" className="hover:text-gray-300 flex items-center gap-1">
            <BookOpenIcon className="h-4 w-4" />
            <span>Tutorial</span>
            </Link>
            <Link href="/bookmarks" className="hover:text-gray-300 flex items-center gap-1">
            <BookmarkIcon className="h-4 w-4" />
            <span>Bookmarks</span>
            </Link>

            {/* Sign In/Profile */}
            <Button variant="outline" size="sm"
                className="hover:bg-white hover:text-black text-white bg-black transition-colors duration-250">
                <UserIcon className="h-4 w-4 mr-2" />
                Sign In
            </Button>
        </div>
    </div>
</nav>
);
}