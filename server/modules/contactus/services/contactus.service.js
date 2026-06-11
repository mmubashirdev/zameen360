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

  const sendContactUsEmail = async (to, formData) => {
    const { name, email, phone, subject, message } = formData;

    const adminEmail = process.env.ADMIN_EMAIL || "shahzaib.334aug25webbpt@gmail.com";

    const html = `
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

          <!-- MAIN CONTAINER -->
          <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#FAFAFA;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
            
            <!-- TOP BLUE BAR -->
            <tr>
              <td style="background:#1A73E8;height:6px;"></td>
            </tr>

            <!-- LOGO HEADER -->
            <tr>
              <td style="padding:40px 50px 25px;text-align:center;background:#FAFAFA;">
                <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td style="vertical-align:middle;padding-right:10px;">
                      <span style="font-size:40px;">🏠</span>
                    </td>
                    <td style="vertical-align:middle;">
                      <h1 style="color:#0F172A;margin:0;font-size:38px;font-weight:800;letter-spacing:-0.5px;">
                        Zameen <span style="color:#1A73E8;">360</span>
                      </h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- DIVIDER -->
            <tr>
              <td style="padding:0 50px;">
                <div style="border-top:1px solid #E5E7EB;"></div>
              </td>
            </tr>

            <!-- MAIN CONTENT -->
            <tr>
              <td style="padding:35px 50px 20px;text-align:center;background:#FAFAFA;">
                <h2 style="color:#0F172A;margin:0 0 20px;font-size:32px;font-weight:800;">
                  New Contact Us Submission
                </h2>
                <p style="color:#4B5563;margin:0;font-size:15px;line-height:1.7;">
                  You have received a new inquiry from your website's contact form.
                </p>
              </td>
            </tr>

            <!-- CONTACT CARD -->
            <tr>
              <td style="padding:10px 50px 25px;text-align:center;background:#FAFAFA;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #E5E7EB;border-radius:14px;padding:25px;text-align:left;">
                  
                  <!-- NAME -->
                  <tr>
                    <td width="120" style="padding:8px 0; color:#6B7280; font-weight:600; font-size:14px; vertical-align:top;">
                      Full Name
                    </td>
                    <td style="padding:8px 0; color:#0F172A; font-size:14px; line-height:1.6;">
                      ${name || 'Not provided'}
                    </td>
                  </tr>

                  <!-- EMAIL -->
                  <tr>
                    <td style="padding:8px 0; color:#6B7280; font-weight:600; font-size:14px; vertical-align:top;">
                      Email Address
                    </td>
                    <td style="padding:8px 0; color:#0F172A; font-size:14px; line-height:1.6;">
                      ${email || 'Not provided'}
                    </td>
                  </tr>

                  <!-- PHONE -->
                  <tr>
                    <td style="padding:8px 0; color:#6B7280; font-weight:600; font-size:14px; vertical-align:top;">
                      Phone Number
                    </td>
                    <td style="padding:8px 0; color:#0F172A; font-size:14px; line-height:1.6;">
                      ${phone || 'Not provided'}
                    </td>
                  </tr>

                  <!-- SUBJECT -->
                  <tr>
                    <td style="padding:8px 0; color:#6B7280; font-weight:600; font-size:14px; vertical-align:top;">
                      Subject
                    </td>
                    <td style="padding:8px 0; color:#0F172A; font-size:14px; line-height:1.6; font-weight:600;">
                      ${subject || 'No subject'}
                    </td>
                  </tr>

                  <!-- MESSAGE -->
                  <tr>
                    <td style="padding:12px 0 8px; color:#6B7280; font-weight:600; font-size:14px; vertical-align:top;">
                      Message
                    </td>
                    <td style="padding:8px 0; color:#0F172A; font-size:14px; line-height:1.6; border-top:1px solid #E5E7EB; padding-top:12px;">
                      ${message ? message.replace(/\n/g, '<br>') : 'No message provided'}
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

            <!-- ACTION NOTE -->
            <tr>
              <td style="padding:0 50px 30px;text-align:center;background:#FAFAFA;">
                <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td style="vertical-align:top;padding-right:10px;">
                      <span style="font-size:20px;color:#1A73E8;">📧</span>
                    </td>
                    <td style="vertical-align:top;text-align:left;">
                      <p style="color:#4B5563;margin:0;font-size:14px;line-height:1.6;">
                        <strong>Reply directly</strong> to this email to respond to the inquiry.<br>
                        The sender will receive your response from your email address.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- DIVIDER -->
            <tr>
              <td style="padding:0 50px;background:#FAFAFA;">
                <div style="border-top:1px solid #E5E7EB;"></div>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:#F3F4F6;padding:25px 50px;text-align:center;">
                <p style="color:#6B7280;margin:0 0 8px;font-size:13px;">
                  This inquiry was submitted through the Zameen 360 contact form.
                </p>
                <p style="color:#6B7280;margin:0 0 18px;font-size:13px;">
                  Need help? Contact us at <a href="mailto:support@zameen360.com" style="color:#1A73E8;text-decoration:underline;font-weight:600;">support@zameen360.com</a>
                </p>

                <!-- SOCIAL ICONS -->
                <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
                  <tr>
                    <td style="padding:0 6px;">
                      <a href="#" style="
                        display:inline-block;
                        width:36px;height:36px;
                        border:1.5px solid #1A73E8;
                        border-radius:50%;
                        text-align:center;
                        line-height:36px;
                        text-decoration:none;
                        color:#1A73E8;
                        font-size:16px;
                      ">f</a>
                    </td>
                    <td style="padding:0 6px;">
                      <a href="#" style="
                        display:inline-block;
                        width:36px;height:36px;
                        border:1.5px solid #1A73E8;
                        border-radius:50%;
                        text-align:center;
                        line-height:36px;
                        text-decoration:none;
                        color:#1A73E8;
                        font-size:14px;
                      ">📷</a>
                    </td>
                    <td style="padding:0 6px;">
                      <a href="#" style="
                        display:inline-block;
                        width:36px;height:36px;
                        border:1.5px solid #1A73E8;
                        border-radius:50%;
                        text-align:center;
                        line-height:36px;
                        text-decoration:none;
                        color:#1A73E8;
                        font-size:14px;
                        font-weight:700;
                      ">in</a>
                    </td>
                  </tr>
                </table>

                <p style="color:#6B7280;margin:0;font-size:12px;">
                  © 2025 Zameen 360. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

    return await sendEmail(to, "New Contact Us Submission - Zameen 360", html);
  };

  const adminEmail = process.env.ADMIN_EMAIL || "shahzaib.334aug25webbpt@gmail.com";

  const emailSent = await sendContactUsEmail(adminEmail, {
    name: contactName,
    email,
    phone,
    subject,
    message,
  });

  if (!emailSent) {
    const error = new Error("Unable to send contact inquiry at this time. Please try again later.");
    error.status = 500;
    throw error;
  }

  return {
    success: true,
    message: "Contact form submitted successfully.",
    data: { name: contactName, email, phone, subject, message },
  };
};

module.exports = {
  submitContactFormService,
};