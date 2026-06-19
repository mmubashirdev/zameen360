// components/property-details/shared/ActionCards.tsx
import { Heart, Share2, Flag } from "lucide-react";
import { useState } from "react";

interface Props {
  propertyId: number;
  title: string | null;
}

const ActionCards = ({ title }: Props) => {
  const [saved, setSaved] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: title || "Property", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-300 shadow-sm space-y-2">
      <button onClick={() => setSaved(!saved)}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition ${
          saved ? "bg-red-50 text-red-600" : "border border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}>
        <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
        {saved ? "Saved" : "Save"}
      </button>
      <button onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
        <Share2 className="w-4 h-4" />
        Share
      </button>
      <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
        <Flag className="w-4 h-4" />
        Report
      </button>
    </div>
  );
};

export default ActionCards;