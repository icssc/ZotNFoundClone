"use client";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";

// https://stackoverflow.com/questions/77978480/nextjs-with-react-leaflet-ssr-webpack-window-not-defined-icon-not-found
const LazyMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto p-4 md:p-6">
        <div className="mt-12 text-center text-white p-10">
          <h1 className="text-3xl font-bold mb-4">Welcome to ZotNFound</h1>
          <p className="max-w-2xl mx-auto">
            The premier lost and found platform. Find what you&apos;ve lost or
            help others recover their belongings.
          </p>
        </div>
        <LazyMap />
      </main>
    </div>
  );
}
