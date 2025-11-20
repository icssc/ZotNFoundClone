import Image from "next/image";

export default function OriginSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-8 py-12 items-center justify-center max-w-6xl mx-auto bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
      <div className="flex-1 text-left space-y-4">
        <h1 className="text-3xl font-bold text-white">Origin of ZotnFound</h1>
        <p className="text-gray-400 text-base leading-relaxed">
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
        <div className="w-[300px] relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <Image
            src="/zotnfound_ig.png"
            alt="ZotnFound Instagram"
            width={400}
            height={400}
            className="rounded-lg relative border border-white/10"
          />
        </div>
      </div>
    </div>
  );
}
