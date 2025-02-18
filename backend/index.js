const express = require("express");
const path = require("path");
const { connectToDatabase } = require("./database/connectionDB");
require("dotenv").config();
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

const app = express();

app.use(express.json()); //middleware to parse json body

const assetsPath = path.join(__dirname, "../assets");
app.use("/assets", express.static(assetsPath));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//DB connection
connectToDatabase();

//fetch and store games
//fetchAndStoregame();

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

//wishlist routes
app.use("/api/wishlist", wishlistRoute);

//cart routes
app.use("/api/cart", cartRoute);

//comment routes
app.use("/api/comments", commentRoute);

//user routes
app.use("/api/user", userRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
