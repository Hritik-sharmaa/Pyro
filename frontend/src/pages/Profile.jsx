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
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user || !user.userId) {
      setLoading(false);
      return;
    }

    fetchUserData();
    fetchOrders();
  }, [isAuthenticated, user]);

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
      <div className="flex items-center justify-center h-screen bg-[#0b0d11]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-[#0b0d11]">
        <div className="bg-red-900/30 text-red-400 p-6 rounded-lg border border-red-700">
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">
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
        <div className="w-full md:w-1/5 bg-black/50 backdrop-blur-sm p-6 md:min-h-screen">
          <div className="sticky top-24">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-10 w-1 bg-red-600 rounded-full"></div>
              <h2 className="text-2xl font-extrabold">Dashboard</h2>
            </div>

            <div className="flex flex-col gap-3">
              <button
                className={`p-4 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                  activeTab === "details"
                    ? "bg-gradient-to-r from-red-700/40 to-red-900/20 border-l-4 border-red-600"
                    : "hover:bg-zinc-900/50"
                }`}
                onClick={() => setActiveTab("details")}>
                <User
                  size={20}
                  className={
                    activeTab === "details" ? "text-red-500" : "text-gray-500"
                  }
                />
                <span className={activeTab === "details" ? "font-bold" : ""}>
                  Profile
                </span>
              </button>

              <button
                className={`p-4 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                  activeTab === "orders"
                    ? "bg-gradient-to-r from-red-700/40 to-red-900/20 border-l-4 border-red-600"
                    : "hover:bg-zinc-900/50"
                }`}
                onClick={() => setActiveTab("orders")}>
                <ShoppingCart
                  size={20}
                  className={
                    activeTab === "orders" ? "text-red-500" : "text-gray-500"
                  }
                />
                <span className={activeTab === "orders" ? "font-bold" : ""}>
                  {userData?.firstName
                    ? `${userData.firstName}'s Orders`
                    : "Orders"}
                </span>
              </button>

              <button
                className="p-4 rounded-xl transition-all duration-300 flex items-center gap-3 hover:bg-zinc-900/50 mt-6 group"
                onClick={handleLogout}>
                <LogOut
                  size={20}
                  className="text-gray-500 group-hover:text-red-500 transition-colors"
                />
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
                 
                  <img
                    src={profilePic || "/placeholder.svg"}
                    alt="Profile"
                    className="relative w-32 h-32 rounded-full object-cover"
                  />
                </div>

                <div className="space-y-4 flex-1">
                  <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50 hover:border-red-900/30 transition-colors">
                    <h2 className="flex items-center gap-3 text-xl md:text-2xl">
                      <MdOutlinePerson2 className="text-red-500" size={24} />
                      <span className="font-bold text-white">Name:</span>
                      <span className="text-gray-300 font-medium">
                        {userData.firstName} {userData.lastName}
                      </span>
                    </h2>
                  </div>

                  <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50 hover:border-red-900/30 transition-colors">
                    <p className="flex items-center gap-3 text-xl md:text-2xl">
                      <MdAlternateEmail className="text-red-500" size={24} />
                      <span className="font-bold text-white">Email:</span>
                      <span className="text-gray-300 font-medium">
                        {userData.email}
                      </span>
                    </p>
                  </div>

                  <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50 hover:border-red-900/30 transition-colors">
                    <p className="flex items-center gap-3">
                      <TbLockPassword className="text-red-500" size={24} />
                      <Link
                        to="/forgot-password"
                        className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Reset your password
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
                <div className="grid gap-6">
                  {orders.map((order, index) => (
                    <div
                      key={order._id}
                      className="bg-zinc-900/40 rounded-xl overflow-hidden shadow-lg border border-zinc-800/50 hover:border-red-900/30 transition-all duration-300 hover:shadow-red-900/10 group">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative md:w-56 h-48 md:h-auto overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                          <img
                            src={order.games[0]?.poster || "/placeholder.svg"}
                            alt={order.games[0]?.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute bottom-2 left-2 z-20 bg-red-600/80 text-white text-xs font-bold px-2 py-1 rounded">
                            #{index + 1}
                          </div>
                        </div>

                        <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                          <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                              {order.games[0]?.name}
                            </h2>

                            <div className="flex flex-wrap gap-3 mt-3">
                              <div className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1.5 rounded-full text-sm">
                                <Clock size={14} className="text-red-400" />
                                <span className="text-gray-300">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1.5 rounded-full text-sm">
                                <CreditCard
                                  size={14}
                                  className="text-red-400"
                                />
                                <span className="text-gray-300">
                                  {order.paymentMethod}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-between items-end">
                            <Link to={`/games/${order.games[0]?._id}`}>
                              <button className="bg-zinc-800 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                                View Details
                              </button>
                            </Link>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-white">
                                ₹{order.totalAmount}
                              </p>
                            </div>
                          </div>
                        </div>
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
