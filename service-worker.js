const CACHE='kin-v3';
const PRE=['/kin/','/kin/index.html','/kin/kin.png','/kin/manifest.json'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRE)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('firebaseio.com')||e.request.url.includes('googleapis.com')||e.request.url.includes('gstatic.com')){e.respondWith(fetch(e.request).catch(()=>new Response('')));return}
  e.respondWith(caches.match(e.request).then(cached=>{const net=fetch(e.request).then(r=>{if(r.ok)caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>cached);return cached||net}));
});
