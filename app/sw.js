// This is the service worker file for the PWA

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("coin-flip-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "/coin-flip.mp3",
        "/coin-result.mp3",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png",
        "/icons/maskable-icon.png",
      ])
    }),
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            // Don't cache API calls or external resources
            if (!event.request.url.includes("/api/") && event.request.url.startsWith(self.location.origin)) {
              return caches.open("coin-flip-v1").then((cache) => {
                cache.put(event.request, fetchResponse.clone())
                return fetchResponse
              })
            }
            return fetchResponse
          })
        )
      })
      .catch(() => {
        // Return a fallback for offline navigation
        if (event.request.mode === "navigate") {
          return caches.match("/")
        }
        return null
      }),
  )
})

self.addEventListener("activate", (event) => {
  const cacheWhitelist = ["coin-flip-v1"]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

