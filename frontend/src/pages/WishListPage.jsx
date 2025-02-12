import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { IoIosSearch } from "react-icons/io";
import Footer from "../components/Footer";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { IoCartOutline } from "react-icons/io5";
import { PiTrashSimple } from "react-icons/pi";
import "../styles/Common.css";

const WishlistPage = () => {
  const { userId, isAuthenticated, isCheckingAuth, setWishlistCount } =
    useAuthStore();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  useEffect(() => {
    // console.log("isAuthenticated:", isAuthenticated);
    // console.log("isCheckingAuth:", isCheckingAuth);
    // console.log("userId:", userId);
    if (isCheckingAuth) return;

    if (isAuthenticated && userId) {
      const fetchWishlist = async () => {
        try {
          console.log("Fetching wishlist...");
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/${userId}`
          );
          console.log("API response:", response.data);
          setWishlist(response.data.games || []);
          setWishlistCount(response.data.games.length);
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchWishlist();
    } else {
      console.log("User is not authenticated or no userId.");
      setLoading(false);
    }
  }, [userId, isAuthenticated, isCheckingAuth]);

  const filteredWishlist = wishlist.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveFromWishlist = async (gameId) => {
    console.log("Deleting game:", { userId, gameId });

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/remove/${userId}/${gameId}`
      );
      setWishlist((prev) => prev.filter((game) => game._id !== gameId));
      setWishlistCount(wishlist.length - 1);
      toast.success("Game removed from wishlist!");
    } catch (error) {
      console.error("Error removing game from wishlist:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="h-screen bg-[#0f1115] w-full">
      <Navbar />
      <div className=" text-white text-center py-32">
        <h1 className="text-4xl font-bold">Your Wishlist</h1>
        <p className="mt-3 text-lg">
          Browse your saved games and discover great deals!
        </p>
        <div className="max-w-7xl mx-auto mt-6 px-4">
          <div className="flex items-center justify-center">
            <div className="relative flex items-center w-full">
              <input
                type="text"
                placeholder="Search your wishlist..."
                className="w-full p-3 pl-12 rounded-lg bg-gray-700 text-white border-gray-600 focus:ring focus:ring-white focus:outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoIosSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-white text-4xl font-extrabold my-24">
          No games left in your wishlist.
        </div>
      ) : (
        <div className="px-20 bg-[#0f1115] pb-10">
          <div className="space-y-6">
            {filteredWishlist.map((gameObj) => {
              const {
                _id,
                name,
                poster,
                released,
                discountedPrice,
                tags,
                addedAt,
              } = gameObj;
              const gameKey = _id
                ? _id.toString()
                : gameObj.gameId?.toString() || Math.random();

              return (
                <div
                  key={gameKey}
                  className="flex items-center bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div className="h-48 object-contain p-3 flex items-center">
                    <div className="text-black px-3 py-2 rounded-full text-sm font-semibold">
                      {filteredWishlist.indexOf(gameObj) + 1}
                    </div>
                    {poster && (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${poster}`}
                        alt={name}
                        className="w-full h-full rounded-xl"
                      />
                    )}
                  </div>

                  <div className="p-4 flex-1 text-black flex justify-between">
                    <div className="flex flex-col justify-center items-start">
                      <h3 className="text-xl font-semibold truncate">{name}</h3>
                      <p className="text-sm mt-2 line-clamp-3">
                        Released Date: {new Date(released).toLocaleDateString()}
                      </p>
                      <p className="text-sm mt-2 line-clamp-3">
                        Added Date: {new Date(addedAt).toLocaleDateString()}
                      </p>
                      <p className="pt-5 text-xs">
                        {tags.length > 0
                          ? tags.slice(0, 5).map((tag, index) => (
                              <span
                                key={index}
                                className="border-2 border-zinc-400 px-2 py-1 mr-2 rounded">
                                {tag}
                              </span>
                            ))
                          : "No tags available"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <div className="flex gap-2 items-center text-center bg-zinc-200 p-2 rounded">
                        <div className="text-xl font-semibold mr-2">
                          {discountedPrice
                            ? `₹${discountedPrice.toLocaleString()}`
                            : "Price Unavailable"}
                        </div>
                        <button className="bg-[#0f1115] text-white px-4 py-3 rounded-lg text-sm hover:bg-black transition-colors duration-300 flex gap-2">
                          Add to Cart <IoCartOutline size={22} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveFromWishlist(_id)}
                        className="border-red-500 border text-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-500 hover:text-white transition-colors duration-300 flex gap-2">
                        Remove <PiTrashSimple size={22} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default WishlistPage;
