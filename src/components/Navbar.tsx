import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/logo.png';

export default function Navbar () {
    return (
        <nav className="bg-gray-800">
            <div className="w-full px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-start">
                        <div className="flex shrink-0 items-center">
                            <Image 
                                src={logo}
                                alt="ZotNFound logo"
                                width={50}
                                height={50}
                            />
                            <Link href="/" className="rounded-md px-3 py-2 text-3xl font-bold text-gray-300 hover:bg-gray-700 hover:text-white">ZotNFound</Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                        <div className="flex space-x-4">
                            <Link href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">About</Link>
                            <Link href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Updates</Link>
                            <Link href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Instagram</Link>
                        </div>
                        </div>
                    </div>

                    <div>
                        <Link href="#">
                            <button className="rounded-md px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                Sign In
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};