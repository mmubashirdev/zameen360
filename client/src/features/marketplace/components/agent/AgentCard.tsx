import { Phone, Mail, MessageCircle, User } from "lucide-react";
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

const AgentCard = ({ user }: Props) => {
  if (!user) {
    return (
      <div className="bg-white rounded-xl p-4 border">
        <p className="text-gray-500 text-sm text-center">Agent info not available</p>
      </div>
    );
  }

  return (
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
          <a href={`tel:${user.phone}`} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            <Phone className="w-4 h-4" />
            Call Now
          </a>
        )}
        {user.phone && (
          <a href={`https://wa.me/${user.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        )}
        {user.email && (
          <a href={`mailto:${user.email}`} className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition">
            <Mail className="w-4 h-4" />
            Email
          </a>
        )}
      </div>
    </div>
  );
};

export default AgentCard;