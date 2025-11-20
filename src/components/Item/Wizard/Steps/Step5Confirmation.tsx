import Image from "next/image";
import { LocationFormData } from "@/lib/types";
import { Calendar, MapPin, Tag, FileText } from "lucide-react";

interface Step5Props {
  formData: LocationFormData;
}

export function Step5Confirmation({ formData }: Step5Props) {
  return (
    <div className="space-y-4 sm:space-y-6 overflow-y-auto pr-2">
      <div className="text-center space-y-0.5 sm:space-y-1">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          Review Details
        </h3>
        <p className="text-xs sm:text-sm text-gray-400">
          Please verify the information before submitting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Image Preview */}
        <div className="relative aspect-square w-full max-w-[200px] sm:max-w-[280px] mx-auto rounded-xl sm:rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl">
          {formData.file ? (
            <Image
              src={URL.createObjectURL(formData.file)}
              alt="Item Image"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-xs sm:text-sm">
              No image uploaded
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
            <div className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium backdrop-blur-md border border-white/10 ${
              formData.isLost 
                ? "bg-indigo-500/20 text-indigo-200" 
                : "bg-emerald-500/20 text-emerald-200"
            }`}>
              {formData.isLost ? "Lost Item" : "Found Item"}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/5 space-y-3 sm:space-y-4">
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-white mb-0.5 sm:mb-1">{formData.name}</h4>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400">
                <Tag className="w-3 h-3" />
                <span className="capitalize">{formData.type}</span>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 pt-2 border-t border-white/5">
              <div className="flex gap-2 sm:gap-3">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {formData.description}
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
                <p className="text-xs sm:text-sm text-gray-300">
                  {formData.date.toLocaleDateString(undefined, { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {formData.location && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
                  <p className="text-xs sm:text-sm text-gray-300">
                    Location selected on map
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
