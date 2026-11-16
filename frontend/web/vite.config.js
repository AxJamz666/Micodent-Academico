import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
function readPort(value, fallback) {
  if (!value) return fallback
  if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 65535) throw new Error('VITE_PORT_INVALID')
  return Number(value)
}

export function createViteConfig(env = {}) {
  const target = env.DEV_API_PROXY_TARGET || 'http://127.0.0.1:4000'
  let url
  try { url = new URL(target) } catch { throw new Error('VITE_DEV_PROXY_INVALID') }
  if (url.protocol !== 'http:' || !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
      || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('VITE_DEV_PROXY_INVALID')
  }
  return {
    plugins: [react()],
    server: { host: env.HOST || 'localhost', port: readPort(env.PORT, 5173), proxy: {
      '/api': { target, changeOrigin: false },
      '/uploads': { target, changeOrigin: false },
    } },
    preview: { host: env.HOST || 'localhost', port: readPort(env.PORT, 4173) },
  }
}

export default defineConfig(({ mode }) => createViteConfig({
  ...loadEnv(mode, process.cwd(), ''),
  ...process.env,
}))
