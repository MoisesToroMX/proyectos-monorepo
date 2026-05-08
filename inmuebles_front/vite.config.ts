import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          if (id.includes('@heroui')) return 'heroui'
          if (id.includes('@react-aria') || id.includes('@react-types')) {
            return 'react-aria'
          }
          if (id.includes('@react-stately')) return 'react-stately'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('@reduxjs') || id.includes('react-redux')) {
            return 'state'
          }
          if (id.includes('react-router')) return 'router'
          if (id.includes('axios')) return 'http'

          return 'vendor'
        },
      },
    },
  },
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  test: {
    css: true,
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
