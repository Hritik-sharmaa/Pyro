import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Common.css";
import axios from "axios";
import { MdSort, MdFilterList } from "react-icons/md";
import Footer from "../components/Footer";
import { TbSortAscendingLetters } from "react-icons/tb";
import { AiOutlineSortDescending } from "react-icons/ai";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoGameControllerOutline } from "react-icons/io5";
import WishlistButton from "../components/WishlistButton";
import { Link } from "react-router-dom";
import BrowseLoader from "../skeletonLoader/BrowseLoader";

const BrowseGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalGames, setTotalGames] = useState(0);
  const [sortOption, setSortOption] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");

  const gamesPerPage = 20;

  // Fetch games with pagination and sorting
  const fetchGames = async (page, sortField, order) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/games/browse-games`,
        {
          params: {
            page,
            limit: gamesPerPage,
            sort: sortField,
            order,
          },
        }
      );
      setTimeout(() => {
        setGames(response.data.games);
        setTotalGames(response.data.totalGames);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error("Error fetching browse games:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames(currentPage, sortOption, sortOrder);
  }, [currentPage, sortOption, sortOrder]);

  const totalPages = Math.ceil(totalGames / gamesPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  // Calculate visible page numbers for pagination
  const getVisiblePageNumbers = () => {
    const delta = 2; // Number of pages to show before and after current page
    const range = [];

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add first page if not already in range
    if (range[0] > 1) {
      if (range[0] > 2) {
        range.unshift("...");
      }
      range.unshift(1);
    }

    // Add last page if not already in range
    if (range[range.length - 1] < totalPages) {
      if (range[range.length - 1] < totalPages - 1) {
        range.push("...");
      }
      range.push(totalPages);
    }

    return range;
  };

  // Function to render star ratings
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-400" />);
      }
    }

    return stars;
  };

  // Calculate discount percentage
  const calculateDiscount = (original, discounted) => {
    return Math.round(((original - discounted) / original) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1115] to-[#161a23] font text-white">
      <Navbar />

      <div className="relative pt-20 pb-10 px-4 md:px-8 lg:px-20">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-900/20 to-blue-900/20 blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 mt-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-2 bg-[#66CC41] rounded-full"></div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Browse Games
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 p-3 bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800/50">
              <div className="flex items-center">
                <MdSort size={20} className="mr-2 text-[#66CC41]" />
                <span className="text-sm text-gray-300">Sort:</span>
              </div>

              <select
                className="bg-gray-800 text-white text-sm py-2 px-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#66CC41]/50"
                value={sortOption}
                onChange={handleSortChange}>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
                <option value="released">Release Date</option>
                <option value="lowest-price">Lowest Price</option>
                <option value="highest-price">Highest Price</option>
              </select>

              <button
                className="flex items-center gap-2 py-2 px-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors duration-200"
                onClick={toggleSortOrder}>
                {sortOrder === "asc" ? (
                  <>
                    <TbSortAscendingLetters size={18} />
                    <span className="text-sm hidden sm:inline">Ascending</span>
                  </>
                ) : (
                  <>
                    <AiOutlineSortDescending size={18} />
                    <span className="text-sm hidden sm:inline">Descending</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {loading ? (
            <BrowseLoader />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {games.map((game) => (
                  <div
                    key={game._id}
                    className="group relative bg-gradient-to-b from-gray-800/80 to-gray-900/80 rounded-xl overflow-hidden shadow-lg hover:shadow-[#66CC41]/20 border border-gray-800/50 hover:border-[#66CC41]/30 transition-all duration-300 hover:-translate-y-1">
                    <Link
                      to={`/games/${game._id}`}
                      className="block relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 z-10"></div>
                      <img
                        src={game.poster || "/placeholder.svg"}
                        alt={game.name}
                        className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <div className="flex items-center gap-1 mb-1">
                          {renderRating(game.rating)}
                          <span className="ml-1 text-sm font-medium">
                            {game.rating}/5
                          </span>
                        </div>
                      </div>

                      {game.originalPrice > game.discountedPrice && (
                        <div className="absolute top-3 right-3 bg-[#66CC41] text-black font-bold px-2 py-1 rounded-md z-20 shadow-lg">
                          -
                          {calculateDiscount(
                            game.originalPrice,
                            game.discountedPrice
                          )}
                          %
                        </div>
                      )}
                    </Link>

                    <div className="absolute top-3 left-3 z-20">
                      <WishlistButton game={game} />
                    </div>

                    <div className="p-4">
                      <Link to={`/games/${game._id}`}>
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-[#66CC41] transition-colors">
                          {game.name}
                        </h3>
                      </Link>

                      <div className="flex justify-between items-end">
                        <div>
                          {game.originalPrice > game.discountedPrice ? (
                            <>
                              <p className="text-gray-400 text-sm line-through">
                                ₹{game.originalPrice.toLocaleString("en-IN")}
                              </p>
                              <p className="text-[#66CC41] font-bold text-xl">
                                ₹{game.discountedPrice.toLocaleString("en-IN")}
                              </p>
                            </>
                          ) : (
                            <p className="text-[#66CC41] font-bold text-xl">
                              ₹{game.discountedPrice.toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 mb-8 flex justify-center">
                  <div className="flex flex-wrap items-center gap-2 bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-gray-800/50">
                    <button
                      onClick={() =>
                        handlePageClick(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === 1
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-gray-800 hover:bg-gray-700 text-white"
                      } transition-colors`}>
                      Prev
                    </button>

                    {getVisiblePageNumbers().map((number, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof number === "number" && handlePageClick(number)
                        }
                        className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg transition-colors ${
                          number === currentPage
                            ? "bg-[#66CC41] text-black font-bold"
                            : number === "..."
                            ? "bg-transparent text-gray-400 cursor-default"
                            : "bg-gray-800 hover:bg-gray-700 text-white"
                        }`}>
                        {number}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        handlePageClick(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === totalPages
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-gray-800 hover:bg-gray-700 text-white"
                      } transition-colors`}>
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BrowseGames;
