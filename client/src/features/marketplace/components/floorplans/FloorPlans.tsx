interface Props {
  floorPlan: string | null;
  title: string | null;
}

const FloorPlans = ({ floorPlan, title }: Props) => {
  if (!floorPlan) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Floor Plan</h2>
      <div className="border rounded-xl overflow-hidden bg-gray-50">
        <img src={floorPlan} alt={`${title} floor plan`} className="w-full h-auto" />
      </div>
    </div>
  );
};

export default FloorPlans;