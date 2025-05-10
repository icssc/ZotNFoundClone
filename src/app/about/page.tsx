import Image from "next/image";
import Link from "next/link";

interface CarouselItem {
  title: string;
  description: string;
  image: string;
  alt: string;
}

export default function About() {
  const carousel: CarouselItem[] = [
    {
      title: "Get Started - It's Simple & Easy",
      description:
        "Log in with your UCI email and start listing lost & found items!",
      image: "/get_started.png",
      alt: "Getting Started Image",
    },
    {
      title: "Navigate Around the Map",
      description:
        "Effortlessly navigate UCI's interactive map to efficiently search for lost and found items.",
      image: "/navigate_around.png",
      alt: "Navigate Around Map Image",
    },
    {
      title: "Search for Lost & Found Items",
      description:
        "Utilize the easy-to-use filter and search bar to look up specific items.",
      image: "/search_for.png",
      alt: "Search for Lost & Found Items Image",
    },
  ];

  return (
    <div className="text-center min-h-screen space-y-8 bg-slate-100">
      <div className="mx-4 md:mx-32 py-8 space-y-8">
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

        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold">
            We are <span className="text-blue-500">ZotnFound</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div className="px-10 py-8 rounded-md shadow-lg transition-transform duration-300 hover:scale-105 bg-white text-center">
              <p className="text-red-400 font-bold text-3xl">88</p>
              <p className="text-sm">Lost Items</p>
            </div>
            <div className="px-10 py-8 rounded-md shadow-lg transition-transform duration-300 hover:scale-105 bg-white text-center">
              <p className="text-green-400 font-bold text-3xl">32</p>
              <p className="text-sm">Found Items</p>
            </div>
            <div className="px-10 py-8 rounded-md shadow-lg transition-transform duration-300 hover:scale-105 bg-white text-center">
              <p className="text-yellow-400 font-bold text-3xl">16</p>
              <p className="text-sm">Successful Items</p>
            </div>
            <div className="px-10 py-8 rounded-md shadow-lg transition-transform duration-300 hover:scale-105 bg-white text-center">
              <p className="text-purple-400 font-bold text-3xl">705</p>
              <p className="text-sm">Active Users</p>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-center mb-6">
            Explore how ZotnFound works
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {carousel.map((item, idx) => (
              <div
                key={idx}
                className="w-full max-w-sm px-4 py-4 rounded-md shadow-lg transition-transform duration-300 hover:scale-105 bg-white flex flex-col items-center"
              >
                <Image
                  src={item.image}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto rounded-md"
                  alt={item.alt}
                />
                <div className="text-center max-w-full mt-2">
                  <p className="text-md font-semibold">{item.title}</p>
                  <p className="text-xs mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 py-4 items-center justify-center">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">Origin of ZotnFound</h1>
            <p className="text-gray-700 text-sm">
              Many people are constantly losing their belongings, whether that
              be their phones, keys, or water bottles. This is especially true
              for UCI students on the UCI subreddit, where there are countless
              posts being created about lost and found items. Due to this
              problem, we decided to take matters into our own hands and created
              an Instagram account to help lost items return back to their
              original owners. We have so far helped over 10 people and gained
              over 300+ followers.
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
      </div>
    </div>
  );
}
