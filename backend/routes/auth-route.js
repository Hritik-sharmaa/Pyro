const express = require("express");
const router = express.Router();
const passport = require("passport");
const { register, login, logout, verifyEmail, forgotPassword, resetPassword } = require("../controllers/auth-controller");
const { generateJWTToken } = require("../utils/generateJWTToken");
const { getClientUrl } = require("../utils/clientUrl");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Google login is only available when GOOGLE_CLIENT_ID/SECRET are configured.
const requireGoogle = (req, res, next) =>
  passport.googleEnabled
    ? next()
    : res
        .status(503)
        .json({ message: "Google login is not configured on this server." });

// Google Login
router.get(
    "/google",
    requireGoogle,
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  // Google Callback
  router.get(
    "/google/callback",
    requireGoogle,
    (req, res, next) =>
      passport.authenticate("google", {
        failureRedirect: `${getClientUrl(req)}/login`,
        session: false,
      })(req, res, next),
    (req, res) => {
      const token = generateJWTToken(
        res,
        req.user._id,
        req.user.firstName,
        req.user.email
      );
      res.redirect(`${getClientUrl(req)}?token=${token}`);
    }
  );

module.exports = router;
