import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Common.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SeeAllButton from "./SeeAllButton";
import WishlistButton from "./WishlistButton";

const FlashSale = () => {
  const [games, setGames] = useState([]);

  // Fetch flash sale games from backend
  useEffect(() => {
    const fetchFlashSaleGames = async () => {
      try {
        const response = await axios.get("/api/flash-sale");
        console.log("response: ", response.data)

        // Validate response format
        if (response.data && Array.isArray(response.data)) {
          setGames(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching flash sale games:", error.message);
      }
    };

    fetchFlashSaleGames();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };
  return (
    <div className="bg-[#0f1115] text-white py-10 px-20 w-full h-full font">
      <h2 className="text-4xl font-bold mb-7 flex items-center ">
        Flash Sale {<SeeAllButton route="/flash-sale" />}
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2 }}
        className="grid grid-cols-5 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {games.map((game) => (
          <motion.div
            key={game._id}
            variants={itemVariants}
            className="relative overflow-hidden group">
            <Link to={`/games/${game._id}`}>
              <div className="relative w-full h-[25rem]">
                <img
                  src={game.poster}
                  alt={game.name}
                  className="object-cover w-full h-full group-hover:brightness-[45%] transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </Link>
            <WishlistButton game={game} />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-90 p-4">
              <h3 className="text-sm font-semibold truncate">{game.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-[#66CC41] text-[#294700] text-lg px-1 py- font-bold">
                  -{game.discount}%
                </span>
                <span className="text-white line-through text-sm">
                  ₹{game.originalPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-white">
                  ₹{game.discountedPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FlashSale;
