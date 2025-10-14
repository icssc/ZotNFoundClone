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
    "Utilize the easy-to-use filter and search bar to look up specific items.",
    image: "/search_for.png",
    alt: "Search for Lost & Found Items Image",
},
];

export default function ExploreCarousel() {
    return (
            <div className = "max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-center mb-6">
                Explore how ZotnFound works
              </h1>
              <div className="flex flex-wrap justify-center gap-6">
                {carousel.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-1 min-w-[300px] max-w-[350px] px-4 py-4 rounded-md shadow-lg transition-transform duration-300 hover:scale-105 bg-white flex flex-col items-center" //added min and max widths to fix centering issue on medium screens
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
                      <p className="text-lg font-semibold">{item.title}</p>
                      <p className="text-md mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
    

    );
}
