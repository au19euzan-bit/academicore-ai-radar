/* Foreground unread-source badge; no push subscription or background polling. */
(()=>{
 const key='edumind-badge';
 const supported=typeof navigator.setAppBadge==='function'&&typeof navigator.clearAppBadge==='function';
 const installed=()=>navigator.standalone===true||matchMedia('(display-mode:standalone)').matches;
 const isIOS=/iPhone|iPad|iPod/.test(navigator.userAgent);
 const count=()=>D.filter(isNew).length;
 const enabled=()=>{try{return localStorage.getItem(key)==='on'}catch{return false}};
 const permission=()=>typeof Notification==='undefined'?'unavailable':Notification.permission;
 const dialog=document.createElement('dialog');dialog.id='badgeDialog';
 dialog.innerHTML=`<div class="platform-dialog-head"><h2 id="badgeTitle">Uygulama simgesi rozeti</h2><button type="button" class="platform-dialog-close" data-dialog-close aria-label="Pencereyi kapat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><p class="utility-intro">Henüz incelemediğiniz yeni kaynakların sayısı uygulama simgesinde görünsün.</p><p id="badgeStatus" class="utility-status" role="status"></p><p class="utility-note">Son 30 günde eklenen kaynaklar sayılır. Kaynak kartını açtığınızda sayı azalır.</p><div class="utility-actions"><button type="button" id="badgeEnable" class="utility-primary">Rozeti etkinleştir</button><button type="button" id="badgeDisable">Rozeti kapat</button></div><div class="utility-divider"></div><p class="utility-note">iPhone'da ana ekrana eklenmiş uygulama ve bildirim izni gerekir. Rozetin görünümünü telefonunuz belirler.</p><p class="utility-note">Sayı, uygulama yeni veriyi aldığında güncellenir. Uygulama tamamen kapalıyken yeni kaynakları öğrenmez; bu sürüm push bildirimi göndermez.</p><button type="button" id="badgeClose" class="utility-done">Tamam</button>`;
 dialog.setAttribute('aria-labelledby','badgeTitle');document.body.append(dialog);dialog.querySelector('[data-dialog-close]').onclick=()=>dialog.close();
 const status=dialog.querySelector('#badgeStatus'),enable=dialog.querySelector('#badgeEnable');
 function paint(){
  enable.disabled=!supported||(isIOS&&!installed())||permission()==='denied';
  status.textContent=!supported?'Bu tarayıcı simge rozetini desteklemiyor.':isIOS&&!installed()?'Bu ayarı telefonunuzun ana ekranındaki Akademi simgesinden açın.':permission()==='denied'?'Bildirim izni kapalı. Telefon ayarlarındaki Akademi bildirim/rozet izinlerini kontrol edin.':`${count()} incelenmemiş yeni kaynak · Rozet ${enabled()?'açık':'kapalı'}`;
 }
 let last='';
 async function update(force=false){
  paint();if(!supported)return;
  const value=enabled()?count():0,signature=String(value)+'|'+permission();if(!force&&signature===last)return;
  try{if(value>0)await navigator.setAppBadge(value);else await navigator.clearAppBadge();last=signature}catch{last='';if(dialog.open)status.textContent='Rozet ayarlanamadı. Uygulamanın kurulumunu ve bildirim izinlerini kontrol edin.'}
 }
 enable.onclick=async()=>{
  try{
   if(isIOS&&permission()!=='granted'){
    if(typeof Notification==='undefined')throw Error('Bildirim izni bu ortamda kullanılamıyor.');
    const result=await Notification.requestPermission();if(result!=='granted'){paint();return}
   }
   localStorage.setItem(key,'on');await update(true);
  }catch(e){status.textContent=e.message}
 };
 dialog.querySelector('#badgeDisable').onclick=async()=>{try{localStorage.setItem(key,'off');await update(true)}catch(e){status.textContent=e.message}};
 dialog.querySelector('#badgeClose').onclick=()=>dialog.close();
 const menu=document.querySelector('#myListMenu'),button=document.createElement('button');button.id='myListBadge';button.type='button';button.textContent='Uygulama simgesi rozeti';button.onclick=()=>{menu.open=false;paint();dialog.showModal()};menu.querySelector('.my-list-menu-panel').insertBefore(button,document.querySelector('#bCsv'));
 const previous=sync;sync=function(...args){const result=previous.apply(this,args);queueMicrotask(()=>update());return result};
 document.addEventListener('edumind-recent-reviewed',()=>queueMicrotask(()=>update()));
 addEventListener('storage',e=>{if(e.key===key||e.key==='edumind-recent-reviewed'){REVIEWED_RECENT.clear();load('edumind-recent-reviewed',REVIEWED_RECENT);update(true)}});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')update(true)});
 setInterval(()=>{if(document.visibilityState==='visible')update()},60000);
 update();
})();
