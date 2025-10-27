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
  const itemTypes = [
    { value: "electronics", label: "Electronics", Icon: Headphones },
    { value: "clothing", label: "Clothing", Icon: Shirt },
    { value: "accessories", label: "Accessories", Icon: Key },
    { value: "documents", label: "Documents", Icon: File },
    { value: "other", label: "Other", Icon: CircleDot },
  ];
  return (
    <div className="space-y-2 flex flex-col items-center justify-center">
      <Label htmlFor="type" className="text-white">
        🔍 Select Item Type:
      </Label>

      <div className="flex flex-col text-black md:flex-row md:flex-wrap gap-2 items-center justify-center w-full">
        {itemTypes.map((item) => (
          <Button
            key={item.value}
            variant={formData.type === item.value ? "default" : "outline"}
            className={`w-full md:w-32 md:h-32 ${formData.type === item.value ? "bg-black" : "hover:bg-gray-400"} `}
            onClick={() =>
              updateField("type", item.value as LocationFormData["type"])
            }
          >
            <item.Icon className="w-4 h-4 mr-2" />
            {item.label}
          </Button>
        ))}
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
