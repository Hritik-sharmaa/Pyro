const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  games: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  ],
  totalAmount: Number,
  paymentMethod: {
    type: String,
    enum: ["card", "gpay", "phonepe"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
