import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import "../styles/Slider.css";
import { useWishlistStore } from "../store/wishlistStore";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const GameSlider = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = useAuthStore((state) => state.userId);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);

  useEffect(() => {
    axios
      .get("/api/carousel")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setGames(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching games:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const settings = {
    dots: true,
    dotsClass: "slick-dots custom-dots",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  if (loading) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  if (games.length === 0) {
    return (
      <div className="text-white text-center py-20">No games available</div>
    );
  }
  const handleAddToWishlist = (game, event) => {
    event.stopPropagation();
    if (userId) {
      addToWishlist(game);
      const payload = { userId, gameId: game._id };
      //console.log("Adding game to wishlist:", payload);
      axios
        .post(`http://${process.env.BACKEND_URL}/api/wishlist/add/${userId}`, {
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
    <div className="w-full h-full overflow-hidden bg-[#0f1115] z-10">
      <Slider {...settings}>
        {games.map((game) => (
          <div key={game._id} className="relative w-full h-[750px]">
            {/* {console.log(game.poster)}  */}
            <Link to={`/games/${game._id}`}>
              <motion.div
                className="absolute inset-0 bg-cover bg-center "
                style={{
                  backgroundImage: `url(${game.poster})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center center",
                  backgroundSize: "cover",
                  filter: "brightness(25%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}></motion.div>

              <motion.div
                className="absolute inset-0 flex flex-col items-start justify-center px-20 text-white z-10"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 1 }}>
                <motion.h1
                  className="text-5xl font-extrabold mb-4"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}>
                  {game.name}
                </motion.h1>
                <motion.p
                  className="mb-6 max-w-[700px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}>
                  {game.description?.length > 150
                    ? `${game.description.substring(0, 200)}...`
                    : game.description}
                </motion.p>
                <motion.div
                  className="flex gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="bg-pink-500 text-black px-6 py-2 rounded-md font-semibold hover:bg-pink-600 transition-all ease-out">
                    Buy Now
                  </motion.button>
                  <motion.button
                    className="border border-white px-6 py-2 rounded-md font-semibold hover:bg-white hover:text-black transition-all ease-in"
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) => handleAddToWishlist(game, e)}>
                    <motion.span
                      className="text-xl"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      style={{ display: "inline-block" }}>
                      +
                    </motion.span>{" "}
                    Wishlist
                  </motion.button>
                </motion.div>
              </motion.div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default GameSlider;
