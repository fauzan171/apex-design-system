import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import type { IncomingMessage, ServerResponse } from "http"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://appex-erp-be-staging.itobsidianmuda.workers.dev",
        changeOrigin: true,
        secure: true,
        // Configure cookie handling for development
        configure: (proxy, _options) => {
          proxy.on("proxyRes", (proxyRes: IncomingMessage, req: IncomingMessage, res: ServerResponse) => {
            // Get Set-Cookie headers from backend
            const setCookie = proxyRes.headers["set-cookie"]
            if (setCookie) {
              // Modify cookies to work in development (remove Secure flag, rewrite domain)
              const modifiedCookies = setCookie.map((cookie) => {
                return cookie
                  .replace(/;\s*Secure/gi, "") // Remove Secure flag for localhost
                  .replace(/;\s*SameSite=Strict/gi, "; SameSite=Lax") // Change to Lax for dev
              })
              proxyRes.headers["set-cookie"] = modifiedCookies
            }
          })
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});