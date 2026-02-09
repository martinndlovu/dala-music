import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const n8nUrl = env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/webhook': {
          target: n8nUrl,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
