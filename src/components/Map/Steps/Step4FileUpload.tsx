import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LocationFormData } from "@/lib/types";

interface Step4Props {
  formData: LocationFormData;
  updateField: <K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) => void;
}

export function Step4FileUpload({ formData, updateField }: Step4Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="file" className="text-white">
        📸 Upload an image:
      </Label>
      <Input
        id="file"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          updateField("file", file);
        }}
        className="py-32 bg-slate-400"
      />
    </div>
  );
}
