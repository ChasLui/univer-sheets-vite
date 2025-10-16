import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  
  // Rolldown-specific optimizations
  experimental: {
    // Enable native plugins for better performance
    enableNativePlugin: 'v1',
  },
  
  build: {
    // Use advancedChunks instead of manualChunks for better chunk splitting
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
            },
            {
              name: 'univer',
              test: /[\\/]node_modules[\\/]@univerjs[\\/]/,
            },
          ],
        },
      },
    },
    // Increase chunk size warning limit since Univer is a large library
    chunkSizeWarningLimit: 1000,
  },
});
