import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import Navbar from "../components/Navbar";
import "../styles/Common.css";
import Footer from "../components/Footer";
import { PiTrashSimple } from "react-icons/pi";
import { FiShoppingBag, FiArrowRight, FiShoppingCart } from "react-icons/fi";
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
    }, 1500);
  }, [userId]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/${userId}`,
        {
          withCredentials: true,
        }
      );

      setCartItems(response.data.games || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (gameId) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/cart/remove/${userId}/${gameId}`,
        {
          withCredentials: true,
        }
      );

      setCartItems(cartItems.filter((game) => game.id !== gameId));
    } catch (error) {
      console.error("Error removing game:", error);
    }
  };

  const getTotalPrice = () => {
    const totalAmt = cartItems.reduce(
      (total, game) => total + Number(game.discountedPrice || 0),
      0
    );
    return totalAmt.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1115] to-[#1a1d24] text-white font-sans">
      <Navbar />

      <div className="container mx-auto pt-28 pb-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <div className="bg-[#0f1115] rounded-full p-3">
              <FiShoppingCart className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-5xl font-bold ml-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Your Cart
            </h1>
          </div>

          {loading ? (
            <WishListLoader />
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="bg-[#1e2128] rounded-2xl p-10 shadow-lg max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-gray-400 mb-8">
                  Looks like you haven't added any games to your cart yet.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-medium transition-all hover:opacity-90">
                  Browse Games
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-white text-black rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="bg-indigo-600 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-sm">
                    {cartItems.length}
                  </span>
                  {cartItems.length === 1 ? "Game" : "Games"} in your cart
                </h2>

                <div className="space-y-4">
                  {cartItems.map((game, index) => (
                    <div
                      key={game.id || index}
                      className="flex flex-col sm:flex-row items-center bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(79,70,229,0.15)]">
                      <div className="sm:w-32 overflow-hidden flex-shrink-0 ml-5">
                        <img
                          src={
                            game.poster
                              ? `${import.meta.env.VITE_BACKEND_URL}${
                                  game.poster
                                }`
                              : "/placeholder.svg"
                          }
                          alt={game.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="p-4 flex-1">
                        <h3 className="text-xl font-bold mb-1 line-clamp-1">
                          {game.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Added on {new Date().toLocaleDateString()}
                        </p>
                      </div>

                      <div className="p-4 flex flex-col sm:items-end gap-3">
                        <div className="px-4 py-2 bg-gray-800 rounded-lg">
                          <span className="text-lg font-bold text-green-400">
                            ₹{game.discountedPrice.toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromCart(game.id)}
                          className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                          <PiTrashSimple size={18} />
                          <span className="text-sm font-medium">Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white text-black rounded-xl overflow-hidden shadow-lg">
                <div className="p-6 border-b border-gray-800">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>

                    <div className="border-t border-gray-800 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Total</span>
                        <span className="text-2xl font-bold text-green-400">
                          ₹{getTotalPrice()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
                  <button
                    onClick={() =>
                      navigate("/orders", { state: { cartItems } })
                    }
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 text-white">
                    <span>Proceed to Checkout</span>
                    <FiArrowRight className="w-5 h-5" />
                  </button>

                  <div className="mt-4 text-center text-sm text-black">
                    Secure checkout powered by our payment partners
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
