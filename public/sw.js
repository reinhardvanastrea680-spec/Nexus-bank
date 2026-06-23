// Nexus Bank Service Worker v2
const CACHE_NAME = "nexus-bank-v2";
const STATIC_ASSETS = ["/", "/manifest.json", "/admin-manifest.json"];

// Install — cache static shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, smart fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET and chrome-extension requests
  if (request.method !== "GET" || request.url.startsWith("chrome-extension")) return;

  // Firebase / API requests — network only, never cache
  if (
    request.url.includes("firestore.googleapis.com") ||
    request.url.includes("firebase") ||
    request.url.includes("googleapis.com")
  ) {
    return;
  }

  // Navigation requests — network first, smart cache fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        const url = new URL(request.url);
        // Admin routes fall back to admin-login, not user home
        if (url.pathname.startsWith("/admin")) {
          return caches.match("/admin-login") || caches.match("/");
        }
        return caches.match("/");
      })
    );
    return;
  }

  // Static assets — cache first
  event.respondWith(
    caches.match(request).then(
      (cached) => cached || fetch(request).then((response) => {
        if (response.ok && response.type !== "opaque") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
    )
  );
});
