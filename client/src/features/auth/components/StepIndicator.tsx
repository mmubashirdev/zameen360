// client/src/features/auth/components/StepIndicator.tsx
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
}

const STEPS = [
  { id: 1, label: "Email" },
  { id: 2, label: "Verify" },
  { id: 3, label: "New Password" },
  { id: 4, label: "Success" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="mb-8">
      <div className="relative flex items-start justify-between">
        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        {/* Filled line */}
        <div
          className="absolute top-4 left-0 h-0.5 bg-gradient-to-right from-blue-600 to-blue-500 transition-all duration-500 ease-out z-0"
          style={{ width: `${progressPercent}%` }}
        />

        {STEPS.map((step) => {
          const done = step.id < currentStep;
          const active = step.id === currentStep;

          return (
            <div
              key={step.id}
              className="relative z-20 flex flex-col items-center gap-2"
            >
              <div
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300",
                  done
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                    : active
                      ? "bg-white border-blue-600 text-blue-600 ring-4 ring-blue-100"
                      : "bg-white border-gray-200 text-gray-400",
                ].join(" ")}
              >
                {done ? <Check size={14} strokeWidth={3} /> : step.id}
              </div>
              <span
                className={[
                  "text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors",
                  active
                    ? "text-blue-700 font-semibold"
                    : done
                      ? "text-gray-700"
                      : "text-gray-400",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
