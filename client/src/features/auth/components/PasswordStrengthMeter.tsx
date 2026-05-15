import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password?: string;
}

interface Criterion {
  label: string;
  test: (p: string) => boolean;
}

const CRITERIA: Criterion[] = [
  { label: "At least 8 characters long", test: (p) => p.length >= 8 },
  {
    label: "Contains uppercase and lowercase letters",
    test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  },
  { label: "Contains at least one number", test: (p) => /\d/.test(p) },
  {
    label: "Contains at least one special character",
    test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

const LABELS: string[] = ["", "Weak", "Fair", "Good", "Strong"];
const SEG_COLORS: string[] = [
  "bg-gray-200",
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
];
const TEXT_COLORS: string[] = [
  "text-gray-400",
  "text-red-600",
  "text-orange-600",
  "text-yellow-600",
  "text-green-600",
];

export default function PasswordStrengthMeter({
  password = "",
}: PasswordStrengthMeterProps) {
  const metCount = CRITERIA.filter((c) => c.test(password)).length;
  const score = password ? Math.max(1, metCount) : 0;

  return (
    <div className="mt-3">
      {/* Bar */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-gray-600 whitespace-nowrap">
          Password Strength:
        </span>
        <div className="flex flex-1 gap-1.5">
          {[1, 2, 3, 4].map((seg) => (
            <div
              key={seg}
              className={[
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                seg <= score ? SEG_COLORS[score] : "bg-gray-200",
              ].join(" ")}
            />
          ))}
        </div>
        {score > 0 && (
          <span className={`text-xs font-semibold ${TEXT_COLORS[score]}`}>
            {LABELS[score]}
          </span>
        )}
      </div>

      {/* Checklist */}
      <ul className="space-y-1.5">
        {CRITERIA.map((c, i) => {
          const ok = c.test(password);
          return (
            <li key={i} className="flex items-center gap-2 text-xs">
              <span
                className={[
                  "w-4 h-4 rounded-full flex items-center justify-center 'flex-shrink-0",
                  ok ? "text-green-600" : "text-gray-300",
                ].join(" ")}
              >
                {ok ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  <X size={14} strokeWidth={2.5} />
                )}
              </span>
              <span className={ok ? "text-gray-700" : "text-gray-400"}>
                {c.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
