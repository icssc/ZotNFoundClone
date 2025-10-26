import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LocationFormData } from "@/lib/types";
import imageCompression from "browser-image-compression";

interface Step4Props {
  updateField: <K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) => void;
}

export function Step4FileUpload({ updateField }: Step4Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="file" className="text-white">
        📸 Upload an image:
      </Label>
      <Input
        id="file"
        type="file"
        accept="image/*"
        onChange={async (e) => {
          let file = e.target.files?.[0] || null;
          if (file) {
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
              fileType: "image/webp",
              preserveExif: false,
            };
            file = await imageCompression(file, options);
          }
          updateField("file", file);
        }}
        className="py-32 bg-slate-400"
      />
    </div>
  );
}
