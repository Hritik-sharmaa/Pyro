const mongoose = require("mongoose");
require("dotenv").config();

// Connects to MongoDB and keeps retrying until it succeeds.
//
// A single failed attempt at boot (Atlas IP allow-list not updated yet, the
// database briefly unreachable, a cold start racing the network, ...) used to
// leave the server permanently without a database until someone restarted it.
//
// Pass { maxAttempts: 1 } (as the seed script does) to fail fast instead.
exports.connectToDatabase = async ({ maxAttempts = Infinity } = {}) => {
  const retryDelayMs = 5000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log("Connected to MongoDB");
      return;
    } catch (error) {
      // error.message never contains the connection string or password.
      console.error(
        `MongoDB connection attempt ${attempt} failed: ${error.message}`
      );
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
  }
};
