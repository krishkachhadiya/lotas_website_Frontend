import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  // ADDED: Force preview to run on port 5173 to match backend CORS settings
  preview: {
    port: 5173,
    strictPort: true,
  }
})    