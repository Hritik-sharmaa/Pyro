const Order = require("../model/order.js");
const Cart = require("../model/cart.js");
const mongoose = require("mongoose");

const checkOut = async (req, res) => {
  try {
    const { userId, paymentMethod } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const cart = await Cart.findOne({ userId: objectUserId }).populate(
      "items.gameId"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.gameId.discountedPrice || 0);
    }, 0);

    const newOrder = new Order({
      userId,
      games: cart.items.map((item) => ({
        _id: item.gameId._id.toString(),
        name: item.gameId.name,
        poster: item.gameId.poster,
        discountedPrice: item.gameId.discountedPrice,
      })),
      totalAmount,
      paymentMethod,
    });

    await newOrder.save();

    await Cart.findOneAndDelete({ userId });

    res.json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Checkout Error:", error);
    res
      .status(500)
      .json({ error: "Error processing order", details: error.message });
  }
};

const getUserOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    const orders = await Order.find({ userId }).populate({
      path: "games",
      select: "name poster discountedPrice" 
    })
    .lean() 
    .exec();
;
    // console.log("Orders with populated games:", JSON.stringify(orders, null, 2));
    // console.log("orders sent to frontend: ", orders);
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching orders", details: error.message });
  }
};

module.exports = { checkOut, getUserOrder };
