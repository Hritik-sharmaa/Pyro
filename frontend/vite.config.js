import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import slimReactIcons from "./vite-plugins/slim-react-icons.js";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");

  return {
    // slimReactIcons keeps `vite build` under ~512 MB of memory (see the plugin).
    plugins: [slimReactIcons(), react()],
    define: {
      // Base URL of the backend API.
      //  - unset / empty  -> same origin. This is what you want in production when
      //    Express serves the built UI (one deployment hosts UI + API).
      //  - set            -> that URL, e.g. VITE_BACKEND_URL=https://api.example.com
      //    when the frontend is hosted separately from the backend.
      // Defaulting to "" (instead of leaving it undefined) prevents requests to
      // the literal URL "undefined/api/...".
      "import.meta.env.VITE_BACKEND_URL": JSON.stringify(
        env.VITE_BACKEND_URL ?? ""
      ),
    },
    build: {
      // Keep bundles out of /assets, which the backend uses for game posters.
      assetsDir: "static",
    },
    server: {
      // NOTE: this proxy is only used by `npm run dev`.
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
  };
});
