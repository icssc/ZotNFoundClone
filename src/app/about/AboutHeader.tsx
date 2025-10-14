import Image from "next/image";
import Link from "next/link";

export default function AboutHeader() {
  return (
    <div className="flex flex-row place-content-end items-center">
      <Link href="/">
        <div className="flex flex-row gap-4 items-center">
          <h1 className="text-2xl font-bold">ZotnFound</h1>
          <Image
            src="/ZotnFound_Small_Logo.png"
            alt="ZotnFound Logo"
            width={50}
            height={50}
          />
        </div>
      </Link>
    </div>
  );
}