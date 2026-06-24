const prisma = require("../../../configs/prisma");

const REVIEW_SELECT = {
  id: true,
  rating: true,
  message: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      fullName: true,
      city: true,
      profilePicture: true,
    },
  },
};

const normalizePropertyId = (propertyId) => {
  const id = Number(propertyId);
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("Invalid property id");
    error.status = 400;
    throw error;
  }
  return id;
};

const normalizeRating = (rating) => {
  const value = Number(rating);
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    const error = new Error("Rating must be between 1 and 5");
    error.status = 400;
    throw error;
  }
  return value;
};

const normalizeMessage = (message) => {
  const value = typeof message === "string" ? message.trim() : "";
  if (!value) {
    const error = new Error("Review message is required");
    error.status = 400;
    throw error;
  }
  if (value.length > 1000) {
    const error = new Error("Review message must be 1000 characters or less");
    error.status = 400;
    throw error;
  }
  return value;
};

const getPropertyReviews = async (propertyId) => {
  const id = normalizePropertyId(propertyId);

  const [reviews, summary] = await Promise.all([
    prisma.review.findMany({
      where: { propertyId: id },
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
      select: REVIEW_SELECT,
    }),
    prisma.review.aggregate({
      where: { propertyId: id },
      _avg: { rating: true },
      _count: { id: true },
    }),
  ]);

  return {
    reviews,
    totalReviews: summary._count.id,
    averageRating: Number(summary._avg.rating || 0),
  };
};

const getFeaturedReviews = async () => {
  const reviews = await prisma.review.findMany({
    where: { rating: { gte: 4 } },
    orderBy: [{ createdAt: "desc" }, { rating: "desc" }],
    take: 3,
    select: {
      ...REVIEW_SELECT,
      property: {
        select: {
          id: true,
          title: true,
          city: true,
          locality: true,
        },
      },
    },
  });

  return { reviews };
};

const createPropertyReview = async (propertyId, userId, payload) => {
  const id = normalizePropertyId(propertyId);
  const rating = normalizeRating(payload.rating);
  const message = normalizeMessage(payload.message);

  const property = await prisma.property.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!property) {
    const error = new Error("Property not found");
    error.status = 404;
    throw error;
  }

  try {
    const review = await prisma.review.create({
      data: {
        propertyId: id,
        userId,
        rating,
        message,
      },
      select: REVIEW_SELECT,
    });

    return review;
  } catch (error) {
    if (error.code === "P2002") {
      error.status = 409;
      error.message = "You have already reviewed this property";
    }
    throw error;
  }
};

module.exports = {
  createPropertyReview,
  getFeaturedReviews,
  getPropertyReviews,
};
