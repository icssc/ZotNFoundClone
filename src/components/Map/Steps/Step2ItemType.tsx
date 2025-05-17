import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Headphones, Shirt, Key, File, CircleDot } from 'lucide-react';
import { StepProps } from "@/lib/types";

export function Step2ItemType({ formData, setFormData }: StepProps) {
  return (
    <div className="space-y-2 flex flex-col items-center justify-center">
      <Label htmlFor="type" className="text-white">🔍 Select Item Type:</Label>

      <div className="flex flex-wrap gap-2 items-center justify-center">
        <Button 
          variant={formData.type === "electronics" ? "default" : "outline"} 
          className={`w-48 h-48 ${formData.type === "electronics" ? "bg-black" : ""}`} 
          onClick={() => setFormData({ ...formData, type: "electronics" })}
        >
          <Headphones className="w-4 h-4 mr-2" />
          Electronics
        </Button>
        <Button 
          variant={formData.type === "clothing" ? "default" : "outline"} 
          className={`w-48 h-48 ${formData.type === "clothing" ? "bg-black" : ""}`} 
          onClick={() => setFormData({ ...formData, type: "clothing" })}
        >
          <Shirt className="w-4 h-4 mr-2" />
          Clothing
        </Button>
        <Button 
          variant={formData.type === "accessories" ? "default" : "outline"} 
          className={`w-48 h-48 ${formData.type === "accessories" ? "bg-black" : ""}`} 
          onClick={() => setFormData({ ...formData, type: "accessories" })}
        >
          <Key className="w-4 h-4 mr-2" />
          Accessories
        </Button>
        <Button 
          variant={formData.type === "documents" ? "default" : "outline"} 
          className={`w-48 h-48 ${formData.type === "documents" ? "bg-black" : ""}`} 
          onClick={() => setFormData({ ...formData, type: "documents" })}
        >
          <File className="w-4 h-4 mr-2" />
          Documents
        </Button>
        <Button 
          variant={formData.type === "other" ? "default" : "outline"} 
          className={`w-48 h-48 ${formData.type === "other" ? "bg-black" : ""}`} 
          onClick={() => setFormData({ ...formData, type: "other" })}
        >
          <CircleDot className="w-4 h-4 mr-2" />
          Other
        </Button>
      </div>
      <div className="flex items-center justify-center bg-slate-800 rounded-lg p-1 w-full max-w-xs mx-auto">
        <button
          className={`flex-1 py-2 px-4 rounded-md transition-all ${
            formData.isLost 
              ? "bg-blue-600 text-white" 
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
          onClick={() => setFormData({ ...formData, isLost: true })}
        >
          Lost Item
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md transition-all ${
            !formData.isLost 
              ? "bg-blue-600 text-white" 
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
          onClick={() => setFormData({ ...formData, isLost: false })}
        >
          Found Item
        </button>
      </div>
    </div>
  );
} 