const { sendSupportMessageService } = require("../services/support.service");

exports.sendSupportMessage = async (req, res) => {
  try {
    const name = req.body.name || req.body.fullName;
    const { email, subject, message } = req.body;

    const result = await sendSupportMessageService(name, email, subject, message);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to send contact message",
    });
  }
};
