/// <reference lib="webworker" />

/// inspired by
/// https://github.com/ibrahima92/pwa-with-vanilla-js/blob/master/serviceWorker.js

const staticCacheName = "edis-game";
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/images/coffee1.jpg",
  "/images/coffee2.jpg",
  "/images/coffee3.jpg",
  "/images/coffee4.jpg",
  "/images/coffee5.jpg",
  "/images/coffee6.jpg",
  "/images/coffee7.jpg",
  "/images/coffee8.jpg",
  "/images/coffee9.jpg",
];

// Default type of `self` is `WorkerGlobalScope & typeof globalThis`
// https://github.com/microsoft/TypeScript/issues/14877
declare let self: ServiceWorkerGlobalScope;

// Example:
self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});

// We need an export to force this file to act like a module, so TS will let us re-type `self`
export default null;
