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
    <div className="w-full py-2 sm:py-4 px-1 sm:px-2">
      <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
        {/* Progress Line Background */}
        <div className="absolute top-3 sm:top-4 left-0 w-full h-0.5 bg-white/10 -z-10 rounded-full" />

        {/* Active Progress Line */}
        <div
          className="absolute top-3 sm:top-4 left-0 h-0.5 bg-linear-to-r from-indigo-500 to-purple-500 -z-10 transition-all duration-500 ease-out rounded-full"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isActive = currentStep >= step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div className="flex flex-col items-center group" key={step.number}>
              <div
                className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-300 border-2
                  ${
                    isActive
                      ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-110"
                      : "bg-black text-gray-500 border-white/10 group-hover:border-white/30"
                  }
                  ${isCurrent ? "ring-2 sm:ring-4 ring-white/10 scale-125" : ""}
                `}
              >
                {currentStep > step.number ? (
                  <span className="text-indigo-600">✓</span>
                ) : (
                  step.number
                )}
              </div>

              <div
                className={`mt-1 sm:mt-2 text-[8px] sm:text-[10px] md:text-xs font-medium tracking-wide uppercase transition-colors duration-300 ${
                  isActive ? "text-white" : "text-gray-600"
                }`}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
