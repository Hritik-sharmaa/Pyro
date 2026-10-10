const axios = require("axios");
require("dotenv").config();
const Game = require("../model/game");
const posters = require("../utils/poster");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// Function to generate random price in INR
const randomPriceInRupees = () =>
  Math.round(Math.random() * (5000 - 500) + 500);

const calculateDiscountedPrice = (originalPrice, discount) => {
  return Math.round(originalPrice * (1 - discount / 100));
};

const updatePosters = async () => {
  try {
    for (const poster of posters) {
      const { id, poster: posterPath } = poster;

      console.log(`Updating poster for Game ID: ${id} with ${posterPath}`);

      const existingGame = await Game.findOne({ gameId: id });

      if (existingGame) {
        console.log(`Found game: ${existingGame.name}`);
        existingGame.poster = posterPath;
        await existingGame.save();
        console.log(`Updated poster for game: ${existingGame.name}`);
      } else {
        console.warn(`Game with ID ${id} not found in the database.`);
      }
    }
    console.log("Successfully updated posters.");
  } catch (err) {
    console.error("Error updating posters:", err.message);
  }
};

const fetchAndStoregame = async () => {
  try {
    const rawgApiKey = process.env.RAWG_API_KEY;
    const baseUrl = process.env.BASE_URL;
    let page = 1;
    let gameStored = 0;

    while (gameStored < 200) {
      if (gameStored >= 200) break;
      const { data } = await axios.get(baseUrl, {
        params: {
          key: rawgApiKey,
          page,
          page_size: 40,
        },
      });

      const filteredGames = data.results.filter((game) => game.rating > 3);

      for (const game of filteredGames) {
        if (gameStored >= 200) break;
        const gameDetails = await axios.get(`${baseUrl}/${game.id}`, {
          params: {
            key: rawgApiKey,
          },
        });

        const details = gameDetails.data;

        // Fetching screenshots
        const fetchScreenshots = async (gameId) => {
          try {
            const screenshotData = await axios.get(
              `${baseUrl}/${gameId}/screenshots`,
              {
                params: { key: rawgApiKey },
              }
            );
            if (screenshotData.data && screenshotData.data.results) {
              return screenshotData.data.results.map(
                (screenshot) => screenshot.image
              );
            } else {
              console.warn(
                `No screenshots found in response for Game ID ${gameId}`
              );
              return [];
            }
          } catch (err) {
            console.error(
              `Failed to fetch screenshots for Game ID ${gameId}:`,
              err.message
            );
            return [];
          }
        };

        // fetching the trailer
        const fetchTrailer = async (gameId) => {
          try {
            const trailerData = await axios.get(`${baseUrl}/${gameId}/movies`, {
              params: { key: rawgApiKey },
            });
            if (trailerData.data.results.length > 0) {
              return (
                trailerData.data.results[0].data.max || "No trailer available"
              );
            }
            return "No trailer available";
          } catch (err) {
            console.error(
              `Failed to fetch trailer for Game ID ${gameId}:`,
              err.message
            );
            return "No trailer available";
          }
        };

        // Fetching publisher
        const fetchPublisher = async (publishers) => {
          try {
            if (publishers.length > 0) {
              return publishers.map((publisher) => publisher.name);
            }
            return ["No publisher available"];
          } catch (err) {
            console.error(
              `Failed to fetch publisher for Game ID ${game.id}:`,
              err.message
            );
            return ["Error fetching publisher"];
          }
        };

        const publisher = await fetchPublisher(details.publishers || []);

        const screenshots = await fetchScreenshots(game.id);

        const trailer = await fetchTrailer(game.id);

        const poster = posters.find((p) => p.id === game.id)?.poster || "";

        const existingGame = await Game.findOne({ name: details.name });

        if (!existingGame) {
          const originalPrice = randomPriceInRupees();
          let discount = 0;

          if (details.rating >= 4.5) {
            discount = 15;
          } else if (new Date(details.released) < new Date("2020-01-01")) {
            discount = 30;
          } else if (details.rating <= 3.5) {
            discount = 50;
          }

          const isFree = Math.random() < 0.05;
          const discountedPrice = isFree
            ? 0
            : calculateDiscountedPrice(originalPrice, discount);

          await Game.create({
            name: details.name,
            gameId: game.id,
            description: details.description_raw || "No description available",
            system_requirements: details.platforms?.reduce((acc, p) => {
              acc[p.platform.name] =
                p.requirements?.minimum || "No requirements available";
              return acc;
            }, {}),
            rating: details.rating,
            originalPrice,
            discountedPrice,
            discount,
            publisher: publisher,
            released: details.released,
            genres: details.genres.map((genre) => genre.name),
            tags: details.tags.map((tag) => tag.name),
            screenshots: screenshots.length > 0 ? screenshots : [],

            trailer,
            poster,
          });
          gameStored++;
        }

        if (gameStored >= 200) break;
      }

      page++;
      await delay(500);
    }
    console.log(`Successfully stored ${gameStored} games.`);

    await updatePosters();
  } catch (err) {
    console.error("Error fetching games:", err.message);
  }
};

