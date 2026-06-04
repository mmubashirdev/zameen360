const service = require("../services/admin.service");

exports.getAllUsers = async (req, res) => {
  try { 
    const data = await service.getAllUsersService(req.query);
     res.status(200).json({ success: true, data }); }
  catch (e)
   { res.status(500).json({ success: false, message: e.message }); 
}
};


exports.adminLogin = async (req,res) => {
  try {
    const data = await service.AdminLogin(req.email,req.password);
    res.status(200).json({ data , message:"Admin Login Success"})
  } catch (e) {
    res.status(500).json({message:e.message})
  }
};

exports.getUserById = async (req, res) => {
  try {
     const data = await service.getUserByIdService(req.params.user_id);
      res.status(200).json({ success: true, data });
     }
  catch (e) { 
    res.status(e.status || 500).json({ success: false, message: e.message }); 
}
};

exports.blockUser = async (req, res) => {
  try { 
    const name = await service.blockUserService(req.params.user_id, req.body.reason, req.ip);
     res.status(200).json({ success: true, message: `${name} blocked.` });
     }
  catch (e) { 
    res.status(e.status || 500).json({ success: false, message: e.message });
 }
};

exports.unblockUser = async (req, res) => {
  try {
     const name = await service.unblockUserService(req.params.user_id, req.ip);
      res.status(200).json({ success: true, message: `${name} unblocked.` });
     }
  catch (e) { 
    res.status(e.status || 500).json({ success: false, message: e.message });
 }
};

exports.deleteUser = async (req, res) => {
  try { 
    const name = await service.deleteUserService(req.params.user_id);
     res.status(200).json({ success: true, message: `${name} deleted.` });
     }
  catch (e) {
    res.status(e.status || 500).json({ success: false, message: e.message });
 }
};

exports.getStats = async (req, res) => {
  try { 
    const data = await service.getUserStatsService();
     res.status(200).json({ success: true, data });
     }
  catch (e) { 
    res.status(500).json({ success: false, message: e.message }); }
};