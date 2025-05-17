import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StepProps } from "@/lib/types";

export function Step1BasicInfo({ formData, setFormData }: StepProps) {
  return (
    <div>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white">
          🔑 Item Name:
        </Label>
        <Input
          id="name"
          placeholder="Ex: Airpods Pro, ..."
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          value={formData.description}
          className="text-white"
        />
      </div>
    </div>
  );
}
