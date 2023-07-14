import legacy from "@vitejs/plugin-legacy";

// import { nodePolyfills } from 'vite-plugin-node-polyfills';

// import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy(),
    // nodePolyfills({
    //   // To exclude specific polyfills, add them to this list.
    //   exclude: [
    //     "url", // Excludes the polyfill for `fs` and `node:fs`.
    //   ],
    //   // Whether to polyfill specific globals.
    //   globals: {
    //     Buffer: true, // can also be 'build', 'dev', or false
    //     global: true,
    //     process: true,
    //   },
    //   // Whether to polyfill `node:` protocol imports.
    //   protocolImports: true,
    // }),
    // chunkSplitPlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
});
