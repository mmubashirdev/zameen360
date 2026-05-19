// src/features/marketplace/components/property-details/agent/AgentCard.tsx
import { Phone, Mail, BadgeCheck, Star } from "lucide-react";

const AgentCard = () => {
  return (
    <div className="border border-gray-200 shadow-lg rounded-xl p-5 bg-white">
      <h3 className="text-sm font-semibold text-gray-500 mb-4">
        LISTING AGENT
      </h3>

      <div className="flex items-center gap-3 mb-3">
        <img
          src="https://i.pravatar.cc/100?img=12"
          alt="agent"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <div className="flex items-center gap-1">
            <h3 className="font-semibold text-gray-900">Usman Khalid</h3>
            <BadgeCheck
              size={16}
              className="fill-blue-600 text-white"
            />
          </div>
          <p className="text-gray-500 text-xs">Senior Property Consultant</p>
          <p className="text-blue-600 text-xs">Zameen 360</p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-4">
        <Star size={14} className="fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">4.9</span>
        <span className="text-xs text-gray-500">(128 Reviews)</span>
      </div>

      <div className="space-y-2">
        <button className="mb-3 h-12 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition">
          <Phone size={16} />
          Call Now
        </button>
        <button className="mb-3 h-12 w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition">
          <Phone size={16} />
          WhatsApp
        </button>
        <button className="mb-3 h-12 w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition">
          <Mail size={16} />
          Email Agent
        </button>
      </div>
    </div>
  );
};

export default AgentCard;
