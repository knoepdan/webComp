const cacheName = "web_comp_v1";

// hardcoded for now (to be improved.. autogenerate it)
const assets = [
  "/",
  "/index.html",
//  "/assets/index-D-VLIVcx.css",
//  "/assets/index-BLMf7nB6.js",
  "/img/birdSmaller.jpg",
  "/img/LionSmaller.jpg",
  "/icon/72.jpg",
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log("[Service Worker] Caching appContent");
      await cache.addAll(assets);
    })()
  );
});

self.addEventListener("activate", (e) => {
  console.log("Service worker activated (clear items no longer chached)");
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === cacheName) {
            return;
          }
          return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});
