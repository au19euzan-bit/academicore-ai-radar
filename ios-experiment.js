/* Presentation-only navigation. Existing route/filter/card logic remains in charge. */
(()=>{
 document.documentElement.id='iosDesign';
 const root=document.documentElement,nav=document.querySelector('#bottomnav'),base=renderNav;
 function dock(){const active=root.classList.contains('mobile-source-mode')?'list':S.view;const count=D.filter(d=>S.basket.has(d.n)||followed(d)).length;
 nav.innerHTML=[['radar','Radar'],['list','Kaynaklar'],['discover','Keşfet'],['follow','Listem']].map(([key,label])=>`<button type="button" class="navbtn" data-ios-view="${key}" aria-label="${label}" ${active===key?'aria-current="page"':''}>${key==='radar'?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6a6 6 0 1 0 6 6M12 12l6-6"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>':ICON[key]}<span>${label}</span>${key==='follow'&&count?`<em class="badge">${count}</em>`:''}</button>`).join('');
 nav.style.setProperty('--dock-index',String(Math.max(0,['radar','list','discover','follow'].indexOf(active))));
 nav.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(root.classList.contains('sheet-open'))return;setView(b.dataset.iosView)});
 }
 renderNav=function(){base();dock()};renderNav();
 new MutationObserver(()=>{dock();color()}).observe(root,{attributes:true,attributeFilter:['class','data-theme']});
 function color(){if(root.classList.contains('sheet-open'))return;const surface=!root.classList.contains('mobile-source-mode')&&!root.classList.contains('mobile-my-list-mode')&&!root.classList.contains('mobile-discover-mode')?'#000000':getComputedStyle(root).getPropertyValue('--bg').trim();const meta=document.querySelector('meta[name="theme-color"]');if(meta&&meta.content!==surface)meta.content=surface}
 color();dispatchEvent(new Event('resize'));
})();
/* Anchor transient panels to the corner occupied by their triggering control. */
(()=>{
 const root=document.documentElement;let last=null,scheduled=0;
 const pairs=[['#myListMenu .my-list-menu-panel','#myListMenu>summary'],['#cameraMobileSortMenu','.camera-mobile-sort'],['.source-filter-popover','.camera-filter-clear'],['.radar-read-popover','.radar-read-toggle']];
 const dialogIds=['transferDialog','badgeDialog','suggestionDialog'];const origins=new WeakMap(),naturalWidths=new WeakMap();
 document.addEventListener('click',e=>{let t=e.target.closest?.('button,summary');if(!t)return;if(t.closest('.my-list-menu-panel'))t=document.querySelector('#myListMenu>summary');last=t;queue()},true);
 function queue(){if(!scheduled)scheduled=requestAnimationFrame(()=>{scheduled=0;place()})}
 function visible(p){return p&&!p.hidden&&p.getClientRects().length&&(!p.closest('details')||p.closest('details').open)&&(!(p instanceof HTMLDialogElement)||p.open)}
 function position(panel,trigger){if(!trigger||!trigger.getClientRects().length)return;if(!naturalWidths.has(panel))naturalWidths.set(panel,panel.offsetWidth);
  const r=trigger.getBoundingClientRect(),pad=12,w=Math.min(naturalWidths.get(panel),innerWidth-2*pad),right=r.left+r.width/2>innerWidth/2,below=r.top+r.height/2<innerHeight/2;
  const fitted=Math.min(w,right?r.right-pad:innerWidth-r.left-pad);
  const x=Math.max(pad,Math.min(innerWidth-fitted-pad,right?r.right-fitted:r.left));
  panel.classList.add('corner-panel');panel.dataset.corner='true';panel.style.setProperty('--corner-width',fitted+'px');
  const height=below?Math.max(80,innerHeight-Math.max(pad,r.top)-pad):Math.max(80,r.bottom-pad);
  const h=Math.min(panel.scrollHeight+2,height),y=below?Math.max(pad,r.top):Math.max(pad,r.bottom-h);
  panel.classList.add('corner-panel');panel.dataset.corner='true';for(const[k,v]of Object.entries({'--corner-width':fitted+'px','--corner-left':x+'px','--corner-top':y+'px','--corner-height':height+'px','--corner-origin':(right?'right':'left')+' '+(below?'top':'bottom')}))if(panel.style.getPropertyValue(k)!==v)panel.style.setProperty(k,v);
 }
 function place(){if(!matchMedia('(max-width:759px)').matches||root.classList.contains('radar-desktop'))return;
  for(const[p,t]of pairs){const panel=document.querySelector(p);if(visible(panel))position(panel,document.querySelector(t))}
  // Large dialogs use their full-width, centered layout rather than a button corner.
  for(const id of dialogIds){const panel=document.getElementById(id);if(!panel)continue;panel.classList.remove('corner-panel');delete panel.dataset.corner;for(const prop of ['--corner-width','--corner-left','--corner-top','--corner-height','--corner-origin'])panel.style.removeProperty(prop)}
 }
 new MutationObserver(queue).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','open']});
 addEventListener('resize',queue);addEventListener('scroll',queue,{passive:true});window.visualViewport?.addEventListener('resize',queue);queue();
})();
/* Transient explanations close after inactivity; outside taps are consumed. */
(()=>{
 const transient=[['.my-list-menu-panel','#myListMenu>summary'],['#cameraMobileSortMenu','.camera-mobile-sort'],['.source-filter-popover','.camera-filter-clear'],['.radar-read-popover','.radar-read-toggle']];
 const dialogs=['badgeDialog','cardPlatformDialog','transferDialog','suggestionDialog'];
 let timer=0,signature='',eatClickUntil=0;
 const showing=e=>e&&!e.hidden&&e.getClientRects().length&&(!e.closest('details')||e.closest('details').open);
 function active(){const modal=dialogs.map(id=>document.getElementById(id)).find(d=>d?.open);if(modal)return[{panel:modal,modal:true,timed:modal.id==='badgeDialog'}];return transient.map(([p,t])=>({panel:document.querySelector(p),trigger:document.querySelector(t),timed:true})).filter(x=>showing(x.panel))}
 function close(item){if(item.modal)item.panel.close();else{const details=item.panel.closest('details');if(details)details.open=false;else item.panel.hidden=true;item.trigger?.setAttribute('aria-expanded','false')}}
 function reset(){clearTimeout(timer);if(active().some(x=>x.timed))timer=setTimeout(()=>active().filter(x=>x.timed).forEach(close),8000)}
 new MutationObserver(()=>{const next=active().map(x=>x.panel.id||x.panel.className).join('|');if(next!==signature){signature=next;reset()}}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','open']});
 window.addEventListener('pointerdown',e=>{
  const items=active();if(!items.length)return;
  const inside=items.some(x=>{if(!x.modal)return x.panel.contains(e.target);const r=x.panel.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom});
  if(inside){reset();return}
  items.forEach(close);eatClickUntil=Date.now()+900;e.preventDefault();e.stopImmediatePropagation();
 },true);
 window.addEventListener('click',e=>{if(Date.now()<eatClickUntil){eatClickUntil=0;e.preventDefault();e.stopImmediatePropagation()}},true);
 document.addEventListener('keydown',e=>{if(!active().length)return;if(e.key==='Escape'){active().forEach(close);e.preventDefault();e.stopImmediatePropagation()}else reset()},true);
 document.addEventListener('input',reset,true);document.addEventListener('wheel',e=>{if(active().some(x=>x.panel.contains(e.target)))reset()},{capture:true,passive:true});
})();

/* Keep the source identity above the independently scrolling description. */
(()=>{
 const previous=renderDetail;
 renderDetail=function(...args){
  document.querySelector('#cardIdentity')?.remove();
  const result=previous.apply(this,args);
  const audit=document.querySelector('#sheetBody details.audit'),topic=document.querySelector('#sheetBody .cd-why');
  const source=D.find(d=>d.id===S.sel);
  if(topic&&source){
   topic.querySelector('.card-topic p')?.remove();
   topic.querySelector('.cd-row-label')?.remove();
   const parts=[];
   if(source.by)parts.push(esc(source.by)+' önerdi');
   if(source.at)parts.push(esc(trDate(source.at))+' tarihinde radara eklendi');
   if(parts.length){const footer=document.createElement('div');footer.className='card-source-credit';footer.innerHTML=parts.join(' · ');topic.append(footer)}
   audit?.remove();
  }
  if(!matchMedia('(max-width:759px)').matches)return result;
  const body=document.querySelector('#sheetBody'),card=body?.querySelector('.cd');
  if(!card)return result;
  const identity=document.createElement('div');identity.id='cardIdentity';identity.className='cd';
  for(const selector of ['.profile-cover','.cd-hd']){const node=card.querySelector(selector);if(node)identity.append(node)}
  body.before(identity);
  return result;
 };
})();
/* Large route titles: search scrolls away before the pinned title. */
(()=>{
 const root=document.documentElement,mobile=matchMedia('(max-width:759px)');let queued=false;
 const configs=[{key:'sources',host:'#sources',input:'#q',title:'Kaynaklar',toolbar:'.camera-filter-head.is-source-navigation',small:'.toolbar-page-label'},{key:'saved',host:'#sepet',title:'Listem',toolbar:'.my-list-title-row',small:'.my-list-page-name'},{key:'discover',host:'#discover',title:'Keşfet',toolbar:'.discover-toolbar',small:'.discover-page-name'}];
 // Tablets get the same large titles on Listem and Keşfet; their Kaynaklar is a section of the radar page.
 function update(){queued=false;const tablet=root.classList.contains('radar-tablet');if(!mobile.matches&&!tablet)return;
  for(const c of configs){if(!mobile.matches&&c.key==='sources')continue;const host=document.querySelector(c.host);if(!host)continue;
   // Under the title only Kaynaklar has its search; Listem keeps its platform rail sticky below.
   const input=c.input&&document.querySelector(c.input),item=input&&(input.closest('label')||input.parentElement);
   if(c.input&&!input)continue;
   if(c.key==='saved'){
    const rail=document.querySelector('#myListPlatforms');
    if(rail&&!rail.parentElement.classList.contains('saved-platform-sticky')){const wrap=document.createElement('div');wrap.className='saved-platform-sticky';rail.before(wrap);wrap.append(rail)}
   }
   let hero=host.querySelector('.route-large-header');
   if(!hero){hero=document.createElement('div');hero.className='route-large-header';hero.innerHTML='<h1 class="route-large-title">'+c.title+'</h1><div class="route-search-slot"></div>';if(c.key==='sources')host.prepend(hero);else host.querySelector(c.key==='discover'?'.discover-toolbar':'.my-list-title-row').after(hero)}
   if(item&&item.parentNode!==hero.lastElementChild)hero.lastElementChild.append(item);
   if(input)item.classList.add('route-search-field');
   const toolbar=document.querySelector(c.toolbar),title=hero.firstElementChild;
   if(toolbar){const active=c.key==='sources'?root.classList.contains('mobile-source-mode'):c.key==='discover'?!host.hidden:mobile.matches?root.classList.contains('mobile-my-list-mode'):host.getClientRects().length>0;const folded=active&&title.getBoundingClientRect().bottom<=toolbar.getBoundingClientRect().bottom+1;toolbar.classList.toggle('route-title-folded',folded)}
  }
 }
 function queue(){if(!queued){queued=true;requestAnimationFrame(update)}}
 new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
 new MutationObserver(queue).observe(root,{attributes:true,attributeFilter:['class']});
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);queue();
})();

