import Image from "next/image";

export default function OriginSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-8 py-12 items-center justify-center max-w-6xl mx-auto bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
      <div className="flex-1 text-left space-y-4">
        <h1 className="text-3xl font-bold text-white">Origin of ZotNFound</h1>
        <p className="text-gray-400 text-base leading-relaxed">
          ZotNFound is the lost and found website for UCI. We noticed the UCI
          subreddit was filled with students looking for lost phones, keys, and
          water bottles, so we built a better solution. We are Anteaters helping
          Anteaters, ensuring that every lost item finds its way back home. So
          far, we have helped over 10 people and gained over 300+ followers.
        </p>
      </div>
      <div className="flex justify-center">
        <div className="w-[300px] relative group border-white border-[0.25] p-2">
          {/* Corner accents */}
          <div className="pointer-events-none absolute z-10 -top-px -left-px h-10 w-10">
            <div className="absolute -top-px -left-px h-8 w-[3px] bg-white" />
            <div className="absolute -top-px -left-px w-8 h-[3px] bg-white" />
          </div>
          <div className="pointer-events-none absolute z-10 -top-px -right-px h-10 w-10">
            <div className="absolute -top-px -right-px h-8 w-[3px] bg-white" />
            <div className="absolute -top-px -right-px w-8 h-[3px] bg-white" />
          </div>
          <div className="pointer-events-none absolute z-10 -bottom-px -left-px h-10 w-10">
            <div className="absolute -bottom-px -left-px h-8 w-[3px] bg-white" />
            <div className="absolute -bottom-px -left-px w-8 h-[3px] bg-white" />
          </div>
          <div className="pointer-events-none absolute z-10 -bottom-px -right-px h-10 w-10">
            <div className="absolute -bottom-px -right-px h-8 w-[3px] bg-white" />
            <div className="absolute -bottom-px -right-px w-8 h-[3px] bg-white" />
          </div>

          <div className="absolute -inset-1 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <Image
            src="/zotnfound_ig.png"
            alt="ZotnFound Instagram"
            width={400}
            height={400}
            className="rounded-lg relative border border-white/10 transition-transform duration-300 group-hover:scale-105 hover:rounded-none"
          />
        </div>
      </div>
    </div>
  );
}
