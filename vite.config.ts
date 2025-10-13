import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/dtrader": {
        target: "https://dbot.deriv.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dtrader/, ""),
        secure: true,
      },
    },
  },
});
