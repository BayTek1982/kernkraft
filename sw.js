// Kleiner Hintergrunddienst: speichert die App-Seite, damit sie als echte App startet und auch offline öffnet.
// Bei jeder neuen Fassung der App die Nummer hinter "kernkraft-v" um eins erhöhen.
const CACHE = "kernkraft-v3";
const FILES = ["/", "/index.html", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))));
  self.clients.claim();
});
// Erst das Netz fragen (immer die neueste Fassung), nur ohne Netz aus dem Speicher
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request)));
});
