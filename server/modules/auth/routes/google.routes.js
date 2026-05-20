const router = require("express").Router();
const passport = require("../../../configs/passport");
const { generateAccessToken, generateRefreshToken } = require("../../../utils/generateToken");
const prisma = require("../../../configs/prisma");


router.get( "/google", passport.authenticate("google", {scope: ["profile", "email"],
    session: false,
  })
);

// ─── Google OAuth Callback ────────────────────────────────────────────────────

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  async (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        return res.redirect(
          `${process.env.CLIENT_URL}/login?error=no_user`
        );
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

      // Redirect to frontend with token
      const redirectUrl = `${process.env.CLIENT_URL}/auth/google/callback?token=${accessToken}&refreshToken=${refreshToken}`;
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=callback_failed`);
    }
  }
);

module.exports = router;