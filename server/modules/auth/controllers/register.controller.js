const service = require("../services/register.service");

exports.register = async (req, res) => {
  try {
    const data = await service.registerUser(
      req.body,
      req.ip,
      req.headers["user-agent"]
    );

    res.status(201).json({
      success: true,
      message: "Registered successfully. Please verify your email.",
      data,
    });
  } catch (e) {
    res.status(e.status || 500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.registerBuyer = async (req, res) => {
  req.body.role = "BUYER";
  return exports.register(req, res);
};

exports.registerSeller = async (req, res) => {
  req.body.role = "SELLER";
  return exports.register(req, res);
};