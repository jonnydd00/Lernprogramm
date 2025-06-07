const CACHE_NAME = 'lernprogramm-v2';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './js/model.js',
  './js/view.js',
  './js/presenter.js',
  './manifest.json',
];

// Installations-Event: Dateien cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Aktivierungs-Event: Alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch-Event: Aus Cache oder Netzwerk laden
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});