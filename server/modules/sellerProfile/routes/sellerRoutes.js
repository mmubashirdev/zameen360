const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const authMiddleware = require("../../auth/middlewares/auth.middleware");

router.get("/profile", authMiddleware, sellerController.getProfile);
router.put("/profile", authMiddleware, sellerController.updateProfile);
router.get("/stats", authMiddleware, sellerController.getStats);
router.get("/listings", authMiddleware, sellerController.getMyListings);
router.get("/activity", authMiddleware, sellerController.getActivity);

module.exports = router;