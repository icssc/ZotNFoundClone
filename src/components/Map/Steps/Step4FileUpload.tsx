import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LocationFormData } from "@/lib/types";

interface Step4Props {
  updateField: <K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) => void;
}

export function Step4FileUpload({ updateField }: Step4Props) {
  const handleFileChange = (file: File | null, dropZone: HTMLElement) => {
    updateField("file", file);
    updatePreview(file, dropZone);
  };

  const updatePreview = (file: File | null, dropZone: HTMLElement) => {
    const placeholder = dropZone.querySelector(
      ".placeholder"
    ) as HTMLElement | null;
    const existingPreview = dropZone.querySelector(
      ".preview-img"
    ) as HTMLImageElement | null;

    if (!file) {
      existingPreview?.remove();
      if (placeholder) placeholder.style.opacity = "1";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      let preview = existingPreview;

      if (!preview) {
        preview = document.createElement("img");
        preview.className =
          "preview-img absolute inset-0 w-full h-full object-contain rounded-lg pointer-events-none p-2";
        const inputEl = dropZone.querySelector("input[type=file]");
        if (inputEl) {
          dropZone.insertBefore(preview, inputEl);
        } else {
          dropZone.appendChild(preview);
        }
      }

      preview.src = String(reader.result);
      if (placeholder) placeholder.style.opacity = "0";
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || null;
    const dropZone = e.currentTarget as HTMLElement;
    handleFileChange(file, dropZone);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const dropZone = e.currentTarget.closest(
      ".drop-zone"
    ) as HTMLElement | null;
    if (dropZone) {
      handleFileChange(file, dropZone);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="file" className="text-white">
        📸 Upload an image:
      </Label>

      <div className="relative">
        <div
          className="group drop-zone relative flex items-center justify-center rounded-lg border-2 border-dashed border-slate-600 bg-slate-800 bg-opacity-30 p-6 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg hover:border-sky-400 hover:bg-linear-to-br hover:from-sky-600/6 hover:to-indigo-600/6 min-h-[200px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {/* Placeholder text */}
          <div className="pointer-events-none text-center placeholder transition-opacity duration-200">
            <p className="text-sm text-slate-200">
              <span className="text-2xl block mb-2">📸</span>
              <span className="font-medium">
                Drop image here or click to browse
              </span>
            </p>
            <p className="mt-2 text-xs text-slate-400 group-hover:text-sky-200 transition-colors">
              PNG, JPG, GIF — up to 10MB
            </p>
          </div>

          {/* Hidden file input overlay */}
          <Input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <p className="mt-2 text-xs text-slate-400">
          Tip: Click or drag-and-drop to upload. The preview will appear while
          you can still replace the file.
        </p>
      </div>
    </div>
  );
}
