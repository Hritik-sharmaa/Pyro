import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const GamesDetails = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMedia, setActiveMedia] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/games/${gameId}`
        );
        const gameData = response.data;

        // Ensure screenshots exist and are valid
        const validScreenshots = gameData.screenshots?.filter((s) => s) || [];

        // Choose the first available media (trailer or a screenshot)
        const initialMedia = gameData.trailer || validScreenshots[0] || null;

        setGame({ ...gameData, screenshots: validScreenshots });
        setActiveMedia(initialMedia);
      } catch (err) {
        setError("Failed to load game details.");
      } finally {
        setLoading(false);
      }
    };
    fetchGameDetails();
  }, [gameId]);

  if (loading)
    return <div className="text-white text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: true,
    focusOnSelect: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const mediaToDisplay = game.trailer
    ? [game.trailer, ...game.screenshots]
    : game.screenshots;

  return (
    <div className="h-full bg-[#0f1115] text-white">
      <Navbar />
      <div className="container mx-auto px-10 py-32">
        <h1 className="text-5xl font-extrabold mb-2">{game.name}</h1>
        <p className="mb-10">
          <span className="font-bold">Rating:</span> {game.rating} ⭐
        </p>
        <div className="flex flex-col lg:flex-row items-center lg:items-start">
          <div className="lg:w-2/3">
            <div className="w-full rounded-lg shadow-lg mb-6">
              {activeMedia ? (
                activeMedia.includes(".mp4") ? (
                  <video className="w-full rounded-lg" controls autoPlay>
                    <source src={activeMedia} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={activeMedia}
                    onError={(e) => {
                      e.target.style.display = "none";
                      setActiveMedia(
                        mediaToDisplay.find(
                          (m) => m !== activeMedia && !m.includes(".mp4")
                        ) || null
                      );
                    }}
                    className="w-full rounded-lg"
                    alt="Game Screenshot"
                  />
                )
              ) : (
                <div className="text-center text-gray-400">
                  No media available
                </div>
              )}
            </div>

            <Slider {...settings}>
              {mediaToDisplay.map((media, index) => (
                <div key={index} onClick={() => setActiveMedia(media)}>
                  {media.includes(".mp4") ? (
                    <video className="w-80 h-28 rounded-lg" src={media} />
                  ) : (
                    <img
                      src={media}
                      onError={(e) => (e.target.style.display = "none")} // Hide broken thumbnails
                      className="w-full h-28 rounded-lg"
                      alt="Game Media"
                    />
                  )}
                </div>
              ))}
            </Slider>

            <p className="text-gray-400 text-lg mt-3">{game.description}</p>
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
                <span className="font-bold">Genres:</span>{" "}
                {game.genres.join(", ")}
              </p>

              <p className="mt-3 text-lg">
                <span className="line-through">₹{game.originalPrice}</span>
                <span className="text-green-500 font-bold">
                  {" "}
                  ₹{game.discountedPrice} ({game.discount}% OFF)
                </span>
              </p>
            </div>
            <button className="mt-6 bg-[#66CC41] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#387a20]">
              Buy Now
            </button>
          </div>

          <div className="lg:w-1/2 lg:ml-10 mt-6 lg:mt-0">
            <img
              src={game.poster}
              alt={game.name}
              onError={(e) => (e.target.style.display = "none")} // Hide broken posters
              className="w-full lg:w-3/4 rounded-lg shadow-lg mb-6"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GamesDetails;
