import { MapPin } from "lucide-react";

interface Props {
  address: string | null;
  city: string | null;
  locality: string | null;
}

const LocationMap = ({ address, city, locality }: Props) => {
  const fullAddress = [address, locality, city].filter(Boolean).join(", ");
  if (!fullAddress) return null;

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Location</h2>
      <div className="flex items-start gap-2 mb-3 p-3 bg-blue-50 rounded-lg">
        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
        <p className="text-sm text-gray-700">{fullAddress}</p>
      </div>
      <div className="rounded-xl overflow-hidden border h-80">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          title="Property Location"
        />
      </div>
    </div>
  );
};

export default LocationMap;