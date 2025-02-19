const express = require("express");
const {
  getAllUsers,
  deleteUser,
  getAllGames,
  deleteGame,
  updateGamePrice,
} = require("../controllers/admin-controller");
const router = express.Router();

// users routes
router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUser);

//games routes
router.get("/games", getAllGames);
router.delete("/games/:gameId", deleteGame);
router.put("/games/:gameId/price", updateGamePrice);

module.exports = router;
