const PropertyDetailSkeleton = () => (
  <div className="bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - main content */}
        <div className="lg:col-span-2 space-y-6 bg-white rounded-xl p-6 animate-pulse">
          {/* Gallery */}
          <div className="w-full h-80 bg-gray-200 rounded-xl" />

          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg" />
            ))}
          </div>

          {/* Title */}
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>

          {/* Sections */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 pt-4 border-t border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>

        {/* Right - sidebar */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 space-y-3 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-10 bg-gray-200 rounded-lg w-full mt-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default PropertyDetailSkeleton;
