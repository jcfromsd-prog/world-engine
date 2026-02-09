import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true, // Expose to network (optional but good for testing)
    // https: false // Removed to fix TS error; defaults to HTTP
  }
})
