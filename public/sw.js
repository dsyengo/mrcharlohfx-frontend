// public/sw.js
const CACHE_NAME = "elitetraders-cache-v1";
const URLS_TO_CACHE = ["/", "/index.html", "/deriv"]; // you can add more

self.addEventListener("install", event => {
    console.log("[SW] Installing...");
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(URLS_TO_CACHE);
        })
    );
});

self.addEventListener("activate", event => {
    console.log("[SW] Activated");
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(name => {
                    if (name !== CACHE_NAME) return caches.delete(name);
                })
            )
        )
    );
    return self.clients.claim();
});

self.addEventListener("fetch", event => {
    const req = event.request;

    // ⚡ Only handle GET requests
    if (req.method !== "GET") return;

    // ⚡ Try cache first, then network
    event.respondWith(
        caches.match(req).then(cachedResponse => {
            if (cachedResponse) return cachedResponse;
            return fetch(req)
                .then(networkResponse => {
                    // Cache Deriv proxy and static assets
                    if (req.url.includes("/deriv") || req.url.endsWith(".js") || req.url.endsWith(".css")) {
                        caches.open(CACHE_NAME).then(cache => cache.put(req, networkResponse.clone()));
                    }
                    return networkResponse;
                })
                .catch(() => caches.match("/offline.html")); // optional offline fallback
        })
    );
});
