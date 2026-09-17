import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// fs.allow includes the repo root because the invoice template is imported
// ?raw from Docs/Billing/ (single source of truth, not copied into src).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    fs: {
      allow: [fileURLToPath(new URL('../..', import.meta.url))],
    },
  },
})
