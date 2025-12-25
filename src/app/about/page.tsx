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
            <>
              <style>{`
                .animate-gradient-hover {
                  background-size: 200% 200%;
                  background-position: 0% 50%;
                }
                .animate-gradient-hover:hover {
                  animation: gradient-shift 3s linear infinite;
                }
                @keyframes gradient-shift {
                  0% {
                    background-position: 0% 50%;
                  }
                  50% {
                    background-position: 100% 50%;
                  }
                  100% {
                    background-position: 0% 50%;
                  }
                }
              `}</style>
              <span className="animate-gradient-hover text-transparent bg-clip-text bg-linear-to-r from-green-400 via-red-400 to-blue-400 font-extrabold tracking-tight drop-shadow-[0_0_25px_rgba(59,130,246,0.45)]">
                Zot<span className="mx-1">N</span>Found
              </span>
            </>
          </h1>
          <StatisticsCards />
        </div>
        <ExploreCarousel />
        <OriginSection />
      </div>
    </div>
  );
}
