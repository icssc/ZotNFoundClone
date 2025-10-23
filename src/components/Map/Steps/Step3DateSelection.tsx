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
    <div className="space-y-2 flex flex-col justify-center items-center">
      <Label htmlFor="date" className="text-white">
        📅 When was it lost/found?
      </Label>
      <Calendar
        mode="single"
        selected={formData.date}
        onSelect={(newDate) => {
          updateField("date", newDate || new Date());
        }}
        className="rounded-md border shadow text-white"
      />
    </div>
  );
}
