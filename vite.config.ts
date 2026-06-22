import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      port: 5173,
    },
    build: {
      // Raise warning limit — we're splitting manually below
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // ── Manual chunk splitting ────────────────────────────────────
          // Splits the single massive bundle into smaller cacheable pieces.
          // The browser can load only what it needs and cache each chunk
          // independently — dramatically reduces TBT and FCP.
          manualChunks(id: string) {
            // React runtime — smallest, most cached
            if (id.includes("node_modules/react/") ||
                id.includes("node_modules/react-dom/") ||
                id.includes("node_modules/scheduler/")) {
              return "vendor-react";
            }
            // TanStack Router + Query — changes rarely
            if (id.includes("node_modules/@tanstack/react-router") ||
                id.includes("node_modules/@tanstack/react-query") ||
                id.includes("node_modules/@tanstack/react-start") ||
                id.includes("node_modules/@tanstack/router-plugin")) {
              return "vendor-tanstack";
            }
            // Firebase — large but rarely changes
            if (id.includes("node_modules/firebase")) {
              return "vendor-firebase";
            }
            // Recharts — only used on a few pages
            if (id.includes("node_modules/recharts") ||
                id.includes("node_modules/d3-") ||
                id.includes("node_modules/victory-")) {
              return "vendor-charts";
            }
            // Radix UI — split from app code
            if (id.includes("node_modules/@radix-ui")) {
              return "vendor-radix";
            }
            // All other node_modules → single vendor chunk
            if (id.includes("node_modules/")) {
              return "vendor-misc";
            }
            // Admin routes → separate chunk (most users won't load these)
            if (id.includes("/routes/admin")) {
              return "routes-admin";
            }
            // User transfer routes (largest files)
            if (id.includes("wire-transfer") ||
                id.includes("local-transfer") ||
                id.includes("check-deposit") ||
                id.includes("buy-crypto") ||
                id.includes("card-deposit") ||
                id.includes("crypto-deposit")) {
              return "routes-transfers";
            }
          },
        },
      },
    },
  },
  nitro: {
    preset: "vercel",
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
