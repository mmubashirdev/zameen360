const jwt = require("jsonwebtoken");
const prisma = require("../../../configs/prisma");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ success: false, message: "No token." });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true, sellerDetail: true },
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
    return res.status(500).json({ success: false, message: e.message });
    }
  }
};