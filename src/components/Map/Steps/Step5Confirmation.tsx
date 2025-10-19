import Image from "next/image";
import { ConfirmationStepProps } from "@/lib/types";

export function Step5Confirmation({ formData }: ConfirmationStepProps) {
  return (
    <div className="space-y-4 max-h-[50vh] sm:max-h-[70vh] overflow-y-auto">
      <h3 className="font-medium md:text-lg text-sm text-white">Confirm and Submit</h3>
      <div className="flex flex-col lg:flex-row gap-4 justify-center items-center">
        <div className="bg-gray-800 p-4 rounded-md space-y-2 md:w-80 md:h-80 w-56 h-56">
          <Image
            src={formData.file ? URL.createObjectURL(formData.file) : ""}
            alt="Item Image"
            className="w-full h-full object-cover rounded"
            width={320}
            height={320}
          />
        </div>
        <div className="bg-gray-800 p-4 rounded-md space-y-2 flex-1 md:w-80 md:h-80 h-56 w-56">
          <h3 className="font-medium text-lg text-white">
            <strong>Item Information:</strong>
          </h3>
          <div className="space-y-3">
            <p className="text-white text-xs md:text-base">
              <strong>Name:</strong> {formData.name}
            </p>
            <p className="text-white text-xs md:text-base">
              <strong>Description:</strong> {formData.description}
            </p>
            <p className="text-white text-xs md:text-base">
              <strong>Type:</strong> {formData.type}
            </p>
            <p className="text-white text-xs md:text-base">
              <strong>Date:</strong> {formData.date.toLocaleDateString()}
            </p>
            <p className="text-white text-xs md:text-base">
              <strong>Image:</strong>{" "}
              {formData.file ? formData.file.name : "None"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
