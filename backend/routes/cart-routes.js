const express = require("express");
const {
  addToCart,
  getCart,
  removeFromCart,
} = require("../controllers/cart-controller");
const router = express.Router();

router.post("/add/:userId", addToCart);
router.get("/:userId", getCart);
router.delete("/remove/:userId/:gameId", removeFromCart);

module.exports = router;
