import { useState } from "react";
import { Phone, MessageSquare, MessageCircle, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PropertyUser {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  profilePicture: string | null;
  city: string | null;
  createdAt?: string;
  sellerDetail?: {
    totalListings: number;
    activeListings: number;
    sellerRating: string | null;
    isPremium: boolean;
  };
}

interface Props {
  user?: PropertyUser;
  propertyId: number;
}

const AgentCard = ({ user, propertyId }: Props) => {
  const [showCallModal, setShowCallModal] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="bg-white rounded-xl p-4 border">
        <p className="text-gray-500 text-sm text-center">Agent info not available</p>
      </div>
    );
  }

  const handleMessageClick = () => {
    // Navigate to messages page, passing seller and property info in state if needed by the future implementation
    navigate("/messages", { 
      state: { 
        sellerId: user.id, 
        propertyId,
        sellerName: user.fullName,
        sellerAvatar: user.profilePicture
      } 
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl p-4 border shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">Contact Agent</h3>

        <div className="flex items-center gap-3 mb-4">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt={user.fullName} className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-7 h-7 text-blue-600" />
            </div>
          )}
          <div>
            <div className="font-semibold text-gray-900">{user.fullName}</div>
            {user.city && <div className="text-xs text-gray-500">{user.city}</div>}
            {user.sellerDetail?.isPremium && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                Premium
              </span>
            )}
          </div>
        </div>

        {user.sellerDetail && (
          <div className="grid grid-cols-2 gap-2 mb-4 text-center">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-lg font-bold text-blue-600">{user.sellerDetail.totalListings}</div>
              <div className="text-xs text-gray-500">Listings</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-lg font-bold text-blue-600">
                {user.sellerDetail.sellerRating || "N/A"}
              </div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {user.phone && (
            <button 
              onClick={() => setShowCallModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </button>
          )}
          {user.phone && (
            <a href={`https://wa.me/${user.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          )}
          <button 
            onClick={handleMessageClick}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <MessageSquare className="w-4 h-4" />
            Message
          </button>
        </div>
      </div>

      {/* Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowCallModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Call Agent</h3>
              <p className="text-gray-500 text-sm mb-6">{user.fullName}</p>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                <p className="text-2xl font-semibold tracking-wide text-gray-800">
                  {user.phone}
                </p>
              </div>
              
              <a 
                href={`tel:${user.phone}`}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
              >
                <Phone className="w-5 h-5" />
                Make Call
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentCard;