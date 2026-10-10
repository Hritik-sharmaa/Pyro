// Public URL of the frontend, used for links we put in emails and for the
// post-Google-login redirect. Set CLIENT_URL in production; when the UI is served
// by this same server we can safely fall back to the incoming request's origin.
exports.getClientUrl = (req) => {
  const configured = process.env.CLIENT_URL;
  if (configured) return configured.trim().replace(/\/$/, "");
  return `${req.protocol}://${req.get("host")}`;
};
