import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://manpowers.es/backend',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/backend': {
        target: 'https://manpowers.es',
        changeOrigin: true,
        secure: true
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1024
  }
})
