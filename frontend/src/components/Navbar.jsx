import React from "react";
import "../styles/Common.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { IoIosHeartEmpty } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { useAuthStore } from "../store/authStore";
import { RiArrowDropDownLine } from "react-icons/ri";
import axios from "axios";

const Navbar = () => {
  const { user, isAuthenticated, checkAuth, logout, wishlistCount } =
    useAuthStore((state) => state);
  const [searchVisible, setSearchVisible] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [active, setActive] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    setActive(!active);
    setSearchQuery("");
    setSuggestions([]);
  };

  const fetchSuggestions = useCallback(async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      console.log("Clearing suggestions");
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/games/search`,
        { params: { q: query } }
      );
      console.log("Full API Response:", response.data);
      setSuggestions(response.data.games || []);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const delayDebounce = setTimeout(() => {
        fetchSuggestions(searchQuery);
      }, 300);
      return () => clearTimeout(delayDebounce);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
    }
    checkAuth();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setScrollingDown(true);
      } else {
        setScrollingDown(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div>
      <nav
        className={`flex items-center justify-between w-full h-[80px] bg-black px-20 text-white fixed left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          scrollingDown ? "-translate-y-full" : "translate-y-0"
        }`}>
        <div className="flex items-center gap-10">
          <Link to="/">
            <h1 className="text-3xl font-bold text-[#FF4438] logo">Pyro</h1>
          </Link>
          <ul className="flex items-center gap-8 text-lg font-thin">
            <motion.li
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer ${
                location.pathname === "/" ? "font-extrabold" : ""
              }`}>
              <Link to="/">Home</Link>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer ${
                location.pathname === "/browse-games" ? "font-extrabold" : ""
              }`}>
              <Link to="/browse-games">Browse</Link>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer ${
                location.pathname === "/about-us" ? "font-extrabold" : ""
              }`}>
              <Link to="/about-us">About Us</Link>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer ${
                location.pathname === "/free-games" ? "font-extrabold" : ""
              }`}>
              <Link to="/free-games">Play Games</Link>
            </motion.li>
          </ul>
        </div>

        <div className="flex items-center gap-6">
          <motion.button
            onClick={toggleSearch}
            className={`relative ${active ? "text-[#DCFF1E]" : ""}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}>
            <CiSearch size={28} />
          </motion.button>

          <div
            className={`absolute top-5 right-[28rem] w-[20rem] transition-all duration-300 ease-in-out ${
              searchVisible ? "block" : "hidden"
            }`}>
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border border-zinc-700 outline-none p-2 pl-5 rounded-2xl text-white"
            />
            {suggestions && suggestions.length > 0 && (
              <ul className="absolute w-full bg-black border border-zinc-700 z-50 mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((game) => (
                  <Link to={`/games/${game._id}`} key={game._id}>
                    <li
                      key={game._id}
                      className="p-2 hover:bg-zinc-800 cursor-pointer flex items-center gap-3">
                      <img
                        src={game.poster}
                        alt={game.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span>{game.name}</span>
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </div>

          <motion.button
            className=""
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}>
            <Link to="/cart">
              <IoCartOutline size={28} />
            </Link>
          </motion.button>

          <motion.button
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}>
            <Link to="/wishlist" className="relative">
              <IoIosHeartEmpty size={28} />
              {wishlistCount > 0 && (
                <span className="absolute bottom-4 left-1 bg-red-500 text-white text-sm rounded w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </motion.button>

          {isAuthenticated ? (
            <div className="relative">
              <motion.div
                className="flex items-center gap-1 text-lg text-[#DCFF1E] cursor-pointer bg-black px-3 py-1 rounded-md"
                onClick={handleDropdownToggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}>
                hello, {user?.firstName || "Guest"}
                <RiArrowDropDownLine size={20} />
              </motion.div>
              {showDropdown && (
                <motion.div
                  className="absolute top-12 left-0 w-full bg-black border-none rounded-md px-4 py-3 shadow-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}>
                  <span className="cursor-pointer hover:text-[#DCFF1E] transition-all ease-in text-lg">
                    <Link to="/profile">Profile</Link>
                  </span>
                  <button
                    className="w-full text-center text-black bg-[#DCFF1E] font-bold p-2 rounded mt-3 hover:bg-[#9ab022]"
                    onClick={handleLogout}>
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#DCFF1E] text-black font-semibold px-4 py-2 rounded-md hover:bg-[#bad524]"
              onClick={() => navigate("/login")}>
              Login
            </motion.button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
