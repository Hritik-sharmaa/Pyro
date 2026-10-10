require("dotenv").config();
const fs = require("fs");
const express = require("express");
const path = require("path");
const { connectToDatabase } = require("./database/connectionDB");
const authRoutes = require("./routes/auth-route");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("./utils/passport-config");
const carouselRoute = require("./routes/carousel-route");
const {
  fetchAndStoregame,
  fetchTopRatedGames,
  fetchFlashSaleGames,
  fetchUnder500Games,
  fetchUnder1000Games,
  fetchGamesByGenre,
  fetchBrowseGames,
  fetchSearchGames,
  fetchGameDetails,
} = require("./controllers/game-controller");
const gameRoute = require("./routes/game-route");
const topRatedGames = require("./routes/top-rated-games");
const flashSale = require("./routes/flash-sale-games");
const underGames = require("./routes/under-games");
const wishlistRoute = require("./routes/wishlist-routes");
const { getUserProfile } = require("./controllers/user-controller");
const userRoute = require("./routes/user-routes");
const cartRoute = require("./routes/cart-routes");
const commentRoute = require("./routes/comment-routes");
const adminRoute = require("./routes/admin-routes");
const orderRoute = require("./routes/order-routes");

// Fail fast with a readable message instead of a cryptic crash later.
const missing = ["MONGO_URI", "JWT_SECRET"].filter((k) => !process.env[k]);
if (missing.length) {
  console.error(
    `Missing required environment variable(s): ${missing.join(", ")}. ` +
      "Set them in your hosting platform's dashboard (or in a local .env file)."
  );
  process.exit(1);
}

const app = express();
const isProduction = process.env.NODE_ENV === "production";

// Hosting platforms (Render, Railway, Fly, Heroku, ...) terminate TLS in a proxy.
// Without this, req.protocol is "http" and Google OAuth builds a wrong callback URL.
app.set("trust proxy", 1);

app.use(express.json()); //middleware to parse json body

// Game posters (JPG/WEBP/AVIF) live in <repo>/assets and are served at /assets/...
const assetsPath = path.join(__dirname, "..", "assets");
app.use("/assets", express.static(assetsPath));

// Allowed browser origins. Not needed when the UI is served by this same server
// (same origin), but required when the frontend is hosted separately.
// CLIENT_URL = the frontend's URL; CORS_ORIGINS = optional extra comma-separated URLs.
const allowedOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CORS_ORIGINS || "").split(","),
  "http://localhost:5173",
]
  .map((o) => (o || "").trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) =>
      callback(null, !origin || allowedOrigins.includes(origin)),
    credentials: true,
  })
);

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: isProduction, sameSite: "lax" },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//DB connection
connectToDatabase();

//fetch and store games
//fetchAndStoregame();  // seeding now lives in `npm run seed` (backend/scripts/seed.js)

// health check for hosting platforms
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));

//middlewares
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoute);
app.use("/api/carousel", carouselRoute);
app.use("/api/top-rated", topRatedGames); //for home page to show only 6 games
app.use("/api/flash-sale", flashSale);
app.use("/api/games/under-price", underGames);

//search routes
app.use("/api/games/search", fetchSearchGames);

//games routes
app.use("/api/games/top-rated", fetchTopRatedGames);
app.use("/api/games/flash-sale", fetchFlashSaleGames);
app.use("/api/games/under-price-500", fetchUnder500Games);
app.use("/api/games/under-price-1000", fetchUnder1000Games);
app.use("/api/games/browse-games", fetchBrowseGames);
app.use("/api/games/genre/:genre", fetchGamesByGenre);
app.use("/api/games/:gameId", fetchGameDetails);

//payment routes
// app.use("/api/orders", orderRoutes);
// app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoute);

//wishlist routes
app.use("/api/wishlist", wishlistRoute);

//cart routes
app.use("/api/cart", cartRoute);

//comment routes
app.use("/api/comments", commentRoute);

//user routes
app.use("/api/user", userRoute);

//admin routes
app.use("/api/admin", adminRoute);

// Serve the built React app (frontend/dist) from this same server, so one
// deployment hosts both UI and API. Skipped when the frontend isn't built
// (e.g. local dev, where Vite serves the UI on :5173).
const clientDist = path.join(__dirname, "..", "frontend", "dist");
if (fs.existsSync(path.join(clientDist, "index.html"))) {
  app.use(express.static(clientDist));
  // SPA fallback: any non-API, non-file GET returns index.html so that
  // client-side routes like /games/123 survive a refresh.
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/") || path.extname(req.path)) return next();
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// Platforms inject the port to listen on via PORT.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
