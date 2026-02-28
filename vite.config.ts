import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

// Custom plugin to copy _redirects file
const copyRedirectsPlugin = () => ({
  name: 'copy-redirects',
  closeBundle() {
    const distDir = path.resolve(__dirname, 'dist')
    if (!existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true })
    }
    copyFileSync(
      path.resolve(__dirname, '_redirects'),
      path.resolve(distDir, '_redirects')
    )
    console.log('Copied _redirects to dist folder')
  }
})

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react(), copyRedirectsPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
