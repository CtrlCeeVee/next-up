/* eslint-disable no-restricted-globals */
/// <reference lib="webworker" />

// Service Worker for Next-Up PWA
// Handles: offline caching, push notifications, notification actions

const CACHE_NAME = 'next-up-v5'; // Bumped version to force update
const urlsToCache = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
  // Don't cache root path, index.html or JS assets - let them be fetched fresh
];

// ============================================
// INSTALL - Cache static assets
// ============================================
self.addEventListener('install', (event) => {
  console.log('[Service Work`er] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// ============================================
// ACTIVATE - Clean up old caches
// ============================================
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ============================================
// MESSAGE - Handle messages from app
// ============================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Received SKIP_WAITING message');
    self.skipWaiting();
  }
});

// ============================================
// FETCH - Network-first for HTML/JS, cache for static assets
// ============================================
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // ALWAYS fetch fresh (never cache): auth, API, HTML, JS, CSS
  if (url.pathname.includes('/auth/') || 
      url.pathname.includes('/api/') ||
      url.pathname.includes('supabase.co') ||
      url.pathname.endsWith('.html') ||
      url.pathname === '/' ||
      url.pathname.match(/\.(js|css)$/)) {
    // Network-only strategy with no cache fallback to prevent stale content
    event.respondWith(
      fetch(event.request).catch(() => {
        // If offline, show offline page instead of cached stale content
        if (url.pathname.endsWith('.html') || url.pathname === '/') {
          return new Response(
            '<html><body><h1>Offline</h1><p>Please check your internet connection.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
        throw new Error('Network request failed');
      })
    );
    return;
  }

  // Only cache static assets like images, icons, fonts
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Cache hit
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Only cache successful static asset responses
          if (url.pathname.match(/\.(png|jpg|jpeg|svg|webp|woff|woff2|ico)$/)) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return response;
        }).catch(() => {
          // Network failed, try cache as last resort for static assets only
          return caches.match(event.request);
        });
      })
  );
});

// ============================================
// PUSH - Receive and display notifications
// ============================================
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');

  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Next-Up', body: event.data.text() };
    }
  }

  const title = data.title || 'Next-Up';
  const options = {
    body: data.body || 'New notification',
    icon: data.icon || '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'default',
    data: data.data || {},
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ============================================
// NOTIFICATION CLICK - Handle user interactions
// ============================================
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.action);
  
  event.notification.close();

  const { action } = event;
  const notificationData = event.notification.data || {};
  const { url } = notificationData;

  // Handle specific actions (confirm/dispute scores, accept/reject partnerships)
  if (action === 'confirm-score') {
    event.waitUntil(handleConfirmScore(notificationData));
    return;
  }

  if (action === 'dispute-score') {
    const disputeUrl = url || '/';
    event.waitUntil(clients.openWindow(disputeUrl));
    return;
  }

  if (action === 'accept-partner') {
    event.waitUntil(handleAcceptPartnership(notificationData));
    return;
  }

  if (action === 'reject-partner') {
    event.waitUntil(handleRejectPartnership(notificationData));
    return;
  }

  // Default action - open app to specific URL or home
  const defaultUrl = url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (let client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(defaultUrl);
        }
      })
  );
});

// ============================================
// HELPER FUNCTIONS - API calls from service worker
// ============================================

async function handleConfirmScore(data) {
  try {
    const { matchId, pendingScoreId, leagueId, nightId } = data;
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${self.location.origin}/api/leagues/${leagueId}/nights/${nightId}/matches/${matchId}/confirm-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ pendingScoreId })
    });

    if (!response.ok) {
      throw new Error('Failed to confirm score');
    }

    // Show success notification
    await self.registration.showNotification('Score Confirmed ✓', {
      body: 'Score has been confirmed successfully',
      icon: '/icon-192.png',
      tag: 'score-confirmed',
      vibrate: [100, 50, 100]
    });
  } catch (error) {
    console.error('Error confirming score:', error);
    await self.registration.showNotification('Error', {
      body: 'Failed to confirm score. Please open the app.',
      icon: '/icon-192.png',
      tag: 'score-error'
    });
  }
}

async function handleAcceptPartnership(data) {
  try {
    const { requestId, leagueId, nightId } = data;
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${self.location.origin}/api/leagues/${leagueId}/nights/${nightId}/partnership-requests/${requestId}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to accept partnership');
    }

    await self.registration.showNotification('Partnership Accepted ✓', {
      body: 'Partnership has been confirmed',
      icon: '/icon-192.png',
      tag: 'partnership-accepted',
      vibrate: [100, 50, 100]
    });
  } catch (error) {
    console.error('Error accepting partnership:', error);
    await self.registration.showNotification('Error', {
      body: 'Failed to accept partnership. Please open the app.',
      icon: '/icon-192.png',
      tag: 'partnership-error'
    });
  }
}

async function handleRejectPartnership(data) {
  try {
    const { requestId, leagueId, nightId } = data;
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${self.location.origin}/api/leagues/${leagueId}/nights/${nightId}/partnership-requests/${requestId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to reject partnership');
    }

    await self.registration.showNotification('Partnership Declined', {
      body: 'Partnership request declined',
      icon: '/icon-192.png',
      tag: 'partnership-declined'
    });
  } catch (error) {
    console.error('Error rejecting partnership:', error);
  }
}

async function getAuthToken() {
  // Get auth token from open app windows
  const clients = await self.clients.matchAll({ type: 'window' });
  
  if (clients.length > 0) {
    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        resolve(event.data.token);
      };
      
      // Send message to client asking for auth token
      clients[0].postMessage({ type: 'GET_AUTH_TOKEN' }, [channel.port2]);
      
      // Timeout after 2 seconds
      setTimeout(() => resolve(null), 2000);
    });
  }

  return null;
}
