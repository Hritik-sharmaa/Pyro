const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/user"); // Adjust path based on your project structure

// Google login is optional: the strategy constructor throws without credentials,
// which would otherwise crash the whole server at startup.
const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

if (googleEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // Relative by default (resolved against the request host, needs "trust proxy").
        // Set GOOGLE_CALLBACK_URL to an absolute URL to pin it explicitly.
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            // If not, create a new user
            user = await User.create({
              firstName: profile.name.givenName,
              lastName: profile.name.familyName || "",
              email: profile.emails[0].value,
              googleId: profile.id,
              isVerified: true, // Google accounts are inherently verified
            });
          }

          return done(null, user);
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn(
    "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set - Google login is disabled."
  );
}

passport.googleEnabled = googleEnabled;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
