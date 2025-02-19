import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import VerificationEmail from "./pages/VerificationEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Games from "./pages/Games";
import TopRatedGamesPage from "./pages/TopRatedGamesPage";
import FlashSaleGamePage from "./pages/FlashSaleGamePage";
import Under500Games from "./pages/Under500Games";
import Under1000Games from "./pages/Under1000Games";
import GenreGamesPage from "./pages/GenreGamesPage";
import BrowseGames from "./pages/BrowseGames";
import AboutUs from "./pages/AboutUs";
import CartPage from "./pages/CartPage";
import WishListPage from "./pages/WishListPage";
import Profile from "./pages/Profile";
import GamesDetails from "./pages/GamesDetails";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // ✅ Check auth on app load
  }, []);

  if (isCheckingAuth) {
    return <p>Loading...</p>; // Prevent rendering while checking auth
  }
  return (
    <div>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/browse-games" element={<BrowseGames />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishListPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerificationEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/top-rated" element={<TopRatedGamesPage />} />
        <Route path="/flash-sale" element={<FlashSaleGamePage />} />
        <Route path="/under-price-500" element={<Under500Games />} />
        <Route path="/under-price-1000" element={<Under1000Games />} />
        <Route path="/genre/:genre" element={<GenreGamesPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/games/:gameId" element={<GamesDetails />} />
      </Routes>
    </div>
  );
}

export default App;
