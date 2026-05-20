const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Zameen 360" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (e) {
    console.error("Email error:", e);
    return false;
  }
};

// ============================================
// 🔐 OTP EMAIL - SIMPLE CLEAN DESIGN
// ============================================
const sendOTPEmail = async (to, otp, purpose) => {
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
                  Verify Your Email
                </h2>
                <p style="color:#4B5563;margin:0;font-size:15px;line-height:1.7;">
                  Thanks for registering with Zameen 360.<br>
                  Please use the verification code below to verify your email address.
                </p>
              </td>
            </tr>

            <!-- OTP BOX -->
            <tr>
              <td style="padding:10px 50px 25px;text-align:center;background:#FAFAFA;">
                <div style="
                  background:#EEF4FF;
                  border:2px dashed #93C5FD;
                  border-radius:14px;
                  padding:28px 20px;
                  display:inline-block;
                  min-width:380px;
                ">
                  <div style="
                    color:#1A73E8;
                    font-size:54px;
                    font-weight:800;
                    letter-spacing:14px;
                    font-family:Arial,sans-serif;
                    line-height:1;
                  ">
                    ${otp}
                  </div>
                </div>
              </td>
            </tr>

            <!-- EXPIRY TEXT -->
            <tr>
              <td style="padding:0 50px 30px;text-align:center;background:#FAFAFA;">
                <p style="color:#4B5563;margin:0;font-size:15px;">
                  This code will expire in <strong style="color:#1A73E8;">1 minute</strong>.
                </p>
              </td>
            </tr>

            <!-- DIVIDER -->
            <tr>
              <td style="padding:0 50px;background:#FAFAFA;">
                <div style="border-top:1px solid #E5E7EB;"></div>
              </td>
            </tr>

            <!-- SECURITY NOTE -->
            <tr>
              <td style="padding:25px 50px 35px;background:#FAFAFA;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50" style="vertical-align:top;padding-right:14px;">
                      <span style="font-size:28px;color:#1A73E8;">🛡️</span>
                    </td>
                    <td style="vertical-align:top;">
                      <p style="color:#4B5563;margin:0;font-size:14px;line-height:1.6;">
                        For your security, do not share this code with anyone.<br>
                        Zameen 360 will never ask for this code via phone or email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:#F3F4F6;padding:25px 50px;text-align:center;">
                <p style="color:#6B7280;margin:0 0 8px;font-size:13px;">
                  If you didn't request this code, you can safely ignore this email.
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
  return await sendEmail(to, "Verify Your Email - Zameen 360", html);
};

