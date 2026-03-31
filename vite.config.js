import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/puzzle': {
        target: 'https://www.nytimes.com',
        changeOrigin: true,
        rewrite: () => {
          const today = new Date().toISOString().slice(0, 10)
          return `/svc/connections/v2/${today}.json`
        },
      },
    },
  },
})
