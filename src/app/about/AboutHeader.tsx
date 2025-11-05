import Image from "next/image";
import Link from "next/link";

export default function AboutHeader() {
  return (
    <div className="flex flex-row place-content-end items-center">
      <Link href="/">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="text-2xl font-bold">ZotNFound</h1>
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
