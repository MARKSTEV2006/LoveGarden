
// ==========================================
// LOVE GARDEN - PWA SERVICE WORKER
// PHOTO & VIDEO GALLERY EDITION
// ==========================================

const VERSION = 'love-garden-gallery-v5-speed';

const CORE = [
  './',
  './index.html',
  './styles.css',
  './gallery.css',
  './app.js',
  './config.js',
  './manifest.webmanifest',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-180.png'
];

// INSTALL SERVICE WORKER

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

// REMOVE OLD CACHES

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== VERSION)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// NETWORK REQUESTS

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  // Video streaming needs normal HTTP Range handling.
  if (
    /\.(mp4|webm|mov)$/i.test(url.pathname) ||
    event.request.headers.has('range')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();

          event.waitUntil(
            caches.open(VERSION)
              .then((cache) => {
                return cache.put(event.request, copy);
              })
          );
        }

        return response;
      })
      .catch(async () => {
        const cached =
          await caches.match(event.request);

        if (cached) return cached;

        if (event.request.mode === 'navigate') {
          return (
            await caches.match('./index.html')
          ) || Response.error();
        }

        return Response.error();
      })
  );
});
