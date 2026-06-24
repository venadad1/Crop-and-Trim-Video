// ClipForge Service Worker — scoped to /editor.html
// Injects COOP/COEP headers for ffmpeg.wasm SharedArrayBuffer support.
// Does NOT run on index.html so ad scripts work freely there.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(response => {
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
      newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
      newHeaders.set('Cross-Origin-Resource-Policy', 'cross-origin');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }).catch(() => fetch(e.request))
  );
});
