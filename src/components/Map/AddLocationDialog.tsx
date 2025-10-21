"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useReducer, useActionState, startTransition, useEffect } from "react";
import { Step1BasicInfo } from "./Steps/Step1BasicInfo";
import { LocationFormData } from "@/lib/types";
import { Step2ItemType } from "./Steps/Step2ItemType";
import { Step3DateSelection } from "./Steps/Step3DateSelection";
import { Step4FileUpload } from "./Steps/Step4FileUpload";
import { Step5Confirmation } from "./Steps/Step5Confirmation";
import { Step6LocationSelection } from "./Steps/Step6LocationSelection";
import { format } from "date-fns";
import {
  createItem,
  CreateItemState,
} from "@/server/actions/item/create/action";

interface AddLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormAction =
  | {
      type: "UPDATE_FIELD";
      field: keyof LocationFormData;
      value: LocationFormData[keyof LocationFormData];
    }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET" };

type FormState = LocationFormData & {
  currentStep: number;
};

const initialFormState: FormState = {
  name: "",
  description: "",
  type: "",
  date: new Date(),
  file: null,
  isLost: true,
  location: null,
  currentStep: 1,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "NEXT_STEP":
      return { ...state, currentStep: Math.min(state.currentStep + 1, 6) };
    case "PREV_STEP":
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
    case "RESET":
      return initialFormState;
    default:
      return state;
  }
}

const initialActionState: CreateItemState = {
  success: false,
};

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: "First", sublabel: "Enter Info" },
    { number: 2, label: "Second", sublabel: "Select Type" },
    { number: 3, label: "Third", sublabel: "Choose Date" },
    { number: 4, label: "Fourth", sublabel: "File Upload" },
    { number: 5, label: "Fifth", sublabel: "Check Info" },
    { number: 6, label: "Sixth", sublabel: "Set Location" },
  ];

  return (
    <div className="w-full bg-slate-800 p-2 sm:p-3 rounded-md">
      <div className="flex items-center justify-around w-full space-x-1 sm:space-x-4 min-w-max">
        {steps.map((step) => (
          <div className="flex items-center" key={step.number}>
            <div className="flex flex-col items-center z-10 relative">
              <div
                className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-white text-xs sm:text-sm
                  ${
                    currentStep === step.number
                      ? "border-2 border-blue-400"
                      : currentStep > step.number
                        ? "bg-blue-400"
                        : "bg-slate-700"
                  } mb-1`}
              >
                {currentStep > step.number ? "✓" : step.number}
              </div>
              <div className="text-xs sm:text-xs text-white font-medium text-center">
                {step.label}
              </div>
              <div className="text-xs sm:text-xs text-slate-400 text-center hidden sm:block">
                {step.sublabel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorDisplay({ actionState }: { actionState: CreateItemState }) {
  if (!actionState.error && !actionState.errors) return null;

  return (
    <>
      {actionState.error && (
        <div className="bg-red-500 text-white p-3 rounded-md text-sm">
          {actionState.error}
        </div>
      )}

      {actionState.errors && (
        <div className="bg-red-500 text-white p-3 rounded-md text-sm space-y-1">
          {Object.entries(actionState.errors).map(([field, errors]) => (
            <div key={field}>
              <strong>{field}:</strong> {errors?.join(", ")}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function DialogActions({
  currentStep,
  isStepValid,
  isPending,
  onBack,
  onCancel,
  onContinue,
}: {
  currentStep: number;
  isStepValid: boolean;
  isPending: boolean;
  onBack: () => void;
  onCancel: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-row justify-between items-end space-x-2 pt-2 sm:pt-4">
      <div className="shrink-0">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isPending}
            className="w-auto"
          >
            Back
          </Button>
        )}
      </div>
      <div className="flex flex-row space-x-2">
        <Button
          className="bg-red-100 hover:bg-red-200 text-black w-auto"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          disabled={!isStepValid || isPending}
          onClick={onContinue}
          className="w-auto"
        >
          {currentStep === 6
            ? isPending
              ? "Submitting..."
              : "Submit"
            : "Continue"}
        </Button>
      </div>
    </div>
  );
}

export function AddLocationDialog({
  open,
  onOpenChange,
}: AddLocationDialogProps) {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [actionState, formAction, isPending] = useActionState(
    createItem,
    initialActionState
  );

  useEffect(() => {
    if (actionState.success && open) {
      onOpenChange(false);
      dispatch({ type: "RESET" });
    }
  }, [actionState.success, open, onOpenChange]);

  const isStepValid = (): boolean => {
    switch (formState.currentStep) {
      case 1:
        return !!formState.name && !!formState.description;
      case 2:
        return !!formState.type;
      case 3:
        return !!formState.date;
      case 4:
        return !!formState.file;
      case 5:
        return true;
      case 6:
        return !!formState.location;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    if (!formState.location || !formState.file) return;

    const data = new FormData();
    data.append("name", formState.name);
    data.append("description", formState.description);
    data.append("type", formState.type);
    data.append("date", format(formState.date, "yyyy-MM-dd"));
    data.append("isLost", String(formState.isLost));
    data.append("location", JSON.stringify(formState.location.map(String)));
    data.append("file", formState.file);

    startTransition(() => {
      formAction(data);
    });
  };

  const handleContinue = () => {
    if (formState.currentStep < 6) {
      dispatch({ type: "NEXT_STEP" });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" });
  };

  const handleCancel = () => {
    onOpenChange(false);
    dispatch({ type: "RESET" });
  };

  function updateField<K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) {
    dispatch({ type: "UPDATE_FIELD", field, value });
  }

  const renderStepContent = () => {
    const props = {
      formData: {
        name: formState.name,
        description: formState.description,
        type: formState.type,
        date: formState.date,
        file: formState.file,
        isLost: formState.isLost,
        location: formState.location,
      },
      updateField,
    };

    switch (formState.currentStep) {
      case 1:
        return <Step1BasicInfo {...props} />;
      case 2:
        return <Step2ItemType {...props} />;
      case 3:
        return <Step3DateSelection {...props} />;
      case 4:
        return <Step4FileUpload updateField={updateField} />;
      case 5:
        return <Step5Confirmation formData={props.formData} />;
      case 6:
        return <Step6LocationSelection {...props} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`bg-slate-700 sm:mx-4 overflow-y-auto ${formState.currentStep >= 5 ? "max-w-fit!" : "md:max-w-xl"}`}
      >
        <DialogHeader className="pb-2 sm:pb-4">
          <DialogTitle className="text-white text-lg sm:text-xl">
            Add New Location
          </DialogTitle>
        </DialogHeader>

        <StepIndicator currentStep={formState.currentStep} />

        <ErrorDisplay actionState={actionState} />

        <div className="py-2 sm:py-4 space-y-3 sm:space-y-4">
          <div className="w-full px-2 sm:px-4">{renderStepContent()}</div>

          <DialogActions
            currentStep={formState.currentStep}
            isStepValid={isStepValid()}
            isPending={isPending}
            onBack={handleBack}
            onCancel={handleCancel}
            onContinue={handleContinue}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
