import Image from "next/image";

const features = [
  {
    title: "Map-Based Search",
    description:
      "Find lost and found posts visually with location-aware filtering.",
    icon: "/logos/locate_dark.svg",
  },
  {
    title: "Quick Posting",
    description:
      "Create a post in seconds with essentials: item, location, time.",
    icon: "/file.svg",
  },
  {
    title: "Smart Subscriptions",
    description:
      "Subscribe for updates by item type, keywords, or your campus zones.",
    icon: "/logos/subscribe_white.svg",
  },
  {
    title: "Bookmarks",
    description:
      "Track items you care about and get notified when status changes.",
    icon: "/logos/bookmark-white.svg",
  },
];

export default function ExploreCarousel() {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Explore Features</h2>
      <div
        className="
          flex gap-4 overflow-x-auto pb-2
          snap-x snap-mandatory
          no-scrollbar
          [scrollbar-width:none] [-ms-overflow-style:none]
        "
      >
        {/* Removed styled-jsx: now using global .no-scrollbar */}
        {features.map((f, i) => (
          <article
            key={f.title}
            className="
              snap-center shrink-0 w-[280px] md:w-[320px]
              rounded-xl border border-border bg-card text-card-foreground
              p-4 animate-in fade-in slide-in-from-bottom
              duration-500 hover:translate-y-[-4px] animate-smooth
            "
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={f.icon}
                alt=""
                width={28}
                height={28}
                className="opacity-90"
              />
              <h3 className="text-lg font-medium">{f.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{f.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
