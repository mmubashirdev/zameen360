const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
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
// 🔐 OTP EMAIL TEMPLATE - 3D STYLE
// ============================================
const sendOTPEmail = async (to, otp, purpose) => {
  const otpDigits = otp.toString().split("");
  const otpBoxes = otpDigits
    .map(
      (digit) => `
    <td align="center" style="padding:0 5px;">
      <div style="
        background:linear-gradient(145deg,#ffffff 0%,#F0F4FF 100%);
        color:#1A73E8;
        font-size:30px;
        font-weight:800;
        font-family:'Courier New',monospace;
        width:50px;
        height:60px;
        line-height:60px;
        border-radius:14px;
        border:1px solid rgba(26,115,232,0.15);
        box-shadow:
          0 6px 20px rgba(26,115,232,0.1),
          0 2px 4px rgba(0,0,0,0.04),
          inset 0 -3px 0 rgba(26,115,232,0.08);
      ">${digit}</div>
    </td>
  `
    )
    .join("");

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#EEF2F7;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#EEF2F7;padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 25px 80px rgba(0,0,0,0.08),0 4px 15px rgba(0,0,0,0.04);">
            
            <!-- 3D BUILDING IMAGE WITH LOGO OVERLAY -->
            <tr>
              <td style="padding:0;margin:0;position:relative;">
                <div style="position:relative;">
                  <img 
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80" 
                    alt="3D Real Estate" 
                    width="620"
                    style="display:block;width:100%;max-width:620px;height:220px;object-fit:cover;"
                  />
                </div>
              </td>
            </tr>

            <!-- FLOATING LOGO CARD (3D EFFECT) -->
            <tr>
              <td align="center" style="padding:0;">
                <div style="
                  margin-top:-40px;
                  position:relative;
                  z-index:10;
                  display:inline-block;
                  background:linear-gradient(145deg,#ffffff 0%,#F8FAFF 100%);
                  padding:14px 32px;
                  border-radius:16px;
                  box-shadow:
                    0 12px 40px rgba(26,115,232,0.15),
                    0 4px 12px rgba(0,0,0,0.06),
                    inset 0 1px 0 rgba(255,255,255,0.8);
                  border:1px solid rgba(26,115,232,0.08);
                ">
                  <h1 style="color:#1F2937;margin:0;font-size:24px;font-weight:800;letter-spacing:0.5px;">
                    🏠 Zameen <span style="color:#1A73E8;">360</span>
                  </h1>
                  <p style="color:#9CA3AF;margin:4px 0 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:500;">
                    3D Property Platform
                  </p>
                </div>
              </td>
            </tr>

            <!-- PURPOSE PILL -->
            <tr>
              <td align="center" style="padding:22px 40px 0;">
                <div style="
                  display:inline-block;
                  background:linear-gradient(135deg,#EEF4FF 0%,#DBEAFE 100%);
                  color:#1A73E8;
                  font-size:11px;
                  font-weight:700;
                  letter-spacing:2.5px;
                  text-transform:uppercase;
                  padding:8px 24px;
                  border-radius:50px;
                  box-shadow:0 2px 8px rgba(26,115,232,0.08);
                ">
                  ✉️ Email Verification
                </div>
              </td>
            </tr>
            
            <!-- MAIN HEADING -->
            <tr>
              <td style="padding:20px 40px 8px;text-align:center;">
                <h2 style="color:#1F2937;margin:0 0 8px;font-size:24px;font-weight:800;">
                  Verify Your Identity
                </h2>
                <p style="color:#6B7280;margin:0;font-size:14px;line-height:1.7;">
                  Use the code below to complete your 
                  <strong style="color:#1A73E8;">${purpose}</strong>
                </p>
              </td>
            </tr>

            <!-- 3D OTP BOXES -->
            <tr>
              <td style="padding:25px 40px 10px;">
                <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td align="center" style="
                      background:linear-gradient(145deg,#FAFBFF 0%,#F0F4FF 100%);
                      padding:28px 24px;
                      border-radius:20px;
                      border:1px solid rgba(26,115,232,0.08);
                      box-shadow:
                        0 8px 30px rgba(26,115,232,0.06),
                        inset 0 1px 0 rgba(255,255,255,0.9);
                    ">
                      <p style="color:#1A73E8;margin:0 0 16px;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">
                        Your Verification Code
                      </p>
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          ${otpBoxes}
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 3D TIMER CARD -->
            <tr>
              <td style="padding:20px 40px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="
                      background:linear-gradient(145deg,#FFFCF0 0%,#FFF9E6 100%);
                      border-left:4px solid #F59E0B;
                      padding:14px 18px;
                      border-radius:0 14px 14px 0;
                      box-shadow:0 4px 15px rgba(245,158,11,0.08);
                    ">
                      <p style="color:#92400E;margin:0;font-size:13px;font-weight:600;">
                        ⏱️ This code expires in <strong>1 minutes</strong>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 3D SECURITY CARD -->
            <tr>
              <td style="padding:16px 40px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="
                      background:linear-gradient(145deg,#F8FAFC 0%,#F1F5F9 100%);
                      border:1px solid #E2E8F0;
                      padding:16px 18px;
                      border-radius:14px;
                      box-shadow:
                        0 4px 15px rgba(0,0,0,0.03),
                        inset 0 1px 0 rgba(255,255,255,0.8);
                    ">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="vertical-align:middle;padding-right:12px;">
                            <div style="
                              background:linear-gradient(145deg,#E8F0FE 0%,#D2E3FC 100%);
                              width:36px;height:36px;
                              border-radius:10px;
                              text-align:center;
                              line-height:36px;
                              box-shadow:0 3px 10px rgba(26,115,232,0.1);
                            ">
                              <span style="font-size:16px;">🛡️</span>
                            </div>
                          </td>
                          <td style="vertical-align:middle;">
                            <p style="color:#374151;margin:0;font-size:12px;line-height:1.6;">
                              <strong>Security:</strong> Never share this code. Zameen 360 will never ask for your OTP.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- INSTRUCTION TEXT -->
            <tr>
              <td style="padding:20px 40px 5px;text-align:center;">
                <p style="color:#9CA3AF;margin:0;font-size:12px;line-height:1.7;">
                  Enter this code on the verification page. If you didn't request this, ignore this email.
                </p>
              </td>
            </tr>

            <!-- DIVIDER -->
            <tr>
              <td style="padding:15px 40px;">
                <hr style="border:none;border-top:1px solid #F1F5F9;margin:0;">
              </td>
            </tr>
            
            <!-- 3D FEATURE PILLS -->
            <tr>
              <td style="padding:5px 40px 25px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" width="33%" style="padding:0 4px;">
                      <div style="
                        background:linear-gradient(145deg,#F0F7FF 0%,#E3EFFD 100%);
                        padding:14px 8px;
                        border-radius:14px;
                        box-shadow:0 4px 12px rgba(26,115,232,0.06),inset 0 1px 0 rgba(255,255,255,0.9);
                        border:1px solid rgba(26,115,232,0.06);
                      ">
                        <span style="font-size:20px;display:block;margin-bottom:4px;">🏘️</span>
                        <p style="color:#1F2937;margin:0;font-size:11px;font-weight:700;">3D Tours</p>
                      </div>
                    </td>
                    <td align="center" width="33%" style="padding:0 4px;">
                      <div style="
                        background:linear-gradient(145deg,#F0FFF4 0%,#DCFCE7 100%);
                        padding:14px 8px;
                        border-radius:14px;
                        box-shadow:0 4px 12px rgba(34,197,94,0.06),inset 0 1px 0 rgba(255,255,255,0.9);
                        border:1px solid rgba(34,197,94,0.06);
                      ">
                        <span style="font-size:20px;display:block;margin-bottom:4px;">✅</span>
                        <p style="color:#1F2937;margin:0;font-size:11px;font-weight:700;">Verified</p>
                      </div>
                    </td>
                    <td align="center" width="33%" style="padding:0 4px;">
                      <div style="
                        background:linear-gradient(145deg,#FFF7ED 0%,#FFEDD5 100%);
                        padding:14px 8px;
                        border-radius:14px;
                        box-shadow:0 4px 12px rgba(249,115,22,0.06),inset 0 1px 0 rgba(255,255,255,0.9);
                        border:1px solid rgba(249,115,22,0.06);
                      ">
                        <span style="font-size:20px;display:block;margin-bottom:4px;">🤝</span>
                        <p style="color:#1F2937;margin:0;font-size:11px;font-weight:700;">Trusted</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 3D FOOTER -->
            <tr>
              <td style="
                background:linear-gradient(145deg,#1A1A2E 0%,#0F1629 100%);
                padding:28px 35px;
                text-align:center;
              ">
                <h3 style="color:#ffffff;margin:0 0 4px;font-size:16px;font-weight:700;">
                  🏠 Zameen <span style="color:#1A73E8;">360</span>
                </h3>
                <p style="color:rgba(255,255,255,0.5);margin:0 0 14px;font-size:11px;letter-spacing:1.5px;">
                  3D Property Experience Platform
                </p>
                <table cellpadding="0" cellspacing="0" style="margin:0 auto 14px;">
                  <tr>
                    <td style="padding:0 5px;">
                      <a href="#" style="
                        display:inline-block;
                        background:rgba(255,255,255,0.08);
                        width:30px;height:30px;
                        border-radius:8px;
                        text-align:center;
                        line-height:30px;
                        text-decoration:none;
                        font-size:13px;
                      ">📘</a>
                    </td>
                    <td style="padding:0 5px;">
                      <a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:30px;height:30px;border-radius:8px;text-align:center;line-height:30px;text-decoration:none;font-size:13px;">📸</a>
                    </td>
                    <td style="padding:0 5px;">
                      <a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:30px;height:30px;border-radius:8px;text-align:center;line-height:30px;text-decoration:none;font-size:13px;">🐦</a>
                    </td>
                    <td style="padding:0 5px;">
                      <a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:30px;height:30px;border-radius:8px;text-align:center;line-height:30px;text-decoration:none;font-size:13px;">💼</a>
                    </td>
                  </tr>
                </table>
                <p style="color:rgba(255,255,255,0.4);margin:0 0 4px;font-size:11px;">
                  <a href="mailto:support@zameen360.com" style="color:#1A73E8;text-decoration:none;font-weight:600;">support@zameen360.com</a>
                </p>
                <p style="color:rgba(255,255,255,0.25);margin:0;font-size:10px;">
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
  return await sendEmail(to, "🔐 Your Zameen 360 Verification Code", html);
};

// ============================================
// 🎉 WELCOME EMAIL TEMPLATE - 3D STYLE
// ============================================
const sendWelcomeEmail = async (to, name) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#EEF2F7;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#EEF2F7;padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 25px 80px rgba(0,0,0,0.08),0 4px 15px rgba(0,0,0,0.04);">
            
            <!-- 3D BUILDING IMAGE -->
            <tr>
              <td style="padding:0;margin:0;">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80" 
                  alt="Welcome" 
                  width="620"
                  style="display:block;width:100%;max-width:620px;height:220px;object-fit:cover;"
                />
              </td>
            </tr>

            <!-- FLOATING LOGO -->
            <tr>
              <td align="center" style="padding:0;">
                <div style="
                  margin-top:-40px;
                  position:relative;
                  z-index:10;
                  display:inline-block;
                  background:linear-gradient(145deg,#ffffff 0%,#F8FAFF 100%);
                  padding:14px 32px;
                  border-radius:16px;
                  box-shadow:0 12px 40px rgba(26,115,232,0.15),0 4px 12px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.8);
                  border:1px solid rgba(26,115,232,0.08);
                ">
                  <h1 style="color:#1F2937;margin:0;font-size:24px;font-weight:800;">
                    🏠 Zameen <span style="color:#1A73E8;">360</span>
                  </h1>
                  <p style="color:#9CA3AF;margin:4px 0 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;">
                    3D Property Platform
                  </p>
                </div>
              </td>
            </tr>

            <!-- WELCOME CELEBRATION -->
            <tr>
              <td style="padding:28px 40px 10px;text-align:center;">
                <div style="
                  display:inline-block;
                  background:linear-gradient(145deg,#FFF9E6 0%,#FEF3C7 100%);
                  width:80px;height:80px;
                  border-radius:50%;
                  line-height:80px;
                  margin-bottom:16px;
                  box-shadow:
                    0 10px 30px rgba(245,158,11,0.15),
                    0 4px 8px rgba(0,0,0,0.04),
                    inset 0 -3px 0 rgba(245,158,11,0.08);
                  border:2px solid rgba(245,158,11,0.1);
                ">
                  <span style="font-size:38px;">🎉</span>
                </div>
                <h2 style="color:#1F2937;margin:0 0 4px;font-size:28px;font-weight:800;">
                  Welcome Aboard!
                </h2>
                <h3 style="color:#1A73E8;margin:0 0 10px;font-size:20px;font-weight:600;">
                  ${name}
                </h3>
                <div style="
                  display:inline-block;
                  background:linear-gradient(135deg,#EEF4FF 0%,#DBEAFE 100%);
                  color:#1A73E8;
                  font-size:11px;font-weight:700;
                  letter-spacing:2px;text-transform:uppercase;
                  padding:7px 22px;border-radius:50px;
                ">
                  🚀 Your 3D Property Journey Starts Now
                </div>
              </td>
            </tr>
            
            <!-- MESSAGE -->
            <tr>
              <td style="padding:20px 40px 10px;">
                <p style="color:#6B7280;margin:0;font-size:14px;text-align:center;line-height:1.8;">
                  Thank you for joining <strong style="color:#1A73E8;">Zameen 360</strong> — Pakistan's first 3D real estate platform. Explore immersive property tours, verified listings, and connect with trusted agents.
                </p>
              </td>
            </tr>

            <!-- 3D FEATURE CARDS -->
            <tr>
              <td style="padding:22px 40px 10px;">
                <h3 style="color:#1F2937;margin:0 0 16px;font-size:17px;text-align:center;font-weight:700;">
                  ✨ What Awaits You
                </h3>
                
                <!-- Card 1 -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                  <tr>
                    <td style="
                      background:linear-gradient(145deg,#F0F7FF 0%,#E8F0FE 100%);
                      border-radius:16px;
                      padding:16px 18px;
                      border-left:4px solid #1A73E8;
                      box-shadow:0 4px 15px rgba(26,115,232,0.06),inset 0 1px 0 rgba(255,255,255,0.8);
                    ">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="48" style="vertical-align:middle;">
                            <div style="
                              background:linear-gradient(145deg,#1A73E8 0%,#1565C0 100%);
                              width:40px;height:40px;
                              border-radius:12px;
                              text-align:center;line-height:40px;
                              box-shadow:0 4px 12px rgba(26,115,232,0.2);
                            ">
                              <span style="font-size:18px;">🔍</span>
                            </div>
                          </td>
                          <td style="vertical-align:middle;padding-left:14px;">
                            <p style="color:#1F2937;margin:0;font-size:14px;font-weight:700;">Search & Discover</p>
                            <p style="color:#6B7280;margin:2px 0 0;font-size:12px;">Browse thousands of verified property listings</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Card 2 -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                  <tr>
                    <td style="
                      background:linear-gradient(145deg,#F0FFF4 0%,#DCFCE7 100%);
                      border-radius:16px;
                      padding:16px 18px;
                      border-left:4px solid #22C55E;
                      box-shadow:0 4px 15px rgba(34,197,94,0.06),inset 0 1px 0 rgba(255,255,255,0.8);
                    ">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="48" style="vertical-align:middle;">
                            <div style="
                              background:linear-gradient(145deg,#22C55E 0%,#16A34A 100%);
                              width:40px;height:40px;
                              border-radius:12px;
                              text-align:center;line-height:40px;
                              box-shadow:0 4px 12px rgba(34,197,94,0.2);
                            ">
                              <span style="font-size:18px;">🏘️</span>
                            </div>
                          </td>
                          <td style="vertical-align:middle;padding-left:14px;">
                            <p style="color:#1F2937;margin:0;font-size:14px;font-weight:700;">3D Virtual Tours</p>
                            <p style="color:#6B7280;margin:2px 0 0;font-size:12px;">Walk through properties in immersive 3D</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Card 3 -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                  <tr>
                    <td style="
                      background:linear-gradient(145deg,#FFF7ED 0%,#FFEDD5 100%);
                      border-radius:16px;
                      padding:16px 18px;
                      border-left:4px solid #F97316;
                      box-shadow:0 4px 15px rgba(249,115,22,0.06),inset 0 1px 0 rgba(255,255,255,0.8);
                    ">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="48" style="vertical-align:middle;">
                            <div style="
                              background:linear-gradient(145deg,#F97316 0%,#EA580C 100%);
                              width:40px;height:40px;
                              border-radius:12px;
                              text-align:center;line-height:40px;
                              box-shadow:0 4px 12px rgba(249,115,22,0.2);
                            ">
                              <span style="font-size:18px;">🗺️</span>
                            </div>
                          </td>
                          <td style="vertical-align:middle;padding-left:14px;">
                            <p style="color:#1F2937;margin:0;font-size:14px;font-weight:700;">Interactive Maps</p>
                            <p style="color:#6B7280;margin:2px 0 0;font-size:12px;">Find properties on 3D interactive maps</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Card 4 -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                  <tr>
                    <td style="
                      background:linear-gradient(145deg,#F5F0FF 0%,#EDE9FE 100%);
                      border-radius:16px;
                      padding:16px 18px;
                      border-left:4px solid #8B5CF6;
                      box-shadow:0 4px 15px rgba(139,92,246,0.06),inset 0 1px 0 rgba(255,255,255,0.8);
                    ">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="48" style="vertical-align:middle;">
                            <div style="
                              background:linear-gradient(145deg,#8B5CF6 0%,#7C3AED 100%);
                              width:40px;height:40px;
                              border-radius:12px;
                              text-align:center;line-height:40px;
                              box-shadow:0 4px 12px rgba(139,92,246,0.2);
                            ">
                              <span style="font-size:18px;">💳</span>
                            </div>
                          </td>
                          <td style="vertical-align:middle;padding-left:14px;">
                            <p style="color:#1F2937;margin:0;font-size:14px;font-weight:700;">Smart Payments</p>
                            <p style="color:#6B7280;margin:2px 0 0;font-size:12px;">Flexible installment plans available</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 3D CTA BUTTON -->
            <tr>
              <td style="padding:20px 40px 10px;text-align:center;">
                <a href="https://zameen360.com" style="
                  background:linear-gradient(145deg,#1A73E8 0%,#1565C0 100%);
                  color:#ffffff;
                  text-decoration:none;
                  padding:15px 45px;
                  border-radius:14px;
                  font-size:15px;
                  font-weight:700;
                  display:inline-block;
                  box-shadow:
                    0 10px 30px rgba(26,115,232,0.3),
                    0 4px 8px rgba(0,0,0,0.08),
                    inset 0 1px 0 rgba(255,255,255,0.15);
                  letter-spacing:0.5px;
                ">
                  🚀 Explore 3D Properties
                </a>
              </td>
            </tr>

            <!-- 3D STATS ROW -->
            <tr>
              <td style="padding:22px 40px 28px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="
                  background:linear-gradient(145deg,#FAFBFF 0%,#F0F4FF 100%);
                  border-radius:16px;
                  border:1px solid rgba(26,115,232,0.06);
                  padding:18px 10px;
                  box-shadow:0 4px 15px rgba(0,0,0,0.02),inset 0 1px 0 rgba(255,255,255,0.9);
                ">
                  <tr>
                    <td align="center" width="33%">
                      <p style="color:#1A73E8;margin:0;font-size:22px;font-weight:800;">10K+</p>
                      <p style="color:#9CA3AF;margin:3px 0 0;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Properties</p>
                    </td>
                    <td align="center" width="33%" style="border-left:1px solid rgba(26,115,232,0.1);border-right:1px solid rgba(26,115,232,0.1);">
                      <p style="color:#1A73E8;margin:0;font-size:22px;font-weight:800;">500+</p>
                      <p style="color:#9CA3AF;margin:3px 0 0;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Agents</p>
                    </td>
                    <td align="center" width="33%">
                      <p style="color:#1A73E8;margin:0;font-size:22px;font-weight:800;">50+</p>
                      <p style="color:#9CA3AF;margin:3px 0 0;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Cities</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- FOOTER -->
            <tr>
              <td style="background:linear-gradient(145deg,#1A1A2E 0%,#0F1629 100%);padding:28px 35px;text-align:center;">
                <h3 style="color:#ffffff;margin:0 0 4px;font-size:16px;font-weight:700;">
                  🏠 Zameen <span style="color:#1A73E8;">360</span>
                </h3>
                <p style="color:rgba(255,255,255,0.45);margin:0 0 14px;font-size:11px;letter-spacing:1.5px;">
                  3D Property Experience Platform
                </p>
                <table cellpadding="0" cellspacing="0" style="margin:0 auto 14px;">
                  <tr>
                    <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:30px;height:30px;border-radius:8px;text-align:center;line-height:30px;text-decoration:none;font-size:13px;">📘</a></td>
                    <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:30px;height:30px;border-radius:8px;text-align:center;line-height:30px;text-decoration:none;font-size:13px;">📸</a></td>
                    <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:30px;height:30px;border-radius:8px;text-align:center;line-height:30px;text-decoration:none;font-size:13px;">🐦</a></td>
                    <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:30px;height:30px;border-radius:8px;text-align:center;line-height:30px;text-decoration:none;font-size:13px;">💼</a></td>
                  </tr>
                </table>
                <p style="color:rgba(255,255,255,0.35);margin:0 0 4px;font-size:11px;">
                  <a href="mailto:support@zameen360.com" style="color:#1A73E8;text-decoration:none;font-weight:600;">support@zameen360.com</a>
                </p>
                <p style="color:rgba(255,255,255,0.2);margin:0;font-size:10px;">
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
  return await sendEmail(to, "🎉 Welcome to Zameen 360 — Your 3D Property Journey!", html);
};

// ============================================
// 🔒 PASSWORD RESET EMAIL TEMPLATE - 3D STYLE
// ============================================
const sendPasswordResetEmail = async (to, otp) => {
  const otpDigits = otp.toString().split("");
  const otpBoxes = otpDigits
    .map(
      (digit) => `
    <td align="center" style="padding:0 5px;">
      <div style="
        background:linear-gradient(145deg,#ffffff 0%,#FFF5F5 100%);
        color:#DC2626;
        font-size:30px;
        font-weight:800;
        font-family:'Courier New',monospace;
        width:50px;
        height:60px;
        line-height:60px;
        border-radius:14px;
        border:1px solid rgba(220,38,38,0.15);
        box-shadow:
          0 6px 20px rgba(220,38,38,0.08),
          0 2px 4px rgba(0,0,0,0.04),
          inset 0 -3px 0 rgba(220,38,38,0.06);
      ">${digit}</div>
    </td>
  `
    )
    .join("");

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#EEF2F7;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#EEF2F7;padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 25px 80px rgba(0,0,0,0.08),0 4px 15px rgba(0,0,0,0.04);">
            
            <!-- 3D BUILDING IMAGE -->
            <tr>
              <td style="padding:0;margin:0;">
                <img 
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80" 
                  alt="Security" 
                  width="620"
                  style="display:block;width:100%;max-width:620px;height:200px;object-fit:cover;"
                />
              </td>
            </tr>

            <!-- FLOATING LOGO -->
            <tr>
              <td align="center" style="padding:0;">
                <div style="
                  margin-top:-40px;
                  position:relative;z-index:10;
                  display:inline-block;
                  background:linear-gradient(145deg,#ffffff 0%,#F8FAFF 100%);
                  padding:14px 32px;
                  border-radius:16px;
                  box-shadow:0 12px 40px rgba(26,115,232,0.15),0 4px 12px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.8);
                  border:1px solid rgba(26,115,232,0.08);
                ">
                  <h1 style="color:#1F2937;margin:0;font-size:24px;font-weight:800;">
                    🏠 Zameen <span style="color:#1A73E8;">360</span>
                  </h1>
                  <p style="color:#9CA3AF;margin:4px 0 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;">
                    Account Security
                  </p>
                </div>
              </td>
            </tr>

            <!-- ALERT ICON -->
            <tr>
              <td style="padding:25px 40px 10px;text-align:center;">
                <div style="
                  display:inline-block;
                  background:linear-gradient(145deg,#FEF2F2 0%,#FEE2E2 100%);
                  width:75px;height:75px;
                  border-radius:50%;
                  line-height:75px;
                  margin-bottom:14px;
                  border:2px solid rgba(220,38,38,0.12);
                  box-shadow:0 8px 25px rgba(220,38,38,0.1),inset 0 -2px 0 rgba(220,38,38,0.05);
                ">
                  <span style="font-size:35px;">🔒</span>
                </div>
                <h2 style="color:#1F2937;margin:0 0 6px;font-size:24px;font-weight:800;">
                  Password Reset
                </h2>
                <p style="color:#6B7280;margin:0;font-size:14px;">
                  Use the code below to reset your password
                </p>
              </td>
            </tr>
            
            <!-- 3D OTP BOXES -->
            <tr>
              <td style="padding:22px 40px 10px;">
                <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td align="center" style="
                      background:linear-gradient(145deg,#FFFAFA 0%,#FEF2F2 100%);
                      padding:25px 22px;
                      border-radius:20px;
                      border:1px solid rgba(220,38,38,0.08);
                      box-shadow:0 8px 30px rgba(220,38,38,0.05),inset 0 1px 0 rgba(255,255,255,0.9);
                    ">
                      <p style="color:#DC2626;margin:0 0 14px;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">
                        Password Reset Code
                      </p>
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          ${otpBoxes}
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- TIMER -->
            <tr>
              <td style="padding:20px 40px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="
                      background:linear-gradient(145deg,#FFFCF0 0%,#FFF9E6 100%);
                      border-left:4px solid #F59E0B;
                      padding:13px 16px;
                      border-radius:0 14px 14px 0;
                      box-shadow:0 4px 15px rgba(245,158,11,0.06);
                    ">
                      <p style="color:#92400E;margin:0;font-size:13px;font-weight:600;">
                        ⏱️ Expires in <strong>1 minutes</strong>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- SECURITY ALERT -->
            <tr>
              <td style="padding:14px 40px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="
                      background:linear-gradient(145deg,#FEF2F2 0%,#FEE2E2 100%);
                      border:1px solid #FECACA;
                      padding:16px;
                      border-radius:14px;
                      box-shadow:0 4px 15px rgba(220,38,38,0.04);
                    ">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="42" style="vertical-align:top;">
                            <div style="
                              background:linear-gradient(145deg,#DC2626 0%,#B91C1C 100%);
                              width:34px;height:34px;
                              border-radius:10px;
                              text-align:center;line-height:34px;
                              box-shadow:0 3px 10px rgba(220,38,38,0.15);
                            ">
                              <span style="font-size:15px;">⚠️</span>
                            </div>
                          </td>
                          <td style="vertical-align:top;padding-left:12px;">
                            <p style="color:#991B1B;margin:0 0 3px;font-size:13px;font-weight:700;">Security Alert</p>
                            <p style="color:#6B7280;margin:0;font-size:12px;line-height:1.6;">
                              If you didn't request this, ignore this email. Contact support for unauthorized access.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- 3D PASSWORD TIPS -->
            <tr>
              <td style="padding:20px 40px 10px;">
                <h3 style="color:#1F2937;margin:0 0 14px;font-size:15px;font-weight:700;">
                  🛡️ Strong Password Tips
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:5px 0;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="vertical-align:middle;padding-right:10px;">
                            <div style="
                              background:linear-gradient(145deg,#E8F0FE 0%,#D2E3FC 100%);
                              width:26px;height:26px;border-radius:50%;
                              text-align:center;line-height:26px;
                              box-shadow:0 2px 6px rgba(26,115,232,0.1);
                            ">
                              <span style="font-size:10px;color:#1A73E8;font-weight:800;">✓</span>
                            </div>
                          </td>
                          <td><p style="color:#4B5563;margin:0;font-size:12px;">At least 8 characters long</p></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="vertical-align:middle;padding-right:10px;">
                            <div style="background:linear-gradient(145deg,#E8F0FE 0%,#D2E3FC 100%);width:26px;height:26px;border-radius:50%;text-align:center;line-height:26px;box-shadow:0 2px 6px rgba(26,115,232,0.1);">
                              <span style="font-size:10px;color:#1A73E8;font-weight:800;">✓</span>
                            </div>
                          </td>
                          <td><p style="color:#4B5563;margin:0;font-size:12px;">Mix uppercase & lowercase</p></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="vertical-align:middle;padding-right:10px;">
                            <div style="background:linear-gradient(145deg,#E8F0FE 0%,#D2E3FC 100%);width:26px;height:26px;border-radius:50%;text-align:center;line-height:26px;box-shadow:0 2px 6px rgba(26,115,232,0.1);">
                              <span style="font-size:10px;color:#1A73E8;font-weight:800;">✓</span>
                            </div>
                          </td>
                          <td><p style="color:#4B5563;margin:0;font-size:12px;">Include numbers & special characters</p></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="vertical-align:middle;padding-right:10px;">
                            <div style="background:linear-gradient(145deg,#E8F0FE 0%,#D2E3FC 100%);width:26px;height:26px;border-radius:50%;text-align:center;line-height:26px;box-shadow:0 2px 6px rgba(26,115,232,0.1);">
                              <span style="font-size:10px;color:#1A73E8;font-weight:800;">✓</span>
                            </div>
                          </td>
                          <td><p style="color:#4B5563;margin:0;font-size:12px;">Never reuse passwords</p></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- DIVIDER -->
            <tr>
              <td style="padding:15px 40px;">
                <hr style="border:none;border-top:1px solid #F1F5F9;margin:0;">
              </td>
            </tr>

            <!-- HELP -->
            <tr>
              <td style="padding:0 40px 25px;text-align:center;">
                <p style="color:#9CA3AF;margin:0;font-size:12px;line-height:1.7;">
                  Still having trouble? Contact 
                  <a href="mailto:support@zameen360.com" style="color:#1A73E8;text-decoration:none;font-weight:600;">support@zameen360.com</a>
                </p>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:linear-gradient(145deg,#1A1A2E 0%,#0F1629 100%);padding:28px 35px;text-align:center;">
                <h3 style="color:#ffffff;margin:0 0 4px;font-size:16px;font-weight:700;">
                  🏠 Zameen <span style="color:#1A73E8;">360</span>
                </h3>
                <p style="color:rgba(255,255,255,0.45);margin:0 0 14px;font-size:11px;letter-spacing:1.5px;">
                  3D Property Experience Platform
                </p>
                <table cellpadding="0" cellspacing="0" style="margin:0 auto 14px;">
                  <tr>
                    <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:30px;height:30px;border-radius:8px;text-align:center;line-height:30px;text-decoration:none;font-size:13px;">📘</a></td>
                    <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:30px;height:30px;border-radius:8px;text-align:center;line-height:30px;text-decoration:none;font-size:13px;">📸</a></td>
                    <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:30px;height:30px;border-radius:8px;text-align:center;line-height:30px;text-decoration:none;font-size:13px;">🐦</a></td>
                    <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:30px;height:30px;border-radius:8px;text-align:center;line-height:30px;text-decoration:none;font-size:13px;">💼</a></td>
                  </tr>
                </table>
                <p style="color:rgba(255,255,255,0.35);margin:0 0 4px;font-size:11px;">
                  <a href="mailto:support@zameen360.com" style="color:#1A73E8;text-decoration:none;font-weight:600;">support@zameen360.com</a>
                </p>
                <p style="color:rgba(255,255,255,0.2);margin:0;font-size:10px;">
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
  return await sendEmail(to, "🔒 Reset Your Zameen 360 Password", html);
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};