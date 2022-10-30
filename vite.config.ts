import { defineConfig } from "vite";

import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        }
    },
    server: {
        headers: {
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
        }
    },
    build:{
        rollupOptions: {
          input: "index.html",
        },
        terserOptions: {
            compress: {
                drop_debugger: false,
            }
        }
      }    
})