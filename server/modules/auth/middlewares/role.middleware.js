module.exports = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Auth required." });
  if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: "Access denied." });
  next();
};