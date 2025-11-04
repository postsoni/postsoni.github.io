// Service Worker for PWA
const CACHE_NAME = 'postsoni-v1';
const urlsToCache = [
  '/postori-site/',
  '/postori-site/index.html',
  '/postori-site/style.css',
  '/postori-site/app.js',
  '/postori-site/contact.html',
  '/postori-site/404.html',
  '/postori-site/postsoni-icon.png',
  '/postori-site/rc-plane-header.jpg'
];

// インストール時
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('キャッシュを開きました');
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチ時
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュがあれば返す、なければネットワークから取得
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// 古いキャッシュの削除
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
