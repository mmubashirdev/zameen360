const service = require("../services/profile.service");

exports.getProfile = async (req, res) => {
  try { const data = await service.getProfileService(req.user.id); res.status(200).json({ success: true, data }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.updateProfile = async (req, res) => {
  try { const data = await service.updateProfileService(req.user.id, req.user, req.body, req.ip); res.status(200).json({ success: true, message: "Updated.", data }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.uploadPicture = async (req, res) => {
  try { if (!req.file) return res.status(400).json({ success: false, message: "Upload picture." }); const pic = await service.uploadPictureService(req.user.id, req.file.filename); res.status(200).json({ success: true, message: "Uploaded.", data: { profilePicture: pic } }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.removePicture = async (req, res) => {
  try { await service.removePictureService(req.user.id); res.status(200).json({ success: true, message: "Removed." }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.becomeSeller = async (req, res) => {
  try {
    const data = await service.becomeSellerService(req.user.id);
    res.status(200).json({ success: true, message: "You are now a seller!", data });
  } catch (e) {
    res.status(e.status || 500).json({ success: false, message: e.message });
  }
};