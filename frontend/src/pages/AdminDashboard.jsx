import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Common.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("users");
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const gamesPerPage = 20;

  useEffect(() => {
    if (authenticated) {
      fetchUsers();
      fetchGames();
    }
  }, [authenticated]);

  const handleLogin = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/games`
      );
      setGames(response.data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
    setLoading(false);
  };

  const removeUser = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}`
      );
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const removeGame = async (gameId) => {
    if (!window.confirm("Are you sure you want to remove this game?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/games/${gameId}`
      );
      setGames(games.filter((game) => game.gameId !== gameId));
    } catch (error) {
      console.error("Error removing game:", error);
    }
  };

  const updateGamePrice = async (gameId, updatedData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/games/${gameId}/price`,
        updatedData
      );
      setGames(
        games.map((game) => (game.gameId === gameId ? response.data : game))
      );
    } catch (error) {
      console.error("Error updating game price:", error);
    }
  };

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black font">
        <div className="bg-zinc-200 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl mb-4">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white px-2 py-1 rounded text-black w-full mb-4"
            placeholder="Enter Admin Password"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-700 w-full">
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black px-20 py-10 font">
      <h1 className="text-4xl font-bold text-center mb-10">Admin Dashboard</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded ${
            activeTab === "users" ? "bg-blue-500" : "bg-gray-700"
          } text-white hover:bg-blue-700`}>
          Users
        </button>
        <button
          onClick={() => setActiveTab("games")}
          className={`px-4 py-2 rounded ${
            activeTab === "games" ? "bg-blue-500" : "bg-gray-700"
          } text-white hover:bg-blue-700`}>
          Games
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : activeTab === "users" ? (
        <div>
          <h2 className="text-4xl font-bold mb-4 text-center">Users</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="bg-zinc-200 p-4 rounded-lg">
                <p className="text-lg">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-400">{user.email}</p>
                <button
                  onClick={() => removeUser(user._id)}
                  className="mt-2 bg-red-500 px-3 py-1 rounded text-white hover:bg-red-700">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-4xl font-bold mt-10 mb-4 text-center">Games</h2>
          <div className="space-y-4">
            {currentGames.map((game) => (
              <div key={game.gameId} className="bg-zinc-200 p-4 rounded-lg">
                <p className="text-3xl font-bold">{game.name}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div>
                    <label className="block text-gray-700 text-sm">
                      Original Price
                    </label>
                    <input
                      type="number"
                      value={game.originalPrice || ""}
                      onChange={(e) =>
                        updateGamePrice(game.gameId, {
                          riginalPrice: Number(e.target.value) || 0,
                          discount: game.discount || 0,
                          discountedPrice:
                            (Number(e.target.value) || 0) -
                            ((Number(e.target.value) || 0) *
                              (game.discount || 0)) /
                              100,
                        })
                      }
                      className="bg-gray-700 px-2 py-1 rounded text-white w-20"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      value={game.discount || ""}
                      onChange={(e) =>
                        updateGamePrice(game.gameId, {
                          originalPrice: game.originalPrice || 0,
                          discount: e.target.value || 0,
                          discountedPrice:
                            (game.originalPrice || 0) -
                            ((game.originalPrice || 0) *
                              (Number(e.target.value) || 0)) /
                              100,
                        })
                      }
                      className="bg-gray-700 px-2 py-1 rounded text-white w-20"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm">
                      Discounted Price
                    </label>
                    <p className="text-green-600 font-bold">
                      ₹{game.discountedPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeGame(game.gameId)}
                  className="mt-3 bg-red-500 px-3 py-1 rounded text-white hover:bg-red-700">
                  Remove Game
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from(
              { length: Math.ceil(games.length / gamesPerPage) },
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1 ? "bg-blue-500" : "bg-gray-700"
                  } text-white hover:bg-blue-700`}>
                  {i + 1}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
