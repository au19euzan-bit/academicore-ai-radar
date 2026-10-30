/* v1.3.347-test: takip döngüsü (aşama 1).
   Listem'deki her kaynak bir ya da birden çok kanaldan takip edilir. Kanal bağlantısı
   açılıp uygulamaya dönülünce ziyaret o gün için kaydedilir. Kaynağın takip sıklığı
   (günlük 1, haftalık 7, dönemsel 30 gün) ve son ziyaret, bakma zamanını belirler.
   Günün ilk açılışında radar Listem'i bir tur tarar; bakma zamanı gelenler amber olur,
   sonuç penceresi açılır ve takip turu bu kaynakları sırayla açtırır.
   Tüm kayıtlar yalnızca bu cihazda tutulur (cihaz yedeğine dahil). */
(()=>{
 const K_CH='edumind-channels',K_VIS='edumind-visits',K_SCAN='edumind-scan-day',K_SETUP='edumind-setup',K_INT='edumind-interest';
 const FREQ={g:1,h:7,a:30};
 const read=(k,fb)=>{try{const v=JSON.parse(localStorage.getItem(k));return v&&typeof v==='object'&&!Array.isArray(v)?v:fb}catch{return fb}};
 const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
 let CH=read(K_CH,{}),VIS=read(K_VIS,{});
 /* v1.3.350-test: AcademiCore AI Radar okuyucusunun günlük ajanı (GitHub Actions) içerikleri
    data/items.json'a yazar. Eşleşen kaynaklarda "bakma zamanı" takvimden değil, son ziyaretten
    sonra gelen gerçek içerikten çıkar. */
 const FEED_URL='./data/items.json',K_FEED='edumind-feed-cache',K_READ='edumind-feed-read',K_STAR='edumind-feed-star';
 const FEED_MAP={mollick:'Ethan Mollick',mishra:'Punya Mishra',cae:'Computers & Education',cicek:'Çiçek ile Teknoloji',erhan:'Erhan Meydan',bjet:'British Journal of Educational Technology',ijaied:'Int. Journal of AI in Education (IJAIED)',openai:'OpenAI',unesco:'UNESCO – Dijital Eğitim ve AI',oecd:'OECD Education and Skills',anthropic:'Anthropic (Claude)',deepmind:'Google DeepMind / Gemini'};
 let FEED=read(K_FEED,null),feedState=FEED?'cache':'loading';
 const readSet=new Set((()=>{try{return JSON.parse(localStorage.getItem(K_READ)||'[]')}catch{return[]}})()),starSet=new Set((()=>{try{return JSON.parse(localStorage.getItem(K_STAR)||'[]')}catch{return[]}})());
 const saveSet=(k,set)=>{try{localStorage.setItem(k,JSON.stringify([...set].slice(-2000)))}catch{}};
 const pad=n=>String(n).padStart(2,'0');
 const today=()=>{const t=new Date();return t.getFullYear()+'-'+pad(t.getMonth()+1)+'-'+pad(t.getDate())};
 const dayNo=s=>{const [y,m,d]=s.split('-').map(Number);return Date.UTC(y,m-1,d)/864e5};
 const daysSince=s=>s?dayNo(today())-dayNo(s):null;
 const scannedToday=()=>{try{return localStorage.getItem(K_SCAN)===today()}catch{return false}};

 /* ---------- Veri ---------- */
 const listed=()=>D.filter(inMyList);
 const byName=n=>D.find(d=>d.n===n);
 function available(d){const seen=new Map();sortLinks(d.links.filter(real)).forEach(l=>{if(REG[l.p]&&!seen.has(l.p))seen.set(l.p,l)});return[...seen.values()]}
 function channels(d){
  const av=available(d),has=p=>av.some(l=>l.p===p);
  const stored=(CH[d.n]||[]).filter(has);if(stored.length)return stored;
  // Önceki sürümlerden taşınan veri: platformda takip işaretleri, sonra Platformlarım.
  const marked=av.filter(l=>S.done.has(doneKey(l.p,d))||(REG[l.p].g==='icr'&&S.done.has('feed|'+d.n))).map(l=>l.p);
  const pref=av.filter(l=>prefRank(l.p)<99).slice(0,2).map(l=>l.p);
  const set=[...new Set([...marked,...pref])];return set.length?set:av.slice(0,1).map(l=>l.p);
 }
 const linkFor=(d,p)=>available(d).find(l=>l.p===p);
 const chName=p=>REG[p]?REG[p].n:p;
 function lastVisit(d){const v=VIS[d.n];if(!v)return null;return Object.values(v).sort().pop()||null}
 const visitedToday=d=>lastVisit(d)===today();
 // Akışı olan kaynakta bakma zamanı: hiç ziyaret edilmediyse ya da son ziyaretten sonra içerik geldiyse.
 function due(d){if(!inMyList(d))return false;const s=daysSince(lastVisit(d));if(hasFeed(d)&&FEED)return s===null||newItems(d).length>0;return s===null||s>=FREQ[d.r]}
 const dueText=d=>{const n=hasFeed(d)&&FEED?newItems(d).length:0;if(n)return n+' yeni içerik';const s=daysSince(lastVisit(d));return s===null?'ilk ziyaret':s===0?'bugün':s+' gün oldu'};
 const feedIdFor=d=>Object.keys(FEED_MAP).find(k=>FEED_MAP[k]===d.n);
 function hasFeed(d){return!!feedIdFor(d)}
 const localDay=iso=>{const t=new Date(iso);return t.getFullYear()+'-'+pad(t.getMonth()+1)+'-'+pad(t.getDate())};
 function itemsFor(d){const id=feedIdFor(d);if(!id||!FEED)return[];return FEED.items.filter(i=>i.sourceId===id).sort((a,b)=>String(b.published).localeCompare(String(a.published)))}
 function newItems(d){const lv=lastVisit(d),items=itemsFor(d);if(!lv)return items.filter(i=>daysSince(localDay(i.published))<=7);return items.filter(i=>localDay(i.published)>lv)}
 const whenText=n=>n<=0?'bugün':n===1?'yarın':n+' gün sonra';
 function nextCheck(d){const s=daysSince(lastVisit(d));return s===null?0:Math.max(0,FREQ[d.r]-s)}
 function saveVisit(d,p){VIS[d.n]=Object.assign({},VIS[d.n],{[p]:today()});write(K_VIS,VIS)}
 function setChannels(d,list){CH[d.n]=list;write(K_CH,CH)}

 /* ---------- Bağlantı açılınca dönüşte kaydetme ---------- */
 let pending=null;
 function openLink(d,p){pending={n:d.n,p,hidden:false,at:Date.now()};render()}
 function settle(){
  if(!pending)return;const d=byName(pending.n);const p=pending.p;pending=null;if(!d)return render();
  saveVisit(d,p);afterVisit(d,p);
 }
 document.addEventListener('visibilitychange',()=>{if(!pending)return;if(document.hidden)pending.hidden=true;else if(pending.hidden)settle()});
 addEventListener('pageshow',()=>{if(pending&&pending.hidden)settle()});

 /* ---------- Tur sırası ---------- */
 let order=[],skipped=[];
 function tourIds(){
  const ids=listed().filter(d=>due(d)||visitedToday(d)).map(d=>d.id);
  order=order.filter(id=>ids.includes(id));
  ids.sort((a,b)=>{const x=D.find(d=>d.id===a),y=D.find(d=>d.id===b);return'gha'.indexOf(x.r)-'gha'.indexOf(y.r)||x.n.localeCompare(y.n,'tr')}).forEach(id=>{if(!order.includes(id))order.push(id)});
  return order.filter(id=>!skipped.includes(id)).concat(skipped.filter(id=>order.includes(id)));
 }
 let current=null;
 function currentSource(){const ids=tourIds(),rest=ids.map(id=>D.find(d=>d.id===id)).filter(d=>!visitedToday(d));if(current&&rest.some(d=>d.id===current))return D.find(d=>d.id===current);current=rest[0]?.id||null;return rest[0]||null}

 /* ---------- Ortak parçalar ---------- */
 const IC={
  ext:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  ok:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
 play:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  radar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12 18 6"/></svg>'
 };
 function linkButtons(d,cls){
  const vis=VIS[d.n]||{},t=today();
  return channels(d).map(p=>{const l=linkFor(d,p);if(!l)return'';const done=vis[p]===t,wait=pending&&pending.n===d.n&&pending.p===p;
   return`<a class="${cls}${done?' is-visited':''}${wait?' is-pending':''}" href="${esc(l.u)}" target="_blank" rel="noopener" data-tk-open="${esc(p)}" data-tk-name="${esc(d.n)}" aria-label="${esc(chName(p))} bağlantısını aç${done?', bugün ziyaret edildi':''}">${picon(p)}<span>${esc(chName(p))}</span>${done?`<em>${IC.ok}Ziyaret edildi</em>`:IC.ext}</a>`}).join('');
 }
 function pendingRow(d){
  if(!pending||pending.n!==d.n)return'';
  return`<div class="tk-pending" role="status"><span>${esc(chName(pending.p))} açıldı · uygulamaya dönünce kaydedilecek</span><button type="button" data-tk-save>Şimdi kaydet</button></div>`;
 }
 function bindLinks(root){
  root.querySelectorAll('[data-tk-open]').forEach(a=>a.addEventListener('click',()=>{const d=byName(a.dataset.tkName);if(d)openLink(d,a.dataset.tkOpen)}));
  root.querySelectorAll('[data-tk-save]').forEach(b=>b.onclick=settle);
 }

 /* ---------- Kartta "Takip" bölümü ---------- */
 function statusLine(d){
  if(!inMyList(d))return['','Listende değil · bir kanal seçince listene eklenir'];
  if(visitedToday(d))return['is-done','Bugün ziyaret edildi · sıradaki kontrol '+whenText(FREQ[d.r])];
  if(due(d))return['is-due','Bakma zamanı geldi · '+dueText(d)];
  return['','Son ziyaret '+daysSince(lastVisit(d))+' gün önce · sıradaki kontrol '+whenText(nextCheck(d))];
 }
 const plainLinks=list=>list.map(l=>`<a class="tk-link plain" href="${esc(l.u)}" target="_blank" rel="noopener">${picon(l.p)}<span>${esc(chName(l.p))}</span>${IC.ext}</a>`).join('');
 function cardSection(d){
  const av=available(d),on=inMyList(d)?channels(d):[],[cls,text]=statusLine(d);
  if(!av.length)return'';
  return`<section class="tk-card" aria-label="Takip">
   <p class="tk-status ${cls}"><span class="tk-dot" aria-hidden="true"></span>${esc(text)}</p>
   <h3 class="tk-h">Takip kanalları</h3>
   <div class="tk-chips" role="group" aria-label="Takip kanalları">${av.map(l=>{const p=on.includes(l.p);return`<button type="button" class="tk-chip" aria-pressed="${p}" data-tk-chan="${esc(l.p)}">${p?IC.ok:IC.plus}<span>${esc(chName(l.p))}</span></button>`}).join('')}</div>
   ${on.length?`<h3 class="tk-h">Bağlantıyı aç</h3><div class="tk-links">${linkButtons(d,'tk-link')}</div>${pendingRow(d)}`:`<h3 class="tk-h">Bağlantılar</h3><div class="tk-links">${plainLinks(av)}</div>`}
   ${on.length&&av.length>on.length?`<details class="tk-more"><summary>Diğer bağlantılar</summary><div class="tk-links">${plainLinks(av.filter(l=>!on.includes(l.p)))}</div></details>`:''}
   ${cardFeed(d)}
   <p class="tk-hint">${on.length?`${esc(RH[d.r])} takip edilen bir kaynak. Bağlantıyı açıp uygulamaya döndüğünde ziyaret kaydedilir.`:'Bir kanal seçince kaynak Listem’e eklenir; bakma zamanı geldiğinde Listem’in üstünde sıraya girer.'}</p>
  </section>`;
 }
 function decorateCard(){
  const body=document.querySelector('#sheetBody'),d=D.find(x=>x.id===S.sel);if(!body||!d)return;
  body.querySelector('.tk-card')?.remove();
  const html=cardSection(d);if(!html)return;
  const anchor=body.querySelector('.cd .profile-actions')||body.querySelector('.cd-why');if(!anchor)return;
  anchor.insertAdjacentHTML(anchor.classList.contains('profile-actions')?'afterend':'beforebegin',html);
  const sec=body.querySelector('.tk-card');
  sec.querySelectorAll('[data-tk-chan]').forEach(b=>b.onclick=()=>{
   const p=b.dataset.tkChan;
   if(!inMyList(d)){toggleMyList(d.n);setChannels(d,[p]);toast('Listeme eklendi · '+chName(p));}
   else{const list=channels(d),next=list.includes(p)?list.filter(x=>x!==p):[...list,p];
    if(!next.length){toggleMyList(d.n);delete CH[d.n];write(K_CH,CH);toast('Listemden çıkarıldı')}else setChannels(d,next)}
   renderDetail();render();
  });
  bindLinks(sec);bindFeedItems(sec);
 }
 const baseRenderDetail=renderDetail;
 renderDetail=function(...args){const r=baseRenderDetail.apply(this,args);decorateCard();return r};

 /* ---------- Radar: durum kartı ---------- */
 let scanning=null;
 function stripState(){
  const L=listed(),dueL=L.filter(due),doneToday=L.filter(visitedToday);
  if(!L.length)return{title:'Listen boş',sub:'Kaynak ekleyince günlük takip başlar',btn:['Kaynaklar','list']};
  if(scanning)return{title:'Listen taranıyor…',sub:`${scanning.seen}/${L.length} kaynak · ${scanning.hits} sinyal`,busy:true};
  // Filtre seçiliyken sonuç anında: kaç kaynak eşleştiği ve Kaynaklar'a geçiş.
  if(anyF()){const n=D.filter(match).length,sub=!scannedToday()?'Bugün henüz taranmadı':dueL.length?`${dueL.length} kaynağa bakma zamanı`:'Bugünkü tur tamam';return{title:`Filtrene ${n} kaynak uyuyor`,sub,btn:["Kaynaklar'da gör",'list'],filter:true}}
  if(!scannedToday())return{title:'Bugün henüz taranmadı',sub:`Listende ${L.length} kaynak`,btn:['Tara','scan']};
  if(dueL.length)return{title:`${dueL.length} kaynağa bakma zamanı`,sub:doneToday.length?`${doneToday.length} tamamlandı · ${dueL.length} kaldı`:`Listendeki ${L.length} kaynak tarandı`,btn:[doneToday.length?'Tura devam':'Turu başlat','tour'],due:true};
  const next=Math.min(...L.map(nextCheck).map(n=>n||FREQ.g));const nextCount=L.filter(d=>(nextCheck(d)||FREQ.g)===next).length;
  return{title:'Bugünkü tur tamam',sub:`Sıradaki: ${whenText(next)} · ${nextCount} kaynak`,btn:['Tara','scan'],ok:true};
 }
 function renderStrip(){
  const el=document.querySelector('#newStrip');if(!el)return;
  const s=stripState(),count=el.querySelector('.recent-source-count');
  el.hidden=false;el.classList.add('tk-strip');
  el.querySelector('.recent-summary')?.remove();
  let box=el.querySelector('.tk-status-card');
  if(!box){box=document.createElement('div');box.className='tk-status-card';el.prepend(box)}
  box.className='tk-status-card'+(s.filter?' is-filter':'')+(s.due?' is-due':'')+(s.ok?' is-ok':'')+(s.busy?' is-busy':'');
  box.innerHTML=`<span class="tk-ic" aria-hidden="true">${s.ok?IC.ok:IC.radar}</span><span class="tk-txt" aria-live="polite"><strong>${esc(s.title)}</strong><span>${esc(s.sub)}</span></span>${s.btn?`<button type="button" class="tk-btn${s.due?' primary':s.filter?' brand':''}" data-tk-act="${s.btn[1]}">${esc(s.btn[0])}</button>`:''}`;
  const b=box.querySelector('[data-tk-act]');if(b)b.onclick=()=>{const a=b.dataset.tkAct;if(a==='scan')runScan(false);else if(a==='tour')openTour();else setView('list')};
  if(count)el.append(count);
 }
 const baseRenderNewStrip=renderNewStrip;
 renderNewStrip=function(...args){const r=baseRenderNewStrip.apply(this,args);renderStrip();return r};

 /* ---------- Radar noktaları ---------- */
 function paintDots(){
  const svg=document.querySelector('#academyRadar');if(!svg)return;
  const show=scannedToday()&&!scanning;
  svg.querySelectorAll('.node[data-id]').forEach(g=>{const d=D.find(x=>x.id===g.dataset.id);if(!d)return;
   g.classList.toggle('tk-due',show?due(d):!!(scanning&&g.classList.contains('tk-hit')));
   g.classList.toggle('tk-new',isNew(d));
  });
 }
 let dotQueued=0;
 const queueDots=()=>{if(!dotQueued)dotQueued=requestAnimationFrame(()=>{dotQueued=0;paintDots()})};
 const watchRadar=()=>{const svg=document.querySelector('#academyRadar');if(!svg)return setTimeout(watchRadar,400);new MutationObserver(m=>{if(m.some(x=>x.type==='childList'))queueDots()}).observe(svg,{childList:true,subtree:true});queueDots()};
 watchRadar();

 /* ---------- Tarama ---------- */
 const radarVisible=()=>{const v=document.querySelector('.view[data-view="radar"]');return v&&!v.hidden&&!document.documentElement.classList.contains('mobile-source-mode')&&!document.hidden};
 const angleOf=g=>{const m=/rotate\(([-\d.]+)/.exec(g?.getAttribute('transform')||'');return m?parseFloat(m[1]):null};
 function runScan(auto){
  if(scanning)return;const L=listed();if(!L.length){render();return}
  const dueIds=new Set(L.filter(due).map(d=>d.id)),listIds=new Set(L.map(d=>d.id));
  const quick=document.querySelector('[data-quick-scan]'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  scanning={seen:0,hits:0};render();
  const finish=()=>{if(!scanning)return;scanning=null;
   // After one sweep the radar goes quiet, as in the prototype, even if the beam was already running.
   if(quick&&/durdur/i.test(quick.textContent))quick.click();
   try{localStorage.setItem(K_SCAN,today())}catch{}
   document.querySelectorAll('#academyRadar .node.tk-hit').forEach(g=>g.classList.remove('tk-hit'));
   order=[];skipped=[];current=null;render();openResult();};
  if(reduce||!quick||!radarVisible()){scanning.seen=L.length;scanning.hits=dueIds.size;return setTimeout(finish,reduce?250:0)}
  // The beam's own on/off state can differ from the saved setting at startup, so it is read
  // from the screen: a visible beam is running.
  const fanOn=()=>{const f=document.querySelector('#academyRadar .scan-fan');return!!f&&f.style.display!=='none'};
  if(!fanOn()){scanning.started=true;quick.click();setTimeout(()=>{if(scanning&&!fanOn())quick.click()},300)}
  let total=0,last=null;const t0=performance.now(),seen=new Set();
  const tick=()=>{
   if(!scanning)return;
   const fan=document.querySelector('#academyRadar .scan-fan'),a=angleOf(fan);
   if(a!==null){if(last!==null)total+=((a-last)%360+360)%360;last=a}
   document.querySelectorAll('#academyRadar .node.scanned[data-id]').forEach(g=>{const id=g.dataset.id;if(!listIds.has(id)||seen.has(id))return;seen.add(id);scanning.seen++;if(dueIds.has(id)){scanning.hits++;g.classList.add('tk-hit','tk-due')}});
   renderStrip();
   if(total>=358||performance.now()-t0>30000){scanning.seen=L.length;scanning.hits=dueIds.size;return finish()}
   requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
 }
 // Günün ilk açılışında, radar göründüğünde bir kez kendiliğinden.
 let autoTried=false;
 function maybeAuto(){if(setupOpen()||autoTried||scannedToday()||!listed().length||!radarVisible())return;autoTried=true;setTimeout(()=>{if(!scannedToday()&&radarVisible())runScan(true);else autoTried=false},900)}

 /* ---------- Sonuç penceresi ---------- */
 const result=document.createElement('dialog');result.id='takipResult';result.className='tk-sheet';result.setAttribute('aria-labelledby','takipResultTitle');document.body.append(result);
 function openResult(){
  const L=listed(),dueL=L.filter(due);const first=dueL.filter(d=>lastVisit(d)===null).length;
  const withNew=dueL.filter(d=>hasFeed(d)&&FEED&&newItems(d).length).length;
  const head=!dueL.length?'Bugün bakılacak kaynak yok.':withNew?`Listendeki ${dueL.length} kaynağa bakma zamanı geldi; ${withNew} tanesinde yeni içerik var.`:first===dueL.length?`Listendeki ${dueL.length} kaynağın ilk ziyaret zamanı geldi. Her birini seçtiğin kanallardan açacaksın.`:`Listendeki ${L.length} kaynaktan ${dueL.length} tanesine bakma zamanı geldi.`;
  result.innerHTML=`<span class="tk-grab" aria-hidden="true"></span><h2 id="takipResultTitle">Tarama tamamlandı</h2><p class="tk-lede">${esc(head)}</p>
   ${dueL.length?`<ul class="tk-rows">${dueL.map(d=>`<li>${avatar(d,32)}<span class="tk-row-txt"><b>${esc(d.n)}</b><span>${esc(channels(d).map(chName).join(' · '))}</span></span><span class="tk-when">${esc(dueText(d))}</span></li>`).join('')}</ul>`:''}
   ${newBlock()}
   <div class="tk-actions"><button type="button" class="tk-btn" data-tk-close>Sonra</button>${dueL.length?`<button type="button" class="tk-btn primary" data-tk-tour>Turu başlat</button>`:''}</div>`;
  result.querySelector('[data-tk-close]').onclick=()=>result.close();
  const t=result.querySelector('[data-tk-tour]');if(t)t.onclick=()=>{result.close();openTour()};
  const nb=result.querySelector('[data-tk-new]');if(nb)nb.onclick=()=>{result.close();showNew()};
  if(!result.open)result.showModal();
 }
 result.addEventListener('click',e=>{if(e.target===result)result.close()});

 /* ---------- Listem: "Bugün bakılacaklar" (takip turu) ---------- */
 let toastText='',toastTimer=0;
 const listemOpen=()=>document.documentElement.classList.contains('mobile-my-list-mode')||S.view==='follow';
 function afterVisit(d,p){
  if(listemOpen()){
   current=null;const next=currentSource();
   toastText=`${d.n} kaydedildi`+(next?` · sıradaki: ${next.n}`:'');clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toastText='';renderTour()},3200);
  }else toast(`${d.n} · ${chName(p)} ziyareti kaydedildi`);
  render();
 }
 // Radar ve sonuç penceresindeki "Turu başlat" Listem'in üstündeki bölümü açar.
 function openTour(){current=null;setView('follow');requestAnimationFrame(()=>requestAnimationFrame(()=>{renderTour();const h=document.querySelector('#tkToday');if(h){h.scrollIntoView({block:'start'});h.querySelector('.tk-open,.tk-btn')?.focus({preventScroll:true})}}))}
 function todayHost(){
  const sepet=document.querySelector('#sepet');if(!sepet)return null;
  let h=document.querySelector('#tkToday');
  if(!h){h=document.createElement('section');h.id='tkToday';h.className='tk-today';h.setAttribute('aria-labelledby','tkTodayTitle')}
  const anchor=sepet.querySelector('.saved-platform-sticky')||sepet.querySelector('#myListPlatforms')||sepet.querySelector('#basket');
  if(anchor&&h.nextElementSibling!==anchor)anchor.before(h);
  return h;
 }
 function renderTour(){
  const host=todayHost();if(!host)return;
  const L=listed();if(!L.length){host.hidden=true;return}host.hidden=false;
  const ids=tourIds(),src=ids.map(id=>D.find(d=>d.id===id)).filter(Boolean);
  const done=src.filter(visitedToday),rest=src.filter(d=>!visitedToday(d)),cur=currentSource();
  const total=src.length,pct=total?Math.round(done.length/total*100):0;
  let body;
  if(!scannedToday()&&!total)body=`<div class="tk-today-row"><span class="tk-row-txt"><b>Bugün henüz taranmadı</b><span>Listendeki ${L.length} kaynak taranınca bakma zamanı gelenler burada sıralanır.</span></span><button type="button" class="tk-btn" data-tk-scan>Tara</button></div>`;
  else if(!total)body=`<div class="tk-today-row is-ok"><span class="tk-ic small">${IC.ok}</span><span class="tk-row-txt"><b>Bugün bakılacak kaynak yok</b><span>${esc(nextTourText())}</span></span></div>`;
  else body=`<div class="tk-progress"><div><strong>${done.length} / ${total} tamamlandı</strong><span>${rest.length?rest.length+' kaldı':'Tur tamam'}</span></div><div class="tk-bar" role="progressbar" aria-label="Bugünkü tur" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done.length}"><i style="width:${pct}%"></i></div></div>
   ${toastText?`<p class="tk-toast" role="status">${IC.ok}<span>${esc(toastText)}</span></p>`:''}
   ${cur?`<div class="tk-current"><span class="tk-eyebrow">Sıradaki</span>
     <button type="button" class="tk-who" data-tk-card="${esc(cur.id)}" aria-label="${esc(cur.n)}: kartı aç">${avatar(cur,44)}<span><strong>${esc(cur.n)}</strong><span>${esc(RH[cur.r])} takip · ${esc(dueText(cur))}</span></span></button>
     <div class="tk-open-list">${linkButtons(cur,'tk-open')}</div>${pendingRow(cur)}
     ${rest.length>1?`<div class="tk-row-actions"><button type="button" class="tk-btn ghost" data-tk-skip>Sona bırak</button></div>`:''}</div>`:''}
   ${!rest.length?`<p class="tk-complete-line">${IC.ok}<span>Bugünkü tur tamam. ${esc(nextTourText())}</span></p>`:''}
   ${rest.length>1?`<ul class="tk-list">${rest.filter(d=>d!==cur).map(d=>`<li><button type="button" class="tk-item" data-tk-focus="${esc(d.id)}">${avatar(d,32)}<span class="tk-row-txt"><b>${esc(d.n)}</b><span>${esc(dueText(d))}</span></span><span class="tk-when">Sıraya al</span></button></li>`).join('')}</ul>`:''}
   ${done.length?`<p class="tk-done-line">${IC.ok}<span>Bugün bakılanlar: ${done.map(d=>esc(d.n)).join(', ')}</span></p>`:''}`;
  host.innerHTML=`<h2 class="tk-today-title" id="tkTodayTitle">Bugün bakılacaklar</h2>${body}`;
  host.querySelector('[data-tk-scan]')?.addEventListener('click',()=>runScan(false));
  host.querySelector('[data-tk-card]')?.addEventListener('click',e=>openSheet(e.currentTarget.dataset.tkCard,e.currentTarget));
  host.querySelector('[data-tk-skip]')?.addEventListener('click',()=>{if(!cur)return;skipped=skipped.filter(x=>x!==cur.id).concat(cur.id);current=null;renderTour()});
  host.querySelectorAll('[data-tk-focus]').forEach(b=>b.onclick=()=>{current=b.dataset.tkFocus;skipped=skipped.filter(x=>x!==current);renderTour();host.scrollIntoView({block:'start',behavior:'smooth'})});
  bindLinks(host);
 }
 // Listem satırlarına kanallar ve sıradaki kontrol.
 function decorateListem(){
  document.querySelectorAll('#basket .my-saved-card[data-saved-id]').forEach(card=>{
   const d=D.find(x=>x.id===card.dataset.savedId),info=card.querySelector('.my-saved-info');if(!d||!info)return;
   let m=info.querySelector('.tk-row-meta');if(!m){m=document.createElement('span');m.className='tk-row-meta';info.append(m)}
   const due_=due(d)&&scannedToday(),text=channels(d).map(chName).join(' · ')+' · '+(visitedToday(d)?'bugün bakıldı':due_?'bakma zamanı':'sıradaki kontrol '+whenText(nextCheck(d)));
   m.textContent=text;m.classList.toggle('is-due',due_);
  });
 }
 {const b=document.querySelector('#basket');if(b)new MutationObserver(()=>requestAnimationFrame(decorateListem)).observe(b,{childList:true})}
 function nextTourText(){const L=listed();if(!L.length)return'';const n=Math.min(...L.map(d=>nextCheck(d)||FREQ[d.r]));return`Sıradaki tur ${whenText(n)}.`}

 /* ---------- Aşama 2: ilgi alanı ve yeni kaynaklar ---------- */
 const interest=()=>read(K_INT,null);
 const matchI=(d,I)=>!I||((!I.type?.length||I.type.includes(sourceType(d)))&&(!I.lens?.length||I.lens.includes(d.l))&&(!I.rh?.length||I.rh.includes(d.r)));
 const newOnes=()=>{const I=interest();return academicSourcePool().filter(d=>isNew(d)&&!inMyList(d)&&matchI(d,I))};
 function newBlock(){
  const n=newOnes();if(!n.length)return'';
  return`<div class="tk-new-block"><span class="tk-new-av" aria-hidden="true">${n.slice(0,3).map(d=>avatar(d,28)).join('')}</span><span>${interest()?`Filtrene uyan ${n.length} yeni kaynak eklendi`:`Radara ${n.length} yeni kaynak katıldı`}</span><button type="button" class="tk-btn ghost" data-tk-new>İncele</button></div>`;
 }
 function showNew(){
  const I=interest();clearF();
  if(I){(I.type||[]).forEach(v=>S.type.add(v));(I.lens||[]).forEach(v=>S.lens.add(v));(I.rh||[]).forEach(v=>S.rh.add(v))}
  S.recent=true;S.sort='new';sync();setView('list');
 }

 /* ---------- Aşama 2: Kaynaklar'da seçili filtre etiketleri ---------- */
 function renderChips(){
  const host=document.querySelector('#groups');if(!host)return;
  let row=document.querySelector('#tkFilterChips');
  const f=anyF()?activeF():[];if(S.recent)f.push(['recent','Yeni eklenenler']);if(S.bask)f.push(['basket','Listemdekiler']);if(S.core)f.push(['core','Çekirdek 12']);
  if(!f.length){row?.remove();return}
  if(!row){row=document.createElement('div');row.id='tkFilterChips';row.className='tk-fchips';row.setAttribute('aria-label','Seçili filtreler')}
  if(row.nextElementSibling!==host)host.before(row);
  row.innerHTML=f.map(([k,l])=>`<button type="button" class="tk-fchip" data-tk-rm="${esc(k)}" aria-label="${esc(l)} filtresini kaldır"><span>${esc(l)}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg></button>`).join('')+`<button type="button" class="tk-fclear" data-tk-clear>Temizle</button>`;
  row.querySelectorAll('[data-tk-rm]').forEach(b=>b.onclick=()=>{const k=b.dataset.tkRm;if(k==='recent')S.recent=false;else if(k==='basket')S.bask=false;else if(k==='core')S.core=false;else if(k==='personal'){S.personalIds=null;S.personalLabel=''}else{const [g,v]=k.split(':');S[g]?.delete(v)}sync()});
  row.querySelector('[data-tk-clear]').onclick=()=>{clearF();sync()};
 }

 /* ---------- Aşama 2: ilk açılış kurulumu ---------- */
 const PLATS=[['web','Web siteleri','Kurum, dergi ve proje sayfaları'],['feed','Bülten ve RSS','E-posta bültenleri ve akışlar'],['li','LinkedIn','Kurum ve kişi sayfaları'],['x','X','Hesap paylaşımları'],['bs','Bluesky','Hesap paylaşımları'],['yt','YouTube','Kanallar ve konuşmalar'],['scholar','Google Scholar','Akademik profiller'],['substack','Substack','Yazarların yazıları']];
 const setup=document.createElement('section');setup.id='takipSetup';setup.className='tk-tour tk-setup';setup.hidden=true;setup.setAttribute('role','dialog');setup.setAttribute('aria-modal','true');setup.setAttribute('aria-labelledby','takipSetupTitle');document.body.append(setup);
 let step=1,draft={type:[],lens:[],rh:[]},parked=false;
 function setupOpen(){return!setup.hidden||parked}
 function openSetup(){step=1;draft=Object.assign({type:[],lens:[],rh:[]},interest()||{});setup.hidden=false;document.documentElement.classList.add('tk-tour-open');renderSetup()}
 function closeSetup(){setup.hidden=true;parked=false;document.documentElement.classList.remove('tk-tour-open')}
 const prefOn=p=>S.pref.has(p);
 function prefChannels(d){const av=available(d),mine=av.filter(l=>prefOn(l.p)||(prefOn('feed')&&REG[l.p].g==='icr')||(prefOn('scholar')&&REG[l.p].g==='akd'));return mine.length?{list:mine,outside:false}:{list:av,outside:true}}
 const pool=()=>academicSourcePool();
 const matched=()=>pool().filter(d=>matchI(d,draft)).sort((a,b)=>(b.c?1:0)-(a.c?1:0)||b.p-a.p||a.n.localeCompare(b.n,'tr'));
 function chipRow(group,opts){return`<div class="tk-chips" role="group">${opts.map(([v,l])=>{const on=draft[group].includes(v);return`<button type="button" class="tk-chip" aria-pressed="${on}" data-tk-f="${group}:${esc(v)}">${on?IC.ok:''}<span>${esc(l)}</span></button>`}).join('')}</div>`}
 function renderSetup(){
  if(setup.hidden)return;
  const body=setup.querySelector('.tk-tour-body'),top=body?body.scrollTop:0;
  let main='',foot='';
  if(step===1){
   const n=PLATS.filter(([k])=>prefOn(k)).length;
   main=`<h1 id="takipSetupTitle">Hangi platformları kullanıyorsun?</h1><p class="tk-lede">Kaynakları yalnızca bu platformlar üzerinden takip edeceksin. Daha sonra ayarlardan değiştirebilirsin.</p>
    <div class="tk-plats">${PLATS.map(([k,l,d])=>`<button type="button" class="tk-plat" aria-pressed="${prefOn(k)}" data-tk-p="${k}"><span class="tk-plat-ic">${k==='feed'?picon('newsletter'):picon(k)}</span><b>${esc(l)}</b><span>${esc(d)}</span></button>`).join('')}</div>`;
   foot=`<span class="tk-foot-txt">${n} platform seçildi</span><button type="button" class="tk-btn brand" data-tk-next ${n?'':'disabled'}>Devam</button>`;
  }else if(step===2){
   const m=matched();
   main=`<h1 id="takipSetupTitle">Neyi takip etmek istiyorsun?</h1><p class="tk-lede">Bu seçim ilgi alanın olur. Sonraki açılışlarda ilgine uyan yeni kaynaklar sana ayrıca sunulur.</p>
    <section class="tk-match" aria-live="polite"><div><strong>${m.length}</strong><span>kaynak eşleşiyor</span></div><div class="tk-match-types">${TYPES.map(t=>`<span><i>${m.filter(d=>sourceType(d)===t.k).length}</i>${esc(t.n)}</span>`).join('')}</div></section>
    <h2 class="tk-h">Kaynak türü</h2>${chipRow('type',TYPES.map(t=>[t.k,t.n]))}
    <h2 class="tk-h">Konu</h2>${chipRow('lens',Object.entries(LENS).map(([k,v])=>[k,v.n]))}
    <h2 class="tk-h">Takip sıklığı</h2>${chipRow('rh',Object.entries(RH).map(([k,v])=>[k,v]))}`;
   foot=`<button type="button" class="tk-back" data-tk-prev aria-label="Geri">${IC.back}</button><button type="button" class="tk-btn brand wide" data-tk-next ${m.length?'':'disabled'}>${m.length} kaynağı incele</button>`;
  }else{
   const m=matched(),L=listed(),chans=L.reduce((a,d)=>a+channels(d).length,0);
   main=`<h1 id="takipSetupTitle">Kaynakları incele, listene ekle</h1><p class="tk-lede">Bir platform seçmek kaynağı takibe alır; aynı kaynağı birden fazla platformdan izleyebilirsin. Ayrıntılar için Kart'a dokun.</p>
    <ul class="tk-review">${m.map(d=>{const pc=prefChannels(d),on=inMyList(d)?channels(d):[];return`<li class="${on.length?'is-on':''}"><div class="tk-review-head">${avatar(d,36)}<span class="tk-row-txt"><b>${esc(d.n)}</b><span>${esc(TYPES.find(t=>t.k===sourceType(d))?.n||'')} · ${esc(RH[d.r])}</span></span><button type="button" class="tk-btn ghost small" data-tk-card="${esc(d.id)}">Kart</button></div>
     <div class="tk-chips">${pc.list.map(l=>{const p=on.includes(l.p);return`<button type="button" class="tk-chip" aria-pressed="${p}" data-tk-sc="${esc(d.id)}|${esc(l.p)}">${p?IC.ok:IC.plus}<span>${esc(chName(l.p))}</span></button>`}).join('')}</div>${pc.outside?`<p class="tk-hint">Seçtiğin platformlarda kanalı yok; tüm kanalları gösteriyorum.</p>`:''}</li>`}).join('')}</ul>`;
   foot=`<button type="button" class="tk-back" data-tk-prev aria-label="Geri">${IC.back}</button><span class="tk-foot-txt"><b>${L.length} kaynak</b>${chans} kanaldan takip</span><button type="button" class="tk-btn brand" data-tk-finish ${L.length?'':'disabled'}>Bitir ve tara</button>`;
  }
  setup.innerHTML=`<div class="tk-steps" aria-label="Adım ${step} / 3"><span class="${step>=1?'on':''}"></span><span class="${step>=2?'on':''}"></span><span class="${step>=3?'on':''}"></span><small>Adım ${step} / 3 · İlk kurulum</small></div><div class="tk-tour-body">${main}</div><div class="tk-setup-foot">${foot}</div>`;
  const nb=setup.querySelector('.tk-tour-body');if(nb)nb.scrollTop=top;
  setup.querySelectorAll('[data-tk-p]').forEach(b=>b.onclick=()=>{const k=b.dataset.tkP;S.pref.has(k)?S.pref.delete(k):S.pref.add(k);saveAll();renderSetup()});
  setup.querySelectorAll('[data-tk-f]').forEach(b=>b.onclick=()=>{const [g,v]=b.dataset.tkF.split(':');draft[g]=draft[g].includes(v)?draft[g].filter(x=>x!==v):[...draft[g],v];renderSetup()});
  setup.querySelectorAll('[data-tk-sc]').forEach(b=>b.onclick=()=>{const [id,p]=b.dataset.tkSc.split('|'),d=D.find(x=>x.id===id);if(!d)return;
   if(!inMyList(d)){toggleMyList(d.n);setChannels(d,[p])}else{const list=channels(d),next=list.includes(p)?list.filter(x=>x!==p):[...list,p];if(!next.length){toggleMyList(d.n);delete CH[d.n];write(K_CH,CH)}else setChannels(d,next)}renderSetup()});
  setup.querySelectorAll('[data-tk-card]').forEach(b=>b.onclick=()=>{parked=true;setup.hidden=true;openSheet(b.dataset.tkCard)});
  setup.querySelector('[data-tk-next]')?.addEventListener('click',()=>{step++;renderSetup();setup.querySelector('.tk-tour-body').scrollTop=0});
  setup.querySelector('[data-tk-prev]')?.addEventListener('click',()=>{step--;renderSetup();setup.querySelector('.tk-tour-body').scrollTop=0});
  setup.querySelector('[data-tk-finish]')?.addEventListener('click',()=>{
   write(K_INT,draft);try{localStorage.setItem(K_SETUP,'done');localStorage.removeItem(K_SCAN)}catch{}
   closeSetup();setView('radar');autoTried=false;setTimeout(()=>{sync();runScan(true)},500);
  });
 }
 // Kart kapanınca kuruluma geri dön.
 new MutationObserver(()=>{if(parked&&document.querySelector('#sheet')?.hidden){parked=false;setup.hidden=false;renderSetup()}}).observe(document.querySelector('#sheet'),{attributes:true,attributeFilter:['hidden']});
 // Yeni kullanıcıya bir kez; listesi olan mevcut kullanıcı atlar.
 (()=>{let flag=null;try{flag=localStorage.getItem(K_SETUP)}catch{}
  if(flag)return;if(listed().length){try{localStorage.setItem(K_SETUP,'skipped')}catch{}return}
  openSetup()})();
 /* ---------- Keşfet: takip listesini kur (kişisel öneri yerine) ---------- */
 function renderStart(){
  const route=document.querySelector('#discover .my-list-route');if(!route)return;
  route.hidden=true;
  let box=document.querySelector('#tkStart');
  if(!box){box=document.createElement('section');box.id='tkStart';box.className='tk-start';box.setAttribute('aria-labelledby','tkStartTitle')}
  if(box.nextElementSibling!==route)route.before(box);
  const I=interest(),names=I?[...(I.type||[]).map(k=>TYPES.find(t=>t.k===k)?.n),...(I.lens||[]).map(k=>LENS[k]?.n),...(I.rh||[]).map(k=>RH[k])].filter(Boolean):[];
  box.innerHTML=`<h2 id="tkStartTitle">${I?'İlgi alanın':'Takip listeni kur'}</h2><p>${I?esc(names.length?names.join(' · '):'Tüm kaynaklar'):'Kullandığın platformları ve ilgi alanını seç; eşleşen kaynakları kanallarıyla listene ekle. Radar her gün bakma zamanı gelenleri bulur.'}</p>
   <div class="tk-start-row"><span>${listed().length} kaynak takip ediliyor${newOnes().length?` · ${I?'ilgine uyan ':''}${newOnes().length} yeni kaynak`:''}</span><button type="button" class="tk-btn brand" data-tk-setup>${I?'Düzenle':'Başla'}</button></div>`;
  box.querySelector('[data-tk-setup]').onclick=openSetup;
 }

 /* ---------- Radar: tek tarama ---------- */
 // The old continuous beam toggle and its settings are hidden (takip.css); the beam only runs
 // for the daily scan, at the fast speed.
 (()=>{const sel=document.querySelector('#radarSettings [data-option="speed"]');if(sel&&sel.value!=='5000'){sel.value='5000';sel.dispatchEvent(new Event('change',{bubbles:true}))}})();
 // The separate radar guide ("?") is merged into "Nasıl çalışır?". Its inline display is
 // rewritten by other code on layout changes, so it is hidden again whenever that happens.
 document.querySelectorAll('.radar-read-toggle').forEach(help=>{const hide=()=>{if(help.style.getPropertyValue('display')!=='none')help.style.setProperty('display','none','important')};hide();new MutationObserver(hide).observe(help,{attributes:true,attributeFilter:['style','hidden']})});
 {const info=document.querySelector('#introBtn');info?.setAttribute('aria-label','Nasıl çalışır?');info?.setAttribute('title','Nasıl çalışır?')}

 /* ---------- Akış: veri, Listem'de "Yeni içerikler", kartta "Son içerikler", oynatıcı ---------- */
 async function loadFeed(){
  try{const r=await fetch(FEED_URL+'?t='+Date.now(),{cache:'no-store'});if(!r.ok)throw 0;const j=await r.json();if(!j||!Array.isArray(j.items))throw 0;
   FEED={generatedAt:j.generatedAt,items:j.items.filter(i=>FEED_MAP[i.sourceId]).map(i=>({id:i.id,sourceId:i.sourceId,title:i.title,url:i.url,published:i.published,excerpt:i.summary||i.excerpt||'',image:i.image||'',videoId:i.videoId||null}))};
   write(K_FEED,FEED);feedState='ok';
  }catch{feedState=FEED?'cache':'error'}
  render();
 }
 const feedSources=()=>Object.values(FEED_MAP).map(byName).filter(Boolean);
 const relDay=iso=>{const n=daysSince(localDay(iso));return n<=0?'Bugün':n===1?'Dün':n<7?n+' gün önce':new Date(iso).toLocaleDateString('tr-TR',{day:'numeric',month:'short'})};
 let feedFilter='all';
 function renderFeed(){
  const sepet=document.querySelector('#sepet'),today=document.querySelector('#tkToday');if(!sepet||!today)return;
  let host=document.querySelector('#tkFeed');
  if(!host){host=document.createElement('section');host.id='tkFeed';host.className='tk-feed';host.setAttribute('aria-labelledby','tkFeedTitle')}
  if(today.nextElementSibling!==host)today.after(host);
  if(!listed().length){host.hidden=true;return}host.hidden=false;
  const mine=listed().filter(hasFeed),pool=mine.flatMap(d=>itemsFor(d).map(i=>({i,d}))).filter(x=>daysSince(localDay(x.i.published))<=30).sort((a,b)=>String(b.i.published).localeCompare(String(a.i.published)));
  const unread=pool.filter(x=>!readSet.has(x.i.id)).length,stars=pool.filter(x=>starSet.has(x.i.id)).length;
  const shown=(feedFilter==='unread'?pool.filter(x=>!readSet.has(x.i.id)):feedFilter==='star'?pool.filter(x=>starSet.has(x.i.id)):pool).slice(0,40);
  const head=`<div class="tk-feed-head"><h2 id="tkFeedTitle">Yeni içerikler</h2><div class="tk-seg" role="group" aria-label="İçerikleri süz">${[['all','Tümü',''],['unread','Okunmamış',unread],['star','Yıldızlı',stars]].map(([k,l,n])=>`<button type="button" aria-pressed="${feedFilter===k}" data-tk-ff="${k}">${l}${n!==''?` <i>${n}</i>`:''}</button>`).join('')}</div></div>`;
  let body;
  if(!mine.length)body=`<p class="tk-feed-note">İçerik akışı şimdilik şu kaynaklarda var: ${feedSources().map(d=>`<button type="button" class="tk-inline" data-tk-card="${esc(d.id)}">${esc(d.n)}</button>`).join(', ')}. Bunları takip edince yeni içerikleri burada görürsün.</p>`;
  else if(!FEED)body=`<p class="tk-feed-note">${feedState==='error'?'İçerikler alınamadı. Bağlantı gelince yeniden denenecek.':'İçerikler yükleniyor…'}</p>`;
  else if(!shown.length)body=`<p class="tk-feed-note">${feedFilter==='all'?'Takip ettiğin kaynaklarda son 30 günde içerik yok.':feedFilter==='unread'?'Okunmamış içerik kalmadı.':'Yıldızlı içerik yok.'}</p>`;
  else{let last='';body=shown.map(({i,d})=>{const g=relDay(i.published),grp=g!==last?`<h3 class="tk-feed-day">${esc(g)}</h3>`:'';last=g;const r=readSet.has(i.id),st=starSet.has(i.id);
   return`${grp}<article class="tk-fi${r?' is-read':''}"><a class="tk-fi-main" href="${esc(i.url)}" target="_blank" rel="noopener" data-fi="${esc(i.id)}" data-fi-src="${esc(d.n)}"${i.videoId?` data-fi-video="${esc(i.videoId)}"`:''}><span class="tk-fi-meta">${avatar(d,20)}<span>${esc(d.n)}</span>${r?'':'<em>Yeni</em>'}</span><b>${esc(i.title)}</b>${i.excerpt?`<span class="tk-fi-ex">${esc(i.excerpt)}</span>`:''}</a>${i.image?`<img class="tk-fi-img" src="${esc(i.image)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:''}
    <div class="tk-fi-act">${i.videoId?`<button type="button" data-fi-play="${esc(i.id)}">${IC.play}<span>İzle</span></button>`:''}<button type="button" aria-pressed="${st}" data-fi-star="${esc(i.id)}" aria-label="${st?'Yıldızı kaldır':'Yıldızla'}">${IC.star}</button><button type="button" aria-pressed="${r}" data-fi-read="${esc(i.id)}" aria-label="${r?'Okunmadı say':'Okundu say'}">${IC.ok}</button></div></article>`}).join('')}
  host.innerHTML=head+body;
  host.querySelectorAll('[data-tk-ff]').forEach(b=>b.onclick=()=>{feedFilter=b.dataset.tkFf;renderFeed()});
  host.querySelectorAll('[data-tk-card]').forEach(b=>b.onclick=()=>openSheet(b.dataset.tkCard,b));
  host.querySelectorAll('.tk-fi img').forEach(img=>img.addEventListener('error',()=>img.remove(),{once:true}));
  bindFeedItems(host);
 }
 function bindFeedItems(root){
  root.querySelectorAll('[data-fi]').forEach(a=>a.addEventListener('click',e=>{const d=byName(a.dataset.fiSrc);readSet.add(a.dataset.fi);saveSet(K_READ,readSet);
   if(a.dataset.fiVideo){e.preventDefault();if(d)saveVisit(d,'yt');openPlayer(a.dataset.fiVideo,a.href);render();return}
   if(d)openLink(d,(channels(d).find(p=>p==='web')||channels(d)[0]||'web'))}));
  root.querySelectorAll('[data-fi-play]').forEach(b=>b.onclick=()=>b.closest('.tk-fi').querySelector('[data-fi]').click());
  root.querySelectorAll('[data-fi-star]').forEach(b=>b.onclick=()=>{const id=b.dataset.fiStar;starSet.has(id)?starSet.delete(id):starSet.add(id);saveSet(K_STAR,starSet);renderFeed()});
  root.querySelectorAll('[data-fi-read]').forEach(b=>b.onclick=()=>{const id=b.dataset.fiRead;readSet.has(id)?readSet.delete(id):readSet.add(id);saveSet(K_READ,readSet);renderFeed()});
 }
 // Kartta "Son içerikler".
 function cardFeed(d){
  const items=itemsFor(d).slice(0,3);if(!items.length)return'';const fresh=new Set(newItems(d).map(i=>i.id));
  return`<h3 class="tk-h">Son içerikler</h3><ul class="tk-card-feed">${items.map(i=>`<li><a href="${esc(i.url)}" target="_blank" rel="noopener" data-fi="${esc(i.id)}" data-fi-src="${esc(d.n)}"${i.videoId?` data-fi-video="${esc(i.videoId)}"`:''}><span>${esc(relDay(i.published))}${fresh.has(i.id)&&inMyList(d)?' · <em>yeni</em>':''}</span><b>${esc(i.title)}</b></a></li>`).join('')}</ul>`;
 }
 // Uygulama içinde video (YouTube'un gömülü oynatıcısı).
 const player=document.createElement('dialog');player.id='tkPlayer';player.className='tk-player';player.setAttribute('aria-label','Video');document.body.append(player);
 function openPlayer(id,url){
  player.innerHTML=`<div class="tk-player-bar"><a href="${esc(url)}" target="_blank" rel="noopener">YouTube'da aç ${IC.ext}</a><button type="button" data-close aria-label="Videoyu kapat">${IC.x}</button></div><div class="tk-player-frame"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&playsinline=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
  player.querySelector('[data-close]').onclick=()=>player.close();if(!player.open)player.showModal();
 }
 player.addEventListener('close',()=>{player.innerHTML=''});
 player.addEventListener('click',e=>{if(e.target===player)player.close()});

 /* ---------- Yenileme ---------- */
 function render(){renderStrip();renderChips();paintDots();renderTour();renderFeed();decorateListem();renderStart();if(!document.querySelector('#sheet')?.hidden)decorateCard()}
 const baseSync=sync;
 sync=function(...args){const r=baseSync.apply(this,args);render();maybeAuto();return r};
 document.addEventListener('edumind-preferences-restored',()=>{CH=read(K_CH,{});VIS=read(K_VIS,{});render()});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){render();maybeAuto()}});
 addEventListener('load',()=>{render();maybeAuto()});
 loadFeed();let feedAt=Date.now();document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-feedAt>3*36e5){feedAt=Date.now();loadFeed()}});
 render();maybeAuto();
 window.edumindTakip={runScan,openTour,openResult,openSetup,state:()=>({channels:CH,visits:VIS,scanDay:localStorage.getItem(K_SCAN)})};
})();
