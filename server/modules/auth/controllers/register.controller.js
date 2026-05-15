const service = require("../services/register.service");

exports.register = async (req, res) => {
  try {
    const data = await service.registerUser(
      req.body,
      req.ip || "unknown",
      req.headers["user-agent"] || "unknown"
    );

    res.status(201).json({
      success: true,
      message: "Registered successfully. Please verify your email.",
      data,
    });
  } catch (e) {
    // Handle Prisma unique constraint error
    if (e.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Use  Different Email.",
      });
    }

    res.status(e.status || 500).json({
      success: false,
      message: e.message || "Internal server error",
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