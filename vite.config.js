import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    extensions: [".js", ".json", ".vue", ".mjs", "wasm"],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  base: "./",
})