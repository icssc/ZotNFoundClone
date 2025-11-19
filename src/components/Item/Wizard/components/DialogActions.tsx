import { Button } from "@/components/ui/button";
import { WizardMode } from "@/components/Item/ItemWizardDialog";

interface DialogActionsProps {
  currentStep: number;
  isStepValid: boolean;
  isPending: boolean;
  onBack: () => void;
  onCancel: () => void;
  onContinue: () => void;
  mode: WizardMode;
}

export function DialogActions({
  currentStep,
  isStepValid,
  isPending,
  onBack,
  onCancel,
  onContinue,
  mode,
}: DialogActionsProps) {
  return (
    <div className="flex flex-row justify-between items-end space-x-2 pt-2 sm:pt-4">
      <div className="shrink-0">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isPending}
            className="w-auto bg-black hover:bg-white/10 border-white/30 text-white hover:text-white transition-all duration-200"
          >
            Back
          </Button>
        )}
      </div>
      <div className="flex flex-row space-x-2">
        <Button
          className="bg-red-500/90 hover:bg-red-700 border border-red-400 text-white w-auto transition-all duration-200"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          disabled={!isStepValid || isPending}
          onClick={onContinue}
          className="w-auto bg-white hover:bg-white/70 text-black transition-all duration-200"
        >
          {currentStep === 6
            ? isPending
              ? mode === "create"
                ? "Submitting..."
                : "Saving..."
              : mode === "create"
                ? "Submit"
                : "Save Changes"
            : "Continue"}
        </Button>
      </div>
    </div>
  );
}
