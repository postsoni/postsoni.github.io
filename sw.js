// Service Worker - ぽすとそに工房
// 方針：ネットにつながるときは「必ず最新」を表示し、つながらないときだけ保存版を使う（ネットワーク優先）
const CACHE_NAME = 'postsoni-koubou-v1.8.0';
const OFFLINE_URL = '/offline.html';

// 圏外でも最低限表示できるように、最初に保存しておくファイル
const CACHE_FILES = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/offline.html',
    '/postsoni-icon.png',
    '/favicon.ico',
    '/rc-plane-header.jpg'
];

// インストール時：保存しておくファイルを取得し、すぐに新しい版へ切り替える
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_FILES))
            .then(() => self.skipWaiting())
    );
});

// 有効化時：古い版の保存データを削除し、開いているページもすぐ新しい版の管理下に置く
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => Promise.all(
                cacheNames
                    .filter(cacheName => cacheName !== CACHE_NAME)
                    .map(cacheName => caches.delete(cacheName))
            ))
            .then(() => self.clients.claim())
    );
});

// 読み込み時：ネットワーク優先
self.addEventListener('fetch', event => {
    const request = event.request;

    // 送信（GET以外）と、外部サイト（note・YouTube・訪問者カウンターなど）には関わらない
    if (request.method !== 'GET') return;
    if (new URL(request.url).origin !== self.location.origin) return;

    event.respondWith(
        fetch(request)
            .then(response => {
                // 最新版が取れたら、圏外のときのために保存しておく
                if (response && response.status === 200 && response.type === 'basic') {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
                }
                return response;
            })
            .catch(() =>
                // ネットにつながらないときだけ、保存版を使う
                caches.match(request).then(cached => {
                    if (cached) return cached;
                    if (request.mode === 'navigate') return caches.match(OFFLINE_URL);
                    return Response.error();
                })
            )
    );
});
