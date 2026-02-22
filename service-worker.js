const CACHE='kin-v2';
const PRECACHE=['/kin/','/kin/index.html','/kin/kin.png','/kin/manifest.json'];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  // Network-first for API calls, cache-first for assets
  if(e.request.url.includes('firebaseio.com')||e.request.url.includes('googleapis.com')){
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached=>{
      const network=fetch(e.request).then(resp=>{
        if(resp.ok) caches.open(CACHE).then(c=>c.put(e.request,resp.clone()));
        return resp;
      }).catch(()=>cached);
      return cached||network;
    })
  );
});
