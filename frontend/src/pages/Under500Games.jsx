
import axios from "axios"
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import "../styles/Common.css"
import { MdSort, MdStar, MdCalendarToday } from "react-icons/md"
import Footer from "../components/Footer"
import WishlistButton from "../components/WishlistButton"
import { Link } from "react-router-dom"
import GameCardSkeleton from "../skeletonLoader/GameCardSkeleton"

const Under500Games = () => {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalGames, setTotalGames] = useState(0)
  const [sortOption, setSortOption] = useState("relevance")

  const gamesPerPage = 20

  // Fetch games based on the current page
  const getUnderPrice500Games = async (page, sortField, order) => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/games/under-price-500`, {
        params: {
          page: page,
          limit: gamesPerPage,
          sort: sortField,
          order,
        },
      })
      setTimeout(() => {
        setGames(response.data.games)
        setTotalGames(response.data.totalGames)
        setLoading(false)
      }, 3000)
    } catch (err) {
      console.error("Error fetching the under-price-500 games", err)
      setLoading(false)
    }
  }

  useEffect(() => {
    getUnderPrice500Games(currentPage, sortOption)
    // Scroll to top when page changes
    window.scrollTo(0, 0)
  }, [currentPage, sortOption])

  const totalPages = Math.ceil(totalGames / gamesPerPage)

  const handlePageClick = (page) => {
    setCurrentPage(page)
  }

  const handleSortChange = (e) => {
    setSortOption(e.target.value)
    setCurrentPage(1)
  }

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  // Function to render star rating
  const renderRating = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<MdStar key={i} className="text-yellow-400" />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<MdStar key={i} className="text-yellow-400 opacity-50" />)
      } else {
        stars.push(<MdStar key={i} className="text-gray-400" />)
      }
    }

    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-yellow-400 font-medium">{rating}/5</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-[#0f1115] to-[#1a1d24] font">
      <Navbar />

      <div className="w-full bg-[url('/images/hero-bg.jpg')] bg-cover bg-center py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">Games Under ₹500</h1>
          <p className="text-xl text-gray-200 max-w-2xl mb-8">
            Discover amazing gaming experiences that won't break the bank. Quality games at affordable prices.
          </p>
          <div className="w-32 h-1 bg-[#66CC41] rounded-full"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-[#1e2128] p-4 rounded-lg shadow-lg">
         
          <div className="flex items-center bg-[#2a2e38] rounded-lg p-2 shadow-inner">
            <MdSort size={24} className="text-[#66CC41] mr-2" />
            <span className="mr-2 text-gray-300">Sort By:</span>
            <select
              className="bg-[#2a2e38] text-white border-none focus:ring-2 focus:ring-[#66CC41] rounded p-2 cursor-pointer"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="relevance">Relevance</option>
              <option value="name">Name</option>
              <option value="released">Release Date</option>
              <option value="lowest-price">Lowest Price</option>
              <option value="highest-price">Highest Price</option>
            </select>
          </div>
        </div>

       
        {loading && <GameCardSkeleton />}

     
        <div className="grid grid-cols-1 gap-6">
          {!loading &&
            games.map((game) => (
              <div
                key={game._id}
                className="bg-[#1e2128] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 relative overflow-hidden">
                    <Link to={`/games/${game._id}`} className="block">
                      <img
                        src={game.poster || "/placeholder.svg"}
                        alt={game.name}
                        className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    </Link>
                  </div>
                  <div className="md:w-3/4 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link to={`/games/${game._id}`} className="block">
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#66CC41] transition-colors duration-300">
                            {game.name}
                          </h3>
                        </Link>
                        <div className="flex space-x-2">
                          <WishlistButton game={game} />
                        </div>
                      </div>

                      <div className="mt-3 mb-4">{renderRating(game.rating)}</div>

                      <div className="flex flex-wrap gap-4 mt-4 mb-6">
                        <div className="flex items-center text-gray-300">
                          <MdCalendarToday className="mr-2 text-[#66CC41]" />
                          <span>
                            {new Date(game.released).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <div className="text-3xl font-bold text-[#66CC41]">
                          ₹{game.discountedPrice.toLocaleString("en-IN")}
                        </div>
                        {game.price > game.discountedPrice && (
                          <div className="ml-3 line-through text-gray-500">₹{game.price.toLocaleString("en-IN")}</div>
                        )}
                      </div>

                      <Link
                        to={`/games/${game._id}`}
                        className="px-6 py-2 bg-[#387a20] hover:bg-[#66CC41] text-white font-bold rounded-md transition-colors duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

       
        {!loading && games.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-4">No games found</h3>
            <p className="text-gray-400">Try changing your search or filter options</p>
          </div>
        )}

       
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="inline-flex items-center rounded-md shadow-sm bg-[#1e2128] p-1">
              <button
                onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium rounded-md mr-1 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-[#2a2e38]"
              >
                Previous
              </button>

              {pageNumbers.map((number) => {
                // Show limited page numbers with ellipsis
                if (number === 1 || number === totalPages || (number >= currentPage - 1 && number <= currentPage + 1)) {
                  return (
                    <button
                      key={number}
                      onClick={() => handlePageClick(number)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md mx-1 font-bold transition-colors duration-200 ${
                        currentPage === number ? "bg-[#387a20] text-white" : "text-gray-300 hover:bg-[#2a2e38]"
                      }`}
                    >
                      {number}
                    </button>
                  )
                } else if (
                  (number === currentPage - 2 && currentPage > 3) ||
                  (number === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span key={number} className="w-10 h-10 flex items-center justify-center text-gray-500">
                      ...
                    </span>
                  )
                }
                return null
              })}

              <button
                onClick={() => handlePageClick(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium rounded-md ml-1 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-[#2a2e38]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Under500Games

