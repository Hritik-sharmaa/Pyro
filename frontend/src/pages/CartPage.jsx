import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import Navbar from "../components/Navbar";
import "../styles/Common.css";
import Footer from "../components/Footer";
import { PiTrashSimple } from "react-icons/pi";
import WishListLoader from "../skeletonLoader/WishListLoader";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { userId, checkAuth } = useAuthStore();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      checkAuth();
      return;
    }
    setTimeout(() => {
      fetchCart();
    }, 3000);
  }, [userId]);

  const fetchCart = async () => {
    try {
      //    console.log("Fetching cart for user:", userId);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/${userId}`,
        { withCredentials: true }
      );

      //      console.log("Cart Response:", response.data);

      setCartItems(response.data.games || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (gameId) => {
    //console.log(`Attempting to remove game: ${gameId} for user: ${userId}`);

    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/cart/remove/${userId}/${gameId}`,
        { withCredentials: true }
      );
      //console.log("Remove response:", response.data);

      setCartItems(cartItems.filter((game) => game.id !== gameId));
    } catch (error) {
      console.error("Error removing game:", error);
    }
  };

  const getTotalPrice = () => {
    let totalAmt = cartItems.reduce(
      (total, game) => total + Number(game.discountedPrice || 0),
      0
    );
    return totalAmt.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-white font">
      <Navbar />
      <div className="pt-28 py-10 px-20">
        <h1 className="text-3xl font-bold text-center mb-16">Your Cart</h1>

        {loading ? (
          <WishListLoader />
        ) : cartItems.length === 0 ? (
          <p className="text-lg text-center">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((game, index) => (
              <div
                key={game.id || index}
                className="flex flex-col md:flex-row items-center bg-white text-black p-3 rounded-lg shadow-md">
                <img
                  src={game.poster}
                  alt={game.name}
                  className="h-[9rem] rounded-xl object-cover"
                />

                <div className="ml-4 flex-1 text-black">
                  <h2 className="text-3xl font-bold mb-1">{game.name}</h2>
                  <p className="text-sm">
                    Added Date: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2 mr-4">
                  <div className="flex gap-2 items-center text-center bg-zinc-200 px-6 py-2 rounded">
                    <div className="text-lg font-semibold mr-1">
                      ₹{game.discountedPrice.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(game.id)}
                    className="border-red-500 border text-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-500 hover:text-white transition-colors duration-300 flex gap-2">
                    Remove <PiTrashSimple size={22} />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-6 bg-zinc-900 text-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold">
                Total Amount:
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-green-400">
                ₹{getTotalPrice()}
              </p>
            </div>

            <button
              onClick={() => navigate("/orders", { state: { cartItems } })}
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-lg py-3 rounded-lg shadow-lg transition-all duration-300">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
