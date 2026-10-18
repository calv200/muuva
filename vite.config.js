import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import localizedEntries from "./build/localizedEntries.js";

export default defineConfig({
  base: "/muuva/",
  plugins: [react(), localizedEntries()],
});
