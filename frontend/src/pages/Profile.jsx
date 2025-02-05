import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import Navbar from "../components/Navbar";
import { MdOutlinePerson2, MdAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import profilePic from "/profile-pic.png";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuthStore((state) => state);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://${process.env.BACKEND_URL}/api/user/profile",
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
    fetchUserData();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token"); // Clear token from localStorage
    navigate("/login");
  };

  if (loading)
    return <div className="text-white text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="flex flex-col items-center text-white bg-[#0f1115] h-screen">
      <Navbar />
      <div className="flex items-center justify-center gap-4 pt-28">
        <img src={profilePic} alt="" className="w-20" />
        <h1 className="text-3xl font-bold text-white ">Profile</h1>
      </div>
      {isAuthenticated && userData ? (
        <div className="mt-10">
          <h2 className="text-2xl flex items-center gap-2">
            <MdOutlinePerson2 />
            <span className="font-bold">Name: </span>
            {userData.firstName} {userData.lastName}
          </h2>
          <p className="text-lg flex items-center gap-2">
            <MdAlternateEmail />
            <span className="font-bold">Email: </span>
            {userData.email}
          </p>
          <p className="text-lg flex items-center gap-2">
            <TbLockPassword />{" "}
            <span className="font-bold">
              <Link to="/forgot-password">Forgot password?</Link>
            </span>
          </p>
          <button
            className="w-full text-center text-black bg-[#DCFF1E] font-bold p-2 rounded mt-3 hover:bg-[#9ab022]"
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="mt-10">
          <p className="text-lg text-zinc-400">You are not logged in.</p>
          <Link to="/login">
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
              Login
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
