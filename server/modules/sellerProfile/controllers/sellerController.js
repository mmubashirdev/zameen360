const sellerService = require("../services/sellerService");

// GET /api/seller/profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await sellerService.getSellerProfile(userId);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: profile,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/seller/profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedProfile = await sellerService.updateSellerProfile(
      userId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/seller/stats
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await sellerService.getSellerStats(userId);

    return res.status(200).json({
      success: true,
      message: "Stats fetched successfully",
      data: stats,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/seller/listings (My Listings page ke liye)
const getMyListings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page, limit } = req.query;

    const result = await sellerService.getSellerListings(userId, {
      status,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Listings fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/seller/activity
const getActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit } = req.query;
    const activities = await sellerService.getRecentActivity(userId, limit);

    return res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getStats,
  getMyListings,
  getActivity,
};