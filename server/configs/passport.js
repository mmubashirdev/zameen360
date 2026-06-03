// Google OAuth
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("./prisma");

const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallback = process.env.GOOGLE_CALLBACK_URL;

if (googleClientID && googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: googleCallback,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase().trim();
          const fullName = profile.displayName;
          const googleId = profile.id;
          const profilePicture = profile.photos?.[0]?.value;

          if (!email) {
            return done(new Error("No email from Google"), null);
          }

          // Check if user exists
          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            // Existing user - update Google info if needed
            if (!user.googleId) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: {
                  googleId,
                  isVerified: true,
                  profilePicture: user.profilePicture || profilePicture,
                },
              });
            }
          } else {
            // New user - create account
            user = await prisma.user.create({
              data: {
                email,
                fullName,
                googleId,
                profilePicture,
                role: "BUYER",
                isVerified: true,
                isActive: true,
                passwordHash: "",
              },
            });

            // Create profile
            await prisma.userProfile.create({
              data: {
                userId: user.id,
                profileComplete: false,
              },
            });
          }

          return done(null, user);
        } catch (error) {
          console.error("Google OAuth error:", error);
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn(
    "Google OAuth not configured: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google login."
  );
}

module.exports = passport;