// Google OAuth
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("./prisma");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
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
                isVerified: true, // Google emails are verified
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
              role: "BUYER", // Default role
              isVerified: true, // Google verified
              isActive: true,
              passwordHash: "", // No password for OAuth users
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

module.exports = passport;