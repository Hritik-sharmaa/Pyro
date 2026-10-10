import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useAuthStore } from "../store/authStore";
import "../styles/Common.css";
import { MdOutlinePerson } from "react-icons/md";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { motion } from "motion/react";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { register, isLoading, error, user } = useAuthStore();
  // console.log("user is: ",user);

  const registerUser = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = data;
    console.log("Data is: ", data);

    //validations
    if (!firstName || !lastName || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      await register(firstName, lastName, email, password);
    } catch (err) {
      toast.error(err.message || "Registration failed");
      return;
    }

    setData({ firstName: "", lastName: "", email: "", password: "" });
    toast.success("Registration successfull, Please Verify!");
    navigate("/verify-email"); //redirect to verify email page
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 bg font-mono tracking-tighter bg">
      <form
        onSubmit={registerUser}
        className="w-full max-w-md bg-white border border-white/60 backdrop-blur-lg shadow-lg rounded-lg p-8 text-gray-900">
        <h2 className="logo text-center text-2xl mb-4 text-[#FF4438]">
          <a href="/">Pyro</a>
        </h2>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create an Account
        </h2>
        <div className="flex space-x-4 mb-4 text-gray-900">
          <div className="w-1/2">
            <label className="block font-medium mb-2">First name</label>
            <div className="relative">
              <MdOutlinePerson
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Enter first name"
                value={data.firstName}
                className="w-full border bg-transparent border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-[13px] pl-10"
                onChange={(e) =>
                  setData({ ...data, firstName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="w-1/2">
            <label className="block font-medium mb-2">Last name</label>
            <div className="relative">
              <MdOutlinePerson
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Enter last name"
                value={data.lastName}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-blue-500  text-gray-900 placeholder:text-[13px] pl-10"
                onChange={(e) => setData({ ...data, lastName: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">Email</label>
          <div className="relative">
            <MdOutlineAlternateEmail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="email"
              placeholder="Enter email"
              value={data.email}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder:text-[13px] pl-10"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block font-medium mb-2">Password</label>
          <div className="relative">
            <TbLockPassword
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={data.password}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-sm text-gray-900 placeholder:text-[13px] pl-10"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute top-[50%] right-[1rem] transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full border border-blue-900 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-200"
          disabled={isLoading}>
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mx-auto"></div>
          ) : (
            "Create an account"
          )}
        </motion.button>
        <p className="text-center mt-5 text-gray-500">
          Already have account then{" "}
          <Link to="/login" className="underline text-blue-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
