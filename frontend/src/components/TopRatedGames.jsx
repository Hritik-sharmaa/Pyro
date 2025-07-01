import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SeeAllButton from "./SeeAllButton";
import WishlistButton from "./WishlistButton";
import { Link } from "react-router-dom";

const TopRatedGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Top Rated Games
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/top-rated`)
      .then((response) => {
        setGames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching top-rated games:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-white text-center py-10">Loading...</div>;
  }
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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };
  return (
    <div className="text-white bg-[#0f1115] w-full h-full px-20 py-10 font ">
      <h2 className="text-4xl font-bold mb-7 flex items-center">
        Top rated {<SeeAllButton route="/top-rated" />}
      </h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, amount: 0.2 }}>
        {games.map((game) => (
          <motion.div
            key={game._id}
            className="bg-white text-black rounded-md overflow-hidden shadow-lg h-[230px] group"
            variants={itemVariants}>
            <Link to={`/games/${game._id}`}>
              <div
                className="h-[180px] bg-cover bg-center cursor-pointer group-hover:brightness-[45%] relative"
                style={{ backgroundImage: `url(${game.poster})` }}>
                <WishlistButton game={game} />
              </div>
            </Link>

            <div className="pl-4 p-1 relative h-[50px]">
              <h3 className="text-sm font-bold">{game.name}</h3>
              <p className="text-xs text-red-600">{game.rating}/5</p>
              <div className="absolute right-[4.7rem] top-0 bg-[#66CC41] text-[#294700] py-1 px-3 transition mt-2 font-bold ">
                -{game.discount}%
              </div>
              <div className="absolute right-2 top-0 bg-black text-white px-4 transition mt-2 text-xs">
                ₹{game.discountedPrice.toLocaleString("en-IN")}
                <br />
                <p className="text-[8px] line-through text-center">
                  ₹{game.originalPrice.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TopRatedGames;
