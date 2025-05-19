"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Step1BasicInfo } from "./Steps/Step1BasicInfo";
import { LocationFormData } from "@/lib/types";
import { Step2ItemType } from "./Steps/Step2ItemType";
import { Step3DateSelection } from "./Steps/Step3DateSelection";
import { Step4FileUpload } from "./Steps/Step4FileUpload";
import { Step5Confirmation } from "./Steps/Step5Confirmation";
import { Step6LocationSelection } from "./Steps/Step6LocationSelection";
import { useCreateItem } from "@/hooks/Items";
import { NewItem } from "@/db/schema";
import { format } from "date-fns";

interface AddLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLocationDialog({
  open,
  onOpenChange,
}: AddLocationDialogProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<LocationFormData>({
    name: "",
    description: "",
    type: "",
    date: new Date(),
    file: null,
    isLost: true,
    location: null,
  });

  const [itemToCreate, setItemToCreate] = useState<NewItem | null>(null);
  const { data, error } = useCreateItem(itemToCreate as NewItem);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data && isSubmitting) {
      onOpenChange(false);
      setCurrentStep(1);
      setFormData({
        name: "",
        description: "",
        type: "",
        date: new Date(),
        file: null,
        isLost: true,
        location: null,
      });
      setIsSubmitting(false);
      setItemToCreate(null);
    }
  }, [data, isSubmitting, onOpenChange]);

  useEffect(() => {
    if (error) {
      console.error("Error creating item:", error);
      setIsSubmitting(false);
    }
  }, [error]);

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!formData.name && !!formData.description;
      case 2:
        return !!formData.type;
      case 3:
        return !!formData.date;
      case 4:
        return !!formData.file;
      case 5:
        return true;
      case 6:
        return !!formData.location;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!formData.location || !formData.file) return;

    setIsSubmitting(true);

    const reader = new FileReader();
    reader.readAsDataURL(formData.file);

    reader.onload = () => {
      const base64String = reader.result as string;

      const newItem: NewItem = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        date: format(formData.date, "yyyy-MM-dd"),
        image: base64String,
        islost: formData.isLost,
        location: formData.location?.map(String) ?? [],
        isresolved: false,
        ishelped: false,
      };
      setItemToCreate(newItem);
    };
  };

  const handleContinue = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} setFormData={setFormData} />;
      case 2:
        return <Step2ItemType formData={formData} setFormData={setFormData} />;
      case 3:
        return (
          <Step3DateSelection formData={formData} setFormData={setFormData} />
        );
      case 4:
        return (
          <Step4FileUpload formData={formData} setFormData={setFormData} />
        );
      case 5:
        return <Step5Confirmation formData={formData} />;
      case 6:
        return (
          <Step6LocationSelection
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-700 !max-w-fit">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Location</DialogTitle>
        </DialogHeader>

        <div className="w-full bg-slate-800 p-3 rounded-md">
          <div className="flex items-center justify-around w-full space-x-4">
            {/* Steps with connecting lines between them */}
            {[
              {
                number: 1,
                label: "First",
                sublabel: "Enter Info",
                active: currentStep === 1,
              },
              {
                number: 2,
                label: "Second",
                sublabel: "Select Type",
                active: currentStep === 2,
              },
              {
                number: 3,
                label: "Third",
                sublabel: "Choose Date",
                active: currentStep === 3,
              },
              {
                number: 4,
                label: "Fourth",
                sublabel: "File Upload",
                active: currentStep === 4,
              },
              {
                number: 5,
                label: "Fifth",
                sublabel: "Check Info",
                active: currentStep === 5,
              },
              {
                number: 6,
                label: "Sixth",
                sublabel: "Set Location",
                active: currentStep === 6,
              },
            ].map((step) => (
              <div className="flex items-center" key={step.number}>
                <div className="flex flex-col items-center z-10 relative">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-white
                      ${step.active ? "border-2 border-blue-400" : currentStep > step.number ? "bg-blue-400" : "bg-slate-700"} mb-1`}
                  >
                    {currentStep > step.number ? "✓" : step.number}
                  </div>
                  <div className="text-xs text-white font-medium">
                    {step.label}
                  </div>
                  <div className="text-xs text-slate-400">{step.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-4 space-y-4">
          {renderStepContent()}

          <div className="flex justify-between space-x-2 pt-4">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                className="bg-red-100 hover:bg-red-200 text-black"
                onClick={() => {
                  onOpenChange(false);
                  setCurrentStep(1);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={!isStepValid() || isSubmitting}
                onClick={handleContinue}
              >
                {currentStep === 6
                  ? isSubmitting
                    ? "Submitting..."
                    : "Submit"
                  : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
