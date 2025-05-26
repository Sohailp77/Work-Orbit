import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: true, // listen on all addresses, including LAN
    port: 80, // optional
    strictPort: true, // fail if port is already in use
    cors: true, // enable CORS for all origins
    open: false, // optional: don't auto-open the browser
    hmr: {
      protocol: 'ws', // use websocket for HMR
      host: '10.190.74.125', // or your external IP if needed
    },
  },
})
