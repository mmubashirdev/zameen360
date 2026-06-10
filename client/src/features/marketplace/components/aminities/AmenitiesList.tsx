import { CheckCircle } from "lucide-react";

interface Props {
  amenities: string[];
}

const AmenitiesList = ({ amenities }: Props) => {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {amenities.map((item, i) => (
          <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesList;