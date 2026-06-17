interface SkeletonCardProps {
  count?: number;
  layout?: "grid" | "list";
}

const SkeletonCard = ({ count = 6, layout = "grid" }: SkeletonCardProps) => (
  <div
    className={
      layout === "grid"
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        : "flex flex-col gap-3"
    }
  >
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm animate-pulse"
      >
        {/* Image area */}
        <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300" />

        {/* Content area */}
        <div className="p-4 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/3 mt-2" />

          <div className="flex gap-2 pt-2">
            <div className="h-3 bg-gray-200 rounded w-16" />
            <div className="h-3 bg-gray-200 rounded w-16" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonCard;
