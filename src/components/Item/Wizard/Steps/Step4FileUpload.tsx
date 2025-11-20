import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LocationFormData } from "@/lib/types";
import imageCompression from "browser-image-compression";
import React from "react";
import {
  trackFileUploadStarted,
  trackFileUploadCompleted,
  trackFileUploadFailed,
} from "@/lib/analytics";
import { UploadCloud } from "lucide-react";

interface Step4Props {
  updateField: <K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) => void;
}

export function Step4FileUpload({ updateField }: Step4Props) {
  const compressImage = async (file: File | null) => {
    if (!file) return null;
    try {
      trackFileUploadStarted();
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
        preserveExif: false,
      } as const;
      const compressed = await imageCompression(file, options);
      trackFileUploadCompleted(compressed.size, compressed.type);
      return compressed;
    } catch (error) {
      // On failure, fall back to original file
      trackFileUploadFailed(
        error instanceof Error ? error.message : "Compression failed"
      );
      return file;
    }
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
          "preview-img absolute inset-0 w-full h-full object-contain rounded-xl pointer-events-none p-2 bg-black/50 backdrop-blur-sm";
        const inputEl = dropZone.querySelector("input[type=file]");
        if (inputEl && inputEl.parentElement === dropZone) {
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

  const handleFileChange = async (file: File | null, dropZone: HTMLElement) => {
    const compressed = await compressImage(file);
    updateField("file", compressed);
    updatePreview(compressed, dropZone);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || null;
    const dropZone = e.currentTarget as HTMLElement;
    await handleFileChange(file, dropZone);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const dropZone = e.currentTarget.closest(
      ".drop-zone"
    ) as HTMLElement | null;
    if (dropZone) {
      await handleFileChange(file, dropZone);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <Label
        htmlFor="file"
        className="text-white/90 font-medium text-xs sm:text-sm"
      >
        📸 Upload an image:
      </Label>

      <div className="relative group">
        <div
          className="group drop-zone relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/5 p-4 sm:p-8 transition-all duration-300 ease-out hover:border-indigo-500/50 hover:bg-white/10 min-h-[160px] sm:min-h-[240px] overflow-hidden cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {/* Placeholder text */}
          <div className="pointer-events-none text-center placeholder transition-opacity duration-300 flex flex-col items-center gap-2 sm:gap-3">
            <div className="p-3 sm:p-4 rounded-full bg-white/5 group-hover:bg-indigo-500/20 transition-colors duration-300">
              <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-indigo-400" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-sm sm:text-base font-medium text-white group-hover:text-indigo-300 transition-colors">
                Click or drag image here
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 group-hover:text-gray-300">
                Supports JPG, PNG, GIF (max 10MB)
              </p>
            </div>
          </div>

          {/* Hidden file input overlay */}
          <Input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
      </div>
    </div>
  );
}
