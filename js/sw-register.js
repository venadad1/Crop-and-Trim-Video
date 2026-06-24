// Registers SW only on editor.html — keeps index.html (landing + ads) clean
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(reg => {
      if (reg.installing || reg.waiting) {
        const sw = reg.installing || reg.waiting;
        sw.addEventListener('statechange', e => {
          if (e.target.state === 'activated') window.location.reload();
        });
      }
    })
    .catch(err => console.warn('[ClipForge SW]', err));
}
