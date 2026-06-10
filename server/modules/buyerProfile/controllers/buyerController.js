const buyerService = require("../services/buyerService");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await buyerService.getBuyerProfile(userId);
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

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedProfile = await buyerService.updateBuyerProfile(userId, req.body);
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

const switchToSeller = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await buyerService.convertToSeller(userId, req.body);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit } = req.query;
    const activities = await buyerService.getRecentActivity(userId, limit);
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
  switchToSeller,
  getActivity,
};