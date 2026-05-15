const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  // ⚡ Performance settings
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
// 🔐 OTP EMAIL TEMPLATE - UNIQUE DESIGN
// ============================================
const sendOTPEmail = async (to, otp, purpose) => {
  const otpDigits = otp.toString().split("");
  const otpBoxes = otpDigits
    .map(
      (digit) => `
    <td align="center" style="padding:0 6px;">
      <div style="
        background:#FFFFFF;
        color:#0F172A;
        font-size:38px;
        font-weight:900;
        font-family:'Courier New',monospace;
        width:60px;
        height:74px;
        line-height:74px;
        border-radius:16px;
        border:2px solid #E0E7FF;
        box-shadow:
          0 10px 30px rgba(79,70,229,0.12),
          inset 0 -4px 0 rgba(79,70,229,0.08);
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
  <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#EEF2FF;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#EEF2FF;padding:40px 20px;">
      <tr>
        <td align="center">

          <table width="800" cellpadding="0" cellspacing="0" style="max-width:800px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 25px 80px rgba(79,70,229,0.1);">
            
            <!-- HEADER WITH GRADIENT -->
            <tr>
              <td style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);padding:40px 50px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:900;letter-spacing:-0.5px;">
                        Zameen <span style="color:#FCD34D;">360°</span>
                      </h1>
                      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;font-weight:500;">
                        Your Property Universe
                      </p>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <div style="
                        background:rgba(255,255,255,0.15);
                        backdrop-filter:blur(10px);
                        padding:8px 18px;
                        border-radius:50px;
                        display:inline-block;
                        border:1px solid rgba(255,255,255,0.2);
                      ">
                        <span style="color:#ffffff;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">
                          Verification
                        </span>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- DECORATIVE STRIP -->
            <tr>
              <td style="background:linear-gradient(90deg,#FCD34D 0%,#F59E0B 25%,#EF4444 50%,#EC4899 75%,#8B5CF6 100%);height:5px;"></td>
            </tr>

            <!-- MAIN CONTENT -->
            <tr>
              <td style="padding:50px 60px 30px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <!-- LEFT COLUMN -->
                    <td width="45%" style="vertical-align:top;padding-right:40px;">
                      <div style="
                        display:inline-block;
                        background:linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 100%);
                        color:#4F46E5;
                        font-size:11px;
                        font-weight:800;
                        letter-spacing:3px;
                        text-transform:uppercase;
                        padding:8px 20px;
                        border-radius:50px;
                        margin-bottom:20px;
                      ">
                        Action Required
                      </div>
                      <h2 style="color:#0F172A;margin:0 0 16px;font-size:32px;font-weight:900;line-height:1.15;letter-spacing:-1px;">
                        Almost<br>
                        <span style="background:linear-gradient(135deg,#4F46E5,#7C3AED);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">There!</span>
                      </h2>
                      <p style="color:#64748B;margin:0 0 24px;font-size:15px;line-height:1.7;">
                        Use the verification code on the right to complete your 
                        <strong style="color:#4F46E5;">${purpose}</strong> process.
                      </p>
                      
                      <!-- TIMER BADGE -->
                      <table cellpadding="0" cellspacing="0" style="margin-top:8px;">
                        <tr>
                          <td style="
                            background:linear-gradient(135deg,#FEF3C7 0%,#FDE68A 100%);
                            padding:14px 20px;
                            border-radius:14px;
                            border-left:5px solid #F59E0B;
                          ">
                            <p style="color:#92400E;margin:0 0 2px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                              Time Sensitive
                            </p>
                            <p style="color:#78350F;margin:0;font-size:14px;font-weight:700;">
                              Expires in 10 minutes
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>

                    <!-- RIGHT COLUMN - OTP -->
                    <td width="55%" style="vertical-align:top;">
                      <div style="
                        background:linear-gradient(145deg,#F8FAFF 0%,#EEF2FF 100%);
                        padding:35px 25px;
                        border-radius:24px;
                        border:1px solid #E0E7FF;
                        box-shadow:0 15px 40px rgba(79,70,229,0.08);
                        text-align:center;
                        position:relative;
                      ">
                        <p style="color:#4F46E5;margin:0 0 22px;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:800;">
                          Verification Code
                        </p>
                        <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                          <tr>
                            ${otpBoxes}
                          </tr>
                        </table>
                        <div style="
                          margin-top:24px;
                          padding-top:20px;
                          border-top:1px dashed #C7D2FE;
                        ">
                          <p style="color:#64748B;margin:0;font-size:12px;font-weight:600;">
                            Keep this code private &amp; confidential
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- SECURITY BANNER -->
            <tr>
              <td style="padding:0 60px 25px;">
                <div style="
                  background:linear-gradient(145deg,#F1F5F9 0%,#E2E8F0 100%);
                  border:1px solid #CBD5E1;
                  padding:20px 24px;
                  border-radius:16px;
                ">
                  <p style="color:#0F172A;margin:0 0 6px;font-size:14px;font-weight:800;">
                    Security First
                  </p>
                  <p style="color:#475569;margin:0;font-size:13px;line-height:1.6;">
                    Zameen 360 will never request your code via call, SMS, or third-party apps. If you didn't request this, please ignore this email.
                  </p>
                </div>
              </td>
            </tr>

            <!-- FEATURES GRID -->
            <tr>
              <td style="padding:0 60px 35px;">
                <p style="color:#94A3B8;margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-align:center;">
                  What Makes Us Different
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" width="33.33%" style="padding:0 6px;">
                      <div style="
                        background:linear-gradient(145deg,#FEF3C7 0%,#FDE68A 100%);
                        padding:20px 12px;
                        border-radius:16px;
                      ">
                        <p style="color:#78350F;margin:0;font-size:24px;font-weight:900;">10K+</p>
                        <p style="color:#92400E;margin:4px 0 0;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Properties</p>
                      </div>
                    </td>
                    <td align="center" width="33.33%" style="padding:0 6px;">
                      <div style="
                        background:linear-gradient(145deg,#DBEAFE 0%,#BFDBFE 100%);
                        padding:20px 12px;
                        border-radius:16px;
                      ">
                        <p style="color:#1E40AF;margin:0;font-size:24px;font-weight:900;">50+</p>
                        <p style="color:#1E3A8A;margin:4px 0 0;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Cities</p>
                      </div>
                    </td>
                    <td align="center" width="33.33%" style="padding:0 6px;">
                      <div style="
                        background:linear-gradient(145deg,#FCE7F3 0%,#FBCFE8 100%);
                        padding:20px 12px;
                        border-radius:16px;
                      ">
                        <p style="color:#9D174D;margin:0;font-size:24px;font-weight:900;">25K+</p>
                        <p style="color:#831843;margin:4px 0 0;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Users</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);padding:35px 60px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <h3 style="color:#ffffff;margin:0 0 6px;font-size:20px;font-weight:900;">
                        Zameen <span style="color:#FCD34D;">360°</span>
                      </h3>
                      <p style="color:rgba(255,255,255,0.5);margin:0;font-size:12px;letter-spacing:1px;">
                        Find. Buy. Sell. Your Property Universe.
                      </p>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <p style="color:rgba(255,255,255,0.5);margin:0 0 4px;font-size:12px;">
                        <a href="mailto:support@zameen360.com" style="color:#FCD34D;text-decoration:none;font-weight:700;">support@zameen360.com</a>
                      </p>
                      <p style="color:rgba(255,255,255,0.3);margin:0;font-size:11px;">
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
  return await sendEmail(to, "Your Zameen 360 Verification Code", html);
};

// ============================================
// 🎉 WELCOME EMAIL - UNIQUE DESIGN
// ============================================
const sendWelcomeEmail = async (to, name) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#F0FDF4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0FDF4;padding:40px 20px;">
      <tr>
        <td align="center">

          <table width="800" cellpadding="0" cellspacing="0" style="max-width:800px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 25px 80px rgba(34,197,94,0.1);">
            
            <!-- HEADER -->
            <tr>
              <td style="background:linear-gradient(135deg,#10B981 0%,#059669 100%);padding:40px 50px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:900;letter-spacing:-0.5px;">
                        Zameen <span style="color:#FCD34D;">360°</span>
                      </h1>
                      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;font-weight:500;">
                        Welcome to your property universe
                      </p>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <div style="
                        background:rgba(255,255,255,0.15);
                        padding:8px 18px;
                        border-radius:50px;
                        display:inline-block;
                        border:1px solid rgba(255,255,255,0.2);
                      ">
                        <span style="color:#ffffff;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">
                          Verified
                        </span>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- COLOR STRIP -->
            <tr>
              <td style="background:linear-gradient(90deg,#10B981 0%,#FCD34D 50%,#10B981 100%);height:5px;"></td>
            </tr>

            <!-- WELCOME HERO -->
            <tr>
              <td style="padding:60px 60px 30px;text-align:center;">
                <p style="color:#10B981;margin:0 0 16px;font-size:12px;font-weight:800;letter-spacing:4px;text-transform:uppercase;">
                  Welcome Aboard
                </p>
                <h2 style="color:#0F172A;margin:0 0 20px;font-size:42px;font-weight:900;line-height:1.1;letter-spacing:-1.5px;">
                  Hello, <span style="background:linear-gradient(135deg,#10B981,#059669);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${name}!</span>
                </h2>
                <p style="color:#64748B;margin:0 auto;font-size:16px;line-height:1.7;max-width:520px;">
                  You're now part of <strong style="color:#10B981;">Zameen 360</strong> — Pakistan's most innovative real estate platform. Let's help you find your dream property.
                </p>

                <!-- CTA BUTTON -->
                <table cellpadding="0" cellspacing="0" style="margin:32px auto 0;">
                  <tr>
                    <td style="
                      background:linear-gradient(135deg,#10B981 0%,#059669 100%);
                      border-radius:14px;
                      box-shadow:0 12px 30px rgba(16,185,129,0.3);
                    ">
                      <a href="https://zameen360.com" style="
                        display:inline-block;
                        color:#ffffff;
                        text-decoration:none;
                        padding:18px 50px;
                        font-size:15px;
                        font-weight:800;
                        letter-spacing:0.5px;
                      ">
                        Start Exploring →
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- FEATURES -->
            <tr>
              <td style="padding:30px 60px;">
                <p style="color:#94A3B8;margin:0 0 24px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-align:center;">
                  Discover What's Possible
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%" style="vertical-align:top;padding:6px;">
                      <div style="
                        background:linear-gradient(145deg,#ECFDF5 0%,#D1FAE5 100%);
                        padding:24px;
                        border-radius:16px;
                        border:1px solid #A7F3D0;
                      ">
                        <p style="color:#065F46;margin:0 0 8px;font-size:14px;font-weight:800;">
                          Smart Search
                        </p>
                        <p style="color:#047857;margin:0;font-size:12px;line-height:1.6;">
                          AI-powered property search across 50+ cities
                        </p>
                      </div>
                    </td>
                    <td width="50%" style="vertical-align:top;padding:6px;">
                      <div style="
                        background:linear-gradient(145deg,#EFF6FF 0%,#DBEAFE 100%);
                        padding:24px;
                        border-radius:16px;
                        border:1px solid #93C5FD;
                      ">
                        <p style="color:#1E40AF;margin:0 0 8px;font-size:14px;font-weight:800;">
                          3D Tours
                        </p>
                        <p style="color:#1D4ED8;margin:0;font-size:12px;line-height:1.6;">
                          Immersive virtual walkthroughs of properties
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td width="50%" style="vertical-align:top;padding:6px;">
                      <div style="
                        background:linear-gradient(145deg,#FEF3C7 0%,#FDE68A 100%);
                        padding:24px;
                        border-radius:16px;
                        border:1px solid #FCD34D;
                      ">
                        <p style="color:#78350F;margin:0 0 8px;font-size:14px;font-weight:800;">
                          Verified Listings
                        </p>
                        <p style="color:#92400E;margin:0;font-size:12px;line-height:1.6;">
                          Every property is authenticated &amp; trusted
                        </p>
                      </div>
                    </td>
                    <td width="50%" style="vertical-align:top;padding:6px;">
                      <div style="
                        background:linear-gradient(145deg,#FCE7F3 0%,#FBCFE8 100%);
                        padding:24px;
                        border-radius:16px;
                        border:1px solid #F9A8D4;
                      ">
                        <p style="color:#9D174D;margin:0 0 8px;font-size:14px;font-weight:800;">
                          Direct Connect
                        </p>
                        <p style="color:#BE185D;margin:0;font-size:12px;line-height:1.6;">
                          Talk to verified buyers &amp; sellers directly
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- STATS BAR -->
            <tr>
              <td style="padding:0 60px 35px;">
                <div style="
                  background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);
                  padding:28px 20px;
                  border-radius:20px;
                ">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" width="33.33%">
                        <p style="color:#FCD34D;margin:0;font-size:28px;font-weight:900;">10K+</p>
                        <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">Properties</p>
                      </td>
                      <td align="center" width="33.33%" style="border-left:1px solid rgba(255,255,255,0.1);border-right:1px solid rgba(255,255,255,0.1);">
                        <p style="color:#10B981;margin:0;font-size:28px;font-weight:900;">50+</p>
                        <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">Cities</p>
                      </td>
                      <td align="center" width="33.33%">
                        <p style="color:#EC4899;margin:0;font-size:28px;font-weight:900;">25K+</p>
                        <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;">Happy Users</p>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);padding:35px 60px;border-top:1px solid rgba(255,255,255,0.05);">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <h3 style="color:#ffffff;margin:0 0 6px;font-size:20px;font-weight:900;">
                        Zameen <span style="color:#FCD34D;">360°</span>
                      </h3>
                      <p style="color:rgba(255,255,255,0.5);margin:0;font-size:12px;letter-spacing:1px;">
                        Find. Buy. Sell. Your Property Universe.
                      </p>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <p style="color:rgba(255,255,255,0.5);margin:0 0 4px;font-size:12px;">
                        <a href="mailto:support@zameen360.com" style="color:#FCD34D;text-decoration:none;font-weight:700;">support@zameen360.com</a>
                      </p>
                      <p style="color:rgba(255,255,255,0.3);margin:0;font-size:11px;">
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
  return await sendEmail(to, "Welcome to Zameen 360 — Let's Begin!", html);
};

// ============================================
// 🔒 PASSWORD RESET EMAIL - UNIQUE DESIGN
// ============================================
const sendPasswordResetEmail = async (to, otp) => {
  const otpDigits = otp.toString().split("");
  const otpBoxes = otpDigits
    .map(
      (digit) => `
    <td align="center" style="padding:0 6px;">
      <div style="
        background:#FFFFFF;
        color:#0F172A;
        font-size:38px;
        font-weight:900;
        font-family:'Courier New',monospace;
        width:60px;
        height:74px;
        line-height:74px;
        border-radius:16px;
        border:2px solid #FECACA;
        box-shadow:
          0 10px 30px rgba(220,38,38,0.12),
          inset 0 -4px 0 rgba(220,38,38,0.08);
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
  <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#FEF2F2;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FEF2F2;padding:40px 20px;">
      <tr>
        <td align="center">

          <table width="800" cellpadding="0" cellspacing="0" style="max-width:800px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 25px 80px rgba(220,38,38,0.1);">
            
            <!-- HEADER -->
            <tr>
              <td style="background:linear-gradient(135deg,#DC2626 0%,#991B1B 100%);padding:40px 50px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:900;letter-spacing:-0.5px;">
                        Zameen <span style="color:#FCD34D;">360°</span>
                      </h1>
                      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;font-weight:500;">
                        Password Reset Request
                      </p>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <div style="
                        background:rgba(255,255,255,0.15);
                        padding:8px 18px;
                        border-radius:50px;
                        display:inline-block;
                        border:1px solid rgba(255,255,255,0.2);
                      ">
                        <span style="color:#ffffff;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">
                          Secure
                        </span>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- COLOR STRIP -->
            <tr>
              <td style="background:linear-gradient(90deg,#DC2626 0%,#FCD34D 50%,#DC2626 100%);height:5px;"></td>
            </tr>

            <!-- MAIN CONTENT -->
            <tr>
              <td style="padding:50px 60px 30px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="45%" style="vertical-align:top;padding-right:40px;">
                      <div style="
                        display:inline-block;
                        background:linear-gradient(135deg,#FEE2E2 0%,#FECACA 100%);
                        color:#DC2626;
                        font-size:11px;
                        font-weight:800;
                        letter-spacing:3px;
                        text-transform:uppercase;
                        padding:8px 20px;
                        border-radius:50px;
                        margin-bottom:20px;
                      ">
                        Reset Request
                      </div>
                      <h2 style="color:#0F172A;margin:0 0 16px;font-size:30px;font-weight:900;line-height:1.15;letter-spacing:-1px;">
                        Reset Your<br>
                        <span style="background:linear-gradient(135deg,#DC2626,#991B1B);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Password</span>
                      </h2>
                      <p style="color:#64748B;margin:0 0 20px;font-size:15px;line-height:1.7;">
                        Use the code on the right to securely reset your account password.
                      </p>
                      
                      <!-- TIMER -->
                      <div style="
                        background:linear-gradient(135deg,#FEF3C7 0%,#FDE68A 100%);
                        padding:14px 20px;
                        border-radius:14px;
                        border-left:5px solid #F59E0B;
                        margin-bottom:14px;
                      ">
                        <p style="color:#92400E;margin:0 0 2px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                          Time Sensitive
                        </p>
                        <p style="color:#78350F;margin:0;font-size:14px;font-weight:700;">
                          Expires in 10 minutes
                        </p>
                      </div>

                      <!-- WARNING -->
                      <div style="
                        background:linear-gradient(135deg,#FEE2E2 0%,#FECACA 100%);
                        padding:14px 20px;
                        border-radius:14px;
                        border-left:5px solid #DC2626;
                      ">
                        <p style="color:#991B1B;margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                          Didn't Request?
                        </p>
                        <p style="color:#7F1D1D;margin:0;font-size:13px;line-height:1.5;">
                          Ignore this email. Your password is safe.
                        </p>
                      </div>
                    </td>

                    <!-- RIGHT - OTP -->
                    <td width="55%" style="vertical-align:top;">
                      <div style="
                        background:linear-gradient(145deg,#FFF1F2 0%,#FFE4E6 100%);
                        padding:35px 25px;
                        border-radius:24px;
                        border:1px solid #FECACA;
                        box-shadow:0 15px 40px rgba(220,38,38,0.08);
                        text-align:center;
                      ">
                        <p style="color:#DC2626;margin:0 0 22px;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:800;">
                          Reset Code
                        </p>
                        <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                          <tr>
                            ${otpBoxes}
                          </tr>
                        </table>
                        <div style="
                          margin-top:24px;
                          padding-top:20px;
                          border-top:1px dashed #FCA5A5;
                        ">
                          <p style="color:#991B1B;margin:0;font-size:12px;font-weight:600;">
                            Never share this code with anyone
                          </p>
                        </div>
                      </div>

                      <!-- PASSWORD TIPS -->
                      <div style="
                        background:linear-gradient(145deg,#F8FAFC 0%,#F1F5F9 100%);
                        padding:20px;
                        border-radius:16px;
                        margin-top:14px;
                        border:1px solid #E2E8F0;
                      ">
                        <p style="color:#0F172A;margin:0 0 12px;font-size:13px;font-weight:800;">
                          Strong Password Tips
                        </p>
                        <p style="color:#64748B;margin:0 0 6px;font-size:12px;line-height:1.6;">
                          • Minimum 8 characters
                        </p>
                        <p style="color:#64748B;margin:0 0 6px;font-size:12px;line-height:1.6;">
                          • Mix of upper &amp; lowercase
                        </p>
                        <p style="color:#64748B;margin:0;font-size:12px;line-height:1.6;">
                          • Include numbers &amp; symbols
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);padding:35px 60px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <h3 style="color:#ffffff;margin:0 0 6px;font-size:20px;font-weight:900;">
                        Zameen <span style="color:#FCD34D;">360°</span>
                      </h3>
                      <p style="color:rgba(255,255,255,0.5);margin:0;font-size:12px;letter-spacing:1px;">
                        Find. Buy. Sell. Your Property Universe.
                      </p>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <p style="color:rgba(255,255,255,0.5);margin:0 0 4px;font-size:12px;">
                        <a href="mailto:support@zameen360.com" style="color:#FCD34D;text-decoration:none;font-weight:700;">support@zameen360.com</a>
                      </p>
                      <p style="color:rgba(255,255,255,0.3);margin:0;font-size:11px;">
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
  return await sendEmail(to, "Reset Your Zameen 360 Password", html);
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};