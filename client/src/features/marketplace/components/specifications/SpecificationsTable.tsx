// components/property-details/specifications/SpecificationsTable.tsx
interface Props {
  areaSize: string | null;
  areaUnit: string | null;
  bedrooms: string | null;
  bathrooms: string | null;
  floors: string | null;
  parking: string | null;
  yearBuilt: string | null;
  furnishing: string | null;
  possession: string | null;
  facing: string | null;
  purpose: string | null;
  propertyType: string | null;
}

// ⭐ Spec type define karo
interface Spec {
  label: string;
  value: string | null;
}

const SpecificationsTable = (props: Props) => {
  // ⭐ Explicit type lagao
  const specs: Spec[] = [
    { label: "Property Type", value: props.propertyType },
    { label: "Purpose", value: props.purpose },
    {
      label: "Area",
      value: props.areaSize
        ? `${props.areaSize} ${props.areaUnit || ""}`
        : null,
    },
    { label: "Bedrooms", value: props.bedrooms },
    { label: "Bathrooms", value: props.bathrooms },
    { label: "Floors", value: props.floors },
    { label: "Parking", value: props.parking },
    { label: "Year Built", value: props.yearBuilt },
    { label: "Furnishing", value: props.furnishing },
    { label: "Possession", value: props.possession },
    { label: "Facing", value: props.facing },
  ].filter((s): s is Spec => s.value !== null && s.value !== "");

  if (specs.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Specifications</h2>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {specs.map((spec, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="px-4 py-3 font-medium text-gray-600 w-1/2">
                  {spec.label}
                </td>
                <td className="px-4 py-3 text-gray-900">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecificationsTable;