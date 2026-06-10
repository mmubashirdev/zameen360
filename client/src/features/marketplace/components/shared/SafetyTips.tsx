// components/property-details/shared/SafetyTips.tsx
import { Shield } from "lucide-react";

const SafetyTips = () => {
  const tips = [
    "Meet in a public place first",
    "Don't pay advance without verification",
    "Verify property documents",
    "Inspect the property in person",
  ];
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <Shield className="w-4 h-4 text-yellow-600" />
        Safety Tips
      </h3>
      <ul className="space-y-1.5 text-sm text-gray-700">
        {tips.map((tip, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-yellow-600">•</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SafetyTips;