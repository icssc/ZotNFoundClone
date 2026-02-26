"use client";

/**
 * Unified ItemWizardDialog that handles both Create (Add) and Edit flows.
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActionState, startTransition, useEffect, useRef } from "react";
import { WizardStepContent } from "./Wizard/components/WizardStepContent";
import { formatDateYMD } from "@/lib/date";
import {
  createItem,
  CreateItemState,
} from "@/server/actions/item/create/action";
import { editItem, EditItemState } from "@/server/actions/item/edit/action";
import { Item } from "@/db/schema";
import {
  trackAddItemStepCompleted,
  trackAddItemStepBack,
  trackEditItemStepCompleted,
  trackEditItemStepBack,
} from "@/lib/analytics";
import { StepIndicator } from "./Wizard/components/StepIndicator";
import { ErrorDisplay } from "./Wizard/components/ErrorDisplay";
import { DialogActions } from "./Wizard/components/DialogActions";
import { useItemWizard } from "./Wizard/hooks/useItemWizard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type WizardMode = "create" | "edit";

interface ItemWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: WizardMode;
  item?: Item; // required if mode === "edit"
  onCompleted?: () => void; // optional callback after successful submit
  autoReloadOnEditSuccess?: boolean; // default true
}

type ActionState = CreateItemState | EditItemState;

const initialActionState: ActionState = { success: false, error: "" };

export function ItemWizardDialog({
  open,
  onOpenChange,
  mode,
  item,
  onCompleted,
  autoReloadOnEditSuccess = true,
}: ItemWizardDialogProps) {
  // Guard: if in edit mode without item, render nothing
  const isEditing = mode === "edit";

  const { formState, updateField, nextStep, prevStep, reset } = useItemWizard(
    mode,
    item
  );

  const [actionState, formAction, isPending] = useActionState(
    async (state: ActionState, payload: FormData) => {
      if (isEditing) {
        return editItem(state, payload);
      } else {
        return createItem(state, payload);
      }
    },
    initialActionState
  );

  const prevIsPendingRef = useRef(false);

  useEffect(() => {
    if (actionState.success && prevIsPendingRef.current && !isPending) {
      // Success transition
      toast.success(
        isEditing ? "Item updated successfully" : "Item created successfully"
      );
      onOpenChange(false);
      reset();

      if (onCompleted) {
        onCompleted();
      }

      if (isEditing && autoReloadOnEditSuccess) {
        // Refresh to reflect edits
        window.location.reload();
      }
    } else if (
      !actionState.success &&
      actionState.error &&
      prevIsPendingRef.current &&
      !isPending
    ) {
      toast.error(actionState.error);
    }
    prevIsPendingRef.current = isPending;
  }, [
    actionState,
    isPending,
    onOpenChange,
    isEditing,
    autoReloadOnEditSuccess,
    mode,
    item,
    onCompleted,
    reset,
  ]);

  const isStepValid = (): boolean => {
    switch (formState.currentStep) {
      case 1:
        return !!formState.name && !!formState.description;
      case 2:
        return !!formState.type;
      case 3:
        return !!formState.date;
      case 4:
        return isEditing ? true : !!formState.file;
      case 5:
        return !!formState.location;
      case 6:
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    if (!formState.location) return;
    if (!isEditing && !formState.file) return;

    const data = new FormData();

    if (isEditing && item) {
      data.append("id", String(item.id));
    }

    data.append("name", formState.name);
    data.append("description", formState.description);
    data.append("type", formState.type);
    data.append("date", formatDateYMD(formState.date));
    data.append("isLost", String(formState.isLost));
    data.append("location", JSON.stringify(formState.location));

    if (isEditing) {
      // In edit mode, file is optional
      if (formState.file) {
        data.append("file", formState.file);
        data.append("keepExistingImage", "false");
      } else {
        data.append("keepExistingImage", "true");
      }
    } else {
      // In create mode, file required
      if (formState.file) {
        data.append("file", formState.file);
      }
    }

    startTransition(() => {
      formAction(data);
    });
  };

  const handleContinue = () => {
    if (formState.currentStep < 6) {
      if (isEditing && item) {
        trackEditItemStepCompleted(formState.currentStep, String(item.id));
      } else {
        const stepNames = [
          "Basic Info",
          "Item Type",
          "Date Selection",
          "File Upload",
          "Location Selection",
          "Confirmation",
        ];
        trackAddItemStepCompleted(
          formState.currentStep,
          stepNames[formState.currentStep - 1]
        );
      }
      nextStep();
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (formState.currentStep > 1) {
      if (isEditing && item) {
        trackEditItemStepBack(formState.currentStep, String(item.id));
      } else {
        trackAddItemStepBack(formState.currentStep);
      }
      prevStep();
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    reset();
  };

  const title = isEditing ? "Edit Item" : "Add a New Item";
  const description = isEditing
    ? "Update your item information"
    : "Follow the steps to add a new lost or found item";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          "bg-black/80 backdrop-blur-xl border-white/10 text-white w-[95vw] sm:w-full sm:mx-4 overflow-hidden transition-all duration-300 ease-in-out shadow-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6"
        }
      >
        <DialogHeader className="pb-2 sm:pb-4">
          <DialogTitle className="text-white text-base sm:text-xl font-bold tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs sm:text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>

        <StepIndicator currentStep={formState.currentStep} mode={mode} />

        <ErrorDisplay actionState={actionState} />

        <div className="py-2 sm:py-4 space-y-3 sm:space-y-4 overflow-hidden relative">
          <div
            key={formState.currentStep}
            className={cn(
              "w-full px-2 sm:px-4 animate-in fade-in slide-in-from-right-4 duration-300 ease-out fill-mode-both"
            )}
          >
            <WizardStepContent
              currentStep={formState.currentStep}
              formData={{
                name: formState.name,
                description: formState.description,
                type: formState.type,
                date: formState.date,
                file: formState.file,
                isLost: formState.isLost,
                location: formState.location,
              }}
              updateField={updateField}
              isEditing={isEditing}
            />
          </div>

          <DialogActions
            currentStep={formState.currentStep}
            isStepValid={isStepValid()}
            isPending={isPending}
            onBack={handleBack}
            onCancel={handleCancel}
            onContinue={handleContinue}
            mode={mode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
