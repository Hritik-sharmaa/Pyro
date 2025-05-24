import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "../styles/Common.css"
import { toast } from "react-hot-toast"
import { useWishlistStore } from "../store/wishlistStore"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"
import GameDetailLoader from "../skeletonLoader/GameDetailLoader"
import CommentSection from "../components/CommentSection"
import { Heart, ShoppingCart, Star, Calendar, Users, Monitor } from "lucide-react"

const GamesDetails = () => {
  const { gameId } = useParams()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { wishlist, addToWishlist } = useWishlistStore()
  const userId = useAuthStore((state) => state.userId)
  const { cart, addToCart } = useCartStore()
  const [activeTab, setActiveTab] = useState("description")

  const mainSliderRef = useRef(null)
  const thumbSliderRef = useRef(null)

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/games/${gameId}`)
        const gameData = response.data

        const validScreenshots = gameData.screenshots?.filter(Boolean) || []
        const hasValidTrailer = gameData.trailer && gameData.trailer.trim() !== ""

        const mediaToDisplay = hasValidTrailer ? [gameData.trailer, ...validScreenshots] : validScreenshots

        setGame({ ...gameData, mediaToDisplay })

        // Ensure the loading screen is shown for at least 3 seconds
        setTimeout(() => {
          setLoading(false)
        }, 1500)
      } catch (err) {
        setError("Failed to load game details.")
        setLoading(false)
      }
    }

    fetchGameDetails()
  }, [gameId])

  const handleAddToWishlist = async () => {
    if (!userId) {
      toast.error("You need to log in first!")
      return
    }

    if (wishlist.some((item) => item._id === game._id)) {
      toast("Already in your wishlist!", { icon: "❤️" })
      return
    }

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/wishlist/add/${userId}`, { gameId: game._id })

      addToWishlist(game)
      toast.success("Game added to wishlist!")
    } catch (error) {
      console.error("error adding to wihslist: ", error)
      toast.error("Failed to add to wishlist!")
    }
  }

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("You need to log in first!")
      return
    }

    if (cart.some((item) => item._id === game._id)) {
      toast("Already in your cart!", { icon: "🛒" })
      return
    }

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/add/${userId}`, { gameId: game._id })

      addToCart(game)
      toast.success("Game added to cart!")
    } catch (error) {
      console.error("error adding to cart: ", error)
      toast.error("Failed to add to cart!")
    }
  }

  const formatSystemRequirements = (requirementsText) => {
    const formattedRequirements = {}
    const sections = requirementsText.split(
      /(?=OS:|Processor:|Memory:|Graphics:|Storage:|Sound Card:|Other requirements: |Recommended: )/,
    )

    sections.forEach((section) => {
      if (section.startsWith("OS:")) {
        formattedRequirements.OS = section.replace("OS:", "").trim()
      } else if (section.startsWith("Processor:")) {
        formattedRequirements.Processor = section.replace("Processor:", "").trim()
      } else if (section.startsWith("Memory:")) {
        formattedRequirements.Memory = section.replace("Memory:", "").trim()
      } else if (section.startsWith("Graphics:")) {
        formattedRequirements.Graphics = section.replace("Graphics:", "").trim()
      } else if (section.startsWith("Storage:")) {
        formattedRequirements.Storage = section.replace("Storage:", "").trim()
      } else if (section.startsWith("Sound Card:")) {
        formattedRequirements["Sound Card"] = section.replace("Sound Card:", "").trim()
      } else if (section.startsWith("Other requirements:")) {
        formattedRequirements["Other Requirements"] = section.replace("Other requirements:", "").trim()
      } else if (section.startsWith("Recommended:")) {
        formattedRequirements["Recommended"] = section.replace("Recommended:", "").trim()
      }
    })
    return formattedRequirements
  }

  const renderStars = (rating) => {
    const filledStars = Math.round(rating)
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star key={i} className={`w-6 h-6 ${i < filledStars ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />,
      )
    }
    return stars
  }

  if (loading) return <GameDetailLoader />
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>
  if (!game.mediaToDisplay.length) return <div className="text-white text-center mt-10">No media available.</div>

  const mainSliderSettings = {
    dots: false,
    arrows: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: thumbSliderRef.current,
    autoplay: true,
    autoplaySpeed: 5000,
  }

  const thumbSliderSettings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    focusOnSelect: true,
    asNavFor: mainSliderRef.current,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  }

  const formattedPCRequirements = formatSystemRequirements(game.system_requirements?.PC || "")

  const discountPercentage = game.discount
  const isInWishlist = wishlist.some((item) => item._id === game._id)
  const isInCart = cart.some((item) => item._id === game._id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1115] to-[#1a1d24] text-white font-sans">
      <Navbar />
      <div className="container mx-auto px-4 md:px-8 py-24">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-start gap-2 mb-4">
              {game.genres.map((genre, index) => (
                <span key={index} className="px-3 py-1 bg-purple-900/60 rounded-full text-sm font-medium">
                  {genre}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              {game.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {renderStars(game.rating)}
                <span className="ml-2 font-bold">{game.rating}</span>
              </div>
              <div className="text-gray-400">|</div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(game.released).toLocaleDateString()}</span>
              </div>
              <div className="text-gray-400">|</div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{game.publisher.join(", ")}</span>
              </div>
            </div>

            {/* Main Slider */}
            <div className="w-full rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] mb-4">
              <Slider {...mainSliderSettings} ref={mainSliderRef}>
                {game.mediaToDisplay.map((media, index) => (
                  <div key={index} className="relative aspect-video">
                    {media.includes(".mp4") ? (
                      <video className="w-full h-full object-cover rounded-lg" controls>
                        <source src={media} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={media || "/placeholder.svg"}
                        className="w-full h-full object-cover rounded-lg"
                        alt={`${game.name} - Screenshot ${index + 1}`}
                      />
                    )}
                  </div>
                ))}
              </Slider>
            </div>

            {/* Thumbnail Slider */}
            {game.mediaToDisplay.length > 1 && (
              <div className="w-full">
                <Slider {...thumbSliderSettings} ref={thumbSliderRef} className="cursor-pointer">
                  {game.mediaToDisplay.map((media, index) => (
                    <div key={index} className="px-1">
                      <div className="aspect-video rounded-md overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all">
                        {media.includes(".mp4") ? (
                          <div className="w-full h-full bg-black flex items-center justify-center">
                            <span className="text-xs">Video</span>
                          </div>
                        ) : (
                          <img
                            src={media || "/placeholder.svg"}
                            className="w-full h-full object-cover"
                            alt={`Thumbnail ${index + 1}`}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            )}
          </div>

          {/* Purchase Panel */}
          <div className="lg:col-span-1">
            <div className="bg-[#1e2128] rounded-xl p-6 shadow-lg sticky top-24">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">₹{game.discountedPrice.toLocaleString("en-IN")}</span>
                    {discountPercentage > 0 && (
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                        -{discountPercentage}%
                      </span>
                    )}
                  </div>
                </div>
                {discountPercentage > 0 && (
                  <div className="text-gray-400 line-through text-lg">
                    ₹{game.originalPrice.toLocaleString("en-IN")}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isInCart ? "Already in Cart" : "Buy Now"}
                </button>

                <button
                  className="w-full py-4 bg-white text-black hover:bg-gray-200 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isInCart ? "Already in Cart" : "Add to Cart"}
                </button>

                <button
                  onClick={handleAddToWishlist}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    isInWishlist ? "bg-pink-100 text-pink-700" : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? "fill-pink-700" : ""}`} />
                  {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mb-12">
          <div className="border-b border-gray-700 mb-6">
            <div className="flex overflow-x-auto">
              <button
                className={`px-6 py-3 font-medium text-lg whitespace-nowrap ${
                  activeTab === "description"
                    ? "border-b-2 border-purple-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`px-6 py-3 font-medium text-lg whitespace-nowrap ${
                  activeTab === "requirements"
                    ? "border-b-2 border-purple-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("requirements")}
              >
                System Requirements
              </button>
              <button
                className={`px-6 py-3 font-medium text-lg whitespace-nowrap ${
                  activeTab === "comments"
                    ? "border-b-2 border-purple-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("comments")}
              >
                Reviews & Comments
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === "description" && (
              <div className="space-y-6">
                <div className="prose prose-lg prose-invert max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed">{game.description}</p>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {game.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "requirements" && (
              <div className="bg-[#1e2128] rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                  <Monitor className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold">System Requirements (Windows)</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-purple-400 mb-4">Minimum Requirements</h3>

                    {Object.entries(formattedPCRequirements).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-700 pb-3">
                        <div className="font-medium text-gray-400">{key}</div>
                        <div className="text-white">{value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-4">Recommended Experience</h3>
                    <p className="text-gray-300">
                      For the best gaming experience, we recommend exceeding the minimum requirements. Higher-end
                      hardware will allow you to enjoy {game.name} at higher frame rates and with more visual effects
                      enabled.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "comments" && (
              <div>
                <div className="mb-8">
                  <div className="flex items-center justify-center flex-col mb-8">
                    <h2 className="text-3xl font-bold mb-4">Player Ratings</h2>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">{renderStars(game.rating)}</div>
                      <span className="text-2xl font-bold">{game.rating}/5</span>
                    </div>
                    <p className="text-gray-400">Based on player reviews</p>
                  </div>
                </div>

                <CommentSection />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default GamesDetails

