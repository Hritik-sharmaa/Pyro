import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Common.css";
import axios from "axios";
import { MdSort } from "react-icons/md";
import Footer from "../components/Footer";
import { TbSortAscendingLetters } from "react-icons/tb";
import { AiOutlineSortDescending } from "react-icons/ai";
import WishlistButton from "../components/WishlistButton";
import { Link } from "react-router-dom";

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
        `http://${process.env.BACKEND_URL}/api/games/browse-games`,
        {
          params: {
            page,
            limit: gamesPerPage,
            sort: sortField,
            order,
          },
        }
      );
      setGames(response.data.games);
      setTotalGames(response.data.totalGames);
    } catch (err) {
      console.error("Error fetching browse games:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames(currentPage, sortOption, sortOrder);
  }, [currentPage, sortOption, sortOrder]);

  const totalPages = Math.ceil(totalGames / gamesPerPage);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="h-full bg-[#0f1115] font text-white">
      <Navbar />
      <div className="pt-28 px-20 py-10">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl mb-8 font-extrabold">Browse Games</h1>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center justify-center">
              <MdSort size={30} className="mr-2" />
              <span>Sort By:</span>
              <select
                className="ml-3 p-2 text-black rounded"
                value={sortOption}
                onChange={handleSortChange}>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
                <option value="released">Release Date</option>
                <option value="lowest-price">Lowest Price</option>
                <option value="highest-price">Highest Price</option>
              </select>
              <button
                className="ml-4 p-2 bg-[#66CC41] text-black rounded"
                onClick={toggleSortOrder}>
                {sortOrder === "asc" ? (
                  <TbSortAscendingLetters />
                ) : (
                  <AiOutlineSortDescending />
                )}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading games...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <div
                key={game._id}
                className="relative group bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-200">
                <img
                  src={game.poster}
                  alt={game.name}
                  className="w-full h-48 object-cover"
                />

                <WishlistButton game={game} />

                <div className="p-4">
                  <h3 className="text-lg font-bold text-black">{game.name}</h3>
                  <p className="text-black text-sm">
                    Original Price: ₹
                    {game.originalPrice.toLocaleString("en-IN")}
                  </p>
                  <p className="text-black mt-2">
                    Discounted Price: ₹
                    {game.discountedPrice.toLocaleString("en-IN")}
                  </p>
                  <Link
                    to={`/games/${game._id}`}
                    className="block mt-4 text-[#378a19] hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pagination mt-6 flex justify-center space-x-4 p-6">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageClick(number)}
              className={`px-4 py-2 font-bold rounded-md text-black ${
                currentPage === number ? "bg-[#387a20]" : "bg-[#66CC41]"
              }`}>
              {number}
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BrowseGames;
