import API from "../../../api/axios";
import type {
  ApiResponse,
  FeaturedReview,
  PropertyReview,
  PropertyReviewsData,
} from "../types";

export const getPropertyReviews = async (propertyId: number) => {
  const response = await API.get<ApiResponse<PropertyReviewsData>>(
    `/reviews/property/${propertyId}`,
  );
  return response.data.data;
};

export const createPropertyReview = async (
  propertyId: number,
  payload: { rating: number; message: string },
) => {
  const response = await API.post<ApiResponse<PropertyReview>>(
    `/reviews/property/${propertyId}`,
    payload,
  );
  return response.data;
};

export const getFeaturedReviews = async () => {
  const response = await API.get<ApiResponse<{ reviews: FeaturedReview[] }>>(
    "/reviews/featured",
  );
  return response.data.data.reviews;
};
