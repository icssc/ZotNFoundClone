import Image from "next/image";
import Link from "next/link";

export default function AboutHeader() {
  return (
    <div className="flex flex-row place-content-end items-center">
      <Link href="/">
        <div className="flex flex-row gap-4 items-center group cursor-pointer">
          <h1 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
            ZotNFound
          </h1>
          <Image
            src="/ZotNFound_Small_Logo.png"
            alt="ZotNFound Logo"
            width={50}
            height={50}
          />
        </div>
      </Link>
    </div>
  );
}
