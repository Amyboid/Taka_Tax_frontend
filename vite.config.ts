import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    // host: "192.168.61.210" ,
    proxy: {
      "/api": {
        target: "https://taka-tax.onrender.com",
        rewrite: (path) => path.replace(/^\/api/, ""),
        changeOrigin: true,
        // secure: false,
      },
    },
  },
});
