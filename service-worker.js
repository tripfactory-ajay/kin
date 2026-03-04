// KiN Service Worker v2.1
const CACHE='kin-v2.1';
const FILES=['/kin/','/kin/index.html','/kin/kin.png','/kin/manifest.json'];

// Install — cache app files
self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(FILES).catch(()=>{}))
  );
  self.skipWaiting();
});

// Activate — delete old caches
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('/kin/index.html')))
  );
});

// Notification click — open the app
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
      // If app already open, focus it
      for(const c of list){
        if(c.url.includes('kin')&&'focus'in c)return c.focus();
      }
      // Otherwise open it
      if(clients.openWindow)return clients.openWindow(e.notification.data&&e.notification.data.url||'/kin/');
    })
  );
});
