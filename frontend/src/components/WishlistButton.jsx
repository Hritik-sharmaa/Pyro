import React from "react";
import { FiPlusCircle } from "react-icons/fi";
import { useWishlistStore } from "../store/wishlistStore";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import axios from "axios";

const WishlistButton = ({ game }) => {
  const userId = useAuthStore((state) => state.userId);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);

  const handleAddToWishlist = (game) => {
    if (userId) {
      addToWishlist(game);
      //const payload = { userId, gameId: game._id };
      //console.log("Adding game to wishlist:", payload);
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/wishlist/add/${userId}`, {
          gameId: game._id,
        })

        .then((res) => {
          toast.success("Game added to wishlist!");
          //console.log("Game added to wishlist: ", res.data);
        })
        .catch((err) => {
          console.error(
            "Error adding to wishlist: ",
            err.response?.data || err.message
          );
        });
    } else {
      toast.error("Please log in to add to your wishlist");
    }
  };
  return (
    <button
      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 bg-black text-white p-2 rounded-full transition-opacity duration-300 z-50"
      title="Add to Wishlist"
      onClick={() => handleAddToWishlist(game)}>
      <FiPlusCircle size={24} />
    </button>
  );
};

export default WishlistButton;
