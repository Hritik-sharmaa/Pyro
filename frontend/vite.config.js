import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Your backend server
        changeOrigin: true,
        secure: false,
      },
      "/assets": {
        target: "http://localhost:3000", // Proxy for static files
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

// NOTE: The proxy below is only used during local development. In production, API calls use the VITE_BACKEND_URL from the .env file.
