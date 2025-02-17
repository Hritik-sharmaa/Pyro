const Cart = require("../model/cart");
const Game = require("../model/game");
const mongoose = require("mongoose")

const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { gameId } = req.body;

    //console.log("Received request:", { userId, gameId });

    if (!userId || !gameId) {
      return res
        .status(400)
        .json({ message: "userId and gameId are required" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.gameId.toString() === gameId
    );

    if (!existingItem) {
      cart.items.push({ gameId });
    }

    //console.log("Cart before saving:", cart);

    await cart.save();

    res.status(200).json({ message: "Game added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate("items.gameId");

    if (!cart || cart.items.length === 0) {
      return res.json({ games: [] });
    }
    console.log("Cart fetched from DB:", cart);

    const games = cart.items.map((item) => ({
      id: item.gameId._id,
      name: item.gameId.name,
      discountedPrice: item.gameId.discountedPrice,
      poster: item.gameId.poster,
    }));

    res.status(200).json({ games });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error });
  }
};


const removeFromCart = async (req, res) => {
  const { userId, gameId } = req.params;

  if (!userId || !gameId) {
    return res.status(400).json({ message: "Missing userId or gameId" });
  }

  try {
    console.log(`Removing game ${gameId} from user ${userId}`);

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Convert gameId to ObjectId before removing
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { gameId: new mongoose.Types.ObjectId(gameId) } } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Game not found in cart" });
    }

    console.log("Updated Cart:", updatedCart);
    res.json({ message: "Game removed successfully", cart: updatedCart });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};





module.exports = { addToCart, getCart, removeFromCart };
