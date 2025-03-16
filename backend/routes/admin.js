const express = require("express");
const router = express.Router();
const Order = require("../model/order");
// Add this new route
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "firstName lastName email")
      .populate("games", "name gameId")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

