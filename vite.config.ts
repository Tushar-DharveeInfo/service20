import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    open: true,
    port: 3000,
  },
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
      onwarn: (warning, warn) => {
        // Suppress "use client" directive warnings from RSC-aware libraries (MUI, PrimeReact, react-router)
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')) return;
        warn(warning);
      },
    },
    chunkSizeWarningLimit: 2000,
    // Combine all CSS into single file to reduce network requests (most CSS chunks are small)
    cssCodeSplit: false,
    // Enable source maps for better debugging (disable in production if needed)
    sourcemap: false,
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Optimize chunk size
    cssMinify: false,
    // Configure module preload for critical chunks
    // This generates <link rel="modulepreload"> tags to load chunks in parallel
    modulePreload: {
      polyfill: true,
    }
  }
})
