import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
      preprocessorOptions: {
        // Import your component-specific CSS file
        postcss: {
          plugins: [require('tailwindcss')('./src/App.css')],
        },
      },
    },
})
