import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import Navbar from "../components/Navbar";
import { MdOutlinePerson2, MdAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FiShoppingCart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import profilePic from "/profile-pic.png";
import { User, ShoppingCart, LogOut } from "lucide-react";
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
    //console.log("User in useEffect:", user);
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
      //console.log("User Data:", data);
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
    return <div className="text-white text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="flex flex-col bg-[#0b0d11] h-screen text-white font">
      <Navbar />
      <div className="flex h-full">
        <div className="w-1/5 bg-black p-6 flex flex-col gap-4 text-lg font-semibold pt-28 px-14">
          <p className="text-2xl font-extrabold mb-10">Dashboard</p>
          <button
            className={`p-3 rounded-2xl transition flex gap-3 ${
              activeTab === "details"
                ? "bg-zinc-900 text-white"
                : "hover:bg-zinc-950"
            }`}
            onClick={() => setActiveTab("details")}>
            <User color={activeTab === "details" ? "#db0021" : "#464649"} />
            Profile
          </button>
          <button
            className={`p-3 rounded-2xl transition flex gap-3 ${
              activeTab === "orders"
                ? "bg-zinc-950 text-white"
                : "hover:bg-zinc-950"
            }`}
            onClick={() => setActiveTab("orders")}>
            <ShoppingCart
              color={activeTab === "orders" ? "#db0021" : "#464649"}
            />
            {userData.firstName}'s Orders
          </button>
          <button
            className={`p-3 rounded-2xl transition flex gap-3 hover:bg-zinc-950
            }`}
            onClick={handleLogout}>
            <LogOut color="#464649" />
            Logout
          </button>
        </div>

        <div className="w-3/4 p-10 mt-20">
          {activeTab === "details" && userData && (
            <div className="bg-zinc-900 p-6 rounded-xl shadow-lg">
              <h1 className="text-4xl font-extrabold text-red-500">
                {userData.firstName}'s Profile
              </h1>
              <div className="flex items-center gap-6 mt-6">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-32 h-32 rounded-full shadow-lg "
                />
                <div>
                  <h2 className="text-2xl flex items-center gap-2">
                    <MdOutlinePerson2 className="text-red-500" />
                    <span className="font-bold text-white">Name:</span>
                    <span className="text-gray-300">
                      {userData.firstName} {userData.lastName}
                    </span>
                  </h2>
                  <p className="text-2xl flex items-center gap-2">
                    <MdAlternateEmail className="text-red-500" />
                    <span className="font-bold text-white">Email:</span>
                    <span className="text-gray-300">{userData.email}</span>
                  </p>
                  <p className="text-xl flex items-center gap-2 mt-2">
                    <TbLockPassword className="text-red-500" />
                    <Link
                      to="/forgot-password"
                      className="font-bold underline text-blue-400 hover:text-blue-500 transition">
                      Forgot password?
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-zinc-900 p-6 rounded-xl shadow-lg">
              <h1 className="text-4xl font-extrabold text-red-500">
                Previous Orders
              </h1>
              {orders?.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {orders.map((order, index) => (
                    <div
                      key={order._id}
                      className="flex items-center bg-white text-black rounded-lg overflow-hidden shadow-md p-4">
                      <span className="text-xl font-bold mr-4">
                        {index + 1}
                      </span>
                      <div className="flex items-center w-full">
                        <img
                          src={order.games[0]?.poster}
                          alt={order.games[0]?.name}
                          className="w-56 h-28 object-cover rounded-lg"
                        />
                        <div className="ml-4 flex-1">
                          <h2 className="text-xl font-bold">
                            {order.games[0]?.name}
                          </h2>
                          <p className="text-sm text-gray-600">
                            Purchased Date:{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            ₹{order.totalAmount}
                          </p>
                          <p className="text-sm text-gray-600">
                            Payment Method: {order.paymentMethod}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-lg text-gray-400">
                  You have no previous orders.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
