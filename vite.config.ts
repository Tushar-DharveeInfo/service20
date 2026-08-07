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
        manualChunks(id) {
          // Only chunk vendor modules to avoid circular dependencies
          // Let Vite handle app code chunking automatically

          if (id.includes('node_modules')) {
            // Let Vite handle React, ReactDOM, and scheduler automatically
            // Manually chunking React causes circular dependencies with MUI
            if ((id.includes('react-router') || id.includes('@mui') || id.includes('@emotion') || id.includes('primereact') || id.includes('ag-charts') || id.includes('ag-grid') || id.includes('lodash'))) {
              return 'vendor-others';
            }

            // 5. Heavy utilities (lazy load these)
            if (id.includes('xlsx') || id.includes('markdown-it') || id.includes('appqa')) {
              return 'vendor-xlsx-markdown';
            }

            // 7. Let Vite handle other node_modules automatically to avoid circular dependencies
            // Don't use a catch-all return here
          }

          return 'app-service';

          // Let Vite handle other app code chunking automatically; note: Manually chunking app code causes circular dependencies with appqa
        },
        // Asset file naming pattern (CSS is combined into single file due to cssCodeSplit: false)
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
      resolveDependencies: (_filename, deps) => {
        // Strategy: Preload critical chunks that are needed for initial app render
        // Browser will load these in parallel while parsing the main chunk

        // Always preload these critical vendor chunks (needed by most pages)
        const criticalVendors = deps.filter(dep =>
          dep.includes('vendor-router') ||    // React Router (routing)
          dep.includes('vendor-mui') ||       // MUI (UI components)
          dep.includes('vendor-primereact')   // PrimeReact (grid, dialogs)
        );

        return criticalVendors;
      }
    }
  }
})
