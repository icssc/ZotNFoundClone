import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { StepProps } from "@/lib/types";

export function Step3DateSelection({ formData, setFormData }: StepProps) {
  return (
    <div className="space-y-2 flex flex-col justify-center items-center">
      <Label htmlFor="date" className="text-white">📅 When was it lost/found?</Label>
      <Calendar 
        mode="single" 
        selected={formData.date} 
        onSelect={(newDate) => {
          setFormData({ ...formData, date: newDate || new Date() });
        }}
        className="rounded-md border shadow text-white"
      />
    </div>
  );
} 