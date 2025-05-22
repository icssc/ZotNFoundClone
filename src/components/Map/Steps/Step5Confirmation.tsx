import Image from "next/image";
import { ConfirmationStepProps } from "@/lib/types";

export function Step5Confirmation({ formData }: ConfirmationStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg text-white">Confirm and Submit</h3>
      <div className="flex gap-4">
        <div className="bg-gray-800 p-4 rounded-md space-y-2 w-64 h-64">
          <Image
            src={formData.file ? URL.createObjectURL(formData.file) : ""}
            alt="Item Image"
            className="w-full h-full object-cover"
            width={256}
            height={256}
          />
        </div>
        <div className="bg-gray-800 p-4 rounded-md space-y-2">
          <h3 className="font-medium text-lg text-white">
            <strong>Item Information:</strong>
          </h3>
          <p className="text-white">
            <strong>Name:</strong> {formData.name}
          </p>
          <p className="text-white">
            <strong>Description:</strong> {formData.description}
          </p>
          <p className="text-white">
            <strong>Type:</strong> {formData.type}
          </p>
          <p className="text-white">
            <strong>Date:</strong> {formData.date.toLocaleDateString()}
          </p>
          <p className="text-white">
            <strong>Image:</strong>{" "}
            {formData.file ? formData.file.name : "None"}
          </p>
        </div>
      </div>
    </div>
  );
}
