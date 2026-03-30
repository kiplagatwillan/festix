import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Manual Chunking: Separates vendor code (MUI, Framer) from your logic
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@mui")) return "vendor_mui";
            if (id.includes("framer-motion")) return "vendor_motion";
            if (id.includes("lucide-react")) return "vendor_icons";
            return "vendor_core";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
