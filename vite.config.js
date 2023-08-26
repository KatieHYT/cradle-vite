import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [react()],
  css: {
      preprocessorOptions: {
        // Import your component-specific CSS file
        postcss: {
          plugins: [('./src/App.css')],
        },
      },
    },
})
