import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize,
  ExternalLink,
  ChevronRight,
  Ban,
} from "lucide-react";

interface PropertyDetailsSidebarProps {
  conversationId: number | null;
}

const PropertyDetailsSidebar: React.FC<PropertyDetailsSidebarProps> = ({ conversationId }) => {
  return (
    <div className="space-y-5">
      {/* Property Details Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">Property Details</h3>

        {/* Image */}
        <div className="relative mb-4">
          <img
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=240&fit=crop"
            alt="Property"
            className="w-full h-44 object-cover rounded-xl"
          />
          <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <span className="absolute bottom-3 left-3 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-md">
            For Sale
          </span>
        </div>

        {/* Property Info */}
        <h4 className="font-bold text-sm text-gray-900 mb-2">
          Beautiful 5 Marla House in DHA Phase 6
        </h4>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin className="w-3 h-3" />
          <span>DHA Phase 6, Lahore, Punjab</span>
        </div>
        <p className="text-blue-500 font-bold text-lg mb-4">PKR 2,50,00,000</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Bed className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-sm text-gray-900">5</span>
            </div>
            <p className="text-xs text-gray-500">Beds</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Bath className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-sm text-gray-900">6</span>
            </div>
            <p className="text-xs text-gray-500">Baths</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Maximize className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-sm text-gray-900">5 Marla</span>
            </div>
            <p className="text-xs text-gray-500">Area</p>
          </div>
        </div>

        <button className="w-full text-blue-500 font-semibold text-sm py-2 flex items-center justify-center gap-1.5 hover:bg-blue-50 rounded-lg">
          View Full Listing
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Buyer Information */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">Buyer Information</h3>

        <div className="flex items-center gap-3 mb-4">
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="Ahmed Khan"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-gray-900">
                Ahmed Khan
              </h4>
              <span className="text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md font-medium">
                ✓ Verified
              </span>
            </div>
            <p className="text-xs text-gray-500">Member since May 2025</p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>Lahore, Punjab</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-4 border-b border-gray-100 mb-3">
          <div className="text-center">
            <p className="text-blue-500 font-bold text-xl">12</p>
            <p className="text-xs text-gray-500">Inquiries</p>
          </div>
          <div className="text-center">
            <p className="text-blue-500 font-bold text-xl">3</p>
            <p className="text-xs text-gray-500">Properties Viewed</p>
          </div>
        </div>

        <button className="w-full flex items-center justify-between text-sm text-gray-700 hover:bg-gray-50 px-2 py-2 rounded-lg">
          <span className="font-medium">View Buyer Profile</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Conversation Details */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h3 className="font-bold text-gray-900 mb-4">Conversation Details</h3>

        <div className="space-y-3 text-sm mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">First Message</span>
            <span className="text-gray-900 font-medium">Today, 10:30 AM</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Listing Inquired</span>
            <span className="text-gray-900 font-medium text-right">
              5 Marla House in DHA Phase 6
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status</span>
            <span className="text-green-600 bg-green-50 text-xs font-medium px-2 py-1 rounded-md">
              Active
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Notifications</span>
            <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-blue-500">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-4" />
            </button>
          </div>
        </div>

        <button className="w-full border border-red-200 text-red-500 hover:bg-red-50 font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2">
          <Ban className="w-4 h-4" />
          Block User
        </button>
      </div>
    </div>
  );
};

export default PropertyDetailsSidebar;