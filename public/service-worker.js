/* Optimized Service Worker for Free Bots XMLs */
const CACHE_NAME = 'freebots-cache-v3'; // bump version when releasing updates

// Resolve manifest URL dynamically
const getManifestURL = () => {
  try {
    const url = new URL(self.location);
    const params = new URLSearchParams(url.search);
    const override = (params.get('bots_domain') || '').toLowerCase().replace(/^www\./, '');
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    const domain = override || hostname;
    return `/xml/${encodeURIComponent(domain)}/bots.json`;
  } catch (_) {
    return '/xml/bots.json';
  }
};

const MANIFEST_URL = getManifestURL();

// Install: pre-cache manifest + top bots
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const res = await fetch(MANIFEST_URL, { cache: 'no-cache' });
        if (res.ok) {
          await cache.put(MANIFEST_URL, res.clone());
          const items = await res.json();
          const files = Array.isArray(items) ? items.slice(0, 5).map(i => `/xml/${encodeURIComponent(i.file)}`) : [];
          await Promise.all(
            files.map(async url => {
              try {
                const resp = await fetch(url, { cache: 'no-cache' });
                if (resp.ok) await cache.put(url, resp.clone());
              } catch (_) {}
            })
          );
        }
      } catch (_) {
        // fallback: manifest will be cached lazily
      }
    })()
  );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)));
      self.clients.claim();
    })()
  );
});

// Fetch: stale-while-revalidate for XML + manifest
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  const isXml = url.pathname.startsWith('/xml/');
  const isManifest = url.pathname === MANIFEST_URL;
  if (!isXml && !isManifest) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);

      // Always update in background
      event.waitUntil(
        (async () => {
          try {
            const fresh = await fetch(request, { cache: 'no-cache' });
            if (fresh.ok) await cache.put(request, fresh.clone());
          } catch (_) {}
        })()
      );

      if (cached) return cached;

      // No cache -> fetch and cache
      try {
        const resp = await fetch(request, { cache: 'no-cache' });
        if (resp.ok) await cache.put(request, resp.clone());
        return resp;
      } catch (_) {
        return new Response('Offline - bots unavailable', { status: 503, statusText: 'Offline' });
      }
    })()
  );
});

// Background sync for bots cache
self.addEventListener('sync', event => {
  if (event.tag === 'sync-bots') {
    event.waitUntil(
      (async () => {
        try {
          const res = await fetch(MANIFEST_URL, { cache: 'no-cache' });
          if (res.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(MANIFEST_URL, res.clone());
          }
        } catch (_) {}
      })()
    );
  }
});

