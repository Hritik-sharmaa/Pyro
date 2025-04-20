const User = require("../model/user");
const Game = require("../model/game");
const Order = require("../model/order"); // Add this line

//getting all user
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error. Unable to fetch users." });
  }
};

// deleting a user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error. Unable to delete user." });
  }
};

//getting all the games
const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ message: "Server error. Unable to fetch games." });
  }
};

//deleting a game
const deleteGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findOneAndDelete({ gameId });

    if (!game) {
      return res.status(404).json({ message: "Game not found." });
    }

    res.status(200).json({ message: "Game deleted successfully." });
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({ message: "Server error. Unable to delete game." });
  }
};

//updating originalPrice, discountedPrice, discount
const updateGamePrice = async (req, res) => {
    try {
      const { gameId } = req.params;
      const { originalPrice, discount, discountedPrice } = req.body;
  
      const updatedGame = await Game.findOneAndUpdate(
        { gameId },
        { originalPrice, discount, discountedPrice },
        { new: true }
      );
  
      if (!updatedGame) {
        return res.status(404).json({ message: "Game not found" });
      }
  
      res.status(200).json(updatedGame);
    } catch (error) {
      res.status(500).json({ message: "Error updating game price", error });
    }
  };

//getting all orders
const getAllOrders = async (req, res) => {
  try {
    console.log("Fetching all orders...");
    const orders = await Order.find()
      .limit(100) // Limit the number of results
      .populate({
        path: "userId",
        select: "firstName lastName email",
        model: "User"
      })
      .populate({
        path: "games",
        select: "name gameId price",
        model: "Game"
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error. Unable to fetch orders." });
  }
};

//updating the games details
const updateGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const updates = req.body;
    
    const updatedGame = await Game.findOneAndUpdate(
      { gameId },
      updates,
      { new: true }
    );

    if (!updatedGame) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json(updatedGame);
  } catch (error) {
    console.error("Error updating game:", error);
    res.status(500).json({ message: "Server error. Unable to update game." });
  }
};


module.exports = {
  getAllUsers,
  deleteUser,
  getAllGames,
  deleteGame,
  updateGamePrice,
  getAllOrders, 
  updateGame, 
};
