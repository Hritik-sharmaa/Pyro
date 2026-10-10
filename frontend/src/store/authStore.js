import { create } from "zustand";
import decode from "jwt-decode";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

export const useAuthStore = create((set) => ({
  user: null,
  userId: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  wishlistCount: 0,

  setWishlistCount: (count) => set({ wishlistCount: count }),

  register: async (firstName, lastName, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Registration failed");
      }
      set({ isLoading: false, isAuthenticated: true, user: data.user });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.log(error);
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      set({ isLoading: false, isAuthenticated: true, user: data.user });
    } catch (err) {
      set({ isLoading: false, error: err.message });
      console.log(err);
      throw err;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = decode(token);
        //console.log("decode message: ", decoded)
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          set({ isAuthenticated: false, isCheckingAuth: false });
          localStorage.removeItem("token");
        } else {
          set({
            user: decoded,
            userId: decoded.userId,
            isAuthenticated: true,
            isCheckingAuth: false,
          });
          // setUserId(decoded.userId);
        }
      } catch (err) {
        set({ isAuthenticated: false, isCheckingAuth: false });
      }
    } else {
      set({ isAuthenticated: false, isCheckingAuth: false });
    }
    set({ isLoading: false });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      //console.log("API Response:", data);

      if (response.ok) {
        if (!data.token) {
          throw new Error("Token not received.");
        }
        // Save token in localStorage or cookies
        localStorage.setItem("token", data.token);
        //console.log("Token received:", data.token);
        const decoded = decode(data.token);
        //console.log("Decoded token:", decoded);
        set({
          isLoading: false,
          isAuthenticated: true,
          user: decoded,
          userId: decoded.userId,
        });
        // setUserId(decoded.userId);
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      set({ isLoading: false, error: err.message });
      console.log(err);
      throw err;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send reset link.");
      }

      const data = await response.json();
      console.log(data);
      set({ isLoading: false, success: true, message: data.message });
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.log(error);
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      set({ isLoading: false, message: data.message });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.log(error);
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }
      // Clear local storage
      localStorage.removeItem("token");

      // Reset the auth state
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      });
      // setUserId(null);
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.log(error);
      throw error;
    }
  },
}));
