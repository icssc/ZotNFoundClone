import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Headphones, Shirt, Key, File, CircleDot } from "lucide-react";
import { LocationFormData } from "@/lib/types";

interface Step2Props {
  formData: LocationFormData;
  updateField: <K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) => void;
}

export function Step2ItemType({ formData, updateField }: Step2Props) {
  return (
    <div className="space-y-2 flex flex-col items-center justify-center">
      <Label htmlFor="type" className="text-white">
        🔍 Select Item Type:
      </Label>

      <div className="flex flex-col md:flex-row md:flex-wrap gap-2 items-center justify-center w-full">
        <Button
          variant={formData.type === "electronics" ? "default" : "outline"}
          className={`w-full md:w-32 md:h-32 ${formData.type === "electronics" ? "bg-black" : ""}`}
          onClick={() => updateField("type", "electronics")}
        >
          <Headphones className="w-4 h-4 mr-2" />
          Electronics
        </Button>
        <Button
          variant={formData.type === "clothing" ? "default" : "outline"}
          className={`w-full md:w-32 md:h-32 ${formData.type === "clothing" ? "bg-black" : ""}`}
          onClick={() => updateField("type", "clothing")}
        >
          <Shirt className="w-4 h-4 mr-2" />
          Clothing
        </Button>
        <Button
          variant={formData.type === "accessories" ? "default" : "outline"}
          className={`w-full md:w-32 md:h-32 ${formData.type === "accessories" ? "bg-black" : ""}`}
          onClick={() => updateField("type", "accessories")}
        >
          <Key className="w-4 h-4 mr-2" />
          Accessories
        </Button>
        <Button
          variant={formData.type === "documents" ? "default" : "outline"}
          className={`w-full md:w-32 md:h-32 ${formData.type === "documents" ? "bg-black" : ""}`}
          onClick={() => updateField("type", "documents")}
        >
          <File className="w-4 h-4 mr-2" />
          Documents
        </Button>
        <Button
          variant={formData.type === "other" ? "default" : "outline"}
          className={`w-full md:w-32 md:h-32 ${formData.type === "other" ? "bg-black" : ""}`}
          onClick={() => updateField("type", "other")}
        >
          <CircleDot className="w-4 h-4 mr-2" />
          Other
        </Button>
      </div>
      <div className="flex items-center justify-center bg-slate-800 rounded-lg p-1 w-full max-w-xs mx-auto">
        <button
          className={`flex-1 md:py-2 md:px-4 py-1 px-2 rounded-md transition-all ${
            formData.isLost
              ? "bg-blue-600 text-white"
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
          onClick={() => updateField("isLost", true)}
        >
          Lost Item
        </button>
        <button
          className={`flex-1 md:py-2 md:px-4 py-1 px-2 rounded-md transition-all ${
            !formData.isLost
              ? "bg-blue-600 text-white"
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
          onClick={() => updateField("isLost", false)}
        >
          Found Item
        </button>
      </div>
    </div>
  );
}
