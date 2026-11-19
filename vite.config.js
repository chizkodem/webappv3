import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync } from "node:fs";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "copy-index-to-404",
      closeBundle() {
        copyFileSync("dist/index.html", "dist/404.html");
      },
    },
  ],
});
