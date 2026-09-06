/* eslint-disable no-restricted-globals */
/// <reference lib="webworker" />

// Self-destructing service worker.
//
// The Next-Up website is now a thin marketing/redirect site; all real
// functionality lives in the native apps. This worker replaces the old
// PWA/offline/push service worker. When the browser picks it up (on the next
// SW update check), it clears every cache, unregisters itself, and reloads any
// open windows so returning visitors and installed PWAs land on the current
// site with no service worker left behind.

self.addEventListener('install', () => {
  // Activate immediately, skipping the waiting phase.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Drop all Cache Storage left over from the old PWA.
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      } catch (error) {
        console.error('Service worker teardown: failed to clear caches:', error);
      }

      // Remove this service worker registration entirely.
      await self.registration.unregister();

      // Reload any open windows/PWA shells so they re-fetch from the network.
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => {
        if ('navigate' in client) {
          client.navigate(client.url);
        }
      });
    })()
  );
});
