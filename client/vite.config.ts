import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget =
    env.VITE_API_PROXY_TARGET?.trim() ||
    (env.DOCKER_CONTAINER ? "http://backend:5000" : "http://localhost:5000");

  return {
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
          target: proxyTarget,
          changeOrigin: true,
        },
        "/socket.io": {
          target: proxyTarget,
          ws: true,
          changeOrigin: true,
        },
        "/uploads": {
          target: proxyTarget,
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
  };
});
