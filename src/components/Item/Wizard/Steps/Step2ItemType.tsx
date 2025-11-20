import { Label } from "@/components/ui/label";
import {
  Headphones,
  Shirt,
  Key,
  File,
  CircleDot,
  Search,
  Check,
} from "lucide-react";
import { LocationFormData } from "@/lib/types";

interface Step2Props {
  formData: LocationFormData;
  updateField: <K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) => void;
}

export function Step2ItemType({ formData, updateField }: Step2Props) {
  const itemTypes = [
    { value: "electronics", label: "Electronics", Icon: Headphones },
    { value: "clothing", label: "Clothing", Icon: Shirt },
    { value: "accessories", label: "Accessories", Icon: Key },
    { value: "documents", label: "Documents", Icon: File },
    { value: "other", label: "Other", Icon: CircleDot },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        <Label className="text-white/90 font-medium text-center block text-xs sm:text-sm">
          What kind of item is it?
        </Label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {itemTypes.map((item) => {
            const isSelected = formData.type === item.value;
            return (
              <button
                key={item.value}
                onClick={() =>
                  updateField("type", item.value as LocationFormData["type"])
                }
                className={`
                  relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border transition-all duration-300 group
                  ${
                    isSelected
                      ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105 z-10"
                      : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white"
                  }
                `}
              >
                <item.Icon
                  className={`w-6 h-6 sm:w-8 sm:h-8 mb-1.5 sm:mb-2 transition-transform duration-300 ${isSelected ? "scale-110" : "group-hover:scale-110"}`}
                />
                <span className="text-[10px] sm:text-xs font-medium">
                  {item.label}
                </span>

                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                    <div className="bg-black text-white rounded-full p-0.5">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-1 sm:pt-2">
        <Label className="text-white/90 font-medium text-center block mb-2 sm:mb-3 text-xs sm:text-sm">
          Is this item lost or found?
        </Label>
        <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
          <button
            className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
              formData.isLost
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            onClick={() => updateField("isLost", true)}
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />I Lost It
          </button>
          <button
            className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
              !formData.isLost
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            onClick={() => updateField("isLost", false)}
          >
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />I Found It
          </button>
        </div>
      </div>
    </div>
  );
}
