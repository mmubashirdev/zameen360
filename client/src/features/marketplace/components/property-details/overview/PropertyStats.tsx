type PropertyStatProps = {
  label: string;
  value: number;
};

const PropertyStats = ({ label, value }: PropertyStatProps) => {
  return (
    <div className="border rounded-xl p-4 text-center">
      <h3 className="text-2xl font-bold">{value}</h3>

      <p className="text-gray-500">{label}</p>
    </div>
  );
};

export default PropertyStats;
