import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "../store/authStore";
import "../styles/Common.css";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { motion } from "motion/react";

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuthStore();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();

    const { email, password } = data;
    // console.log({ email, password });

    if (!email || !password) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      await login(email, password);

      if (data.error) {
        toast.error(data.error);
      } else {
        setData({ email: "", password: "" });
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(error);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white bg font-mono tracking-tighter bg">
      <form
        onSubmit={loginUser}
        className="bg-white border border-white/60 backdrop-blur-lg shadow-lg rounded-lg p-8 w-full max-w-sm text-gray-900">
        <h2 className="logo text-center text-2xl mb-4 text-[#FF4438]">
          <a href="/">Pyro</a>
        </h2>
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome back!</h2>
        <div className="mb-4">
          <label className="block font-medium mb-2">Email</label>
          <div className="relative">
            <MdOutlineAlternateEmail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={data.email}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#dcff1e] text-gray-900 placeholder:text-sm pl-10"
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
              placeholder="Enter your password"
              value={data.password}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#dcff1e] text-gray-900 placeholder:text-sm pl-10"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute top-[50.5%] right-[1.1rem] transform -translate-y-1/2 text-gray-500 "
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>

          <p className="text-center text-sm mt-3 text-gray-500">
            <a href="/forgot-password" className="underline text-blue-400">
              Forgot Password?
            </a>
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-[#dcff1e] text-[#091a23] py-2 px-4 rounded-full transition duration-200 border border-[#091a23] hover:bg-[#091a23] hover:text-[#dcff1e] ease-in"
          disabled={isLoading}>
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mx-auto"></div>
          ) : (
            "Login"
          )}
        </motion.button>

        <div className="flex items-center my-3">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="px-4 text-gray-500">Or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="text-center mt-4 w-full ">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            href={GOOGLE_AUTH_URL}
            className="flex items-center justify-center bg-transparent text-black py-2 px-4 rounded-full transition duration-200 border border-black hover:bg-black hover:text-white ease-in">
            <FcGoogle className="mr-4" />
            Login with Google
          </motion.a>
        </div>
        <p className="text-center mt-4 text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="underline text-blue-400">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
