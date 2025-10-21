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
    <div>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white">
          🔑 Item Name:
        </Label>
        <Input
          id="name"
          placeholder="Ex: Airpods Pro, ..."
          onChange={(e) => updateField("name", e.target.value)}
          value={formData.name}
          className="text-white"
        />
      </div>
      <div className="space-y-2 mt-4">
        <Label htmlFor="description" className="text-white">
          Description of Item:
        </Label>
        <Textarea
          id="description"
          placeholder="📝 Ex: Lost in ICS31 Lec, ..."
          onChange={(e) => updateField("description", e.target.value)}
          value={formData.description}
          className="text-white"
        />
      </div>
    </div>
  );
}
