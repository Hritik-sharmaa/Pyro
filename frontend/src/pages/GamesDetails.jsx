import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Common.css";
import { toast } from "react-hot-toast";
import { useWishlistStore } from "../store/wishlistStore";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import GameDetailLoader from "../skeletonLoader/GameDetailLoader";
import CommentSection from "../components/CommentSection";

const GamesDetails = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { wishlist, addToWishlist } = useWishlistStore();
  const userId = useAuthStore((state) => state.userId);
  const { cart, addToCart } = useCartStore();

  const mainSliderRef = useRef(null);
  const thumbSliderRef = useRef(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/games/${gameId}`
        );
        const gameData = response.data;

        const validScreenshots = gameData.screenshots?.filter(Boolean) || [];
        const hasValidTrailer =
          gameData.trailer && gameData.trailer.trim() !== "";

        const mediaToDisplay = hasValidTrailer
          ? [gameData.trailer, ...validScreenshots]
          : validScreenshots;

        setGame({ ...gameData, mediaToDisplay });

        // Ensure the loading screen is shown for at least 3 seconds
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } catch (err) {
        setError("Failed to load game details.");
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  const handleAddToWishlist = async () => {
    if (!userId) {
      toast.error("You need to log in first!");
      return;
    }

    if (wishlist.some((item) => item._id === game._id)) {
      toast("Already in your wishlist!", { icon: "❤️" });
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/add/${userId}`,
        { gameId: game._id }
      );

      addToWishlist(game);
      toast.success("Game added to wishlist!");
    } catch (error) {
      console.error("error adding to wihslist: ", error);
      toast.error("Failed to add to wishlist!");
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("You need to log in first!");
      return;
    }

    if (cart.some((item) => item._id === game._id)) {
      toast("Already in your cart!", { icon: "🛒" });
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add/${userId}`,
        { gameId: game._id }
      );

      addToCart(game);
      toast.success("Game added to cart!");
    } catch (error) {
      console.error("error adding to cart: ", error);
      toast.error("Failed to add to cart!");
    }
  };

  const formatSystemRequirements = (requirementsText) => {
    const formattedRequirements = {};
    const sections = requirementsText.split(
      /(?=OS:|Processor:|Memory:|Graphics:|Storage:|Sound Card:|Other requirements: |Recommended: )/
    );

    sections.forEach((section) => {
      if (section.startsWith("OS:")) {
        formattedRequirements.OS = section.replace("OS:", "").trim();
      } else if (section.startsWith("Processor:")) {
        formattedRequirements.Processor = section
          .replace("Processor:", "")
          .trim();
      } else if (section.startsWith("Memory:")) {
        formattedRequirements.Memory = section.replace("Memory:", "").trim();
      } else if (section.startsWith("Graphics:")) {
        formattedRequirements.Graphics = section
          .replace("Graphics:", "")
          .trim();
      } else if (section.startsWith("Storage:")) {
        formattedRequirements.Storage = section.replace("Storage:", "").trim();
      } else if (section.startsWith("Sound Card:")) {
        formattedRequirements["Sound Card"] = section
          .replace("Sound Card:", "")
          .trim();
      } else if (section.startsWith("Other requirements:")) {
        formattedRequirements["Other Requirements"] = section
          .replace("Other requirements:", "")
          .trim();
      } else if (section.startsWith("Recommended:")) {
        formattedRequirements["Recommended"] = section
          .replace("Recommended:", "")
          .trim();
      }
    });
    return formattedRequirements;
  };

  const renderStars = (rating) => {
    const filledStars = Math.round(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i < filledStars ? "filled" : "empty"}`}
          style={{
            color: i < filledStars ? "#FFB800" : "#dcdcdc",
          }}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  if (loading) return <GameDetailLoader />;
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!game.mediaToDisplay.length)
    return (
      <div className="text-white text-center mt-10">No media available.</div>
    );

  const mainSliderSettings = {
    dots: false,
    arrows: false,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: thumbSliderRef.current,
  };

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
  };
  const formattedPCRequirements = formatSystemRequirements(
    game.system_requirements?.PC || ""
  );

  return (
    <div className="h-full bg-[#0f1115] text-white font">
      <Navbar />
      <div className="container mx-auto px-10 py-32">
        <h1 className="text-5xl font-extrabold mb-2">{game.name}</h1>
        <p className="mb-10 text-green-600 font-bold text-2xl">
          ₹{game.discountedPrice.toLocaleString("en-IN")}
        </p>

        {game.mediaToDisplay.length > 0 && (
          <div className="w-full lg:w-2/3 mx-auto mb-4">
            <Slider {...mainSliderSettings} ref={mainSliderRef}>
              {game.mediaToDisplay.map((media, index) => (
                <div key={index} className="relative">
                  {media.includes(".mp4") ? (
                    <video className="w-full h-auto rounded-lg" controls>
                      <source src={media} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={media}
                      className="w-full rounded-lg shadow-lg"
                      alt="Game Media"
                    />
                  )}
                </div>
              ))}
            </Slider>
          </div>
        )}

        {game.mediaToDisplay.length > 1 && (
          <div className="w-full lg:w-2/3 mx-auto">
            <Slider
              {...thumbSliderSettings}
              ref={thumbSliderRef}
              className="cursor-pointer">
              {game.mediaToDisplay.map((media, index) => (
                <div
                  key={index}
                  onClick={() => mainSliderRef.current.slickGoTo(index)}
                  className="pl-5">
                  {media.includes(".mp4") ? (
                    <video
                      className="w-24 h-24 lg:w-full lg:h-full rounded-lg"
                      src={media}
                    />
                  ) : (
                    <img
                      src={media}
                      className="w-24 h-24 lg:w-full lg:h-full rounded-lg border-2 border-transparent hover:border-white"
                      alt="Game Thumbnail"
                    />
                  )}
                </div>
              ))}
            </Slider>
          </div>
        )}

        <div className="mt-8">
          <p className="text-gray-400 text-lg">{game.description}</p>
          <div className="text-center text-4xl m-10">
            <h1>Amazing people's rating</h1>
            <p className="m-4">
              <div className="flex justify-center gap-1 font-bold">
                {game.rating}&nbsp;{renderStars(game.rating)}
              </div>
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p>
            <span className="font-bold">Release Date:</span>{" "}
            {new Date(game.released).toDateString()}
          </p>
          <p>
            <span className="font-bold">Publisher:</span>{" "}
            {game.publisher.join(", ")}
          </p>
          <p>
            <span className="font-bold">Genres:</span> {game.genres.join(", ")}
          </p>
          <p>
            <span className="font-bold">Tags:</span>{" "}
            <div className="flex flex-wrap gap-2 mt-2">
              {game.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded inline-block bg-[#3a3b3c]">
                  {tag}
                </span>
              ))}
            </div>
          </p>

          <h1 className="text-center mb-3 mt-14 text-5xl font-bold ">
            {game.name} System requirement's
          </h1>

          <div className="flex items-center justify-center">
            <div className="mt-6 bg-white text-black rounded-xl px-36 py-6 flex items-center justify-center flex-col w-max">
              <div className="text-black text-lg">
                <h3 className="font-bold text-center underline mb-3">
                  Minimum requirement (Windows)
                </h3>
                {formattedPCRequirements.OS && (
                  <p>
                    <span className="font-bold">OS:</span>{" "}
                    {formattedPCRequirements.OS}
                  </p>
                )}
                {formattedPCRequirements.Processor && (
                  <p>
                    <span className="font-bold">Processor:</span>{" "}
                    {formattedPCRequirements.Processor}
                  </p>
                )}
                {formattedPCRequirements.Memory && (
                  <p>
                    <span className="font-bold">Memory:</span>{" "}
                    {formattedPCRequirements.Memory}
                  </p>
                )}
                {formattedPCRequirements.Graphics && (
                  <p>
                    <span className="font-bold">Graphics:</span>{" "}
                    {formattedPCRequirements.Graphics}
                  </p>
                )}
                {formattedPCRequirements.Storage && (
                  <p>
                    <span className="font-bold">Storage:</span>{" "}
                    {formattedPCRequirements.Storage}
                  </p>
                )}
                {formattedPCRequirements["Sound Card"] && (
                  <p>
                    <span className="font-bold">Sound Card:</span>{" "}
                    {formattedPCRequirements["Sound Card"]}
                  </p>
                )}
                {formattedPCRequirements["Other Requirements"] && (
                  <p>
                    <span className="font-bold">Other Requirements:</span>{" "}
                    {formattedPCRequirements["Other Requirements"]}
                  </p>
                )}
                {formattedPCRequirements.Recommended && (
                  <p>
                    <span className="font-bold">Recommended:</span>{" "}
                    {formattedPCRequirements.Recommended}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="">
            <div className="mt-[7rem] border-b border-zinc-600 " />
            <div className="flex justify-center items-center flex-col">
              <div className="">
                <p className="m-10 text-lg flex justify-center items-center flex-col">
                  <span className="font-bold text-2xl">
                    Price: &nbsp;₹{game.discountedPrice}{" "}
                    <span className="text-base line-through font-light">
                      ₹{game.originalPrice}
                    </span>
                  </span>
                  <span className="font-bold text-2xl">
                    Discount: &nbsp;
                    {game.discount}%
                  </span>
                </p>
              </div>
              <div className="flex-col flex">
                <button className="mt-3 bg-[#66CC41] text-black px-36 py-5 rounded-lg font-bold transition-all hover:bg-[#387a20]"
                onClick={handleAddToCart}>
                  Buy Now
                </button>
                <button
                  className="mt-3 bg-white text-black px-36 py-5 rounded-lg font-bold transition-all hover:bg-[#dcdcdc]"
                  onClick={handleAddToCart}>
                  Add to cart
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="mt-3 bg-white text-black px-36 py-5 rounded-lg font-bold transition-all hover:bg-[#dcdcdc]">
                  {wishlist.some((item) => item._id === game._id)
                    ? "Already in Wishlist ❤️"
                    : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
          <CommentSection />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GamesDetails;
