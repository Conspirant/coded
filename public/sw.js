// Caching disabled: minimal no-op service worker to immediately take control and avoid caching
const CACHE_NAME = 'disabled';
const STATIC_CACHE = 'disabled-static';
const DYNAMIC_CACHE = 'disabled-dynamic';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/kcet_cutoffs.json',
  '/kcet_cutoffs_consolidated.json',
  '/data/kcet_cutoffs_consolidated.json',
  '/data/news.json',
  '/placeholder.svg'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Clear all caches if any exist
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Always let the network handle requests; no caching
});

// Background sync for offline data
self.addEventListener('sync', () => {});

// Push notification handling
self.addEventListener('push', () => {});

// Notification click handling
self.addEventListener('notificationclick', () => {});

// Helper function for background sync
async function syncData() {}

// Message handling for communication with main thread
self.addEventListener('message', () => {});
