// src/features/marketplace/components/property-details/floorplans/FloorPlans.tsx
import house1 from "../../../assets/00.webp";

const FloorPlans = () => {
  const plans = [
    { title: "Ground Floor Plan", image: house1 },
    { title: "First Floor Plan", image: house1 },
  ];

  return (
    <div className="border-t pt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">FLOOR PLANS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <div key={plan.title} className="border rounded-lg overflow-hidden">
            <img
              src={plan.image}
              alt={plan.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-3 text-center text-sm text-gray-700 font-medium">
              {plan.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloorPlans;
