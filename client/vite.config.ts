<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
=======
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
>>>>>>> 73e3d77bffa835c174f5a328cebf8a0dded8809f

export default defineConfig({
<<<<<<< HEAD
  plugins: [react()],
  resolve: {
    alias: {
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
})
=======
  plugins: [react(), tailwindcss()],
});
>>>>>>> 73e3d77bffa835c174f5a328cebf8a0dded8809f
