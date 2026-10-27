// Guarda la pantalla para abrirla sin conexión. Los datos (Apps Script) nunca se guardan acá.
const V = 'r21-vend-v1';
const ARCHIVOS = ['./', './index.html', './manifest.webmanifest', '../app/icons/Icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // Primero la red (para que los cambios lleguen); si no hay internet, lo guardado.
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copia = r.clone(); caches.open(V).then(c => c.put(e.request, copia)); }
    return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