const fetchTopRatedGames = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const sortField = req.query.sort || "rating";
  const sortOrder = req.query.order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const sortOptions = {
    rating: { rating: sortOrder },
    name: { name: sortOrder },
    released: { released: sortOrder },
    "lowest-price": { discountedPrice: 1 },
    "highest-price": { discountedPrice: -1 },
  };

  const sortBy = sortOptions[sortField] || sortOptions.rating;

  // console.log("Sort Field:", sortField); /
  // console.log("Sort Order:", sortOrder);
  // console.log("Sort By:", sortBy);

  try {
    const totalGames = await Game.countDocuments({ rating: { $gt: 4 } });
    const games = await Game.find({ rating: { $gt: 4 } })
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.status(200).json({ games, totalGames });
  } catch (err) {
    console.error("error fetching top rated games: ", err);
    res.status(500).json({ message: "error fetching top rated games" });
  }
};

const fetchFlashSaleGames = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const sortField = req.query.sort || "rating";
  const sortOrder = req.query.order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const sortOptions = {
    rating: { rating: sortOrder },
    name: { name: sortOrder },
    released: { released: sortOrder },
    "lowest-price": { discountedPrice: 1 },
    "highest-price": { discountedPrice: -1 },
  };
  const sortBy = sortOptions[sortField] || sortOptions.rating;

  try {
    const totalGames = await Game.countDocuments({ discount: 30 });
    const games = await Game.find({ discount: 30 })
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      games,
      totalGames,
      message: "Successfully fetched the flash sale games",
    });
  } catch (err) {
    console.error("Error fetching flash sale games:", err);
    res.status(500).json({ message: "Error fetching flash sale games" });
  }
};

const fetchUnder500Games = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const sortField = req.query.sort || "rating";
  const sortOrder = req.query.order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const sortOptions = {
    rating: { rating: sortOrder },
    name: { name: sortOrder },
    released: { released: sortOrder },
    "lowest-price": { discountedPrice: 1 },
    "highest-price": { discountedPrice: -1 },
  };
  const sortBy = sortOptions[sortField] || sortOptions.rating;
  try {
    const totalgames = await Game.countDocuments({
      discountPrice: { $lt: 500 },
    });
    const games = await Game.find({ discountedPrice: { $lt: 500 } })
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      games,
      totalgames,
      message: "Successfull fetched the games under 500 sale",
    });
  } catch (err) {
    console.error("error fetching under 500 games ", err);
    res.status(500).json({ message: "errorr fetching under price 500 games" });
  }
};

const fetchUnder1000Games = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const sortField = req.query.sort || "rating";
  const sortOrder = req.query.order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const sortOptions = {
    rating: { rating: sortOrder },
    name: { name: sortOrder },
    released: { released: sortOrder },
    "lowest-price": { discountedPrice: 1 },
    "highest-price": { discountedPrice: -1 },
  };

  const sortBy = sortOptions[sortField] || sortOptions.rating;

  try {
    const totalgames = await Game.countDocuments({
      discountPrice: { $lt: 500 },
    });
    const games = await Game.find({ discountedPrice: { $lt: 1000 } })
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      games,
      totalgames,
      message: "Successfull fetched the games under price 1000 sale",
    });
  } catch (err) {
    console.error("error fetching games under 1000 sale", err);
    res.status(500).json({ message: "errorr fetching game under 1000 games" });
  }
};

const fetchGamesByGenre = async (req, res) => {
  const genre = req.params.genre;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const sortField = req.query.sort || "rating";
  const sortOrder = req.query.order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const sortOptions = {
    rating: { rating: sortOrder },
    name: { name: sortOrder },
    released: { released: sortOrder },
    "lowest-price": { discountedPrice: 1 },
    "highest-price": { discountedPrice: -1 },
  };

  const sortBy = sortOptions[sortField] || sortOptions.rating;

  try {
    const totalGames = await Game.countDocuments({ genres: { $in: [genre] } });
    const games = await Game.find({ genres: { $in: [genre] } })
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .exec();

    res
      .status(200)
      .json({ games, totalGames, message: "Games fetched successfully." });
  } catch (err) {
    console.error("Error fetching games by genre", err);
    res.status(500).json({ message: "Error fetching games by genre." });
  }
};

const fetchBrowseGames = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const sortField = req.query.sort || "rating";
  const sortOrder = req.query.order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const sortOptions = {
    rating: { rating: sortOrder },
    name: { name: sortOrder },
    released: { released: sortOrder },
    "lowest-price": { discountedPrice: 1 },
    "highest-price": { discountedPrice: -1 },
  };

  const sortBy = sortOptions[sortField] || sortOptions.rating;

  try {
    const totalGames = await Game.countDocuments();
    const games = await Game.find().sort(sortBy).skip(skip).limit(limit).exec();

    res
      .status(200)
      .json({ games, totalGames, message: "Games fetched successfully." });
  } catch (err) {
    console.error("Error fetching browse games", err);
    res.status(500).json({ message: "Error fetching browse games." });
  }
};

const fetchSearchGames = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json({ games: [] });

    const games = await Game.find(
      { name: { $regex: query, $options: "i" } },
      "name poster"
    ).limit(5);

    //console.log("Search Results:", games);
    res.json({ games });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//games details
const fetchGameDetails = async (req, res) => {
  try {
    const game = await Game.findOne({ _id: req.params.gameId });
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.json(game);
  } catch (err) {
    console.error("Error fetching the details", err);
    res.status(500).json({ message: "Error fetch the details" });
  }
};

module.exports = {
  fetchAndStoregame,
  updatePosters,
  fetchTopRatedGames,
  fetchFlashSaleGames,
  fetchUnder500Games,
  fetchUnder1000Games,
  fetchGamesByGenre,
  fetchBrowseGames,
  fetchSearchGames,
  fetchGameDetails,
};
