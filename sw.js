const CACHE='trip-tracking-v1';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const url=e.request.url;
  // never cache API or Apps Script calls — always go to network
  if(url.includes('api.anthropic.com')||url.includes('script.google.com')||url.includes('script.googleusercontent.com')){return;}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    if(e.request.method==='GET'&&resp.ok){const cp=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}
    return resp;
  }).catch(()=>caches.match('./index.html'))));
});
