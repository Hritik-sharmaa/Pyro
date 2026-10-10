const crypto = require("crypto");

// Guards /api/admin/*. The dashboard sends the admin password in the
// `x-admin-password` header; it is compared against ADMIN_PASSWORD on the server,
// so the secret never ships inside the frontend bundle.
const requireAdmin = (req, res, next) => {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return res
      .status(503)
      .json({ message: "Admin access is disabled: ADMIN_PASSWORD is not set." });
  }

  const provided = String(req.headers["x-admin-password"] || "");
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!ok) {
    return res.status(401).json({ message: "Invalid admin password." });
  }
  next();
};

module.exports = { requireAdmin };
