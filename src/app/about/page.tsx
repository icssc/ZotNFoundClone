import AboutHeader from "./AboutHeader";
import StatisticsCards from "./StatisticCards";
import ExploreCarousel from "./ExploreCarousel";
import OriginSection from "./OriginSection";

export default function About() {
  return (
    <div className="text-center min-h-screen space-y-8 bg-black text-white selection:bg-blue-500/30">
      <div className="mx-4 md:mx-32 py-8 space-y-8">
        <AboutHeader />
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            We are{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              ZotNFound
            </span>
          </h1>
          <StatisticsCards />
        </div>
        <ExploreCarousel />
        <OriginSection />
      </div>
    </div>
  );
}
