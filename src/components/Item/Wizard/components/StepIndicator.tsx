import { WizardMode } from "@/components/Item/ItemWizardDialog";

interface StepIndicatorProps {
  currentStep: number;
  mode: WizardMode;
}

export function StepIndicator({ currentStep, mode }: StepIndicatorProps) {
  const steps =
    mode === "create"
      ? [
          { number: 1, label: "First", sublabel: "Enter Info" },
          { number: 2, label: "Second", sublabel: "Select Type" },
          { number: 3, label: "Third", sublabel: "Choose Date" },
          { number: 4, label: "Fourth", sublabel: "File Upload" },
          { number: 5, label: "Fifth", sublabel: "Check Info" },
          { number: 6, label: "Sixth", sublabel: "Set Location" },
        ]
      : [
          { number: 1, label: "First", sublabel: "Edit Info" },
          { number: 2, label: "Second", sublabel: "Item Type" },
          { number: 3, label: "Third", sublabel: "Date" },
          { number: 4, label: "Fourth", sublabel: "Image" },
          { number: 5, label: "Fifth", sublabel: "Review" },
          { number: 6, label: "Sixth", sublabel: "Location" },
        ];

  return (
    <div className="w-full bg-black/95 border border-white/20 p-2 sm:p-3 rounded-md">
      <div className="flex items-center justify-around w-full space-x-1 sm:space-x-4 min-w-max">
        {steps.map((step) => (
          <div className="flex items-center" key={step.number}>
            <div className="flex flex-col items-center z-10 relative">
              <div
                className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-black text-xs sm:text-sm
                  ${
                    currentStep === step.number
                      ? "border-2 border-white text-white"
                      : currentStep > step.number
                        ? "bg-white text-black"
                        : "bg-white/10 text-white"
                  } mb-1`}
              >
                {currentStep > step.number ? "✓" : step.number}
              </div>
              <div className="text-xs sm:text-xs text-white font-medium text-center">
                {step.label}
              </div>
              <div className="text-xs sm:text-xs text-gray-400 text-center hidden sm:block">
                {step.sublabel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
