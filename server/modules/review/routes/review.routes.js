const router = require("express").Router();
const authenticate = require("../../auth/middlewares/auth.middleware");
const reviewController = require("../controllers/review.controller");

router.get("/featured", reviewController.getFeaturedReviews);
router.get("/property/:propertyId", reviewController.getPropertyReviews);
router.post(
  "/property/:propertyId",
  authenticate,
  reviewController.createPropertyReview,
);

module.exports = router;
