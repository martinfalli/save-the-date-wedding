import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/save-the-date-wedding/',
  server: {
    port: 5173,
    host: true
  },
  esbuild: {
    loader: 'jsx',
    include: /\.[jt]sx?$/
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  }
}) 