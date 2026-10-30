/* A standalone iPhone can report a shorter layout viewport during cold launch.
   Its physical screen in CSS points is stable before the first route change. */
(()=>{
 const root=document.documentElement,mobile=matchMedia('(max-width:759px)'),standalone=matchMedia('(display-mode: standalone)');
 let queued=false,lastRoute='',settleTimers=[],geometryDirty=true,geometryWidth=0,stableVisualHeight=0;
 const safeProbe=document.createElement('div');safeProbe.setAttribute('aria-hidden','true');safeProbe.style.cssText='position:fixed;top:0;left:0;width:0;height:var(--dock-inset,var(--layout-safe-bottom,0px));visibility:hidden;pointer-events:none';document.body.append(safeProbe);
 // Top safe area: above zero only when the page runs under the status bar (installs made with
 // the old black-translucent style). With the default style iOS starts the page below it.
 const topProbe=document.createElement('div');topProbe.setAttribute('aria-hidden','true');topProbe.style.cssText='position:fixed;top:0;left:0;width:0;height:env(safe-area-inset-top,0px);visibility:hidden;pointer-events:none';document.body.append(topProbe);
 const route=()=>root.classList.contains('mobile-source-mode')?'sources':root.classList.contains('mobile-my-list-mode')?'saved':root.classList.contains('mobile-discover-mode')?'discover':root.classList.contains('intro-mode')?'intro':'radar';
 function viewportHeight(){
  const visual=window.visualViewport,width=root.clientWidth;
  const editing=document.activeElement?.matches('input,textarea,[contenteditable="true"]');
  const keyboard=editing&&visual&&innerHeight-visual.height>120;
  if(keyboard)return Math.round(visual.height+(visual.offsetTop||0));
  const installed=navigator.standalone===true||standalone.matches;
  const portrait=screen.height>screen.width&&width<innerHeight;
  const sameWidth=Math.abs(screen.width-width)<=2;
  const unzoomed=!visual||Math.abs(visual.scale-1)<.02;
  // The full screen is the page only when it runs under the status bar.
  const underStatusBar=topProbe.getBoundingClientRect().height>0;
  if(installed&&portrait&&sameWidth&&unzoomed&&underStatusBar)return Math.round(screen.height);
  return Math.round(visual?.height||innerHeight);
 }
 function update(){
  queued=false;if(!mobile.matches){root.style.removeProperty('--app-viewport-height');return}
  const scale=Math.min(1.25,Math.max(.72,root.clientWidth/440));
  root.style.setProperty('--ui-scale',String(scale));
  if(geometryDirty||geometryWidth!==root.clientWidth){
   geometryDirty=false;geometryWidth=root.clientWidth;
   const height=viewportHeight();root.style.setProperty('--app-viewport-height',height+'px');
   const visual=window.visualViewport;
   // Elastic scrolling changes offsetTop without changing the usable screen.
   const visibleHeight=visual&&Math.abs(visual.scale-1)<.02?visual.height:innerHeight;
   stableVisualHeight=visibleHeight;
   const inset=parseFloat(getComputedStyle(safeProbe).height)||0;
   root.style.setProperty('--layout-dock-top',Math.max(0,Math.min(height,visibleHeight)-inset-62*scale)+'px');
  }
  const current=route();
  if(current!==lastRoute){lastRoute=current;if(!root.classList.contains('sheet-open'))requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'instant'})))}
 }
 function queue(){if(!queued){queued=true;requestAnimationFrame(update)}}
 function geometry(){geometryDirty=true;queue()}
 function settle(){
  settleTimers.forEach(clearTimeout);geometryDirty=true;update();
  // Catch the iOS standalone safe-area / viewport transition after pageshow.
  settleTimers=[80,250,600,1200].map(ms=>setTimeout(geometry,ms));
 }
 new MutationObserver(queue).observe(root,{attributes:true,attributeFilter:['class']});
 addEventListener('resize',geometry);addEventListener('orientationchange',settle);addEventListener('pageshow',settle);addEventListener('load',settle);
 window.visualViewport?.addEventListener('resize',()=>{const editing=document.activeElement?.matches('input,textarea,[contenteditable="true"]');if(editing||Math.abs(window.visualViewport.height-stableVisualHeight)>80)geometry()});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)settle()});
 const textField=e=>e.target?.matches('input:not([type=checkbox]):not([type=radio]):not([type=button]),textarea,[contenteditable="true"]');
 document.addEventListener('focusin',e=>{if(textField(e))geometry()});document.addEventListener('focusout',e=>{if(textField(e))settle()});
 mobile.addEventListener('change',settle);standalone.addEventListener('change',settle);settle();
})();

/* v1.3.321: on phones the card scales as one piece to fit the screen. The
   cover and the fixed header keep their size (they follow the notch); the
   identity block and the details shrink together, down to 82%, before the
   details start to scroll. */
(()=>{
 const MIN_SCALE=.82,mobile=matchMedia('(max-width:759px)');
 const panel=document.getElementById('sheetPanel');
 if(!panel)return;
 let queued=false;
 function fit(){
  queued=false;
  // The identity block is created when the first card opens, so look it up each time.
  const body=document.getElementById('sheetBody'),identity=document.getElementById('cardIdentity');
  if(!body||!identity)return;
  const head=identity.querySelector('.cd-hd'),parts=[head,...body.children].filter(Boolean);
  parts.forEach(p=>p.style.zoom='');
  if(!head||!mobile.matches||!document.documentElement.classList.contains('sheet-open'))return;
  // Only the identity block and the details shrink; the cover keeps its height.
  // Text reflows as it shrinks, so the scale is refined from what was measured.
  let scale=1;
  for(let pass=0;pass<3;pass++){
   const total=identity.getBoundingClientRect().height+body.scrollHeight,avail=panel.clientHeight;
   if(total<=avail+1)break;
   const fixed=identity.getBoundingClientRect().height-head.getBoundingClientRect().height;
   const next=Math.max(MIN_SCALE,scale*(avail-fixed)/(total-fixed));
   if(next>=scale-.002)break;
   scale=next;parts.forEach(p=>p.style.zoom=scale.toFixed(3));
  }
 }
 const queue=()=>{if(!queued){queued=true;requestAnimationFrame(fit)}};
 new MutationObserver(queue).observe(panel,{childList:true,subtree:true});
 new MutationObserver(queue).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 addEventListener('resize',queue);mobile.addEventListener('change',queue);
})();
