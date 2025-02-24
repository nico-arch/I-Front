import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
  },
  define: {
    //API_URL_V1: `"${process.env["API_URL_V1"]}"`,
    API_URL_V1: `"http://localhost:5000/api"`,
	//API_URL_V1: `"http://192.168.25.98:5000/api"`,
  },
});
