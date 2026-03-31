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
        rewrite: () => '/svc/connections/v2/current.json',
      },
    },
  },
})
