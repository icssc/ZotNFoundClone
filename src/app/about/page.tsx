import AboutHeader from "./AboutHeader";
import StatisticsCards from "./StatisticCards"; 
import ExploreCarousel from "./ExploreCarousel";
import OriginSection from "./OriginSection";

export default function About() {
  return (
      <div className="text-center min-h-screen space-y-8 bg-slate-100">
      <div className="mx-4 md:mx-32 py-8 space-y-8">
        <AboutHeader />
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold">
            We are <span className="text-blue-500">ZotnFound</span>
          </h1>
          <StatisticsCards/>
        </div>
        <ExploreCarousel />
        <OriginSection />
      </div>
    </div>
  );
}
