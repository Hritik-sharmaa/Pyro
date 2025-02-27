const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  games: [
    {
      id: String,
      name: String,
      poster: String,
      discountedPrice: Number,
    },
  ],
  totalAmount: Number,
  paymentMethod: { type: String, enum: ["card", "gpay", "phonepe"], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
