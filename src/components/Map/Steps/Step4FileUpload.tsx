import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StepProps } from "@/lib/types";

export function Step4FileUpload({ formData, setFormData }: StepProps) {
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
          setFormData({ ...formData, file });
        }}
        className="py-32 bg-slate-400"
      />
    </div>
  );
}
