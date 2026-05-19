// src/features/marketplace/components/property-details/reviews/ReviewsSection.tsx
import { Star, CheckCircle2 } from "lucide-react";
import { propertyData } from "../../../data/propertyDetailsData";

const ReviewsSection = () => {
  const maxCount = Math.max(
    ...propertyData.ratingBreakdown.map((r) => r.count),
  );

  return (
    <div className="border border-gray-200 mt-5 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">
        REVIEWS ({propertyData.totalReviews})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average rating */}
        <div className="text-center md:text-left">
          <div className="text-5xl font-bold text-gray-900">
            {propertyData.averageRating}
          </div>
          <div className="flex gap-1 my-2 justify-center md:justify-start">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={16}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Based on {propertyData.totalReviews} reviews
          </p>
        </div>

        {/* Rating breakdown */}
        <div className="space-y-2">
          {propertyData.ratingBreakdown.map((row) => (
            <div key={row.stars} className="flex items-center gap-2 text-sm">
              <span className="text-gray-700 w-4">{row.stars}</span>
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: `${(row.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-gray-600 w-8 text-right">{row.count}</span>
            </div>
          ))}
        </div>

        {/* Latest review */}
        <div className="md:col-span-1">
          {propertyData.reviews.map((review) => (
            <div key={review.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-gray-900">
                      {review.name}
                    </span>
                    {review.verified && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 size={12} />
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
          <a
            href="#"
            className="text-blue-600 text-xs hover:underline mt-2 inline-block"
          >
            Read All Reviews
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
