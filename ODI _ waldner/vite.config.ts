import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// Live link to the @node42/ui-kit (New-UIKit) source: the app compiles the
// kit's TS/CSS directly, so edits there hot-reload here with no build.
export default defineConfig({
  // GitHub Pages serves the app under /<repo>/ — CI sets BASE_PATH; local dev stays at /.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@node42/ui-kit': path.resolve(__dirname, '../New-UIKit/src/index.ts'),
    },
    // One copy of React across app + kit source (avoids "Invalid hook call").
    dedupe: ['react', 'react-dom'],
  },
  server: {
    // Allow Vite to read the sibling kit folder outside this app root.
    fs: { allow: ['..'] },
  },
})
