// Service Worker - ぽすとそに工房
const CACHE_NAME = 'postsoni-koubou-v1.7.6';
const OFFLINE_URL = 'offline.html';

// キャッシュするファイル
const CACHE_FILES = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/postsoni-icon.png',
    '/favicon.ico',
    '/rc-plane-header.jpg'
];

// インストール時
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('キャッシュを開きました');
                return cache.addAll(CACHE_FILES);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

// アクティベート時（古いキャッシュを削除）
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => cacheName !== CACHE_NAME)
                    .map(cacheName => {
                        console.log('古いキャッシュを削除:', cacheName);
                        return caches.delete(cacheName);
                    })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// フェッチ時
self.addEventListener('fetch', event => {
    // APIリクエストはキャッシュしない
    if (event.request.url.includes('api.rss2json.com') ||
        event.request.url.includes('note.com') ||
        event.request.url.includes('youtube.com')) {
        return fetch(event.request);
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // キャッシュがあれば返す
                if (response) {
                    // バックグラウンドで更新
                    fetch(event.request).then(fetchResponse => {
                        if (fetchResponse && fetchResponse.status === 200) {
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, fetchResponse.clone());
                            });
                        }
                    }).catch(() => {});
                    
                    return response;
                }
                
                // キャッシュがなければネットワークから取得
                return fetch(event.request).then(fetchResponse => {
                    // 成功したらキャッシュに保存
                    if (fetchResponse && fetchResponse.status === 200 && fetchResponse.type === 'basic') {
                        const responseToCache = fetchResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return fetchResponse;
                }).catch(() => {
                    // オフラインの場合
                    if (event.request.mode === 'navigate') {
                        return caches.match(OFFLINE_URL);
                    }
                });
            })
    );
});
