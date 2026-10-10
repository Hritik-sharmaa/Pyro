// One-off maintenance script. Run it from the repo root:
//
//   npm run seed            # import ~200 games from RAWG into an empty database
//   npm run seed:posters    # only (re)write poster paths on games already in the DB
//
// Needs MONGO_URI, and for `seed` also RAWG_API_KEY and BASE_URL
// (https://api.rawg.io/api/games). Safe to re-run: existing games are skipped.
require("dotenv").config();
const mongoose = require("mongoose");
const { connectToDatabase } = require("../database/connectionDB");
const {
  fetchAndStoregame,
  updatePosters,
} = require("../controllers/game-controller");

const postersOnly = process.argv.includes("--posters-only");

(async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set.");
    process.exit(1);
  }
  if (!postersOnly && (!process.env.RAWG_API_KEY || !process.env.BASE_URL)) {
    console.error("RAWG_API_KEY and BASE_URL must be set to import games.");
    process.exit(1);
  }

  await connectToDatabase({ maxAttempts: 1 });
  if (mongoose.connection.readyState !== 1) {
    console.error("Could not connect to MongoDB; aborting.");
    process.exit(1);
  }

  if (postersOnly) {
    await updatePosters();
  } else {
    await fetchAndStoregame();
  }

  await mongoose.disconnect();
  console.log("Done.");
})();
