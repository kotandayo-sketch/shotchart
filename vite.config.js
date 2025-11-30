import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/shotchart/',   // ★ GitHub Pages では絶対必要
  plugins: [react()],
})
