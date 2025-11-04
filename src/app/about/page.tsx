import AboutHeader from "./AboutHeader";
import ExploreCarousel from "./ExploreCarousel";
import OriginSection from "./OriginSection";
import StatisticCards from "./StatisticCards";

export default function AboutPage() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] px-3 sm:px-4 lg:px-6 py-10">
      <section id="header" className="max-w-6xl mx-auto">
        <AboutHeader />
      </section>

      <section id="explore" className="max-w-6xl mx-auto mt-16">
        <ExploreCarousel />
      </section>

      <section id="origin" className="max-w-5xl mx-auto mt-16">
        <OriginSection />
      </section>

      <section id="stats" className="max-w-6xl mx-auto mt-16">
        <StatisticCards />
      </section>
    </div>
  );
}
