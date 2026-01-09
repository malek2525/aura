import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: "0.0.0.0",

      // ✅ fix: "Blocked request. This host is not allowed"
      allowedHosts: [
        "localhost",
        ".replit.dev",
        ".replit.app",
        ".picard.replit.dev",
      ],
    },
    resolve: {
      alias: {
        // ✅ IMPORTANT: @ should point to /src (NOT project root)
        "@": path.resolve(__dirname, "src"),
      },
    },
    define: {
      // (optional) keep if you really use these
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
  };
});
