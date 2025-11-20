import { Button } from "@/components/ui/button";
import { WizardMode } from "@/components/Item/ItemWizardDialog";
import { ChevronLeft, ChevronRight, Save, Send } from "lucide-react";

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
    <div className="flex flex-row justify-between items-center pt-4 sm:pt-6 mt-2 border-t border-white/5">
      <div className="shrink-0">
        {currentStep > 1 ? (
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={isPending}
            className="text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 gap-1 pl-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isPending}
            className="text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            Cancel
          </Button>
        )}
      </div>

      <div className="flex flex-row space-x-3">
        {currentStep > 1 && (
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isPending}
            className="hidden sm:flex text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
          >
            Cancel
          </Button>
        )}
        
        <Button
          disabled={!isStepValid || isPending}
          onClick={onContinue}
          className={`
            w-auto gap-2 transition-all duration-300
            ${!isStepValid 
              ? "bg-white/10 text-gray-500" 
              : "bg-black/40 text-white hover:scale-[102%] hover:bg-white/10"
            }
          `}
        >
          {currentStep === 6 ? (
            isPending ? (
              <>
                <span className="animate-spin">⏳</span>
                {mode === "create" ? "Submitting..." : "Saving..."}
              </>
            ) : (
              <>
                {mode === "create" ? <Send className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {mode === "create" ? "Submit Item" : "Save Changes"}
              </>
            )
          ) : (
            <>
              Continue
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
