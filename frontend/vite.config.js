import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
    // when we will use hljs to highight then we will use this
    // proxy: {
    //   "/cdn": {
    //     target: "http://unpkg.com",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/cdn/, ""),
    //   },
    // }
  },
});
