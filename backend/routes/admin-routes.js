const express = require("express");
const {
  getAllUsers,
  deleteUser,
  getAllGames,
  deleteGame,
  updateGamePrice,
  getAllOrders,
  updateGame  // Add this line
} = require("../controllers/admin-controller");
const { requireAdmin } = require("../middlewares/admin-middleware");
const router = express.Router();

// every admin route requires the admin password
router.use(requireAdmin);

// users routes
router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUser);

//games routes
router.get("/games", getAllGames);
router.delete("/games/:gameId", deleteGame);
router.put("/games/:gameId/price", updateGamePrice);

//orders routes
router.get("/orders", getAllOrders);
router.put('/games/:gameId', updateGame);

module.exports = router;
