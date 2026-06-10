// components/property-details/reviews/ReviewsSection.tsx
import { Star } from "lucide-react";

interface Props {
  propertyId: number;
}

const ReviewsSection = ({ propertyId }: Props) => {

  
  console.log("Loading reviews for property:", propertyId); // ⭐ Use it

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Reviews</h2>
      <div className="text-center py-8 bg-gray-50 rounded-xl">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500">No reviews yet</p>
        <p className="text-xs text-gray-400">
          Be the first to review this property
        </p>
      </div>
    </div>
  );
};

export default ReviewsSection;