import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LocationFormData } from "@/lib/types";

interface Step1Props {
  formData: LocationFormData;
  updateField: <K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) => void;
}

export function Step1BasicInfo({ formData, updateField }: Step1Props) {
  return (
    <div className="space-y-3 sm:space-y-5">
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="name" className="text-white/90 font-medium text-xs sm:text-sm">
          🔑 Item Name
        </Label>
        <Input
          id="name"
          placeholder="Ex: Airpods Pro, ..."
          onChange={(e) => updateField("name", e.target.value)}
          value={formData.name}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all duration-300 h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm"
        />
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="description" className="text-white/90 font-medium text-xs sm:text-sm">
          Description of Item:
        </Label>
        <Textarea
          id="description"
          placeholder="📝 Ex: Lost in ICS31 Lec, ..."
          onChange={(e) => updateField("description", e.target.value)}
          value={formData.description}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/20 transition-all duration-300 min-h-[100px] sm:min-h-[120px] rounded-lg sm:rounded-xl resize-none text-sm"
        />
      </div>
    </div>
  );
}
