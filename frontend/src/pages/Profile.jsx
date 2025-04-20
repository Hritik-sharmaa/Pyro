import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import Navbar from "../components/Navbar";
import { MdOutlinePerson2, MdAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import profilePic from "/profile-pic.png";
import { User, ShoppingCart, LogOut, Clock, CreditCard } from "lucide-react";
import "../styles/Common.css";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuthStore((state) => state);
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [isEditingName, setIsEditingName] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user || !user.userId) {
      setLoading(false);
      return;
    }

    fetchUserData();
    fetchOrders();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
    }
  }, [userData]);
  const handleSaveName = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update-name`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ firstName, lastName }),
        }
      );

      if (!response.ok) throw new Error("Failed to update name.");

      const updated = await response.json();
      setUserData(updated);
      setIsEditingName(false);
    } catch (err) {
      console.error("Update error:", err.message);
      alert("Failed to update name. Try again.");
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!user || !user.userId) {
      console.error("User or user ID is undefined.");
      return;
    }

    const ordersUrl = `${import.meta.env.VITE_BACKEND_URL}/api/orders/${
      user.userId
    }`;

    try {
      const response = await fetch(ordersUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("fetched data: ", data);
      setOrders(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#0b0d11] to-[#121620]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500/20 border-t-red-500 border-r-red-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-black/80 backdrop-blur-sm"></div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#0b0d11] to-[#121620]">
        <div className="bg-red-900/30 text-red-400 p-8 rounded-xl border border-red-700/50 backdrop-blur-sm shadow-xl max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-xl font-bold text-red-300">Error Occurred</h3>
          </div>
          <p className="text-lg font-medium mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-red-600/20 flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Login
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col bg-gradient-to-b from-[#0b0d11] to-[#121620] min-h-screen text-white font">
      <Navbar />
      <div className="flex flex-col md:flex-row flex-1 pt-16">
        {/* Sidebar */}
        <div className="w-full md:w-1/5 bg-black/50 backdrop-blur-sm p-6 md:min-h-screen border-r border-zinc-800/30">
          <div className="sticky top-24">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-10 w-1 bg-gradient-to-b from-red-500 to-red-700 rounded-full"></div>
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                Dashboard
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <button
                className={`p-4 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                  activeTab === "details"
                    ? "bg-gradient-to-r from-red-700/40 to-red-900/20 border-l-4 border-red-600 shadow-lg shadow-red-900/10"
                    : "hover:bg-zinc-900/50 hover:border-l-4 hover:border-red-900/50"
                }`}
                onClick={() => setActiveTab("details")}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activeTab === "details" ? "bg-red-500/20" : "bg-zinc-800/50"
                  }`}>
                  <User
                    size={18}
                    className={
                      activeTab === "details" ? "text-red-500" : "text-gray-500"
                    }
                  />
                </div>
                <span
                  className={`${
                    activeTab === "details" ? "font-bold" : ""
                  } transition-all`}>
                  Profile
                </span>
              </button>

              <button
                className={`p-4 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                  activeTab === "orders"
                    ? "bg-gradient-to-r from-red-700/40 to-red-900/20 border-l-4 border-red-600 shadow-lg shadow-red-900/10"
                    : "hover:bg-zinc-900/50 hover:border-l-4 hover:border-red-900/50"
                }`}
                onClick={() => setActiveTab("orders")}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activeTab === "orders" ? "bg-red-500/20" : "bg-zinc-800/50"
                  }`}>
                  <ShoppingCart
                    size={18}
                    className={
                      activeTab === "orders" ? "text-red-500" : "text-gray-500"
                    }
                  />
                </div>
                <span
                  className={`${
                    activeTab === "orders" ? "font-bold" : ""
                  } transition-all`}>
                  {userData?.firstName
                    ? `${userData.firstName}'s Orders`
                    : "Orders"}
                </span>
              </button>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent my-4"></div>

              <button
                className="p-4 rounded-xl transition-all duration-300 flex items-center gap-3 hover:bg-red-900/20 group"
                onClick={handleLogout}>
                <div className="w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                  <LogOut
                    size={18}
                    className="text-gray-500 group-hover:text-red-500 transition-colors"
                  />
                </div>
                <span className="group-hover:text-red-400 transition-colors">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 lg:p-10">
          {activeTab === "details" && userData && (
            <div className="bg-black/30 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border border-zinc-800/50 transition-all duration-300 hover:shadow-red-900/10">
              <div className="flex items-center gap-2 mb-8">
                <div className="h-8 w-2 bg-red-600 rounded-full"></div>
                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
                  {userData.firstName}'s Profile
                </h1>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-400 rounded-full opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-300"></div>
                  <img
                    src={profilePic || "/placeholder.svg"}
                    alt="Profile"
                    className="relative w-32 h-32 rounded-full object-cover border-2 border-zinc-800 group-hover:border-red-500 transition-all duration-300"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded-full">
                      Change Photo
                    </span>
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/30 p-5 rounded-xl border border-zinc-800/50 hover:border-red-900/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/5 group">
                    <h2 className="flex flex-wrap items-center gap-3 text-xl md:text-2xl">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                        <MdOutlinePerson2 className="text-red-500" size={24} />
                      </div>
                      <span className="font-bold text-white">Name:</span>

                      {isEditingName ? (
                        <div className="flex flex-col sm:flex-row gap-2 ml-2 w-full max-w-md">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="First Name"
                              className="w-full bg-black/70 text-white border border-zinc-700 focus:border-red-500 rounded-lg px-3 py-2 outline-none transition-colors"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Last Name"
                              className="w-full bg-black/70 text-white border border-zinc-700 focus:border-red-500 rounded-lg px-3 py-2 outline-none transition-colors"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveName}
                              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg px-4 py-2 transition-all duration-300 shadow-lg hover:shadow-red-600/20">
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setFirstName(userData.firstName);
                                setLastName(userData.lastName);
                                setIsEditingName(false);
                              }}
                              className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg px-4 py-2 transition-colors">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-gray-300 font-medium ml-2">
                            {userData.firstName} {userData.lastName}
                          </span>
                          <button
                            onClick={() => setIsEditingName(true)}
                            className="ml-4 text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit
                          </button>
                        </>
                      )}
                    </h2>
                  </div>

                  <div className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/30 p-5 rounded-xl border border-zinc-800/50 hover:border-red-900/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/5 group">
                    <p className="flex flex-wrap items-center gap-3 text-xl md:text-2xl">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                        <MdAlternateEmail className="text-red-500" size={24} />
                      </div>
                      <span className="font-bold text-white">Email:</span>
                      <span className="text-gray-300 font-medium break-all">
                        {userData.email}
                      </span>
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/30 p-5 rounded-xl border border-zinc-800/50 hover:border-red-900/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/5 group">
                    <p className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                        <TbLockPassword className="text-red-500" size={24} />
                      </div>
                      <Link
                        to="/forgot-password"
                        className="font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 group-hover:gap-3 transition-all">
                        Reset your password
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-black/30 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border border-zinc-800/50 transition-all duration-300 hover:shadow-red-900/10">
              <div className="flex items-center gap-2 mb-8">
                <div className="h-8 w-2 bg-red-600 rounded-full"></div>
                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
                  Your Game Library
                </h1>
              </div>

              {orders?.length > 0 ? (
                <div className="grid gap-10">
                  {orders.map((order, orderIndex) => (
                    <div key={order._id} className="space-y-6">
                      <div className="mb-2">
                        <h3 className="text-xl font-bold text-red-400">
                          Order #{orderIndex + 1}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}{" "}
                          | {order.paymentMethod}
                        </p>
                      </div>

                      {order.games.map((game, gameIndex) => (
                        <div
                          key={game._id}
                          className="bg-zinc-900/40 rounded-xl overflow-hidden shadow-lg border border-zinc-800/50 hover:border-red-900/30 transition-all duration-300 hover:shadow-red-900/10 group">
                          <div className="flex flex-col md:flex-row">
                            <div className="relative md:w-56 h-48 md:h-auto overflow-hidden">
                              <img
                                src={game.poster || "/placeholder.svg"}
                                alt={game.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              <div className="absolute bottom-2 left-2 z-20 bg-red-600/80 text-white text-xs font-bold px-2 py-1 rounded">
                                Game #{gameIndex + 1}
                              </div>
                            </div>

                            <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                              <div>
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                                  {game.name}
                                </h2>
                              </div>

                              <div className="mt-4 flex justify-between items-end">
                                <Link to={`/games/${game._id}`}>
                                  <button className="bg-zinc-800 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                                    View Details
                                  </button>
                                </Link>
                                <div className="text-right">
                                  <p className="text-xs text-gray-400 mb-1">
                                    Price
                                  </p>
                                  <p className="text-2xl font-bold text-white">
                                    ₹{game.discountedPrice}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="text-right text-lg font-semibold text-white">
                        Total Amount: ₹{order.totalAmount}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-zinc-900/40 p-8 rounded-xl text-center border border-zinc-800/50">
                  <ShoppingCart
                    size={48}
                    className="mx-auto mb-4 text-red-500/50"
                  />
                  <p className="text-xl text-gray-400">
                    You haven't purchased any games yet.
                  </p>
                  <Link
                    to="/"
                    className="mt-6 inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                    Browse Games
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
