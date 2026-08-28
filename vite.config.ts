import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      port: 5173,
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
        "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com https://*.firebase.com https://*.firebaseio.com https://*.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://*.firebase.com https://*.firebaseio.com https://*.googleapis.com wss://*.firebaseio.com; frame-ancestors 'none';",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
  },
  nitro: {
    preset: "vercel",
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
