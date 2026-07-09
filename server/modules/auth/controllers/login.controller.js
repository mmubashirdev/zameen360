const service = require("../services/login.service");
exports.login = async (req, res) => {
  try {
    const data = await service.loginUser(
      req.body,
      req.ip,
      req.headers["user-agent"],
    );

    res.cookie("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      secure:"true",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      secure: "true",
      path: "/api/auth/refresh",
      maxAge: 15 * 60 * 1000,
    });

    const responseData = { ...data };
    delete responseData.accessToken;
    delete responseData.refreshToken;

    res.status(200).json({ success: true, message: "Login successful.", data: responseData });
  } catch (e) {
    const r = { success: false, message: e.message };
    if (e.requiresVerification) r.requiresVerification = true;
    res.status(e.status || 500).json(r);
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const data = await service.adminLoginService(req.body, req.ip);
    res.cookie("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      secure: "true",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      secure: "true",
      path: "/api/auth/refresh",
      maxAge: 15 * 60 * 1000,
    });

    const responseData = { ...data };
    delete responseData.accessToken;
    delete responseData.refreshToken;

    res.status(200).json({ success: true, message: "Admin login.", data: responseData });
  } catch (e) {
    res.status(e.status || 500).json({ success: false, message: e.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token." });
    }

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const { generateAccessToken, generateRefreshToken } = require("../../../utils/generateToken");
    
    const newAccessToken = generateAccessToken(decoded.userId, decoded.role);
    const newRefreshToken = generateRefreshToken(decoded.userId, decoded.role);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      secure: "true",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      secure: "true",
      path: "/api/auth/refresh",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "Tokens refreshed" });
  } catch (e) {
    res.status(401).json({ success: false, message: "Invalid refresh token." });
  }
};

exports.logout = (req, res) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    secure: "true",
    sameSite: "none",
    maxAge: 0,
  });

  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    secure: "true",
    path: "/api/auth/refresh",
    maxAge: 0,
  });

  res.status(200).json({ success: true, message: "Logged out." });
};
