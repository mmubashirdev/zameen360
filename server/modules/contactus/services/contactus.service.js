const { sendEmail } = require("../../../utils/sendEmail");

const submitContactFormService = async (name, email, subject, message, phone) => {

  const contactName = name || email?.split('@')[0];
  
  if (!contactName || !email || !subject || !message) {
    const error = new Error("All fields are required: name (or email), email, subject, and message");
    error.status = 400;
    throw error;
  }

 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const error = new Error("Invalid email format");
    error.status = 400;
    throw error;
  }

  const adminEmail = process.env.ADMIN_EMAIL || "shahzaib.334aug25webbpt@gmail.com";

  
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#F3F4F6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#FAFAFA;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
              <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <td align="center" style="padding:40px 20px;">
                  <h1 style="margin:0;color:#FFFFFF;font-size:28px;font-weight:600;">New Contact Form Submission</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:40px;">
                  <h2 style="color:#1F2937;margin:0 0 20px 0;font-size:18px;font-weight:600;">Form Details</h2>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                    <tr>
                      <td style="padding:12px;background:#F3F4F6;border-radius:6px;margin-bottom:10px;">
                        <p style="margin:0;color:#6B7280;font-size:12px;font-weight:600;text-transform:uppercase;">Name</p>
                        <p style="margin:5px 0 0 0;color:#1F2937;font-size:14px;font-weight:500;">${contactName}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px;background:#F3F4F6;border-radius:6px;margin-bottom:10px;">
                        <p style="margin:0;color:#6B7280;font-size:12px;font-weight:600;text-transform:uppercase;">Email</p>
                        <p style="margin:5px 0 0 0;color:#1F2937;font-size:14px;font-weight:500;"><a href="mailto:${email}" style="color:#667eea;text-decoration:none;">${email}</a></p>
                      </td>
                    </tr>
                    ${phone ? `
                    <tr>
                      <td style="padding:12px;background:#F3F4F6;border-radius:6px;margin-bottom:10px;">
                        <p style="margin:0;color:#6B7280;font-size:12px;font-weight:600;text-transform:uppercase;">Phone</p>
                        <p style="margin:5px 0 0 0;color:#1F2937;font-size:14px;font-weight:500;"><a href="tel:${phone}" style="color:#667eea;text-decoration:none;">${phone}</a></p>
                      </td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding:12px;background:#F3F4F6;border-radius:6px;margin-bottom:10px;">
                        <p style="margin:0;color:#6B7280;font-size:12px;font-weight:600;text-transform:uppercase;">Subject</p>
                        <p style="margin:5px 0 0 0;color:#1F2937;font-size:14px;font-weight:500;">${subject}</p>
                      </td>
                    </tr>
                  </table>

                  <h3 style="color:#1F2937;margin:30px 0 15px 0;font-size:16px;font-weight:600;">Message</h3>
                  <div style="padding:20px;background:#F9FAFB;border-left:4px solid #667eea;border-radius:4px;">
                    <p style="margin:0;color:#1F2937;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</p>
                  </div>

                  <hr style="border:none;border-top:1px solid #E5E7EB;margin:30px 0;">
                  <p style="margin:0;color:#6B7280;font-size:12px;">This is an automated message from Zameen 360 Contact Form.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  
  const userHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#F3F4F6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#FAFAFA;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
              <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <td align="center" style="padding:40px 20px;">
                  <h1 style="margin:0;color:#FFFFFF;font-size:28px;font-weight:600;">Thank You for Contacting Us!</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:40px;">
                  <p style="margin:0 0 20px 0;color:#1F2937;font-size:14px;line-height:1.6;">
                    Hi ${contactName},
                  </p>
                  
                  <p style="margin:0 0 20px 0;color:#1F2937;font-size:14px;line-height:1.6;">
                    Thank you for reaching out to Zameen 360. We have received your message and will get back to you as soon as possible.
                  </p>

                  <h3 style="color:#1F2937;margin:30px 0 15px 0;font-size:16px;font-weight:600;">Your Submission Details</h3>
                  <div style="padding:20px;background:#F9FAFB;border-left:4px solid #667eea;border-radius:4px;">
                    <p style="margin:5px 0;color:#1F2937;font-size:14px;"><strong>Subject:</strong> ${subject}</p>
                    <p style="margin:5px 0;color:#1F2937;font-size:14px;"><strong>Message:</strong></p>
                    <p style="margin:5px 0;color:#1F2937;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</p>
                  </div>

                  <hr style="border:none;border-top:1px solid #E5E7EB;margin:30px 0;">
                  <p style="margin:0;color:#6B7280;font-size:12px;">Best regards,<br>Zameen 360 Team</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  sendEmail(
    adminEmail,
    `New Contact Form Submission from ${contactName}`,
    adminHtml
  ).catch((error) => {
    console.error("Failed to send admin contact email:", error);
  });

  sendEmail(
    email,
    "We Received Your Message - Zameen 360",
    userHtml
  ).catch((error) => {
    console.error("Failed to send user confirmation email:", error);
  });

  return {
    success: true,
    message: "Your message has been sent successfully. We'll get back to you soon!",
  };
};

module.exports = { submitContactFormService };
