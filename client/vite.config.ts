import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true,
      filename: "stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    host: true,
    allowedHosts: [".ngrok-free.dev"],
    proxy: {
      "/api": {
        target: "http://backend:5000",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://backend:5000",
        ws: true,
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://backend:5000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@shared": path.resolve(__dirname, "./src/shared"),
    },
  },
  optimizeDeps: {
    include: ["recharts"],
  },
  build: {
    commonjsOptions: {
      include: [/recharts/],
    },
  },
});