// ============================================
// 🎉 WELCOME EMAIL - SIMPLE CLEAN DESIGN
// ============================================
const sendWelcomeEmail = async (to, name) => {
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
                  Welcome, ${name}! 🎉
                </h2>
                <p style="color:#4B5563;margin:0;font-size:15px;line-height:1.7;">
                  Thank you for joining Zameen 360.<br>
                  Your account has been successfully created and is ready to use.
                </p>
              </td>
            </tr>

            <!-- WELCOME BOX -->
            <tr>
              <td style="padding:10px 50px 25px;text-align:center;background:#FAFAFA;">
                <div style="
                  background:#EEF4FF;
                  border:2px dashed #93C5FD;
                  border-radius:14px;
                  padding:30px 20px;
                  display:inline-block;
                  min-width:380px;
                ">
                  <p style="color:#1A73E8;margin:0 0 8px;font-size:14px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">
                    Your Account is Ready
                  </p>
                  <p style="color:#0F172A;margin:0;font-size:20px;font-weight:700;">
                    Start your property journey
                  </p>
                </div>
              </td>
            </tr>

            <!-- CTA BUTTON -->
            <tr>
              <td style="padding:0 50px 30px;text-align:center;background:#FAFAFA;">
                <a href="https://zameen360.com" style="
                  display:inline-block;
                  background:#1A73E8;
                  color:#ffffff;
                  text-decoration:none;
                  padding:14px 40px;
                  border-radius:10px;
                  font-size:15px;
                  font-weight:700;
                ">
                  Start Exploring →
                </a>
              </td>
            </tr>

            <!-- DIVIDER -->
            <tr>
              <td style="padding:0 50px;background:#FAFAFA;">
                <div style="border-top:1px solid #E5E7EB;"></div>
              </td>
            </tr>

            <!-- FEATURES -->
            <tr>
              <td style="padding:25px 50px 35px;background:#FAFAFA;">
                <p style="color:#0F172A;margin:0 0 16px;font-size:15px;font-weight:700;text-align:center;">
                  What you can do with Zameen 360
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:8px 0;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="30" style="vertical-align:middle;">
                            <span style="color:#1A73E8;font-size:18px;">✓</span>
                          </td>
                          <td style="vertical-align:middle;">
                            <span style="color:#4B5563;font-size:14px;">Browse 10,000+ verified properties</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="30" style="vertical-align:middle;">
                            <span style="color:#1A73E8;font-size:18px;">✓</span>
                          </td>
                          <td style="vertical-align:middle;">
                            <span style="color:#4B5563;font-size:14px;">Experience 3D virtual property tours</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="30" style="vertical-align:middle;">
                            <span style="color:#1A73E8;font-size:18px;">✓</span>
                          </td>
                          <td style="vertical-align:middle;">
                            <span style="color:#4B5563;font-size:14px;">Connect with trusted real estate agents</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="30" style="vertical-align:middle;">
                            <span style="color:#1A73E8;font-size:18px;">✓</span>
                          </td>
                          <td style="vertical-align:middle;">
                            <span style="color:#4B5563;font-size:14px;">Post your own property for sale or rent</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:#F3F4F6;padding:25px 50px;text-align:center;">
                <p style="color:#6B7280;margin:0 0 8px;font-size:13px;">
                  We're excited to have you on board!
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
  return await sendEmail(to, "Welcome to Zameen 360!", html);
};

// ============================================
// 🔒 PASSWORD RESET EMAIL - SIMPLE CLEAN DESIGN
// ============================================
const sendPasswordResetEmail = async (to, otp) => {
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
                  Reset Your Password
                </h2>
                <p style="color:#4B5563;margin:0;font-size:15px;line-height:1.7;">
                  We received a request to reset your password.<br>
                  Please use the code below to reset your password.
                </p>
              </td>
            </tr>

            <!-- OTP BOX -->
            <tr>
              <td style="padding:10px 50px 25px;text-align:center;background:#FAFAFA;">
                <div style="
                  background:#EEF4FF;
                  border:2px dashed #93C5FD;
                  border-radius:14px;
                  padding:28px 20px;
                  display:inline-block;
                  min-width:380px;
                ">
                  <div style="
                    color:#1A73E8;
                    font-size:54px;
                    font-weight:800;
                    letter-spacing:14px;
                    font-family:Arial,sans-serif;
                    line-height:1;
                  ">
                    ${otp}
                  </div>
                </div>
              </td>
            </tr>

            <!-- EXPIRY TEXT -->
            <tr>
              <td style="padding:0 50px 30px;text-align:center;background:#FAFAFA;">
                <p style="color:#4B5563;margin:0;font-size:15px;">
                  This code will expire in <strong style="color:#1A73E8;">1 minute</strong>.
                </p>
              </td>
            </tr>

            <!-- DIVIDER -->
            <tr>
              <td style="padding:0 50px;background:#FAFAFA;">
                <div style="border-top:1px solid #E5E7EB;"></div>
              </td>
            </tr>

            <!-- SECURITY NOTE -->
            <tr>
              <td style="padding:25px 50px 35px;background:#FAFAFA;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50" style="vertical-align:top;padding-right:14px;">
                      <span style="font-size:28px;color:#1A73E8;">🛡️</span>
                    </td>
                    <td style="vertical-align:top;">
                      <p style="color:#4B5563;margin:0;font-size:14px;line-height:1.6;">
                        For your security, do not share this code with anyone.<br>
                        Zameen 360 will never ask for this code via phone or email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:#F3F4F6;padding:25px 50px;text-align:center;">
                <p style="color:#6B7280;margin:0 0 8px;font-size:13px;">
                  If you didn't request a password reset, you can safely ignore this email.
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
  return await sendEmail(to, "Reset Your Password - Zameen 360", html);
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};