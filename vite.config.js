import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import localizedEntries from "./build/localizedEntries.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    base: env.VITE_BASE_PATH || "/muuva/",
    plugins: [react(), localizedEntries()],
  };
});
