import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { LocationFormData } from "@/lib/types";

interface Step3Props {
  formData: LocationFormData;
  updateField: <K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) => void;
}

export function Step3DateSelection({ formData, updateField }: Step3Props) {
  return (
    <div className="space-y-3 sm:space-y-4 flex flex-col justify-center items-center">
      <Label
        htmlFor="date"
        className="text-white/90 font-medium text-xs sm:text-sm"
      >
        📅 When was it {formData.isLost ? "lost" : "found"}?
      </Label>
      <div className="w-full max-h-[45vh] sm:max-h-[55vh] overflow-auto mb-4">
        <Calendar
          mode="single"
          selected={formData.date}
          onSelect={(newDate) => {
            updateField("date", newDate || new Date());
          }}
          className="shadow text-white"
          classNames={{
            head_cell:
              "text-gray-400 font-normal text-[0.7rem] sm:text-[0.8rem]",
            day_today: "bg-white/10 text-white",
            day_outside: "text-gray-500 opacity-50",
            day_disabled: "text-gray-500 opacity-50",
            day_hidden: "invisible",
            nav_button:
              "border border-white/10 hover:bg-white/10 hover:text-white transition-colors h-6 w-6 sm:h-7 sm:w-7",
          }}
        />
      </div>
    </div>
  );
}
