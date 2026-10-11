import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    tailwindcss(),
    // The Node build is only for direct handler smoke checks. Deployment uses Workers.
    ...(mode === "node-smoke" ? [] : [cloudflare({ viteEnvironment: { name: "ssr" } })]),
    tanstackStart(),
    react(),
  ],
  server: { port: 4173, allowedHosts: ["terminal.local"] },
}));
