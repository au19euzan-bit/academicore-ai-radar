/* Portrait request where supported; iOS fallback keeps the app behind a modal. */
(()=>{
 // Tablets may rotate freely; only phones are held to portrait.
 const phone=()=>!document.documentElement.classList.contains('radar-desktop')&&!document.documentElement.classList.contains('radar-tablet');
 const guard=document.createElement('dialog');guard.id='portraitGuard';guard.setAttribute('aria-labelledby','portraitTitle');
 guard.innerHTML='<svg width="44" height="64" viewBox="0 0 44 64" fill="none" aria-hidden="true"><rect x="5" y="2" width="34" height="60" rx="7" stroke="currentColor" stroke-width="3"/><path d="M18 54h8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg><h1 id="portraitTitle">Telefonu dik tutun</h1><p>Akademi Radar dikey kullanım için tasarlandı.</p>';
 document.body.append(guard);guard.addEventListener('cancel',e=>e.preventDefault());
 function landscape(){
  // Embedded previews use their own viewport, not the desktop monitor orientation.
  if(window.self!==window.top)return matchMedia('(orientation:landscape)').matches;
  // Physical orientation avoids mistaking the on-screen keyboard for rotation.
  if(typeof window.orientation==='number')return Math.abs(window.orientation)%180===90;
  if(screen.orientation?.type)return screen.orientation.type.startsWith('landscape');
  return matchMedia('(orientation:landscape)').matches;
 }
 let wasBlocked=false,recoveryTimers=[];
 function recoverPortrait(){
  recoveryTimers.forEach(clearTimeout);recoveryTimers=[];
  const recover=()=>{
   if(!phone()||landscape())return;
   // iOS can restore focus/scroll before its final visual viewport resize.
   // Radar is a fixed screen, so discard only its unintended page scroll.
   if(S.view==='radar'&&!S.introOpen&&!document.documentElement.classList.contains('sheet-open')){
    window.scrollTo({top:0,left:0,behavior:'instant'});
    if(document.scrollingElement)document.scrollingElement.scrollTop=0;
   }
   document.dispatchEvent(new Event('edumind-portrait-restored'));
   window.dispatchEvent(new Event('edumind-viewport-ready'));
  };
  requestAnimationFrame(()=>requestAnimationFrame(recover));
  recoveryTimers=[80,200,450,900].map(ms=>setTimeout(recover,ms));
 }
 function orient(){
  const blocked=phone()&&landscape(),returning=wasBlocked&&!blocked;
  document.documentElement.classList.toggle('phone-landscape',blocked);
  if(blocked&&!guard.open)guard.showModal();else if(!blocked&&guard.open)guard.close();
  wasBlocked=blocked;
  if(returning)recoverPortrait();
  else if(!blocked)window.dispatchEvent(new Event('edumind-viewport-ready'));
 }
 function lock(){
  if(!phone()||!screen.orientation?.lock)return;
  try{Promise.resolve(screen.orientation.lock('portrait')).catch(()=>{})}catch{}
 }
 addEventListener('orientationchange',orient);addEventListener('resize',orient);addEventListener('pageshow',()=>{orient();lock()});screen.orientation?.addEventListener('change',orient);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){orient();lock()}});
 // Single-finger scrolling, momentum and boundary bounce are owned by WebKit.
 orient();lock();
})();