(()=>{const icon=document.querySelector('#introBtn svg');if(icon){icon.setAttribute('viewBox','0 0 24 24');icon.innerHTML='<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none"/>'}})();

/* Move the existing guide trigger into the left control, retaining its lifecycle. */
(()=>{
 const jump=document.querySelector('.camera-list-jump'),guide=document.querySelector('.radar-read-toggle');
 if(jump&&guide){
  guide.classList.add('radar-guide-control');guide.setAttribute('aria-label','Radar rehberi');guide.title='Radar rehberi';
  guide.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-1 .7-1.7 1.2-1.7 2.7"/><circle cx="12" cy="17" r=".7" fill="currentColor" stroke="none"/></svg>';
  jump.before(guide);
  const visibility=()=>{const sources=document.documentElement.classList.contains('mobile-source-mode');jump.style.setProperty('display',sources?'grid':'none','important');guide.style.setProperty('display',sources?'none':'grid','important')};
  new MutationObserver(visibility).observe(document.documentElement,{attributes:true,attributeFilter:['class']});visibility();
 }
})();

/* Bare help/info glyphs, without their inner circular outlines. */
(()=>{
 const info=document.querySelector('#introBtn svg'),help=document.querySelector('.radar-read-toggle svg');
 if(info)info.innerHTML='<path d="M12 10v8"/><circle cx="12" cy="6" r=".9" fill="currentColor" stroke="none"/>';
 if(help)help.innerHTML='<path d="M8.5 8a3.5 3.5 0 1 1 5.9 2.6c-1.4 1-2.4 1.7-2.4 3.4"/><circle cx="12" cy="18" r=".9" fill="currentColor" stroke="none"/>';
})();

/* Override legacy important display rules on the shared sort control. */
(()=>{const root=document.documentElement,button=document.querySelector('.camera-mobile-sort');if(!button)return;const update=()=>button.style.setProperty('display',root.classList.contains('mobile-source-mode')?'grid':'none','important');new MutationObserver(update).observe(root,{attributes:true,attributeFilter:['class']});update()})();
(()=>{const root=document.documentElement;function update(){const black=!root.classList.contains('mobile-source-mode')&&!root.classList.contains('mobile-my-list-mode');for(const e of document.querySelectorAll('.appbar,.about-header')){if(black){e.style.setProperty('background','#000','important');e.style.setProperty('color','#fff','important')}else{e.style.removeProperty('background');e.style.removeProperty('color')}}}new MutationObserver(update).observe(root,{attributes:true,attributeFilter:['class']});update()})();
