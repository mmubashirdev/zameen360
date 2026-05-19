// src/features/marketplace/components/property-details/shared/ActionsCard.tsx
import { Heart, Share2, Printer } from "lucide-react";

const ActionsCard = () => {
  const actions = [
    { icon: <Heart size={18} />, label: "Save Property" },
    { icon: <Share2 size={18} />, label: "Share Property" },
    { icon: <Printer size={18} />, label: "Print Property Details" },
  ];

  return (
    <div className="border border-gray-200 shadow-lg mt-4 rounded-xl p-5 bg-white">
      <h3 className="text-sm font-semibold text-gray-500 mb-4">ACTIONS</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.label}
            className="w-full flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition"
          >
            <span className="text-blue-600">{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionsCard;
