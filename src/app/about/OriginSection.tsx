import Image from "next/image";

export default function OriginSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 py-4 pb-12 items-center justify-center max-w-6xl mx-auto ">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">Origin of ZotnFound</h1>
        <p className="text-gray-700 text-sm">
          Many people are constantly losing their belongings, whether that be
          their phones, keys, or water bottles. This is especially true for UCI
          students on the UCI subreddit, where there are countless posts being
          created about lost and found items. Due to this problem, we decided to
          take matters into our own hands and created an Instagram account to
          help lost items return back to their original owners. We have so far
          helped over 10 people and gained over 300+ followers.
        </p>
      </div>
      <div className="flex justify-center">
        <div className="w-[400px]">
          <Image
            src="/zotnfound_ig.png"
            alt="ZotnFound Instagram"
            width={400}
            height={400}
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
