const {
  createPropertyReview,
  getFeaturedReviews,
  getPropertyReviews,
} = require("../services/review.service");

exports.getPropertyReviews = async (req, res) => {
  try {
    const data = await getPropertyReviews(req.params.propertyId);
    res.status(200).json({
      success: true,
      message: "Reviews loaded successfully",
      data,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to load reviews",
    });
  }
};

exports.getFeaturedReviews = async (req, res) => {
  try {
    const data = await getFeaturedReviews();
    res.status(200).json({
      success: true,
      message: "Featured reviews loaded successfully",
      data,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to load featured reviews",
    });
  }
};

exports.createPropertyReview = async (req, res) => {
  try {
    const review = await createPropertyReview(
      req.params.propertyId,
      req.user.id,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to submit review",
    });
  }
};
