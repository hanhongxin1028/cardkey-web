import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={index} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                    ${isCompleted ? "step-completed" : isActive ? "step-active" : "step-inactive"}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  isActive ? "text-primary" : isCompleted ? "text-success" : "text-muted-foreground"
                }`}>
                  {step}
                </span>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`
                  w-16 h-0.5 mx-4 transition-colors duration-300
                  ${stepNumber < currentStep ? "bg-success" : "bg-border"}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}