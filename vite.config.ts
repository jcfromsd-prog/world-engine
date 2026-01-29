import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Trigger Restart for Tailwind Config Loading
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
