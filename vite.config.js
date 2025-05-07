import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//import tailwind for configure with vite 
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
})
