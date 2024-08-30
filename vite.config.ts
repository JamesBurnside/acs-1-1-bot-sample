import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'acs-1-1-bot-sample',
  plugins: [react()],
})
