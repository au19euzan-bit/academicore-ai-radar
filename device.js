/* Device boundary is a presentation rule, not authorization. */
(()=>{
 const KEYS=['pref','follow','basket','done','recent-reviewed','subbed','theme','dark','by','view','intro-v1','ui','badge','disciplines','channels','visits','scan-day','setup','interest','feed-read','feed-star'].map(k=>'edumind-'+k);
 const arrays=new Set([...KEYS.slice(0,6),'edumind-disciplines']);
 const plain=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
 const allowedPlatforms=()=>new Set(['all','web','feed','yt',...PFOPTS.map(([k])=>k)]);
 const download=(name,value)=>{const u=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),2000)};
 function snapshot(){
  const storage={};KEYS.filter(k=>k!=='edumind-ui').forEach(k=>{const v=localStorage.getItem(k);if(v!==null)storage[k]=v});
  return {schema:'edumind-device-v1',version:document.querySelector('meta[name=edumind-version]')?.content||'1.3.351-test',createdAt:new Date().toISOString(),storage,
   ui:{platform:myListPlatform,query:myListQuery,sort:myListSort,minutes:document.querySelector('#routeTime')?.value||'20'},
   filters:Object.fromEntries([...FSET,'q','sort','recent','core','mine','bask','week'].map(k=>[k,S[k] instanceof Set?[...S[k]]:S[k]]))};
 }
 function validate(v){
  if(!plain(v)||v.schema!=='edumind-device-v1'||!plain(v.storage))throw Error('Akademi yedeği bekleniyor.');
  for(const[k,s]of Object.entries(v.storage)){
   if(!KEYS.includes(k)||typeof s!=='string'||s.length>1000000)throw Error('Geçersiz yedek alanı: '+k);
   if(arrays.has(k)){const a=JSON.parse(s);if(!Array.isArray(a)||a.length>10000||a.some(x=>typeof x!=='string'||x.length>500))throw Error('Geçersiz liste.');}
   const choices={'edumind-badge':['on','off'],'edumind-theme':['acad','klasik'],'edumind-dark':['auto','light','dark'],'edumind-view':['radar','list','discover','follow','intro','rhythm'],'edumind-intro-v1':['0','1']};
   if(choices[k]&&!choices[k].includes(s))throw Error('Geçersiz görünüm tercihi: '+k);
   if(k==='edumind-ui'){const nested=JSON.parse(s);if(!plain(nested)||!plain(nested.storage)||Object.keys(nested.storage).length)throw Error('Geçersiz görünüm kaydı.');validate(nested);}
  }
  if(v.ui!==undefined){
   if(!plain(v.ui)||Object.values(v.ui).some(x=>typeof x!=='string'||x.length>500)||Object.keys(v.ui).some(k=>!['platform','query','sort','minutes'].includes(k)))throw Error('Geçersiz görünüm tercihleri.');
   if(v.ui.platform!==undefined&&!allowedPlatforms().has(v.ui.platform))throw Error('Geçersiz platform tercihi.');
   if(v.ui.sort!==undefined&&!['added','name','rhythm'].includes(v.ui.sort))throw Error('Geçersiz liste sıralaması.');
   if(v.ui.minutes!==undefined&&![...document.querySelectorAll('[data-route-minutes]')].some(b=>b.dataset.routeMinutes===v.ui.minutes))throw Error('Geçersiz haftalık süre.');
  }
  if(v.filters!==undefined){
   if(!plain(v.filters))throw Error('Geçersiz filtreler.');
   for(const[k,x]of Object.entries(v.filters)){
    if(FSET.includes(k)){if(!Array.isArray(x)||x.length>100||x.some(z=>typeof z!=='string'||z.length>100))throw Error('Geçersiz filtre.');}
    else if(['recent','core','mine','bask'].includes(k)){if(typeof x!=='boolean')throw Error('Geçersiz filtre.');}
    else if(k==='sort'){if(!['type','new','name','rhythm'].includes(x))throw Error('Geçersiz kaynak sıralaması.');}
    else if(k==='q'){if(typeof x!=='string'||x.length>500)throw Error('Geçersiz arama.');}
    else if(k==='week'){if(x!==null&&!WEEK.some(w=>w.d===x))throw Error('Geçersiz hafta.');}
    else throw Error('Bilinmeyen filtre.');
   }
  }
  return v;
 }
 function apply(v,merge){
  ['pref','follow','basket','done'].forEach(k=>{S[k].clear();load('edumind-'+k,S[k])});
  REVIEWED_RECENT.clear();load('edumind-recent-reviewed',REVIEWED_RECENT);
  if(!merge){clearF();S.sort='type';myListPlatform='all';myListQuery='';myListSort='added';}
  for(const[k,x]of Object.entries(v.filters||{})){if(FSET.includes(k)){S[k].clear();x.forEach(z=>S[k].add(z))}else S[k]=x;}
  const ui=v.ui||{};
  if(ui.platform!==undefined)myListPlatform=ui.platform;
  // Listem no longer has a search field, so a saved query is not restored.
  if(ui.sort!==undefined)myListSort=ui.sort;
  const time=document.querySelector('#routeTime');if(time&&(!merge||ui.minutes!==undefined))time.value=ui.minutes||'20';
  document.querySelector('#myListSearch').value=myListQuery;
  document.querySelector('#myListSort').value=myListSort;
  document.querySelector('#q').value=S.q;
  document.querySelectorAll('[data-route-minutes]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.routeMinutes===time?.value)));
  document.documentElement.classList.toggle('th-acad',localStorage.getItem('edumind-theme')!=='klasik');
  document.dispatchEvent(new Event('edumind-preferences-restored'));
  introSeen=localStorage.getItem('edumind-intro-v1')==='1';
  buildRadar();sync();renderPersonalRecommendations();
 }
 function persistUI(){const v=snapshot();localStorage.setItem('edumind-ui',JSON.stringify({schema:v.schema,storage:{},filters:v.filters,ui:v.ui}));}
 function restore(v,merge){
  validate(v);
  const before=Object.fromEntries(KEYS.map(k=>[k,localStorage.getItem(k)])),previous=snapshot();
  try{
   if(!merge)KEYS.forEach(k=>localStorage.removeItem(k));
   for(const[k,s]of Object.entries(v.storage)){
    localStorage.setItem(k,merge&&arrays.has(k)?JSON.stringify([...new Set([...JSON.parse(localStorage.getItem(k)||'[]'),...JSON.parse(s)])]):s);
   }
   apply(v,merge);persistUI();
  }catch(e){
   for(const k of KEYS){try{before[k]===null?localStorage.removeItem(k):localStorage.setItem(k,before[k])}catch{}}
   try{apply(previous,false)}catch{}
   throw e;
  }
  return true;
 }
 window.EduMindDevice={snapshot,validate,restore,persistUI};
 try{const ui=localStorage.getItem('edumind-ui');if(ui)apply(validate(JSON.parse(ui)),true)}catch{}
 let saveTimer;
 const scheduleSave=()=>{clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{persistUI()}catch{}},200)};
 ['click','change','input'].forEach(type=>document.addEventListener(type,scheduleSave));
 addEventListener('pagehide',()=>{try{persistUI()}catch{}});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')try{persistUI()}catch{}});
 const dialog=document.createElement('dialog');dialog.id='transferDialog';dialog.innerHTML=`<div class="platform-dialog-head"><h2 id="backupTitle">Yedekle / aktar</h2><button type="button" class="platform-dialog-close" data-dialog-close aria-label="Pencereyi kapat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><p class="utility-intro">Listem, tercihleriniz ve takip durumlarınız tek bir JSON dosyasında saklanır.</p><button id="backupDownload" class="utility-primary utility-wide" type="button">Tam yedeği indir · JSON</button><div class="utility-divider"></div><label class="utility-file"><input id="backupFile" type="file" accept=".json,application/json"><span class="utility-file-action">JSON dosyası seç</span><span id="backupFilename" class="utility-filename">Henüz dosya seçilmedi</span></label><p id="backupPreview" class="utility-status" role="status"></p><p class="utility-note">Birleştir, listeleri bir araya getirir ve dosyadaki tercihleri uygular. Geri yükle, mevcut kayıtların yerini alır. Önce yedeğinizi indirin.</p><div class="utility-actions"><button id="backupMerge" type="button" disabled>Birleştir</button><button id="backupReplace" type="button" disabled>Geri yükle</button></div><p id="backupStatus" class="utility-status" role="status"></p><button id="backupClose" class="utility-done" type="button">Tamam</button>`;dialog.setAttribute('aria-labelledby','backupTitle');document.body.append(dialog);dialog.querySelector('[data-dialog-close]').onclick=()=>dialog.close();
 let pending;const status=dialog.querySelector('#backupStatus');dialog.querySelector('#backupDownload').onclick=()=>{try{download('Akademi-cihaz-yedegi.json',snapshot())}catch(e){status.textContent=e.message}};
 dialog.querySelector('#backupFile').onchange=async e=>{pending=null;dialog.querySelector('#backupMerge').disabled=dialog.querySelector('#backupReplace').disabled=true;try{const f=e.target.files[0];dialog.querySelector('#backupFilename').textContent=f?.name||'Henüz dosya seçilmedi';if(!f||f.size>5000000)throw Error('En fazla 5 MB JSON seçin.');pending=validate(JSON.parse(await f.text()));dialog.querySelector('#backupPreview').textContent=`Geçerli yedek: ${Object.keys(pending.storage).length} alan · ${pending.createdAt||'tarih yok'}`;dialog.querySelector('#backupMerge').disabled=dialog.querySelector('#backupReplace').disabled=false}catch(err){status.textContent=err.message}};
 for(const[id,merge]of [['backupMerge',true],['backupReplace',false]])dialog.querySelector('#'+id).onclick=()=>{try{restore(pending,merge);status.textContent='Aktarıldı. Görünüm tercihleri sonraki açılışta tamamen uygulanır.'}catch(e){status.textContent=e.message}};
 dialog.querySelector('#backupClose').onclick=()=>dialog.close();
 const menu=document.querySelector('#myListMenu');const open=()=>{if(menu)menu.open=false;dialog.showModal()};const button=document.createElement('button');button.type='button';button.id='myListBackup';button.textContent='Yedekle / aktar';button.onclick=open;menu.querySelector('.my-list-menu-panel').prepend(button);
 const gate=document.createElement('section');gate.id='desktopGate';gate.innerHTML=`<h1>AcademiCore AI Radar</h1><p>Radar'ı telefonunuzda açın.</p><p>Telefonunuzun kamerasıyla bu kodu tarayın veya aşağıdaki adresi telefonunuza gönderin.</p><div id="qrSlot"></div><p id="phoneURL"></p><p>iPhone: Safari → Paylaş → Ana Ekrana Ekle.<br>Android: tarayıcı menüsü → Uygulamayı yükle / Ana ekrana ekle.</p><button id="desktopTransfer">Cihaz yedeğini aktar</button><p>v${document.querySelector('meta[name=edumind-version]')?.content||''} · Kişisel veriler yalnızca bu cihazda saklanır.</p>`;document.body.append(gate);gate.querySelector('#phoneURL').textContent=location.href.split('#')[0];gate.querySelector('#desktopTransfer').onclick=open;
 const phone=()=>{const ua=navigator.userAgent;const mobile=/iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua);const touch=matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<600;
  // iPadOS Safari reports a Mac user agent; touch points identify it as a tablet.
  const tablet=!(mobile||touch)&&(/iPad|Android|Tablet|Silk|Kindle/i.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1)||(matchMedia('(pointer:coarse)').matches&&navigator.maxTouchPoints>1));
  // Bilgisayarda şifreyle açılınca tablet yerleşimi kullanılır.
  const big=!(mobile||touch||tablet),root=document.documentElement;root.classList.toggle('radar-tablet',tablet||(big&&unlocked()));root.classList.toggle('radar-desktop',big&&!unlocked())};
 const DESKTOP_KEY='radar-masaustu',DESKTOP_HASH='3b76ae988ef12a97addd39df398bd553776854a8f11ce6d46b503d712ced95ae';
 const unlocked=()=>{try{return localStorage.getItem(DESKTOP_KEY)==='1'}catch(e){return false}};
 phone();addEventListener('resize',phone);
 gate.querySelector('#qrSlot').insertAdjacentHTML('beforebegin','<form id="desktopUnlock"><p>Bilgisayarda açmak için şifreyi girin.</p><input type="password" id="desktopPass" autocomplete="current-password" aria-label="Şifre" placeholder="Şifre"> <button type="submit">Bilgisayarda aç</button><p id="desktopPassMsg" role="status"></p></form>');
 gate.querySelector('#desktopUnlock').onsubmit=async e=>{e.preventDefault();const msg=gate.querySelector('#desktopPassMsg');try{const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(gate.querySelector('#desktopPass').value));const hex=[...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,'0')).join('');if(hex!==DESKTOP_HASH){msg.textContent='Şifre yanlış.';return}try{localStorage.setItem(DESKTOP_KEY,'1')}catch(_){}location.reload()}catch(_){msg.textContent='Bu tarayıcıda şifre denetlenemedi.'}};
 if(/^https?:$/.test(location.protocol)&&!['localhost','127.0.0.1'].includes(location.hostname)){new QRCode(gate.querySelector('#qrSlot'),{text:location.href.split('#')[0],width:192,height:192,correctLevel:QRCode.CorrectLevel.M})}else gate.querySelector('#qrSlot').textContent='Yerel önizleme: QR yayındaki site adresinde otomatik oluşur.';

})();
