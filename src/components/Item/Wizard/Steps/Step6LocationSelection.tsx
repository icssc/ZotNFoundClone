"use client";
import { Label } from "@/components/ui/label";
import { LocationFormData } from "@/lib/types";
import dynamic from "next/dynamic";

const LocationMap = dynamic(
  () => import("../components/LocationMap"),
  { ssr: false }
);

interface Step6Props {
  formData: LocationFormData;
  updateField: <K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) => void;
}

export function Step6LocationSelection({ formData, updateField }: Step6Props) {
  return (
    <div className="space-y-2">
      <Label className="text-white">📍 Select the location on the map:</Label>
      <div className="md:h-[400px] h-[300px] md:w-[600px] w-full rounded-md overflow-hidden">
        <LocationMap formData={formData} updateField={updateField} />
      </div>
      <p className="text-sm text-gray-400">
        Click on the map to place a marker where the item was{" "}
        {formData.isLost ? "lost" : "found"}.
      </p>
    </div>
  );
}
