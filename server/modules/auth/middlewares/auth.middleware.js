const jwt = require("jsonwebtoken");
const prisma = require("../../../configs/prisma");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { 
        profile: true, 
        sellerDetail: true,
        verifications: true,
        sessions: true,
        passwordResets: true,
        activityLogs: true,
        properties: true
      },
    });

    if (!user){
         return res.status(401).json({ success: false, message: "Invalid token." });
    }
    if (!user.isActive){
         return res.status(403).json({ success: false, message: "Account deactivated." });
    }
    req.user = user;
    next();
  } catch (e) {
    if (e.name === "TokenExpiredError"){
         return res.status(401).json({ success: false, message: "Token expired." });
    }
    if (e.name === "JsonWebTokenError"){
         return res.status(401).json({ success: false, message: "Invalid token." });
    }
    return res.status(500).json({ success: false, message: e.message });
  }
};