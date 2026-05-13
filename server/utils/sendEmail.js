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
// 🔐 OTP EMAIL TEMPLATE - WEBSITE WIDE VIEW
// ============================================
const sendOTPEmail = async (to, otp, purpose) => {
  const otpDigits = otp.toString().split("");
  const otpBoxes = otpDigits
    .map(
      (digit) => `
    <td align="center" style="padding:0 6px;">
      <div style="
        background:linear-gradient(145deg,#ffffff 0%,#F0F7FF 100%);
        color:#1A73E8;
        font-size:36px;
        font-weight:800;
        font-family:'Courier New',monospace;
        width:58px;
        height:70px;
        line-height:70px;
        border-radius:14px;
        border:1.5px solid rgba(26,115,232,0.15);
        box-shadow:
          0 8px 25px rgba(26,115,232,0.1),
          0 2px 6px rgba(0,0,0,0.04),
          inset 0 -3px 0 rgba(26,115,232,0.06);
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
  <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#F0F4F8;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F4F8;padding:30px 20px;">
      <tr>
        <td align="center">

          <!-- WIDE WEBSITE CONTAINER -->
          <table width="800" cellpadding="0" cellspacing="0" style="max-width:800px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 70px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.03);">
            
            <!-- TOP NAV BAR -->
            <tr>
              <td style="background:#ffffff;padding:16px 40px;border-bottom:1px solid #F1F5F9;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <h1 style="color:#1F2937;margin:0;font-size:22px;font-weight:800;">
                        🏠 Zameen <span style="color:#1A73E8;">360</span>
                      </h1>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <span style="color:#6B7280;font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:600;">
                        Secure Verification
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- WIDE REAL ESTATE BANNER IMAGE -->
            <tr>
              <td style="padding:0;margin:0;">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80" 
                  alt="Luxury Property" 
                  width="800"
                  style="display:block;width:100%;max-width:800px;height:250px;object-fit:cover;"
                />
              </td>
            </tr>

            <!-- TWO COLUMN LAYOUT -->
            <tr>
              <td style="padding:40px 50px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <!-- LEFT SIDE - HEADING & INFO -->
                    <td width="45%" style="vertical-align:top;padding-right:30px;">
                      <div style="
                        display:inline-block;
                        background:linear-gradient(135deg,#EEF4FF 0%,#DBEAFE 100%);
                        color:#1A73E8;
                        font-size:10px;
                        font-weight:700;
                        letter-spacing:2.5px;
                        text-transform:uppercase;
                        padding:6px 18px;
                        border-radius:50px;
                        margin-bottom:16px;
                      ">
                        ✉️ Email Verification
                      </div>
                      <h2 style="color:#1F2937;margin:16px 0 10px;font-size:28px;font-weight:800;line-height:1.2;">
                        Verify Your<br>Identity
                      </h2>
                      <p style="color:#6B7280;margin:0 0 16px;font-size:14px;line-height:1.8;">
                        We received a verification request for your 
                        <strong style="color:#1A73E8;">${purpose}</strong>. 
                        Please use the code shown to complete the process.
                      </p>
                      
                      <!-- TIMER WARNING -->
                      <div style="
                        background:linear-gradient(145deg,#FFFCF0 0%,#FFF9E6 100%);
                        border-left:4px solid #F59E0B;
                        padding:12px 16px;
                        border-radius:0 12px 12px 0;
                        margin-top:10px;
                      ">
                        <p style="color:#92400E;margin:0;font-size:13px;font-weight:600;">
                          ⏱️ Code expires in <strong>1 minute</strong>
                        </p>
                      </div>
                    </td>

                    <!-- RIGHT SIDE - OTP BOX -->
                    <td width="55%" style="vertical-align:top;">
                      <div style="
                        background:linear-gradient(145deg,#FAFBFF 0%,#F0F4FF 100%);
                        padding:30px 20px;
                        border-radius:20px;
                        border:1px solid rgba(26,115,232,0.08);
                        box-shadow:0 10px 35px rgba(26,115,232,0.06),inset 0 1px 0 rgba(255,255,255,0.9);
                        text-align:center;
                      ">
                        <p style="color:#1A73E8;margin:0 0 18px;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">
                          Your Verification Code
                        </p>
                        <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                          <tr>
                            ${otpBoxes}
                          </tr>
                        </table>
                        <p style="color:#9CA3AF;margin:18px 0 0;font-size:11px;">
                          Do not share this code with anyone
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- SECURITY NOTICE - FULL WIDTH -->
            <tr>
              <td style="padding:10px 50px 15px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="
                      background:linear-gradient(145deg,#F8FAFC 0%,#F1F5F9 100%);
                      border:1px solid #E2E8F0;
                      padding:16px 20px;
                      border-radius:14px;
                    ">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="vertical-align:middle;padding-right:14px;" width="40">
                            <div style="
                              background:linear-gradient(145deg,#E8F0FE 0%,#D2E3FC 100%);
                              width:36px;height:36px;
                              border-radius:10px;
                              text-align:center;line-height:36px;
                            ">
                              <span style="font-size:16px;">🛡️</span>
                            </div>
                          </td>
                          <td style="vertical-align:middle;">
                            <p style="color:#374151;margin:0;font-size:13px;line-height:1.6;">
                              <strong>Security Notice:</strong> Zameen 360 will never ask you for this code via phone call, SMS, or any third-party app. Keep your code confidential.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- DIVIDER -->
            <tr>
              <td style="padding:10px 50px;">
                <hr style="border:none;border-top:1px solid #F1F5F9;margin:0;">
              </td>
            </tr>

            <!-- FEATURES ROW - 4 COLUMNS -->
            <tr>
              <td style="padding:15px 50px 25px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" width="25%" style="padding:0 6px;">
                      <div style="
                        background:linear-gradient(145deg,#F0F7FF 0%,#E3EFFD 100%);
                        padding:16px 8px;
                        border-radius:14px;
                        box-shadow:0 4px 12px rgba(26,115,232,0.05);
                        border:1px solid rgba(26,115,232,0.05);
                      ">
                        <span style="font-size:22px;display:block;margin-bottom:6px;">🏘️</span>
                        <p style="color:#1F2937;margin:0;font-size:12px;font-weight:700;">3D Tours</p>
                        <p style="color:#9CA3AF;margin:2px 0 0;font-size:10px;">Virtual Walkthrough</p>
                      </div>
                    </td>
                    <td align="center" width="25%" style="padding:0 6px;">
                      <div style="
                        background:linear-gradient(145deg,#F0FFF4 0%,#DCFCE7 100%);
                        padding:16px 8px;
                        border-radius:14px;
                        box-shadow:0 4px 12px rgba(34,197,94,0.05);
                        border:1px solid rgba(34,197,94,0.05);
                      ">
                        <span style="font-size:22px;display:block;margin-bottom:6px;">✅</span>
                        <p style="color:#1F2937;margin:0;font-size:12px;font-weight:700;">Verified</p>
                        <p style="color:#9CA3AF;margin:2px 0 0;font-size:10px;">Trusted Listings</p>
                      </div>
                    </td>
                    <td align="center" width="25%" style="padding:0 6px;">
                      <div style="
                        background:linear-gradient(145deg,#FFF7ED 0%,#FFEDD5 100%);
                        padding:16px 8px;
                        border-radius:14px;
                        box-shadow:0 4px 12px rgba(249,115,22,0.05);
                        border:1px solid rgba(249,115,22,0.05);
                      ">
                        <span style="font-size:22px;display:block;margin-bottom:6px;">🤝</span>
                        <p style="color:#1F2937;margin:0;font-size:12px;font-weight:700;">Agents</p>
                        <p style="color:#9CA3AF;margin:2px 0 0;font-size:10px;">500+ Trusted</p>
                      </div>
                    </td>
                    <td align="center" width="25%" style="padding:0 6px;">
                      <div style="
                        background:linear-gradient(145deg,#F5F0FF 0%,#EDE9FE 100%);
                        padding:16px 8px;
                        border-radius:14px;
                        box-shadow:0 4px 12px rgba(139,92,246,0.05);
                        border:1px solid rgba(139,92,246,0.05);
                      ">
                        <span style="font-size:22px;display:block;margin-bottom:6px;">🗺️</span>
                        <p style="color:#1F2937;margin:0;font-size:12px;font-weight:700;">50+ Cities</p>
                        <p style="color:#9CA3AF;margin:2px 0 0;font-size:10px;">Nationwide</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- WEBSITE FOOTER -->
            <tr>
              <td style="background:linear-gradient(145deg,#1A1A2E 0%,#0F1629 100%);padding:30px 50px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <h3 style="color:#ffffff;margin:0 0 4px;font-size:18px;font-weight:700;">
                        🏠 Zameen <span style="color:#1A73E8;">360</span>
                      </h3>
                      <p style="color:rgba(255,255,255,0.4);margin:0;font-size:11px;letter-spacing:1px;">
                        3D Property Experience Platform
                      </p>
                    </td>
                    <td align="center" style="vertical-align:middle;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:32px;height:32px;border-radius:8px;text-align:center;line-height:32px;text-decoration:none;font-size:14px;">📘</a></td>
                          <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:32px;height:32px;border-radius:8px;text-align:center;line-height:32px;text-decoration:none;font-size:14px;">📸</a></td>
                          <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:32px;height:32px;border-radius:8px;text-align:center;line-height:32px;text-decoration:none;font-size:14px;">🐦</a></td>
                          <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:32px;height:32px;border-radius:8px;text-align:center;line-height:32px;text-decoration:none;font-size:14px;">💼</a></td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <p style="color:rgba(255,255,255,0.4);margin:0 0 3px;font-size:11px;">
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
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
  return await sendEmail(to, "🔐 Your Zameen 360 Verification Code", html);
};

// ============================================
// 🎉 WELCOME EMAIL TEMPLATE - WEBSITE WIDE VIEW
// ============================================
const sendWelcomeEmail = async (to, name) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#F0F4F8;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F4F8;padding:30px 20px;">
      <tr>
        <td align="center">

          <table width="800" cellpadding="0" cellspacing="0" style="max-width:800px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 70px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.03);">
            
            <!-- TOP NAV BAR -->
            <tr>
              <td style="background:#ffffff;padding:16px 40px;border-bottom:1px solid #F1F5F9;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <h1 style="color:#1F2937;margin:0;font-size:22px;font-weight:800;">
                        🏠 Zameen <span style="color:#1A73E8;">360</span>
                      </h1>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <span style="color:#22C55E;font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:600;">
                        ✅ Account Verified
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- WIDE BANNER IMAGE -->
            <tr>
              <td style="padding:0;margin:0;">
                <img 
                  src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80" 
                  alt="Luxury Home" 
                  width="800"
                  style="display:block;width:100%;max-width:800px;height:260px;object-fit:cover;"
                />
              </td>
            </tr>

            <!-- TWO COLUMN WELCOME -->
            <tr>
              <td style="padding:40px 50px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <!-- LEFT - WELCOME TEXT -->
                    <td width="50%" style="vertical-align:top;padding-right:30px;">
                      <div style="
                        display:inline-block;
                        background:linear-gradient(145deg,#FEF3C7 0%,#FDE68A 100%);
                        width:70px;height:70px;
                        border-radius:50%;
                        line-height:70px;
                        text-align:center;
                        margin-bottom:16px;
                        box-shadow:0 8px 25px rgba(245,158,11,0.15);
                      ">
                        <span style="font-size:32px;">🎉</span>
                      </div>
                      <h2 style="color:#1F2937;margin:0 0 4px;font-size:28px;font-weight:800;">
                        Welcome Aboard!
                      </h2>
                      <h3 style="color:#1A73E8;margin:0 0 14px;font-size:22px;font-weight:600;">
                        ${name}
                      </h3>
                      <p style="color:#6B7280;margin:0 0 20px;font-size:14px;line-height:1.8;">
                        Thank you for joining <strong style="color:#1A73E8;">Zameen 360</strong> — Pakistan's first 3D real estate platform. Explore immersive property tours, verified listings, and connect with trusted agents.
                      </p>
                      <a href="https://zameen360.com" style="
                        background:linear-gradient(145deg,#1A73E8 0%,#1565C0 100%);
                        color:#ffffff;
                        text-decoration:none;
                        padding:14px 35px;
                        border-radius:12px;
                        font-size:14px;
                        font-weight:700;
                        display:inline-block;
                        box-shadow:0 8px 25px rgba(26,115,232,0.25);
                      ">
                        🚀 Start Exploring
                      </a>
                    </td>

                    <!-- RIGHT - FEATURE CARDS -->
                    <td width="50%" style="vertical-align:top;">
                      <!-- Card 1 -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                        <tr>
                          <td style="
                            background:linear-gradient(145deg,#F0F7FF 0%,#E8F0FE 100%);
                            border-radius:14px;padding:14px 16px;
                            border-left:4px solid #1A73E8;
                          ">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td width="42" style="vertical-align:middle;">
                                  <div style="background:linear-gradient(145deg,#1A73E8 0%,#1565C0 100%);width:36px;height:36px;border-radius:10px;text-align:center;line-height:36px;">
                                    <span style="font-size:16px;">🔍</span>
                                  </div>
                                </td>
                                <td style="vertical-align:middle;padding-left:12px;">
                                  <p style="color:#1F2937;margin:0;font-size:13px;font-weight:700;">Search & Discover</p>
                                  <p style="color:#6B7280;margin:2px 0 0;font-size:11px;">Thousands of verified listings</p>
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
                            border-radius:14px;padding:14px 16px;
                            border-left:4px solid #22C55E;
                          ">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td width="42" style="vertical-align:middle;">
                                  <div style="background:linear-gradient(145deg,#22C55E 0%,#16A34A 100%);width:36px;height:36px;border-radius:10px;text-align:center;line-height:36px;">
                                    <span style="font-size:16px;">🏘️</span>
                                  </div>
                                </td>
                                <td style="vertical-align:middle;padding-left:12px;">
                                  <p style="color:#1F2937;margin:0;font-size:13px;font-weight:700;">3D Virtual Tours</p>
                                  <p style="color:#6B7280;margin:2px 0 0;font-size:11px;">Immersive property walkthroughs</p>
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
                            border-radius:14px;padding:14px 16px;
                            border-left:4px solid #F97316;
                          ">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td width="42" style="vertical-align:middle;">
                                  <div style="background:linear-gradient(145deg,#F97316 0%,#EA580C 100%);width:36px;height:36px;border-radius:10px;text-align:center;line-height:36px;">
                                    <span style="font-size:16px;">🗺️</span>
                                  </div>
                                </td>
                                <td style="vertical-align:middle;padding-left:12px;">
                                  <p style="color:#1F2937;margin:0;font-size:13px;font-weight:700;">Interactive Maps</p>
                                  <p style="color:#6B7280;margin:2px 0 0;font-size:11px;">Find properties on 3D maps</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Card 4 -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="
                            background:linear-gradient(145deg,#F5F0FF 0%,#EDE9FE 100%);
                            border-radius:14px;padding:14px 16px;
                            border-left:4px solid #8B5CF6;
                          ">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td width="42" style="vertical-align:middle;">
                                  <div style="background:linear-gradient(145deg,#8B5CF6 0%,#7C3AED 100%);width:36px;height:36px;border-radius:10px;text-align:center;line-height:36px;">
                                    <span style="font-size:16px;">💳</span>
                                  </div>
                                </td>
                                <td style="vertical-align:middle;padding-left:12px;">
                                  <p style="color:#1F2937;margin:0;font-size:13px;font-weight:700;">Smart Payments</p>
                                  <p style="color:#6B7280;margin:2px 0 0;font-size:11px;">Flexible installment plans</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- STATS ROW -->
            <tr>
              <td style="padding:10px 50px 30px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="
                  background:linear-gradient(145deg,#FAFBFF 0%,#F0F4FF 100%);
                  border-radius:16px;
                  border:1px solid rgba(26,115,232,0.06);
                  padding:20px 10px;
                ">
                  <tr>
                    <td align="center" width="25%">
                      <p style="color:#1A73E8;margin:0;font-size:24px;font-weight:800;">10K+</p>
                      <p style="color:#9CA3AF;margin:3px 0 0;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Properties</p>
                    </td>
                    <td align="center" width="25%" style="border-left:1px solid rgba(26,115,232,0.1);">
                      <p style="color:#1A73E8;margin:0;font-size:24px;font-weight:800;">500+</p>
                      <p style="color:#9CA3AF;margin:3px 0 0;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Agents</p>
                    </td>
                    <td align="center" width="25%" style="border-left:1px solid rgba(26,115,232,0.1);">
                      <p style="color:#1A73E8;margin:0;font-size:24px;font-weight:800;">50+</p>
                      <p style="color:#9CA3AF;margin:3px 0 0;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Cities</p>
                    </td>
                    <td align="center" width="25%" style="border-left:1px solid rgba(26,115,232,0.1);">
                      <p style="color:#1A73E8;margin:0;font-size:24px;font-weight:800;">25K+</p>
                      <p style="color:#9CA3AF;margin:3px 0 0;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Happy Users</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- WEBSITE FOOTER -->
            <tr>
              <td style="background:linear-gradient(145deg,#1A1A2E 0%,#0F1629 100%);padding:30px 50px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <h3 style="color:#ffffff;margin:0 0 4px;font-size:18px;font-weight:700;">
                        🏠 Zameen <span style="color:#1A73E8;">360</span>
                      </h3>
                      <p style="color:rgba(255,255,255,0.4);margin:0;font-size:11px;">
                        3D Property Experience Platform
                      </p>
                    </td>
                    <td align="center" style="vertical-align:middle;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:32px;height:32px;border-radius:8px;text-align:center;line-height:32px;text-decoration:none;font-size:14px;">📘</a></td>
                          <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:32px;height:32px;border-radius:8px;text-align:center;line-height:32px;text-decoration:none;font-size:14px;">📸</a></td>
                          <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:32px;height:32px;border-radius:8px;text-align:center;line-height:32px;text-decoration:none;font-size:14px;">🐦</a></td>
                          <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:32px;height:32px;border-radius:8px;text-align:center;line-height:32px;text-decoration:none;font-size:14px;">💼</a></td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <p style="color:rgba(255,255,255,0.4);margin:0 0 3px;font-size:11px;">
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
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
  return await sendEmail(to, "🎉 Welcome to Zameen 360 — Your 3D Property Journey!", html);
};

// ============================================
// 🔒 PASSWORD RESET EMAIL - WEBSITE WIDE VIEW
// ============================================
const sendPasswordResetEmail = async (to, otp) => {
  const otpDigits = otp.toString().split("");
  const otpBoxes = otpDigits
    .map(
      (digit) => `
    <td align="center" style="padding:0 6px;">
      <div style="
        background:linear-gradient(145deg,#ffffff 0%,#FFF5F5 100%);
        color:#DC2626;
        font-size:36px;
        font-weight:800;
        font-family:'Courier New',monospace;
        width:58px;
        height:70px;
        line-height:70px;
        border-radius:14px;
        border:1.5px solid rgba(220,38,38,0.15);
        box-shadow:
          0 8px 25px rgba(220,38,38,0.08),
          0 2px 6px rgba(0,0,0,0.04),
          inset 0 -3px 0 rgba(220,38,38,0.05);
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
  <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#F0F4F8;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F4F8;padding:30px 20px;">
      <tr>
        <td align="center">

          <table width="800" cellpadding="0" cellspacing="0" style="max-width:800px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 70px rgba(0,0,0,0.07),0 4px 16px rgba(0,0,0,0.03);">
            
            <!-- TOP NAV BAR -->
            <tr>
              <td style="background:#ffffff;padding:16px 40px;border-bottom:1px solid #F1F5F9;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <h1 style="color:#1F2937;margin:0;font-size:22px;font-weight:800;">
                        🏠 Zameen <span style="color:#1A73E8;">360</span>
                      </h1>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <span style="color:#DC2626;font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:600;">
                        🔒 Password Reset
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- BANNER IMAGE -->
            <tr>
              <td style="padding:0;margin:0;">
                <img 
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80" 
                  alt="Property Security" 
                  width="800"
                  style="display:block;width:100%;max-width:800px;height:230px;object-fit:cover;"
                />
              </td>
            </tr>

            <!-- TWO COLUMN LAYOUT -->
            <tr>
              <td style="padding:40px 50px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <!-- LEFT - INFO -->
                    <td width="45%" style="vertical-align:top;padding-right:30px;">
                      <div style="
                        display:inline-block;
                        background:linear-gradient(145deg,#FEF2F2 0%,#FEE2E2 100%);
                        width:65px;height:65px;
                        border-radius:50%;
                        line-height:65px;
                        text-align:center;
                        margin-bottom:16px;
                        border:2px solid rgba(220,38,38,0.1);
                      ">
                        <span style="font-size:30px;">🔒</span>
                      </div>
                      <h2 style="color:#1F2937;margin:0 0 8px;font-size:26px;font-weight:800;line-height:1.2;">
                        Password<br>Reset Request
                      </h2>
                      <p style="color:#6B7280;margin:0 0 16px;font-size:14px;line-height:1.8;">
                        We received a request to reset your account password. Use the code to proceed securely.
                      </p>
                      
                      <!-- 1 MINUTE TIMER -->
                      <div style="
                        background:linear-gradient(145deg,#FFFCF0 0%,#FFF9E6 100%);
                        border-left:4px solid #F59E0B;
                        padding:12px 16px;
                        border-radius:0 12px 12px 0;
                        margin-bottom:14px;
                      ">
                        <p style="color:#92400E;margin:0;font-size:13px;font-weight:600;">
                          ⏱️ Code expires in <strong>1 minute</strong>
                        </p>
                      </div>

                      <!-- SECURITY ALERT -->
                      <div style="
                        background:linear-gradient(145deg,#FEF2F2 0%,#FEE2E2 100%);
                        border:1px solid #FECACA;
                        padding:14px;
                        border-radius:12px;
                      ">
                        <p style="color:#991B1B;margin:0 0 3px;font-size:12px;font-weight:700;">⚠️ Security Alert</p>
                        <p style="color:#6B7280;margin:0;font-size:11px;line-height:1.6;">
                          If you didn't request this, ignore this email. Your password remains safe.
                        </p>
                      </div>
                    </td>

                    <!-- RIGHT - OTP BOX -->
                    <td width="55%" style="vertical-align:top;">
                      <div style="
                        background:linear-gradient(145deg,#FFFAFA 0%,#FEF2F2 100%);
                        padding:30px 20px;
                        border-radius:20px;
                        border:1px solid rgba(220,38,38,0.08);
                        box-shadow:0 10px 35px rgba(220,38,38,0.05);
                        text-align:center;
                      ">
                        <p style="color:#DC2626;margin:0 0 18px;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">
                          Password Reset Code
                        </p>
                        <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                          <tr>
                            ${otpBoxes}
                          </tr>
                        </table>
                        <p style="color:#9CA3AF;margin:18px 0 0;font-size:11px;">
                          Do not share this code with anyone
                        </p>
                      </div>

                      <!-- PASSWORD TIPS -->
                      <div style="
                        background:linear-gradient(145deg,#F8FAFC 0%,#F1F5F9 100%);
                        padding:18px;
                        border-radius:14px;
                        margin-top:14px;
                        border:1px solid #E2E8F0;
                      ">
                        <p style="color:#1F2937;margin:0 0 10px;font-size:13px;font-weight:700;">🛡️ Password Tips</p>
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="padding:3px 0;">
                              <table cellpadding="0" cellspacing="0"><tr>
                                <td style="vertical-align:middle;padding-right:8px;">
                                  <div style="background:#E8F0FE;width:20px;height:20px;border-radius:50%;text-align:center;line-height:20px;">
                                    <span style="font-size:9px;color:#1A73E8;font-weight:800;">✓</span>
                                  </div>
                                </td>
                                <td><p style="color:#4B5563;margin:0;font-size:11px;">8+ characters</p></td>
                              </tr></table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:3px 0;">
                              <table cellpadding="0" cellspacing="0"><tr>
                                <td style="vertical-align:middle;padding-right:8px;">
                                  <div style="background:#E8F0FE;width:20px;height:20px;border-radius:50%;text-align:center;line-height:20px;">
                                    <span style="font-size:9px;color:#1A73E8;font-weight:800;">✓</span>
                                  </div>
                                </td>
                                <td><p style="color:#4B5563;margin:0;font-size:11px;">Upper & lowercase mix</p></td>
                              </tr></table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:3px 0;">
                              <table cellpadding="0" cellspacing="0"><tr>
                                <td style="vertical-align:middle;padding-right:8px;">
                                  <div style="background:#E8F0FE;width:20px;height:20px;border-radius:50%;text-align:center;line-height:20px;">
                                    <span style="font-size:9px;color:#1A73E8;font-weight:800;">✓</span>
                                  </div>
                                </td>
                                <td><p style="color:#4B5563;margin:0;font-size:11px;">Numbers & special chars</p></td>
                              </tr></table>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- WEBSITE FOOTER -->
            <tr>
              <td style="background:linear-gradient(145deg,#1A1A2E 0%,#0F1629 100%);padding:30px 50px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <h3 style="color:#ffffff;margin:0 0 4px;font-size:18px;font-weight:700;">
                        🏠 Zameen <span style="color:#1A73E8;">360</span>
                      </h3>
                      <p style="color:rgba(255,255,255,0.4);margin:0;font-size:11px;">
                        3D Property Experience Platform
                      </p>
                    </td>
                    <td align="center" style="vertical-align:middle;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:32px;height:32px;border-radius:8px;text-align:center;line-height:32px;text-decoration:none;font-size:14px;">📘</a></td>
                          <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:32px;height:32px;border-radius:8px;text-align:center;line-height:32px;text-decoration:none;font-size:14px;">📸</a></td>
                          <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:32px;height:32px;border-radius:8px;text-align:center;line-height:32px;text-decoration:none;font-size:14px;">🐦</a></td>
                          <td style="padding:0 5px;"><a href="#" style="display:inline-block;background:rgba(255,255,255,0.08);width:32px;height:32px;border-radius:8px;text-align:center;line-height:32px;text-decoration:none;font-size:14px;">💼</a></td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <p style="color:rgba(255,255,255,0.4);margin:0 0 3px;font-size:11px;">
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