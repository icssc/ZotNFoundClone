import Image from "next/image";

export default function OriginSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 py-4 pb-12 items-center justify-center max-w-6xl mx-auto rounded-xl border border-border bg-card text-card-foreground">
      <div className="space-y-3 animate-in fade-in slide-in-from-left duration-700">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">How It Started</h2>
        <p>
          ZotNFound began as a student-led initiative to streamline the chaotic
          process of finding misplaced items across campus. We wanted a system
          that was fast, visual, and respectful of everyone’s time.
        </p>
        <p>
          By combining a map-first interface, simple posting, and smart
          notifications, the community can help each other recover what matters
          most. Every feature is built with real campus workflows in mind.
        </p>
      </div>
      {/* Right side kept visual without images */}
      <div className="rounded-lg w-full h-[240px] lg:h-[300px] bg-gradient-to-br from-neutral-800 via-neutral-900 to-black animate-in slide-in-from-right duration-700" />
    </div>
  );
}

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
