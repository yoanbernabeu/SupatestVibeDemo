import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path pour GitHub Pages - à adapter selon le nom du repo
  // Ex: /mon-repo/ ou laisser '/' si domaine custom
  base: process.env.GITHUB_ACTIONS ? '/SupatestVibeDemo/' : '/',
})
