"use client";

import { Step1BasicInfo } from "../Steps/Step1BasicInfo";
import { Step2ItemType } from "../Steps/Step2ItemType";
import { Step3DateSelection } from "../Steps/Step3DateSelection";
import { Step4FileUpload } from "../Steps/Step4FileUpload";
import { Step5Confirmation } from "../Steps/Step5Confirmation";
import { Step6LocationSelection } from "../Steps/Step6LocationSelection";
import type { LocationFormData } from "@/lib/types";

interface WizardStepContentProps {
  currentStep: number;
  formData: LocationFormData;
  updateField: <K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) => void;
  isEditing: boolean;
}

export function WizardStepContent({
  currentStep,
  formData,
  updateField,
  isEditing,
}: WizardStepContentProps) {
  switch (currentStep) {
    case 1:
      return <Step1BasicInfo formData={formData} updateField={updateField} />;
    case 2:
      return <Step2ItemType formData={formData} updateField={updateField} />;
    case 3:
      return (
        <Step3DateSelection formData={formData} updateField={updateField} />
      );
    case 4:
      return (
        <div className="space-y-3">
          {isEditing && (
            <div className="text-sm text-gray-400 bg-blue-500/10 p-3 rounded-md border border-blue-500/20">
              <p className="font-medium text-blue-400 mb-1">
                💡 Keep Existing Image
              </p>
              <p>
                You can skip this step to keep your current image, or upload a
                new one to replace it.
              </p>
            </div>
          )}
          <Step4FileUpload updateField={updateField} />
        </div>
      );
    case 5:
      return (
        <Step6LocationSelection formData={formData} updateField={updateField} />
      );
    case 6:
      return <Step5Confirmation formData={formData} />;
    default:
      return null;
  }
}
