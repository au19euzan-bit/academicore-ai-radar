/* Detect updates on resume and keep activation behind the user's Update button. */
(()=>{
 if(!('serviceWorker'in navigator)||!/^https?:$/.test(location.protocol))return;
 let registration=null,registrationPromise,readyWorker=null,pendingWorker=null,requested=false,reloading=false;
 let versionProbe=null;
 const currentVersion=document.querySelector('meta[name=edumind-version]')?.content;
 async function probeVersion(){
  if(versionProbe)return versionProbe;
  versionProbe=(async()=>{const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);try{const response=await fetch('./version.json?t='+Date.now(),{cache:'no-store',signal:controller.signal});if(!response.ok)return;const latest=await response.json();if(latest.version&&currentVersion&&latest.version!==currentVersion&&state!=='ready')show('downloading')}catch{}finally{clearTimeout(timer)}})();
  try{await versionProbe}finally{versionProbe=null}
 }
 let hadController=!!navigator.serviceWorker.controller,lastCheck=0,inFlight=null,state='hidden';
 const watched=new WeakSet();
 const notice=document.createElement('aside');notice.id='updateNotice';notice.hidden=true;notice.setAttribute('aria-label','Uygulama güncellemesi');
 notice.innerHTML='<span id="updateMessage" role="status" aria-live="polite">Güncelleme hazır</span><button type="button" id="updateNow">Şimdi güncelle</button><button type="button" id="updateLater">Daha sonra</button>';
 document.body.append(notice);
 const now=notice.querySelector('#updateNow'),message=notice.querySelector('#updateMessage');
 function tell(text){if(typeof toast==='function')toast(text)}
 function show(next,worker){
  if(requested)return;
  if(worker)readyWorker=worker;
  state=next;notice.hidden=false;
  now.disabled=next==='downloading';now.textContent=next==='error'?'Tekrar dene':'Şimdi güncelle';
  message.textContent=next==='ready'?'Güncelleme hazır':next==='downloading'?'Yeni sürüm indiriliyor…':'Güncelleme indirilemedi. Bağlantıyı kontrol edip tekrar deneyin.';
 }
 notice.querySelector('#updateLater').onclick=()=>{notice.hidden=true};
 function reload(){if(!reloading){reloading=true;location.reload()}}
 now.onclick=()=>{
  if(state==='error'){check(true,true);return}
  if(state!=='ready'||requested)return;
  try{saveAll();EduMindDevice.persistUI()}catch{message.textContent='Veriler kaydedilemedi. Yedek alıp tekrar deneyin.';return}
  const worker=registration?.waiting||(readyWorker?.state==='installed'?readyWorker:null);
  requested=true;now.disabled=true;message.textContent='Güncelleniyor…';
  if(worker)worker.postMessage({type:'EDUMIND_SKIP_WAITING'});else reload();
 };
 navigator.serviceWorker.addEventListener('controllerchange',()=>{
  if(!hadController){hadController=true;return}
  if(requested)reload();else show('ready');
 });
 function watch(worker){
  if(!worker)return;
  const inspect=()=>{
   if(worker.state==='installed'&&navigator.serviceWorker.controller){pendingWorker=worker;show('ready',worker);}
   else if(worker.state==='installing'&&navigator.serviceWorker.controller){pendingWorker=worker;if(state!=='ready')show('downloading');}
   else if(worker.state==='redundant'&&(worker===pendingWorker||worker===readyWorker)){
    if(readyWorker===worker)readyWorker=null;
    if(state==='downloading'||requested){requested=false;show('error')}
   }
  };
  if(!watched.has(worker)){watched.add(worker);worker.addEventListener('statechange',inspect)}
  // Installation can finish before the statechange listener is attached.
  inspect();
 }
 async function check(force=false,manual=false){
  if(document.visibilityState==='hidden'||!navigator.onLine){if(manual)tell('Güncellemeleri kontrol etmek için internete bağlanın.');return}
  if(!registration)await ensureRegistration();
  if(!registration){if(manual)tell('Güncelleme kontrolü başlatılamadı. Tekrar deneyin.');return}
  if(registration.waiting)watch(registration.waiting);
  watch(registration.installing);
  if(inFlight)return inFlight;
  if(!force&&Date.now()-lastCheck<30000)return;
  lastCheck=Date.now();
  if(manual)tell('Güncellemeler kontrol ediliyor…');
  inFlight=(async()=>{
   try{
    await Promise.all([registration.update(),probeVersion()]);
    if(registration.waiting)watch(registration.waiting);
    watch(registration.installing);
    if(manual&&!registration.waiting&&!registration.installing&&state!=='ready')tell('Güncel sürümü kullanıyorsunuz.');
   }catch{lastCheck=0;if(state==='downloading')show('error');if(manual)tell('Güncelleme sunucusuna ulaşılamadı. Tekrar deneyin.');}
  })();
  try{await inFlight}finally{inFlight=null}
 }
 function ensureRegistration(){
  if(registration)return Promise.resolve(registration);
  if(!registrationPromise)registrationPromise=navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(reg=>{
   registration=reg;reg.addEventListener('updatefound',()=>watch(reg.installing));
   watch(reg.waiting);watch(reg.installing);return reg;
  }).catch(()=>null).finally(()=>{registrationPromise=null});
  return registrationPromise;
 }
 ensureRegistration().then(reg=>{if(reg)check(true)});
 // Returning to the app must bypass the normal polling cooldown.
 function resumeCheck(){check(true);setTimeout(()=>check(true),2000);setTimeout(()=>check(true),6000)}
 addEventListener('pageshow',resumeCheck);addEventListener('focus',resumeCheck);
 addEventListener('online',()=>check(true));
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')resumeCheck()});
 setInterval(()=>check(true),15000);
 const menu=document.querySelector('#myListMenu .my-list-menu-panel');
 if(menu){
  const button=document.createElement('button');button.type='button';button.id='checkForUpdates';button.textContent='Güncellemeleri denetle';
  button.onclick=()=>{document.querySelector('#myListMenu').open=false;check(true,true)};menu.prepend(button);
 }
})();
