const CACHE_NAME = 'g2-midterm-3d-v5';

const CORE_ASSETS = [
  './',
  './index.html',
  './minecraft.html',
  './print-exam.html',
  './manifest.json',
  './css/style.css',
  './css/minecraft.css',
  './js/game.js',
  './js/baseballField.js',
  './js/specialModes.js',
  './js/audio.js',
  './js/minecraftGame.js',
  './js/minecraftWorld.js',
  './js/minecraftSpecialModes.js',
  './js/minecraftAudio.js',
  './js/gameplayUpgrades.js',
  './js/gameLogic.js',
  './js/curriculum.js',
  './js/guidedTeaching.js',
  './js/questions/chinese.js',
  './js/questions/math.js',
  './js/questions/life.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // 針對 esm.sh CDN 套件 (Three.js / canvas-confetti) 採用 Cache-First 離線快取策略
  if (url.hostname === 'esm.sh') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return res;
        });
      })
    );
    return;
  }

  // 本機 HTML/CSS/JS 採用 Network-First + 離線 Cache Fallback，兼顧即時更新與無網路可用性
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
