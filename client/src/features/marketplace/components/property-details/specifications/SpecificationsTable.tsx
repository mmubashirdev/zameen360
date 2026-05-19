// src/features/marketplace/components/property-details/specifications/SpecificationsTable.tsx
import { propertyData } from "../../../data/propertyDetailsData";

const SpecificationsTable = () => {
  const half = Math.ceil(propertyData.specifications.length / 2);
  const left = propertyData.specifications.slice(0, half);
  const right = propertyData.specifications.slice(half);

  return (
    <div className="border-t border-t-gray-200 pt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">
        SPECIFICATIONS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 border border-gray-200 shadow-lg rounded-lg overflow-hidden">
        <div>
          {left.map((spec, idx) => (
            <div
              key={spec.label}
              className={`flex justify-between px-4 py-2 text-sm ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <span className="text-gray-600">{spec.label}</span>
              <span className="text-gray-900 font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
        <div>
          {right.map((spec, idx) => (
            <div
              key={spec.label}
              className={`flex justify-between px-4 py-2 text-sm ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <span className="text-gray-600">{spec.label}</span>
              <span className="text-gray-900 font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecificationsTable;
