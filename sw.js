// ClipForge Service Worker — injects COOP/COEP ONLY for editor.html and its sub-resources.
// index.html and everything loaded from it (ad scripts, ad images) are left untouched
// so Adsterra and other ad networks can load cross-origin resources freely.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const dest = e.request.destination;

  // Only isolate requests that originate from editor.html context:
  // - the editor page itself
  // - JS/WASM files (ffmpeg core)
  // Everything else (ad images, ad scripts, index.html) passes through unmodified.
  const isEditorPage = url.pathname === '/editor.html' || url.pathname === '/editor';
  const isFFmpegAsset = url.hostname.includes('jsdelivr') || url.pathname.includes('ffmpeg');
  const needsIsolation = isEditorPage || isFFmpegAsset;

  if (!needsIsolation) {
    // Pass through without any header modification — ads work freely
    return;
  }

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
