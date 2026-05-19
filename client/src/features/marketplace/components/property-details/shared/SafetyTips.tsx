// src/features/marketplace/components/property-details/shared/SafetyTips.tsx
import { ShieldCheck } from "lucide-react";

const SafetyTips = () => {
  const tips = [
    "Deal only with verified agents.",
    "Never send money in advance.",
    "Visit the property in person.",
    "Check property documents.",
  ];

  return (
    <div className="border rounded-xl p-5 bg-white">
      <h3 className="text-sm font-semibold text-gray-500 mb-4">SAFETY TIPS</h3>
      <ul className="space-y-3">
        {tips.map((tip) => (
          <li
            key={tip}
            className="flex items-start gap-2 text-sm text-gray-700"
          >
            <ShieldCheck
              size={16}
              className="text-blue-600 shrink-0 mt-0.5"
            />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
      <a
        href="#"
        className="text-blue-600 text-xs hover:underline mt-3 inline-block"
      >
        Learn more about property safety
      </a>
    </div>
  );
};

export default SafetyTips;
