const { submitContactFormService } = require("../services/contactus.service");

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    const result = await submitContactFormService(name, email, subject, message, phone);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to submit contact form",
    });
  }
};
