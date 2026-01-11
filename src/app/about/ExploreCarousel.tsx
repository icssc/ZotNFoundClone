import Image from "next/image";

interface CarouselItem {
  title: string;
  description: string;
  image: string;
  alt: string;
}

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
      "Use the search bar to find specific items. Bookmark your searches for easy access and found item alerts.",
    image: "/search_for.png",
    alt: "Search for Lost & Found Items Image",
  },
];

export default function ExploreCarousel() {
  return (
    <div className="max-w-7xl mx-auto py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-10 text-white">
        Explore how ZotNFound works
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {carousel.map((item, idx) => (
          <div
            key={idx}
            className="flex-1 min-w-[300px] max-w-[350px] px-6 py-6 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10 bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center group"
          >
            <div className="relative w-full aspect-video mb-6 overflow-hidden rounded-lg border border-white/5">
              <Image
                src={item.image}
                fill
                sizes="(max-width: 768px) 100vw, 350px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                alt={item.alt}
              />
            </div>
            <div className="text-center max-w-full">
              <p className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                {item.title}
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
