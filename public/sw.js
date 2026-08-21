// Apno Dhun Service Worker (PWA Offline Caching & High Performance)
const CACHE_NAME = 'apnodhun-cache-v2';

// Static assets to pre-cache on install for 0ms loading
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/logo.webp',
  '/apno-dhun-logo.webp',
  '/safa-icon.webp',
  '/panchayat.webp',
  '/chat-icon.webp',
  '/backgrounds/wedding.webp',
  '/backgrounds/folk.webp',
  '/backgrounds/rap-desktop.webp',
  '/backgrounds/trending.webp',
  '/backgrounds/devotional.webp',
  '/titles/byaav.webp',
  '/titles/lok.webp',
  '/titles/dhh.webp',
  '/titles/trend.webp',
  '/titles/bhakti.webp',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Do NOT cache API requests, WebSockets, or YouTube video streams
  if (
    event.request.method !== 'GET' ||
    requestUrl.origin.includes('supabase') ||
    requestUrl.origin.includes('youtube') ||
    requestUrl.origin.includes('googlevideo') ||
    requestUrl.origin.includes('vercel-insights')
  ) {
    return;
  }

  // Cache-first for static assets (images, fonts, stylesheets, scripts)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached and fetch update in background (Stale-While-Revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Offline fallback for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});
