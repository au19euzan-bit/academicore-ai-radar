const CACHE='edumind-1.3.356-test-github';
const SHELL=['./tokens.css','./app-ortak.css','./app-tanitim.css','./app-radar.css','./app-kaynaklar.css','./app-kart.css','./app-listem.css','./app-kesfet.css','./app.js','./discover.css','./discover.js','./design.js','./takip.js','./takip.css','./responsive-layout.css','./responsive-layout.js','./academy-radar.js','./academy-radar.css','./','./index.html','./sources.js','./device.js','./update.js','./badge.js','./phone-display.js','./suggestions-config.js','./suggestions.js','./qrcode.min.js','./release.css','./ios-experiment.css','./ios-experiment.js','./disciplines.js','./source-areas.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-192.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon-180.png','./apple-touch-icon.png'];
async function fetchShell(url){
 for(let attempt=0;attempt<2;attempt++){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{const response=await fetch(new Request(url,{cache:'no-store',signal:controller.signal}));if(!response.ok)throw new Error('Shell download failed');const body=await response.arrayBuffer();return new Response(body,{status:response.status,statusText:response.statusText,headers:response.headers})}catch(error){if(attempt===1)throw error}finally{clearTimeout(timer)}
 }
}
self.addEventListener('install',e=>e.waitUntil((async()=>{
 const responses=await Promise.all(SHELL.map(fetchShell));
 const cache=await caches.open(CACHE);
 await Promise.all(SHELL.map((url,i)=>cache.put(url,responses[i])));
})()));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('edumind-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;if(u.pathname.endsWith('/version.json')){e.respondWith(fetch(e.request,{cache:'no-store'}));return}e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(e.request);if(hit)return hit;try{return await fetch(e.request)}catch(err){if(e.request.mode==='navigate')return c.match('./index.html');throw err}}))});

self.addEventListener('message',e=>{if(e.data&&e.data.type==='EDUMIND_SKIP_WAITING')e.waitUntil(self.skipWaiting())});
