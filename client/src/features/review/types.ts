export interface ReviewUser {
  id: number;
  fullName: string;
  city?: string | null;
  profilePicture?: string | null;
}

export interface PropertyReview {
  id: number;
  rating: number;
  message: string;
  createdAt: string;
  user: ReviewUser;
}

export interface FeaturedReview extends PropertyReview {
  property?: {
    id: number;
    title?: string | null;
    city?: string | null;
    locality?: string | null;
  };
}

export interface PropertyReviewsData {
  reviews: PropertyReview[];
  totalReviews: number;
  averageRating: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
