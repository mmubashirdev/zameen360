const service = require("../services/login.service");
exports.login = async (req, res) => {
  try { const data = await service.loginUser(req.body, req.ip, req.headers["user-agent"]); res.status(200).json({ success: true, message: "Login successful.", data }); }
  catch (e) { const r = { success: false, message: e.message }; if (e.requiresVerification) r.requiresVerification = true; res.status(e.status || 500).json(r); }
};

exports.adminLogin = async (req, res) => {
  try { const data = await service.adminLoginService(req.body, req.ip); res.status(200).json({ success: true, message: "Admin login.", data }); }
  catch (e) { res.status(e.status || 500).json({ success: false, message: e.message }); }
};