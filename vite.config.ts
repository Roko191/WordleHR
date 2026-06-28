import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/wordle/',
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
})