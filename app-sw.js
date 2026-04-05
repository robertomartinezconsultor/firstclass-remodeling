const CACHE = "first-class-portal-v6";
const ASSETS = [
  "./",
  "./index.html",
  "./app.html",
  "./portal.html",
  "./client-app.webmanifest",
  "./manifest.webmanifest",
  "./apple-touch-icon-180.png",
  "./icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("./app.html");
        }
        return caches.match("./app.html");
      });
    })
  );
});
