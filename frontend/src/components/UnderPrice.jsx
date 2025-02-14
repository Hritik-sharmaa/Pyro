import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiFillWindows } from "react-icons/ai";
import { FaApple } from "react-icons/fa";
import "../styles/Common.css";
import { motion } from "framer-motion";
import SeeAllButton from "./SeeAllButton";
import WishlistButton from "./WishlistButton";
import { Link } from "react-router-dom";

const UnderPrice = () => {
  const [under500, setUnder500] = useState([]);
  const [under1000, setUnder1000] = useState([]);

  useEffect(() => {
    // Fetch games under ₹500
    const fetchUnder500 = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/games/under-price/500`
        );
        setUnder500(response.data);
        //console.log("data: ", response.data)
        console.log("Response:", response); // Check full response
        console.log("Data:", response.data);
      } catch (error) {
        console.error("Error fetching games under ₹500:", error.message);
      }
    };

    // Fetch games under ₹1000
    const fetchUnder1000 = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/games/under-price/1000`
        );
        setUnder1000(response.data);
      } catch (error) {
        console.error("Error fetching games under ₹1000:", error.message);
      }
    };

    fetchUnder500();
    fetchUnder1000();
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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const renderGames = (games) =>
    games.map((game) => (
      <motion.div
        key={game._id}
        className="relative bg-white text-black p-2 rounded-lg group transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
        variants={itemVariants}>
        <Link to={`/games/${game._id}`}>
          <img
            src={game.poster}
            alt={game.name}
            className="w-full h-[150px] object-cover rounded-t-lg group-hover:brightness-[45%] relative"
          />
        </Link>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-sm font-semibold">{game.name}</p>
          <div className="flex gap-1">
            {<AiFillWindows />}
            {<FaApple />}
          </div>
        </div>
        <p className="text-[#66CC41] text-sm mt-1 font-bold">
          ₹{game.discountedPrice.toLocaleString("en-IN")}
        </p>
        <WishlistButton game={game} />
      </motion.div>
    ));

  return (
    <div className="bg-[#0f1115] text-white py-10 px-20 font">
      <div className="flex items-center mb-7">
        <h2 className="text-2xl font-bold">Under ₹500</h2>
        <SeeAllButton route="/under-price-500" />
      </div>
      <motion.div
        className="grid grid-cols-4 gap-4"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, amount: 0.2 }}>
        {renderGames(under500)}
      </motion.div>

      <div className="flex items-center my-7">
        <h2 className="text-2xl font-bold">Under ₹1000</h2>
        <SeeAllButton route="/under-price-1000" />
      </div>
      <motion.div
        className="grid grid-cols-4 gap-4"
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, amount: 0.2 }}>
        {renderGames(under1000)}
      </motion.div>
    </div>
  );
};

export default UnderPrice;
