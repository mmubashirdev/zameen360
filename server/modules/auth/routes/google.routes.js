const router = require("express").Router();
const passport = require("../../../configs/passport");
const { generateAccessToken, generateRefreshToken } = require("../../../utils/generateToken");
const prisma = require("../../../configs/prisma");

const getBackendBaseUrl = (req, fallback) => {
  const configuredUrl = process.env.PUBLIC_URL || process.env.NGROK_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const forwardedProto = req.headers["x-forwarded-proto"]?.split(",")[0]?.trim();
  const proto = forwardedProto || req.protocol || "http";
  const forwardedHost = req.headers["x-forwarded-host"]?.split(",")[0]?.trim();
  const host = forwardedHost || req.headers.host;

  if (host) {
    return `${proto}://${host}`;
  }

  return fallback;
};

const getGoogleCallbackUrl = (req) => {
  if (process.env.GOOGLE_CALLBACK_URL) {
    return process.env.GOOGLE_CALLBACK_URL;
  }
  const baseUrl = getBackendBaseUrl(req, "http://localhost:5000");
  return `${baseUrl.replace(/\/$/, "")}/api/auth/google/callback`;
};

router.get("/google", (req, res, next) => {
  const callbackURL = getGoogleCallbackUrl(req);
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    callbackURL,
  })(req, res, next);
});

// ─── Google OAuth Callback ────────────────────────────────────────────────────

router.get(
  "/google/callback",
  (req, res, next) => {
    const callbackURL = getGoogleCallbackUrl(req);
    const frontendBaseUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
    const failureRedirect = `${frontendBaseUrl}/login?error=google_failed`;

    passport.authenticate("google", {
      session: false,
      callbackURL,
      failureRedirect,
    })(req, res, next);
  },
  async (req, res) => {
    try {
      const user = req.user;
      const frontendBaseUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

      if (!user) {
        return res.redirect(`${frontendBaseUrl}/login?error=no_user`);
      }

      // Generate JWT tokens
      const accessToken = generateAccessToken(user.id, user.role);
      const refreshToken = generateRefreshToken(user.id, user.role);

      // Create session
      await prisma.userSession.create({
        data: {
          userId: user.id,
          sessionToken: accessToken,
          deviceType: "google_oauth",
          browser: req.headers["user-agent"] || "unknown",
          ipAddress: req.ip || "unknown",
          isActive: true,
        },
      });

      // Activity log
      await prisma.userActivityLog.create({
        data: {
          userId: user.id,
          action: "GOOGLE_LOGIN",
          description: "Logged in via Google OAuth",
          ipAddress: req.ip || "unknown",
          status: "SUCCESS",
        },
      });

      // Update last login
      await prisma.userProfile.updateMany({
        where: { userId: user.id },
        data: { lastLogin: new Date() },
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/api/auth/refresh",
        maxAge: 15 * 60 * 1000,
      });

      // Redirect to frontend without token in URL
      const redirectUrl = `${frontendBaseUrl}/auth/google/callback?success=true`;

      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Google callback error:", error);
      const frontendBaseUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
      res.redirect(`${frontendBaseUrl}/login?error=callback_failed`);
    }
  }
);

module.exports = router;