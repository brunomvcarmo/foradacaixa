// Fora da Caixa — service worker: a app abre mais depressa e funciona sem rede (jogos sem a liga).
// - ficheiros com ?v=<impressão digital> (scripts/versao.py): da memória, e só se descarregam quando mudam;
// - o resto (index.html, dados.json, liga_pt.json, ícones): primeiro a rede, a memória só se não houver rede;
// - versao.txt e o Firebase (outro endereço) nunca passam por aqui.
const CACHE = 'fdc-2';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== 'GET' || u.origin !== location.origin || u.pathname.endsWith('/versao.txt') || u.pathname.endsWith('/sw.js')) return;
  if (u.searchParams.has('v')) {
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      const r = await fetch(req);
      if (r.ok) {   // guarda esta versão e apaga as antigas do mesmo ficheiro
        await c.put(req, r.clone());
        for (const k of await c.keys()) { const ku = new URL(k.url); if (ku.pathname === u.pathname && ku.search !== u.search) c.delete(k); }
      }
      return r;
    }));
    return;
  }
  const casa = new URL('./', self.registration.scope).href;   // a página guarda-se sempre com o mesmo nome (sem ?jogo=…)
  const chave = req.mode === 'navigate' ? casa : req;
  e.respondWith(fetch(req).then(r => {
    if (r.ok && r.type === 'basic') { const cp = r.clone(); caches.open(CACHE).then(c => c.put(chave, cp)); }
    return r;
  }).catch(async () => (await caches.match(chave)) || Response.error()));
});

// notificações (scripts/push.py manda {titulo, texto, url, tag})
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = {texto: e.data && e.data.text()}; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Fora da Caixa', {body: d.texto || '', icon: 'icones/icone-192.png', badge: 'icones/icone-192.png', tag: d.tag || undefined, data: {url: d.url || './'}}));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const alvo = new URL(e.notification.data?.url || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(cs => {
    const c = cs.find(x => x.url.startsWith(self.registration.scope));
    if (c) return c.navigate(alvo).then(w => (w || c).focus()).catch(() => c.focus().catch(() => self.clients.openWindow(alvo)));
    return self.clients.openWindow(alvo);
  }));
});
