import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useAuthContext } from "@features/auth/context/useAuthContext";
import {
  createPropertyReview,
  getPropertyReviews,
} from "../api/reviewApi";
import type { PropertyReview } from "../types";

interface Props {
  propertyId: number;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

const StarRating = ({
  rating,
  onChange,
  readOnly = false,
}: {
  rating: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((value) => {
      const filled = value <= rating;
      const className = filled
        ? "fill-orange-400 text-orange-400"
        : "text-gray-300";

      return readOnly ? (
        <Star key={value} className={`h-4 w-4 ${className}`} />
      ) : (
        <button
          key={value}
          type="button"
          onClick={() => onChange?.(value)}
          className="rounded p-0.5 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-300"
          aria-label={`${value} star rating`}
        >
          <Star className={`h-6 w-6 ${className}`} />
        </button>
      );
    })}
  </div>
);

const ReviewsSection = ({ propertyId }: Props) => {
  const { isAuthenticated, user } = useAuthContext();
  const [reviews, setReviews] = useState<PropertyReview[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPropertyReviews(propertyId);
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
    } catch {
      setError("Unable to load reviews right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [propertyId]);

  const visibleReviews = useMemo(
    () => (showAll ? reviews : reviews.slice(0, 3)),
    [reviews, showAll],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAuthenticated) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await createPropertyReview(propertyId, {
        rating,
        message,
      });
      setReviews((prev) => {
        const nextReviews = [response.data, ...prev].sort(
          (a, b) =>
            b.rating - a.rating ||
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        const totalRating = nextReviews.reduce(
          (sum, review) => sum + review.rating,
          0,
        );
        setAverageRating(totalRating / nextReviews.length);
        return nextReviews;
      });
      setMessage("");
      setRating(5);
      setSuccess(response.message);
    } catch (err) {
      const apiError = err as {
        response?: { data?: { message?: string } };
      };
      setError(apiError.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
          <p className="text-sm text-gray-500">
            {reviews.length > 0
              ? `${averageRating.toFixed(1)} average from ${reviews.length} review${reviews.length === 1 ? "" : "s"}`
              : "Be the first to review this property"}
          </p>
        </div>
        {reviews.length > 0 && (
          <StarRating rating={Math.round(averageRating)} readOnly />
        )}
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6 rounded-lg bg-gray-50 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Add your review
              </p>
              <p className="text-xs text-gray-500">
                Posting as {user?.fullName || "logged in user"}
              </p>
            </div>
            <StarRating rating={rating} onChange={setRating} />
          </div>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-28 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            maxLength={1000}
            placeholder="Write your message about this property..."
            required
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-gray-400">
              {message.length}/1000 characters
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 rounded-lg border border-orange-100 bg-orange-50 p-4 text-sm text-orange-900">
          Please{" "}
          <Link to="/login" className="font-semibold underline">
            log in
          </Link>{" "}
          to give a review for this property.
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {success && <p className="mb-4 text-sm text-green-600">{success}</p>}

      {loading ? (
        <div className="rounded-xl bg-gray-50 py-8 text-center text-sm text-gray-500">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-xl bg-gray-50 py-8 text-center">
          <Star className="mx-auto mb-2 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-lg border border-gray-100 p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {review.user.profilePicture ? (
                    <img
                      src={review.user.profilePicture}
                      alt={review.user.fullName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">
                      {getInitials(review.user.fullName)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {review.user.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} readOnly />
              </div>
              <p className="text-sm leading-6 text-gray-600">
                {review.message}
              </p>
            </article>
          ))}

          {reviews.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="w-full rounded-lg border border-gray-200 py-2 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-600"
            >
              {showAll ? "Show Top Reviews" : "Show All Reviews"}
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
