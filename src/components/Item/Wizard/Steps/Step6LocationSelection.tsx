"use client";
import { Label } from "@/components/ui/label";
import { LocationFormData } from "@/lib/types";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("../components/LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-400 animate-pulse">
      Loading map...
    </div>
  ),
});

interface Step6Props {
  formData: LocationFormData;
  updateField: <K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) => void;
}

export function Step6LocationSelection({ formData, updateField }: Step6Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-white/90 font-medium">
          Pin the location
        </Label>
        <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full border border-white/5">
          Click map to place marker
        </span>
      </div>
      
      <div className="md:h-[400px] h-[250px] sm:h-[300px] w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl relative group">
        <LocationMap formData={formData} updateField={updateField} />
        
        {/* Overlay hint that fades out on hover */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none group-hover:bg-transparent transition-colors duration-300" />
      </div>
      
      <p className="text-xs text-center text-gray-500">
        Accurate location helps others find your item faster.
      </p>
    </div>
  );
}
