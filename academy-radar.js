/* AcademyAI v1.17 engine integrated into the v1.3.266 host. No independent filters or source storage. */
(()=>{
'use strict';
const hostMatch=match;
const KEY='edumind-radar-v117-settings';
const defaults={scan:!matchMedia('(prefers-reduced-motion: reduce)').matches,speed:14000,grey:true,band:false,lines:true,labels:false,fit:true,animation:true,statusMarkers:true,highlightSaved:false,hideSaved:false};
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY))||{}}catch{}
const options={...defaults};
for(const k of Object.keys(defaults)){if(typeof defaults[k]==='boolean'&&typeof saved[k]==='boolean')options[k]=saved[k]}
if([5000,8500,14000].includes(saved.speed))options.speed=saved.speed;
// The host's #radar element stays only as the mount point; the old renderer is gone.
const legacySvg=document.querySelector('#radar'),viewport=legacySvg.parentElement;
const newSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');newSvg.id='academyRadar';newSvg.setAttribute('role','group');newSvg.setAttribute('aria-label','Kaynak radarı; içten dışa günlük, haftalık ve dönemsel takip');viewport.append(newSvg);
const CATEGORIES=[
 {n:'Platform',a:316,b:405,c:'#3b82f6',f:'#e7f3ff',subs:['Temel Modeller','Yapay Zekâ Arama','Eğitim Platformları']},
 {n:'Kurum',a:45,b:124,c:'#0fbaa3',f:'#dff9f3',subs:['Üniversite ve Araştırma Merkezleri','Uluslararası Kurumlar','Akademik Topluluklar','Eğitim ve Sivil Toplum','Yükseköğretim ve Teknoloji Ağları','Türkiye Kamu ve Akademi']},
 {n:'Kişi',a:124,b:242,c:'#9655ed',f:'#f0e6ff',subs:['Araştırmacılar','Eğitimciler','Geliştiriciler','Girişimciler','Sektör Uzmanları','Politika ve Etik Uzmanları','İçerik Üreticileri','Topluluk Liderleri','Yatırımcılar']},
 {n:'Yayın',a:242,b:290,c:'#f0647e',f:'#ffebf0',subs:['Akademik Dergiler','Eğitim Teknolojisi Yayınları']},
 {n:'Etkinlik',a:290,b:316,c:'#f5ac2f',f:'#fff5d9',subs:['Konferanslar','Zirveler']}
];
const GROUPS={
 'Platform':{
 'Temel Modeller':'OpenAI|Anthropic (Claude)|Google DeepMind / Gemini|Microsoft AI (Copilot)|Meta AI|Mistral AI|xAI (Grok)|DeepSeek',
 'Yapay Zekâ Arama':'Perplexity',
 'Eğitim Platformları':'OpenAI Eğitim|Claude for Education|Google for Education|Microsoft Education|Code.org / CodeAI|Khan Academy / Khanmigo'
 },
 'Kurum':{
 'Üniversite ve Araştırma Merkezleri':'MIT RAISE|Stanford HAI|AI Pedagogy Project (Harvard)|TÜBİTAK BİLGEM',
 'Uluslararası Kurumlar':'UNESCO – Dijital Eğitim ve AI|OECD Education and Skills|European Digital Education Hub',
 'Akademik Topluluklar':'International AIED Society (IAIED)|SoLAR|Educational Data Mining Society|ISLS',
 'Eğitim ve Sivil Toplum':'TeachAI|Digital Promise|EdTech Hub|ISTE|AI for Education|aiEDU',
 'Yükseköğretim ve Teknoloji Ağları':'EDUCAUSE|Jisc',
 'Türkiye Kamu ve Akademi':'MEB YEĞİTEK|MEB|YÖK|BTK Akademi|TÜBİTAK|TÜBA|YÖKAK'
 },
 'Kişi':{
 'Araştırmacılar':'Rose Luckin|Punya Mishra|Mutlu Cukurova|Mike Sharples|Ryan S. Baker|George Siemens|Neil Selwyn|Melanie Mitchell|Fei-Fei Li|Arvind Narayanan & Sayash Kapoor',
 'Eğitimciler':'Leon Furze|Anna Mills|Marc Watkins|José Antonio Bowen|Lance Eaton|Pat Yongpradit',
 'Geliştiriciler':'Simon Willison|Andrej Karpathy|Lilian Weng|Yann LeCun',
 'Girişimciler':'Sal Khan|Andrew Ng|Amanda Bickerstaff',
 'Sektör Uzmanları':'Nathan Lambert (Interconnects)|Jack Clark (Import AI)|Bryan Alexander',
 'Politika ve Etik Uzmanları':'Wayne Holmes|Emily M. Bender|Timnit Gebru (DAIR)|Gary Marcus',
 'İçerik Üreticileri':'Dan Fitzpatrick|Philippa Hardman|Çiçek ile Teknoloji|Erhan Meydan',
 'Topluluk Liderleri':'Maha Bali|Ethan Mollick',
 'Yatırımcılar':''
 },
 'Yayın':{
 'Akademik Dergiler':'Int. Journal of AI in Education (IJAIED)|Computers & Education: AI|Computers & Education|Journal of Learning Analytics|British Journal of Educational Technology',
 'Eğitim Teknolojisi Yayınları':'EdSurge|EdTech Insiders'
 },
 'Etkinlik':{
 'Konferanslar':'AIED Conference|LAK Conference|EDM Conference',
 'Zirveler':'ASU+GSV'
 }
};
const FOLLOW_RING_RADII=[208,296,380];
const FOLLOW_BANDS=[
 {key:'g',name:'Günlük',inside:112,outside:FOLLOW_RING_RADII[0]},
 {key:'h',name:'Haftalık',inside:FOLLOW_RING_RADII[0],outside:FOLLOW_RING_RADII[1]},
 {key:'a',name:'Dönemsel',inside:FOLLOW_RING_RADII[1],outside:FOLLOW_RING_RADII[2]}
];


let DATA=[],scope='all',drawLines=true,fit=true,extraLabels=false,selection=null;
// Sub-area captions run along the radar's outer edge on two curved tracks. A
// caption needs one line of radial room instead of its whole width, so the radar
// fills almost the entire box. The caption size depends only on the box (labelPx
// on screen); a caption shows the full name where it fits on its track, the short
// name otherwise, and ends with "…" only if neither fits. A grey dashed leader runs
// from the middle of each sub-area arc to a dot just inside its caption.
const labelPx=()=>(matchMedia('(max-width:759px)').matches?9:10)+(extraLabels?2:0);
const MAIN_SIZE=23.8,MAIN_WEIGHT=700,LABEL_PITCH=1.2,LABEL_INSET=.3,LABEL_LEADER=1,LABEL_SPACE=.6,FIT_MARGIN=3;
// Narrow boxes (320px phones) get a third track so no caption needs "…".
let labelSize=24,labelTracks=2;
const SHORT_SUBS={'Temel Modeller':'Modeller','Yapay Zekâ Arama':'YZ Arama','Eğitim Platformları':'Platformlar',
 'Üniversite ve Araştırma Merkezleri':'Üniversiteler','Uluslararası Kurumlar':'Uluslararası','Akademik Topluluklar':'Topluluklar',
 'Eğitim ve Sivil Toplum':'Sivil Toplum','Yükseköğretim ve Teknoloji Ağları':'Ağlar','Türkiye Kamu ve Akademi':'Türkiye',
 'Sektör Uzmanları':'Uzmanlar','Politika ve Etik Uzmanları':'Politika/Etik','İçerik Üreticileri':'İçerik','Topluluk Liderleri':'Liderler',
 'Akademik Dergiler':'Dergiler','Eğitim Teknolojisi Yayınları':'Yayınlar'};
let greyBackground=true,bandColorExperiment=true;
const sourceRhythm=()=> 'h';
const visibleRecords=()=>DATA;
const svg=document.getElementById('academyRadar'),NS='http://www.w3.org/2000/svg',tip=document.getElementById('tip');const X=720,Y=635,ARC=422,INNER=112,SOURCE_RING=380,MAIN_BAND_INNER=382.5,MAIN_BAND_OUTER=416.5,MAIN_TITLE_RING=(MAIN_BAND_INNER+MAIN_BAND_OUTER)/2,MAIN_TITLE_OPTICAL_OFFSET=0;
function el(tag,attrs={},parent=svg,text){const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));if(text!==undefined)n.textContent=text;parent.append(n);return n;}
const rad=a=>(a-90)*Math.PI/180;const xy=(a,r)=>({x:X+r*Math.cos(rad(a)),y:Y+r*Math.sin(rad(a))});const pct=(a,r)=>{let p=xy(a,r);return `${p.x.toFixed(2)} ${p.y.toFixed(2)}`};
// SVG'nin tek bir A komutu 360 dereceyi çizemez; tam daire iki yarım yayla çizilir.
function wedge(a,b,r1,r2){
 const span=b-a;
 // A full ring is two closed circles, the inner one drawn the other way to cut the
 // hole; a radial join between them would show as a hairline seam.
 if(span>=359.995) return `M ${pct(a,r2)} A ${r2} ${r2} 0 1 1 ${pct(a+180,r2)} A ${r2} ${r2} 0 1 1 ${pct(a,r2)} Z M ${pct(a,r1)} A ${r1} ${r1} 0 1 0 ${pct(a+180,r1)} A ${r1} ${r1} 0 1 0 ${pct(a,r1)} Z`;
 return `M ${pct(a,r2)} A ${r2} ${r2} 0 ${span>180?1:0} 1 ${pct(b,r2)} L ${pct(b,r1)} A ${r1} ${r1} 0 ${span>180?1:0} 0 ${pct(a,r1)} Z`;
}
function arc(a,b,r){
 const span=b-a;
 if(span>=359.995)return `M ${pct(a,r)} A ${r} ${r} 0 1 1 ${pct(a+180,r)} A ${r} ${r} 0 1 1 ${pct(a+360,r)}`;
 return `M ${pct(a,r)} A ${r} ${r} 0 ${span>180?1:0} 1 ${pct(b,r)}`;
}
const valid=(r)=>r&&typeof r.n==='string'&&CATEGORIES.some(c=>c.n===r.main)&&CATEGORIES.some(c=>c.n===r.main&&c.subs.includes(r.sub));
const norm=s=>(s||'').toLocaleLowerCase('tr-TR');const initials=n=>n.split(/[\s()/&–-]+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toLocaleUpperCase('tr-TR');
function groupRecords(main,sub){return visibleRecords().filter(d=>d.main===main&&d.sub===sub)}
// Slices follow the visible sources: a sub-area weighs by its source count (dampened,
// so a large group does not crowd out the rest) and a category by the sum of its
// sub-areas, so filters resize categories and sub-areas alike. The first category
// stays centred at the top; a lone category fills the circle.
const subWeight=(main,count)=>main==='Kişi'?Math.max(1.1,count**.64):Math.max(1,count**.67);
function categoryAngles(){
 const cats=CATEGORIES.map(c=>({...c,w:c.subs.reduce((sum,sub)=>{const n=groupRecords(c.n,sub).length;return n?sum+subWeight(c.n,n):sum},0)})).filter(c=>c.w>0);
 if(cats.length===1){const c=cats[0],m=(c.a+c.b)/2;return [{...c,a:m-180,b:m+180}];}
 const total=cats.reduce((sum,c)=>sum+c.w,0);let a=-180*cats[0].w/total;
 return cats.map(c=>{const span=360*c.w/total;const g={...c,a,b:a+span};a+=span;return g});
}
function widths(cat){
 const current=categoryAngles().find(c=>c.n===cat.n);if(!current)return [];
 const active=cat.subs.map(sub=>({sub,count:groupRecords(cat.n,sub).length})).filter(d=>d.count>0);
 if(!active.length)return [];
 const weights=active.map(d=>subWeight(cat.n,d.count));
 const sum=weights.reduce((a,b)=>a+b,0);let a=current.a;
 return active.map((d,i)=>{const w=(current.b-current.a)*weights[i]/sum;const out={main:cat.n,sub:d.sub,a,b:a+w,c:cat.c,f:cat.f,count:d.count};a+=w;return out});
}
// Alt yaylar arasındaki boşluk, açısal dilim genişliğine uyarlanır.
function arcInset(g){return Math.min(2,Math.max(.7,(g.b-g.a)*.17))}
function wedgeInset(g){return Math.min(.255,(g.b-g.a)*.045)}
function sourcePositions(g,recs){
 // Every source stays strictly inside its FOLLOW BAND. No radius depends on group size outside that band.
 // The original EduMind follow-up rhythm is stored in rhythm ('g', 'h', 'a'); imported data may use r.
 const width=g.b-g.a, edge=arcInset(g)+.85;
 const start=g.a+edge,end=g.b-edge;
 const angleSpace=Math.max(.4,end-start);
 const out=[];
 for(const band of FOLLOW_BANDS){
  const records=recs.filter(d=>(d.rhythm||(/^[gha]$/.test(d.r)?d.r:null)||sourceRhythm(d.n))===band.key);
  if(!records.length)continue;
  // 15px margin keeps dot/expanded badge visibly inside its follow-up zone.
  const inner=band.inside+17,outer=band.outside-17;
  const meanRadius=(inner+outer)/2;
  const maxCols=Math.max(1,Math.floor((angleSpace*Math.PI/180*meanRadius)/26));
  const columns=Math.min(maxCols,records.length);
  const rows=Math.ceil(records.length/columns);
  records.forEach((d,i)=>{
   const row=Math.floor(i/columns),first=row*columns,nThisRow=Math.min(columns,records.length-first);
   const col=i-first;
   const a=start+angleSpace*(col+.5)/nThisRow;
   const r=inner+(outer-inner)*(row+.5)/rows;
   out.push({...d,rhythm:band.key,a,r});
  });
 }
 return out;
}
function showTooltip(){} function hideTooltip(){}

const labelCtx=document.createElement('canvas').getContext('2d');
const labelFont=size=>`400 ${size}px ${getComputedStyle(svg).fontFamily}`;
const trackRadius=k=>ARC+3.5+(LABEL_INSET+LABEL_LEADER+(k+.5)*LABEL_PITCH)*labelSize;
const unitPx=()=>labelSize/labelPx(); // one screen pixel in SVG units
const textWidth=s=>{labelCtx.font=labelFont(labelSize);return labelCtx.measureText(s).width};
const halfAngle=(w,k)=>(w+LABEL_SPACE*labelSize)/2/trackRadius(k)*180/Math.PI;
const angleGap=(a,b)=>Math.abs(((a-b)%360+540)%360-180);
function clipToWidth(s,max){if(textWidth(s)<=max)return s;while(s.length>1&&textWidth(s+'…')>max)s=s.slice(0,-1);return s.trimEnd()+'…'}
function planCaptions(groups){
 // A caption takes an angle on its track; one on an outer track also keeps a narrow
 // corridor free on the tracks inside it, so its leader never crosses another caption.
 // The leader always leaves the middle of the arc (m); the caption may slide a little
 // along its track (c) as long as the leader's dot stays under its text.
 const tracks=Array.from({length:labelTracks},()=>[]),plan=new Map(),ids=[...tracks.keys()];
 const corridor=j=>2.6*unitPx()/trackRadius(j)*180/Math.PI; // the dot plus a pixel each side
 const SLIDES=[0,-.35,.35,-.6,.6];
 const blocked=(c,h,k,self)=>tracks[k].some(q=>q!==self&&!(self&&q.owner===self)&&angleGap(c,q.c)<h+q.h);
 const leaderFree=(m,k,self)=>{for(let j=0;j<k;j++)if(tracks[j].some(q=>!q.owner&&q!==self&&angleGap(m,q.c)<corridor(j)+q.h))return false;return true};
 // corridors already on track k must stay clear of a caption placed there
 const fits=(m,c,h,k,self)=>!blocked(c,h,k,self)&&leaderFree(m,k,self);
 const room=(c,k)=>Math.min(180,...tracks[k].map(q=>angleGap(c,q.c)-q.h));
 const place=(q,k)=>{q.track=k;tracks[k].push(q);for(let j=0;j<k;j++)tracks[j].push({c:q.m,h:corridor(j),owner:q})};
 const lift=q=>{for(const t of tracks)for(let i=t.length-1;i>=0;i--)if(t[i]===q||t[i].owner===q)t.splice(i,1)};
 const tryPlace=(m,w,self)=>{for(const k of ids){const h=halfAngle(w,k);for(const f of SLIDES){const c=m+f*h;if(fits(m,c,h,k,self))return {k,c,h}}}return null};
 // Short names first: search track and slide choices in angular order for a layout
 // where every short name fits; the constraints are local, so this is quick.
 const items=[...groups].sort((a,b)=>(a.a+a.b)-(b.a+b.b)).map(g=>{const name=SHORT_SUBS[g.sub]||g.sub;return {g,m:(g.a+g.b)/2,name,w:textWidth(name)}});
 // Start just after the widest gap between neighbouring captions, so the first and
 // last captions meet where there is most room and the search rarely backtracks.
 if(items.length>2){let best=0,gap=-1;items.forEach((it,i)=>{const prev=items[(i+items.length-1)%items.length],g=((it.m-prev.m)%360+360)%360||360;if(g>gap){gap=g;best=i}});items.push(...items.splice(0,best))}
 let steps=0;
 const search=i=>{
  if(i===items.length)return true;
  if(++steps>40000)return false;
  const it=items[i];
  for(const k of ids){const h=halfAngle(it.w,k);for(const f of SLIDES){const c=it.m+f*h;if(!fits(it.m,c,h,k))continue;const q={m:it.m,c,h};place(q,k);it.q=q;if(search(i+1))return true;lift(q)}}
  return false;
 };
 if(search(0))items.forEach(it=>plan.set(keyOf(it.g),{text:it.name,q:it.q}));
 else{
  // No full layout: place greedily and shorten what does not fit with "…".
  tracks.forEach(t=>t.length=0);
  for(const it of items){
   let spot=tryPlace(it.m,it.w),text=it.name;
   if(!spot){
    const k=ids.filter(j=>leaderFree(it.m,j)).reduce((best,j)=>room(it.m,j)>room(it.m,best)?j:best,0);
    text=clipToWidth(it.name,Math.max(0,2*room(it.m,k)*Math.PI/180*trackRadius(k)-LABEL_SPACE*labelSize));
    spot={k,c:it.m,h:halfAngle(textWidth(text),k)};
   }
   const q={m:it.m,c:spot.c,h:spot.h};place(q,spot.k);plan.set(keyOf(it.g),{text,q});
  }
 }
 // Then full names where they fit, widest sectors first.
 for(const g of [...groups].sort((a,b)=>(b.b-b.a)-(a.b-a.a))){
  const p=plan.get(keyOf(g));if(p.text===g.sub)continue;
  const spot=tryPlace(p.q.m,textWidth(g.sub),p.q);if(!spot)continue;
  lift(p.q);p.q.c=spot.c;p.q.h=spot.h;place(p.q,spot.k);p.text=g.sub;
 }
 return new Map([...plan].map(([key,p])=>[key,{text:p.text,track:p.q.track,slide:p.q.c-p.q.m}]));
}
// The leader starts just outside the arc and its dot sits just inside the caption.
// Line weight and dashes come from CSS (.leader), matching the source connectors.
const LEADER_DOT=2.7;
function leaderGeometry(m,track){
 labelCtx.font=labelFont(labelSize);
 const cap=(labelCtx.measureText('H').actualBoundingBoxAscent||labelSize*.72)/2;
 const u=unitPx(),dot=trackRadius(track)-cap-.25*labelSize-LEADER_DOT;
 return {from:xy(m,ARC+3.5+u),to:xy(m,dot-LEADER_DOT-u),dot:xy(m,dot)};
}
// Captions on the lower half run counter-clockwise so they read upright; the cap
// height is centred on the track either way.
function captionCurve(leader,caption){
 const m=leader+(caption.slide||0),r=trackRadius(caption.track);labelCtx.font=labelFont(labelSize);
 const offset=(labelCtx.measureText('H').actualBoundingBoxAscent||labelSize*.72)/2;
 const h=halfAngle(labelCtx.measureText(caption.text).width,caption.track)+4,mid=((m%360)+360)%360;
 if(mid>100&&mid<260){const rr=r+offset;return `M ${pct(m+h,rr)} A ${rr} ${rr} 0 ${h>90?1:0} 0 ${pct(m-h,rr)}`}
 return arc(m-h,m+h,r-offset);
}
const LOCKED_VIEWBOX='85 90 1270 1090';
// The square crop holds the radar and both caption tracks. It is solved from the
// box size alone, so filters, data and names never resize the radar.
let fittedKey='';
function fitRadar(){
 const box=svg.getBoundingClientRect(),px=labelPx(),key=Math.round(box.width)+'x'+Math.round(box.height)+'|'+px;
 if(key===fittedKey||!box.width||!box.height)return;
 const side=Math.min(box.width,box.height);labelTracks=side<300?3:2;
 const reach=LABEL_INSET+LABEL_LEADER+labelTracks*LABEL_PITCH;
 labelSize=2*px*(ARC+3.5+FIT_MARGIN)/Math.max(1,side-2*px*reach);
 const half=ARC+3.5+reach*labelSize+FIT_MARGIN;
 svg.setAttribute('viewBox',`${X-half} ${Y-half} ${half*2} ${half*2}`);
 svg.style.setProperty('--radar-label-size',labelSize.toFixed(2)+'px');
 fittedKey=key;
}
new ResizeObserver(()=>{if(!scene)return;const before=fittedKey;fitRadar();if(fittedKey!==before)refresh(true)}).observe(svg);
const ANIMATION_MS=1420;
const LINE_DELAY=.26; // Animasyonun ilk %26'sında kaynak çizgileri başlamaz.
const LINE_END=.96;  // Çizim dış çembere animasyonun sonuna yakın tamamlanır.
const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
// Respect OS reduced-motion unless the visitor turns the effect on manually.
let scanEnabled=!prefersReducedMotion.matches,scanPeriod=8500,scanAngle=0,scanFrame=0,scanLastTime=0;
// Tarama ucunu, en dış takip çemberi ile ana kategori bandının iç sınırı
// arasındaki beyaz ayırıcı boşluğun RADYAL TAM ORTASINDA bitir.
const SCAN_TRAIL=42,SCAN_RADIUS=(SOURCE_RING+MAIN_BAND_INNER)/2;
const mix=(a,b,t)=>a+(b-a)*t;
const ease=t=>1-Math.pow(1-t,3);
let scene=null,displayState=null,animationId=0,animationCount=0,lastCompletedState=null;
const keyOf=g=>g.main+'|'+g.sub;
function setAttrs(n, attrs){for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));}
function newScene(){
 svg.replaceChildren();
 svg.setAttribute('viewBox',LOCKED_VIEWBOX);fittedKey='';
 svg.classList.toggle('fit',fit);svg.classList.toggle('extra-labels',extraLabels);
 const defs=el('defs'),shadow=el('filter',{id:'sofShadow',x:'-80%',y:'-80%',width:'260%',height:'260%'},defs);
 el('feDropShadow',{dx:0,dy:3,stdDeviation:5,'flood-color':'#172e52','flood-opacity':'.12'},shadow);
 // The gradient is anchored at the one fixed radar center, so all slices share the SAME radial grey bands.
 // Three wider neutral zones: Günlük (112–208), Haftalık (208–296), Dönemsel (296–380).
 // Dots use the original EduMind daily/weekly/periodic follow-up metadata.
 const neutralRamp=el('radialGradient',{id:'academicNeutralRamp',gradientUnits:'userSpaceOnUse',cx:X,cy:Y,r:ARC-6,fx:X,fy:Y},defs);
 [
  ['0%','#d9dfe5'],['49.95%','#d9dfe5'],
  ['50.05%','#e8edf1'],['71.10%','#e8edf1'],
  ['71.20%','#f1f3f6'],['91.25%','#f1f3f6'],
  ['91.40%','#fafbfc'],['100%','#fdfdfe']
 ].forEach(([offset,color])=>el('stop',{offset,'stop-color':color},neutralRamp));
 const layers={wedges:el('g'),rings:el('g'),bands:el('g'),arcs:el('g'),connectors:el('g'),leaders:el('g',{'pointer-events':'none'}),captions:el('g'),sweep:el('g',{'pointer-events':'none'}),nodes:el('g'),scanInfo:el('g',{'pointer-events':'none'}),mainLabels:el('g'),hub:el('g',{class:'radar-hub'})};
 // A translucent cyan wedge follows the rotating ray. The sector slices form a fading tail.
 const glow=el('filter',{id:'scanGlow',x:'-100%',y:'-100%',width:'300%',height:'300%'},defs);
 el('feGaussianBlur',{stdDeviation:3.6},glow);
 const rayGrad=el('linearGradient',{id:'scanRayGrad',gradientUnits:'userSpaceOnUse',x1:X,y1:Y,x2:X,y2:Y-SCAN_RADIUS},defs);
 el('stop',{offset:'0%','stop-color':'#1c9bd6','stop-opacity':'.08'},rayGrad);
 el('stop',{offset:'64%','stop-color':'#35d6ff','stop-opacity':'.58'},rayGrad);
 el('stop',{offset:'100%','stop-color':'#48d7ff','stop-opacity':'.9'},rayGrad);
 const scanRotator=el('g',{class:'scan-fan','aria-hidden':'true'},layers.sweep);
 const sliceCount=20;
 for(let i=0;i<sliceCount;i++){
  const a=-SCAN_TRAIL+(SCAN_TRAIL*i/sliceCount),b=-SCAN_TRAIL+(SCAN_TRAIL*(i+1)/sliceCount);
  const opacity=.012+.22*Math.pow((i+.5)/sliceCount,1.8);
  el('path',{d:wedge(a,b,0,SCAN_RADIUS),fill:'#20b9fa',opacity},scanRotator);
 }
 const glowTip=xy(0,SCAN_RADIUS);
 el('line',{class:'scan-lead',x1:X,y1:Y,x2:glowTip.x,y2:glowTip.y,stroke:'#22bdf7','stroke-width':9,opacity:.57,filter:'url(#scanGlow)'},scanRotator);
 el('line',{class:'scan-lead',x1:X,y1:Y,x2:glowTip.x,y2:glowTip.y,stroke:'url(#scanRayGrad)','stroke-width':2.5,opacity:.86},scanRotator);
 el('circle',{cx:glowTip.x,cy:glowTip.y,r:5.1,fill:'#5ce6ff',opacity:.65,filter:'url(#scanGlow)'},scanRotator);
 el('circle',{cx:glowTip.x,cy:glowTip.y,r:2.2,fill:'#9af3ff',opacity:.83},scanRotator);
 const scanInfo=el('g',{class:'scan-info','aria-hidden':'true',opacity:0},layers.scanInfo);
 const scanInfoBox=el('rect',{x:17,y:-38,width:108,height:25,rx:12.5,fill:'#fff','fill-opacity':'.97',stroke:'#9adcf2','stroke-width':1.2,filter:'url(#sofShadow)'},scanInfo);
 const scanInfoText=el('text',{x:27,y:-21},scanInfo,'');
 // Exactly three extended follow-up rings ending near the outer category band.
 const FOLLOW_RINGS=[...FOLLOW_RING_RADII];
 // Her takip kesik çemberi: aynı yarıçapta merkezlenen 5px beyaz çizginin
 // üstünde 1px gri kesikli hat => beyaz kenar her iki yanda tam 2px.
 for(const r of FOLLOW_RINGS){
  el('circle',{cx:X,cy:Y,r,class:'follow-ring-white'},layers.rings);
  el('circle',{cx:X,cy:Y,r,class:'follow-ring-gray'},layers.rings);
 }
 // En dış kılavuz kesik çemberi (ARC + 7) ve beyaz altlığı bu sürümde çizilmez.
 el('circle',{cx:X,cy:Y,r:INNER-2,fill:'#fff',stroke:'#dce4ef','stroke-width':1.6,filter:'url(#sofShadow)'},layers.hub);
 let title=el('text',{x:X,y:Y-9,'text-anchor':'middle',fill:'#1f3154','font-weight':800,'font-size':21,'letter-spacing':'-.7'},layers.hub,'AcademiCore');
 const second=el('text',{x:X,y:Y+24,'text-anchor':'middle',fill:'#1f3154','font-weight':790,'font-size':24},layers.hub);
 el('tspan',{fill:'#bd1d55'},second,'AI');el('tspan',{},second,' Radar');
 el('path',{d:`M ${X-18} ${Y+42} h 36`,stroke:'#b71a55','stroke-width':2},layers.hub);
 // Labels stay in the exact same typographic class and size as the old ones.
 // Each one is centered on the upward vertical radius, in the middle of its band.
 const rhythmLabels=[
 ];
 // v1.11: Günlük / Haftalık / Dönemsel captions removed; ring semantics remain in data.
 const noresults=el('text',{x:X,y:Y+252,'text-anchor':'middle','dominant-baseline':'middle',class:'noresults',fill:'#8796a9','font-size':14,'font-weight':400},layers.hub);
 noresults.textContent='Seçili filtrelerde kaynak bulunamadı';noresults.style.display='none';
 scene={layers,groups:new Map(),sources:new Map(),mains:new Map(),noresults,scanRotator,scanInfo,scanInfoBox,scanInfoText};
 scanRotator.style.display=scanEnabled?'':'none';
}
function makeTarget(){
 const cats=categoryAngles();
 const groups=CATEGORIES.flatMap(c=>widths(c)).filter(g=>scope!=='Kişi'||g.main==='Kişi');
 const captions=planCaptions(groups),groupMap=new Map(),nodeMap=new Map(),mainMap=new Map();
 for(const g of groups){
  groupMap.set(keyOf(g),{...g,caption:captions.get(keyOf(g)),opacity:1});
  sourcePositions(g,groupRecords(g.main,g.sub)).forEach(d=>nodeMap.set(d.n,{...d,sub:g.sub,main:g.main,opacity:1}));
 }
 for(const c of cats){if(scope==='Kişi'&&c.n!=='Kişi')continue;if(groups.some(g=>g.main===c.n))mainMap.set(c.n,{...c,opacity:1})}
 return {groups:groupMap,nodes:nodeMap,mains:mainMap};
}
function fadeGroup(g){const m=(g.a+g.b)/2;return {...g,a:m,b:m,opacity:0};}
function fadeNode(n,atGroup){return {...n,a:atGroup?(atGroup.a+atGroup.b)/2:n.a,r:n.r,opacity:0};}
function tweenMap(from,to,t,type,targetGroups){
 const out=new Map(),keys=new Set([...from.keys(),...to.keys()]);
 for(const key of keys){
  let a=from.get(key),b=to.get(key);
  if(type==='group'){if(!a)a=fadeGroup(b);if(!b)b=fadeGroup(a)}
  else if(type==='node'){
   if(!a)a=fadeNode(b,displayState?.groups.get(keyOf(b))||null);
   if(!b)b=fadeNode(a,targetGroups?.get(keyOf(a))||null);
  }else {if(!a)a={...b,opacity:0};if(!b)b={...a,opacity:0}}
  const v={...b,opacity:mix(a.opacity,b.opacity,t)};
  if(type==='group'){v.a=mix(a.a,b.a,t);v.b=mix(a.b,b.b,t);v.caption=t<.5?a.caption:b.caption}
  else if(type==='node'){v.a=mix(a.a,b.a,t);v.r=mix(a.r,b.r,t)}
  else {v.a=mix(a.a,b.a,t);v.b=mix(a.b,b.b,t)}
  out.set(key,v);
 }
 return out;
}
function blendStates(from,to,t){
 return {groups:tweenMap(from.groups,to.groups,t,'group'),nodes:tweenMap(from.nodes,to.nodes,t,'node',to.groups),mains:tweenMap(from.mains,to.mains,t,'main')};
}
let captionSeq=0;
function ensureGroupDom(g){
 const k=keyOf(g);let o=scene.groups.get(k);if(o)return o;
 let wedgePath=el('path',{class:'subwedge',fill:g.f},scene.layers.wedges);
 let arcTrack=el('path',{class:'subarc-track',fill:'none',stroke:'#cbd5e1','stroke-linecap':'round','stroke-width':9.1,opacity:0,'pointer-events':'none'},scene.layers.arcs);
 let arcPath=el('path',{class:'subarc',stroke:g.c},scene.layers.arcs);
 const leader=el('line',{class:'leader'},scene.layers.leaders),dot=el('circle',{class:'leader-dot'},scene.layers.leaders);
 const curve=el('path',{id:'subCurve_'+(++captionSeq),fill:'none',stroke:'none'},scene.layers.captions);
 const text=el('text',{class:'subcaption','text-anchor':'middle'},scene.layers.captions);
 const textPath=el('textPath',{href:'#'+curve.id,startOffset:'50%'},text);
 const title=()=>selectGroup(g);
 for(const e of [wedgePath,arcPath,text]){e.addEventListener('click',title);e.addEventListener('mousemove',ev=>showTooltip(ev,`${g.sub} · ${groupRecords(g.main,g.sub).length} kaynak`));e.addEventListener('mouseleave',hideTooltip)}
 o={wedge:wedgePath,arcTrack,arc:arcPath,leader,dot,curve,text,textPath,sub:g.sub};scene.groups.set(k,o);return o;
}
function ensureSourceDom(d){
 let o=scene.sources.get(d.n);if(o){decorateSource(o,d);return o;}
 const line=el('line',{class:'connector'},scene.layers.connectors);
 const group=el('g',{class:'node',role:'button',tabindex:'0','aria-label':d.n},scene.layers.nodes);
 // Her kaynak ışık yokken yalnızca ait olduğu ana kategorinin renginde küçük bir noktadır.
 // Dönüşen rozet aynı SVG grubu içinde kaldığı için koordinatlar, filtreler ve çizgiler değişmez.
 group.dataset.id=d.id;
 el('circle',{class:'hit',cx:0,cy:0,r:14,fill:'transparent','pointer-events':'all'},group);
 group.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')showTip(group)});
 group.addEventListener('pointerleave',()=>hideTip());
 group.addEventListener('focus',()=>showTip(group));group.addEventListener('blur',()=>hideTip());
 const category=CATEGORIES.find(c=>c.n===d.main);
 group.style.setProperty('--source-category',category?.c||'#8392a6');
 const dot=el('circle',{class:'source-dot',cx:0,cy:0,r:4.8,fill:category?.c||'#8392a6',stroke:'#fff','stroke-width':.75,opacity:1},group);
 const spotlight=el('g',{class:'scan-badge',opacity:0,transform:'scale(.62)'},group);
 const circle=el('circle',{cx:0,cy:0,r:13.5,fill:category?.c||'#8392a6',stroke:'#d1daeb','stroke-width':1.25,filter:'url(#sofShadow)',class:'disc'},spotlight);
 const fallbackLabel=el('text',{x:0,y:3.5,'text-anchor':'middle',class:'nodeText'},spotlight,initials(d.n));
 // Veri kaydında görsel URL'si varsa tarama sırasında gerçek görsel belirir;
 // yoksa veya yüklenemezse mevcut iki harfli rozet korunur.
 const imageUrl=d.image||d.imageUrl||d.logo||d.avatar||d.img;
 if(typeof imageUrl==='string'&&/^(https?:\/\/|data:image\/)/i.test(imageUrl)){
  const defs=svg.querySelector('defs'),clipId='sourceClip'+scene.sources.size;
  const clip=el('clipPath',{id:clipId},defs);
  el('circle',{cx:0,cy:0,r:11.65},clip);
  const im=el('image',{href:imageUrl,x:-11.65,y:-11.65,width:23.3,height:23.3,
   preserveAspectRatio:'xMidYMid slice','clip-path':`url(#${clipId})`},spotlight);
  im.addEventListener('load',()=>fallbackLabel.setAttribute('opacity','0'));
  im.addEventListener('error',()=>im.remove());
 }
 const statusHalo=el('circle',{class:'status-new-halo',cx:0,cy:0,r:10,fill:'#f5ac2f','fill-opacity':.23,stroke:'#c98512','stroke-width':1.8,'pointer-events':'none'},group);
 el('circle',{class:'status-new-peak-ring',cx:0,cy:0,r:9,fill:'none',stroke:'#000','stroke-width':1,'pointer-events':'none'},group);
 const savedMarker=el('g',{class:'status-saved-marker','pointer-events':'none'},group);
 el('circle',{cx:0,cy:0,r:11,fill:'#b21632',stroke:'#fff','stroke-width':1.8},savedMarker);
 el('path',{d:'M -4 -6 H 4 V 6 L 0 3 L -4 6 Z',fill:'#fff',stroke:'#fff','stroke-width':.6,'stroke-linejoin':'round'},savedMarker);
 // İsim balonu gösterilmez. Kullanıcı isterse kaynağa dokunup yan panelden ayrıntıya ulaşır.
 group.addEventListener('click',()=>{selectSource(d,group)});
 group.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectSource(d,group)}});
 o={line,group,circle,dot,spotlight,scanScale:.62,scanReveal:0};scene.sources.set(d.n,o);decorateSource(o,d);return o;
}
// Dış başlık bandı: iç yarıçap 382.5 (üçüncü 5px beyaz halkaya bitişik), dış yarıçap 416.5.
// Yazının üst tarafı tüm açılarda dış çembere bakar. Alt yarıdaki metin bu yüzden
// bilerek ters yönde okunur; bu, kullanıcının talep ettiği *radyal dışa bakan* tipografidir.
function mainCaptionCurve(c){
 const center=(c.a+c.b)/2;
 const half=Math.min(27,Math.max(14,(c.b-c.a)*.34));
 const a=center-half,b=center+half;
 // SVG textPath için optik dengeleme: gliflerin merkezinin bandın iki sınırına
 // eşit mesafede kalmasını sağlar; metin tam dilim orta açısına oturur.
 // textPath uses an alphabetic baseline. Center the visible glyph ink,
 // rather than the font's line box, between the band's two radii.
 const size=MAIN_SIZE;
 labelCtx.font=`${MAIN_WEIGHT} ${size}px ${getComputedStyle(svg).fontFamily}`;
 const metrics=labelCtx.measureText(c.n);
 const offset=((metrics.actualBoundingBoxAscent??size*.75)-(metrics.actualBoundingBoxDescent??size*.2))/2;
 // Captions on the lower half run counter-clockwise so they read upright.
 const mid=((center%360)+360)%360;
 if(mid>100&&mid<260){const r=MAIN_TITLE_RING+offset;return `M ${pct(b,r)} A ${r} ${r} 0 ${b-a>180?1:0} 0 ${pct(a,r)}`}
 return arc(a,b,MAIN_TITLE_RING-offset);
}
function ensureMainDom(c){let o=scene.mains.get(c.n);if(o)return o;
 const id='mainCurve_'+CATEGORIES.findIndex(cat=>cat.n===c.n);
 const band=el('path',{class:'mainband',fill:c.f,opacity:.88,'stroke':'#fff','stroke-width':.7},scene.layers.bands);
 const path=el('path',{id,d:mainCaptionCurve(c),fill:'none',stroke:'none'},scene.layers.mainLabels);
 const text=el('text',{'text-anchor':'middle',class:'maincaption',fill:c.c,'dominant-baseline':'alphabetic','alignment-baseline':'alphabetic'},scene.layers.mainLabels);
 const textPath=el('textPath',{href:'#'+id,startOffset:'50%'},text,c.n);
 scene.mains.set(c.n,o={band,path,text,textPath});return o;
}
function paint(state,lineWave=1){
 if(!scene)newScene();
 svg.classList.toggle('fit',fit);svg.classList.toggle('extra-labels',extraLabels);
 for(const [k,g] of state.groups){
  const o=ensureGroupDom(g),span=g.b-g.a,m=(g.a+g.b)/2;
  const selectionOpacity=selection?.sub&&keyOf(selection)!==k?.42:1;
  const opacity=g.opacity*selectionOpacity;
  const safeSpan=Math.max(0,span);
  if(safeSpan>.1){
   const isFullGroup=state.groups.size===1&&span>=359.995;
   const gap=isFullGroup?0:Math.min(wedgeInset(g),safeSpan*.24);
   setAttrs(o.wedge,{d:wedge(g.a+gap,g.b-gap,INNER,ARC-6),fill:greyBackground?'url(#academicNeutralRamp)':g.f,opacity});
   const inset=isFullGroup?0:Math.min(arcInset(g),safeSpan*.25);
   const shape=arc(g.a+inset,g.b-inset,ARC);
   setAttrs(o.arcTrack,{d:shape,opacity:bandColorExperiment?opacity*.78:0});
   setAttrs(o.arc,{d:shape,stroke:bandColorExperiment?'#ffffff':g.c,opacity, 'stroke-width':bandColorExperiment?6.6:7});
  }else{setAttrs(o.wedge,{opacity:0});setAttrs(o.arcTrack,{opacity:0});setAttrs(o.arc,{opacity:0})}
  if(g.caption){
   setAttrs(o.curve,{d:captionCurve(m,g.caption)});if(o.textPath.textContent!==g.caption.text)o.textPath.textContent=g.caption.text;
   const l=leaderGeometry(m,g.caption.track);
   setAttrs(o.leader,{x1:l.from.x,y1:l.from.y,x2:l.to.x,y2:l.to.y,opacity});
   setAttrs(o.dot,{cx:l.dot.x,cy:l.dot.y,r:LEADER_DOT,opacity});
  }
  setAttrs(o.text,{opacity});
  o.wedge.style.pointerEvents=opacity>.18?'auto':'none';o.arc.style.pointerEvents=opacity>.18?'auto':'none';o.text.style.pointerEvents=opacity>.18?'auto':'none';
 }
 // Her geometrik yarım ışında yalnızca MERKEZE EN YAKIN kaynaktan tek çizgi.
 // Geçişte sanal bir dalga cephesi (frontR) içten dışa yürür: en yakın çizgiler önce
 // başlar; cephe sonraki kaynağın yarıçapına ulaştığı anda onun doğrultusu da çizilir.
 // Aynı hizadaki ikinci/üçüncü kaynak için yeni çizgi üretilmez.
 const rays=[];
 const nodes=[...state.nodes.values()].filter(d=>d.opacity>.015).sort((a,b)=>a.r-b.r);
 for(const d of nodes){
  const o=ensureSourceDom(d),p=xy(d.a,d.r),opacity=d.opacity*(selection?.n&&selection.n!==d.n?.48:1);
  setAttrs(o.group,{transform:`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`,opacity});
  o.dot.setAttribute('fill',CATEGORIES.find(c=>c.n===d.main)?.c||'#8392a6');
  o.group.classList.toggle('active',selection?.n===d.n);o.group.style.pointerEvents=opacity>.18?'auto':'none';
  // Gecikmeli başlatılacak her çizginin doğru geometrik grubunu bul.
  const already=rays.find(q=>q.main===d.main&&q.sub===d.sub&&Math.abs(q.a-d.a)<.32);
  if(!already)rays.push(d);
 }
 const minR=rays.length?Math.min(...rays.map(d=>d.r)):SOURCE_RING;
 const frontR=minR+(SOURCE_RING-minR)*Math.max(0,Math.min(1,lineWave));
 const primary=new Set(rays.map(d=>d.n));
 for(const [n,d] of state.nodes){
  const o=ensureSourceDom(d);
  if(!primary.has(n)||!drawLines){o.line.setAttribute('opacity','0');continue}
  const p=xy(d.a,d.r),tipR=Math.max(d.r,Math.min(SOURCE_RING,frontR));
  const end=xy(d.a,tipR),opacity=d.opacity*(selection?.n&&selection.n!==d.n?.48:1);
  setAttrs(o.line,{x1:p.x,y1:p.y,x2:end.x,y2:end.y,opacity:tipR>d.r+.2?opacity*.59:0});
 }
 for(const [k,c] of state.mains){
  const o=ensureMainDom(c);
  // A lone category's band is a full ring; without its white edge it has no seam.
  const singleMain=state.mains.size===1&&(c.b-c.a)>=359.995;
  setAttrs(o.band,{d:wedge(c.a+(singleMain?0:.13),c.b-(singleMain?0:.13),MAIN_BAND_INNER,MAIN_BAND_OUTER),fill:bandColorExperiment?c.c:(greyBackground?'#f4f5f7':c.f),'stroke-width':singleMain?0:.7,opacity:c.opacity*.95});
  setAttrs(o.path,{d:mainCaptionCurve(c)});setAttrs(o.text,{fill:bandColorExperiment?'#ffffff':c.c,opacity:c.opacity});
 }
 scene.noresults.style.display=state.nodes.size===0?'':'none';
 svg.classList.toggle('no-matches',state.nodes.size===0);
 // Kalıcı merkezi belirleyen viewBox'a kesinlikle dokunulmaz.
 displayState=state;
}
function cleanScene(target){
 for(const [k,o] of scene.groups)if(!target.groups.has(k)){for(const e of [o.wedge,o.arcTrack,o.arc,o.leader,o.dot,o.curve,o.text])e.remove();scene.groups.delete(k)}
 for(const [k,o] of scene.sources)if(!target.nodes.has(k)){o.line.remove();o.group.remove();scene.sources.delete(k)}
 for(const [k,o] of scene.mains)if(!target.mains.has(k)){o.band.remove();o.path.remove();o.text.remove();scene.mains.delete(k)}
}
function render(animate=true){
 if(!scene)newScene();
 // The caption size must be settled before captions are planned.
 fitRadar();
 const target=makeTarget();
 if(animationId){cancelAnimationFrame(animationId);animationId=0}
 const from=displayState;const allowAnimation=animate&&options.animation&&from&&!prefersReducedMotion.matches;
 if(!allowAnimation){paint(target);cleanScene(target)}
 else{
  const started=performance.now();animationCount++;
  const tick=(time)=>{
   const p=Math.max(0,Math.min(1,(time-started)/ANIMATION_MS));
   const lineProgress=Math.max(0,Math.min(1,(p-LINE_DELAY)/(LINE_END-LINE_DELAY)));
   paint(p>=1?target:blendStates(from,target,ease(Math.min(1,p/.77))),lineProgress);
   if(p<1){animationId=requestAnimationFrame(tick)}
   else{animationId=0;cleanScene(target);lastCompletedState=target}
  };
  animationId=requestAnimationFrame(tick);
 }
 drawScanFrame();
}
function clearScanBadges(){
 if(!scene)return;
 for(const o of scene.sources.values()){
  o.scanScale=.62;o.scanReveal=0;
  o.spotlight.setAttribute('transform','scale(.62)');
  o.spotlight.setAttribute('opacity',0);
  o.dot.setAttribute('opacity',1);
  o.group.classList.remove('scanned');
 }
 // Eski tarama balonu katmanı korunur ancak hiçbir koşulda görünmez.
 scene.scanInfo.setAttribute('opacity',0);
}
function drawScanFrame(){
 if(!scene)return;
 scene.scanRotator.style.display=scanEnabled?'':'none';
 if(!scanEnabled||!displayState){clearScanBadges();return}
 scene.scanRotator.setAttribute('transform',`rotate(${scanAngle.toFixed(2)} ${X} ${Y})`);
 // Ana tarama ışığı geçerken renkli nokta, kaynak rozetine ve çevresindeki çembere dönüşür.
 // İz sönümlendikçe aynı konumda yeniden küçük noktaya döner; metin balonu üretilmez.
 for(const d of displayState.nodes.values()){
  const o=scene.sources.get(d.n);if(!o||d.opacity<.28)continue;
  const rawDelta=((scanAngle-d.a)%360+360)%360;
  const delta=rawDelta>359.999?0:rawDelta; // Yuvarlama nedeniyle 360° sıfır kabul edilir.
  const intensity=delta<=SCAN_TRAIL?Math.pow(Math.max(0,1-delta/SCAN_TRAIL),.8):0;
  const reveal=Math.min(1,Math.max(0,intensity*2.8));
  const scale=.62+.75*reveal; // Etki anında mevcut rozete göre yaklaşık %37 büyür.
  if(Math.abs(scale-o.scanScale)>.006){o.spotlight.setAttribute('transform',`scale(${scale.toFixed(3)})`);o.scanScale=scale}
  if(Math.abs(reveal-o.scanReveal)>.009){
   o.spotlight.setAttribute('opacity',reveal.toFixed(3));
   o.dot.setAttribute('opacity',(1-reveal).toFixed(3));
   o.scanReveal=reveal;
  }
  o.group.classList.toggle('scanned',reveal>.08);
 }
 scene.scanInfo.setAttribute('opacity',0);
}
function scanTick(t){
 scanFrame=0;
 if(!scanEnabled||document.hidden)return;
 if(scanLastTime){const dt=Math.min(90,Math.max(0,t-scanLastTime));scanAngle=(scanAngle+360*dt/scanPeriod)%360}
 scanLastTime=t;
 drawScanFrame();scanFrame=requestAnimationFrame(scanTick);
}
function changeScanEnabled(enabled){
 scanEnabled=!!enabled;
 if(scanFrame)cancelAnimationFrame(scanFrame);scanFrame=0;scanLastTime=0;
 drawScanFrame();
 if(scanEnabled&&!document.hidden)scanFrame=requestAnimationFrame(scanTick);
}
match=function(d){return hostMatch(d)&&(!options.hideSaved||!inMyList(d))};
const statusKey=document.createElement('div');statusKey.className='academy-status-key';statusKey.setAttribute('aria-label','Radar kaynak işaretleri');statusKey.innerHTML='<span><i class="key-normal"></i>Kaynak</span><span><i class="key-saved"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z" fill="#fff" stroke="#fff"/></svg></i>Listem\'de</span><span><i class="key-new"></i>Yeni</span>';viewport.append(statusKey);
const quickControls=document.createElement('div');quickControls.className='academy-quick-controls';quickControls.setAttribute('role','group');quickControls.setAttribute('aria-label','Radar hızlı kontrolleri');
quickControls.innerHTML='<button type="button" data-quick-scan></button><button type="button" data-quick-saved role="switch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h10v18l-5-3-5 3V3Z"/><path class="saved-visibility-slash" d="m3 3 18 18"/></svg></button>';document.querySelector('.camera-filters').prepend(quickControls);
const quickHome=document.querySelector('.camera-filters'),quickHead=quickHome.querySelector('.camera-filter-head'),quickMobile=matchMedia('(max-width:759px)');
function placeQuickControls(){if(quickMobile.matches){quickHead.prepend(quickControls);document.querySelector('#radarBox').append(statusKey)}else{quickHome.prepend(quickControls);viewport.append(statusKey)}}
quickMobile.addEventListener('change',placeQuickControls);placeQuickControls();
quickControls.querySelector('[data-quick-scan]').onclick=()=>{options.scan=!options.scan;save();applyOptions();syncControls()};
quickControls.querySelector('[data-quick-saved]').onclick=()=>{options.hideSaved=!options.hideSaved;save();sync();syncControls()};
function decorateSource(o,d){
 const listed=inMyList(d),fresh=isNew(d);
 o.group.classList.toggle('listed',listed);o.group.classList.toggle('is-new-source',fresh);
 o.group.setAttribute('aria-label',d.n+(options.statusMarkers?(listed?' · Listem\'de':'')+(fresh?' · Yeni kaynak':''):''));
}
const assigned=new Map();
for(const [main,subs] of Object.entries(GROUPS))for(const [sub,names] of Object.entries(subs))for(const name of names.split('|').filter(Boolean))assigned.set(name,{main,sub});
const fallbacks={org:['Kurum','Eğitim ve Sivil Toplum'],person:['Kişi','Sektör Uzmanları'],academic:['Yayın','Akademik Dergiler'],event:['Etkinlik','Konferanslar'],resource:['Platform','Eğitim Platformları'],platform:['Platform','Temel Modeller']};
function mapRecord(d){
 const base=assigned.get(d.n),[main,sub]=fallbacks[sourceType(d)]||fallbacks.org;
 const classification=base&&!d.type?base:{main,sub};
 return {...d,...classification,rhythm:d.r,url:d.u,priority:d.p,image:avState(d).src};
}
function sourceAvatarColor(d){return CATEGORIES.find(c=>c.n===mapRecord(d).main)?.c||'#8392a6'}
const originalAvatar=avatar;
avatar=function(d,size){
 const color=sourceAvatarColor(d),markup=originalAvatar(d,size),mono=markup.includes('av-mono');
 return markup.replace('class="',`data-source-name="${esc(d.n)}" class="`).replace('style="',`style="--source-category:${color};${mono?`background:${color}!important;color:#fff!important;`:''}`);
};
document.addEventListener('error',event=>{
 const image=event.target;if(!(image instanceof HTMLImageElement)||!image.matches('img.av[data-source-name]'))return;
 const replacement=document.createElement('span');replacement.className=image.className+' av-mono';replacement.style.cssText=image.style.cssText;
 replacement.style.setProperty('background',image.style.getPropertyValue('--source-category'),'important');replacement.style.setProperty('color','#fff','important');replacement.setAttribute('aria-hidden','true');replacement.textContent=window.initials(image.dataset.sourceName);if(replacement.textContent.length>2)replacement.classList.add('l'+Math.min(replacement.textContent.length,4));image.replaceWith(replacement);
},true);
function selectSource(d,group){openSheet(d.id,group)}
function selectGroup(g){
 const types=[...new Set(DATA.filter(d=>d.main===g.main&&d.sub===g.sub).map(d=>sourceType(d)))];
 // Preserve the host's existing type-filter vocabulary and route handling.
 S.type=new Set(types);sync();
}
function applyOptions(){
 drawLines=options.lines;fit=options.fit;extraLabels=options.labels;greyBackground=options.grey;bandColorExperiment=options.band;scanPeriod=options.speed;
 quickControls.hidden=false;
 const scanButton=quickControls.querySelector('[data-quick-scan]'),savedButton=quickControls.querySelector('[data-quick-saved]');
 scanButton.textContent=options.scan?'Taramayı durdur':'Taramayı başlat';scanButton.setAttribute('aria-pressed',String(options.scan));
 savedButton.setAttribute('aria-checked',String(options.hideSaved));savedButton.setAttribute('aria-label',options.hideSaved?'Listem\'dekileri göster':'Listem\'dekileri gösterme');savedButton.title=options.hideSaved?'Listem\'dekileri göster':'Listem\'dekileri gösterme';

 newSvg.classList.toggle('status-markers',options.statusMarkers);newSvg.classList.toggle('highlight-saved',options.statusMarkers&&options.highlightSaved);statusKey.hidden=!options.statusMarkers;
 document.documentElement.classList.add('academy-engine');
 newSvg.removeAttribute('hidden');legacySvg.setAttribute('hidden','');newSvg.style.setProperty('display','block','important');
 legacySvg.style.setProperty('display','none','important');
 changeScanEnabled(options.scan&&S.view==='radar'&&!document.documentElement.classList.contains('mobile-source-mode')&&!document.hidden);
}
let lastSignature='';
function refresh(force=false){
 const all=D.map(mapRecord);DATA=all.filter(d=>hostMatch(d)&&(!options.hideSaved||!inMyList(d)));
 selection=DATA.find(d=>d.id===S.sel)||null;
 const signature=JSON.stringify([DATA.map(d=>[d.id,d.n,d.main,d.sub,d.rhythm,d.image]),S.sel,options]);
 if(force||signature!==lastSignature){
  lastSignature=signature;
  try{render(!force)}catch(error){
   console.error('Academy radar rendering failed',error);
   toast('Radar çizilemedi. Sayfayı yenileyin.');return;
  }
 }
 if(scene)for(const d of DATA){const o=scene.sources.get(d.n);if(o){decorateSource(o,d);o.group.classList.toggle('source-linked',S.sel===d.id)}}
 applyOptions();
}
// The host painter still owns counts and filter controls; the radar itself is drawn here.
paintRadar=function(){oldPaint();refresh()};
buildRadar=function(){refresh(true)};
const legacyHighlight=highlightSource;
highlightSource=function(id,...args){legacyHighlight(id,...args);newSvg.querySelectorAll('.node').forEach(n=>n.classList.toggle('source-linked',!!id&&n.dataset.id===id))};
const legacySetView=setView;
setView=function(...args){const result=legacySetView.apply(this,args);applyOptions();return result};
const button=document.createElement('button');button.type='button';button.id='radarSettingsButton';button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 3-.6 2.2-2 .9-2-.6L2 9l1.7 1.6v2.8L2 15l2.4 3.5 2-.6 2 .9L9 21h6l.6-2.2 2-.9 2 .6L22 15l-1.7-1.6v-2.8L22 9l-2.4-3.5-2 .6-2-.9L15 3z"/><circle cx="12" cy="12" r="3"/></svg>';button.setAttribute('aria-label','Radar ayarları');button.title='Radar ayarları';button.setAttribute('aria-haspopup','dialog');
const topTools=document.createElement('div');topTools.className='academy-top-tools';topTools.setAttribute('role','group');topTools.setAttribute('aria-label','Radar yardım ve ayarları');document.querySelector('#radarBox').append(topTools);
const helpButton=document.querySelector('.radar-read-toggle');
function placeSettingsButton(){
 topTools.append(helpButton,button);helpButton.hidden=false;
 helpButton.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M9 8a3 3 0 1 1 5 2.2c-1.2.7-2 1.3-2 3.3"/><circle cx="12" cy="18" r=".7" fill="currentColor"/></svg>';
 const filter=document.querySelector('.camera-filter-clear'),svg=filter?.querySelector('svg');
 if(svg)svg.innerHTML='<path d="M3 4h18l-7 8v7l-4 2v-9z"/>';
}
const layoutSync=sync;sync=function(...args){const result=layoutSync.apply(this,args);placeSettingsButton();return result};
placeSettingsButton();addEventListener('resize',placeSettingsButton);
const dialog=document.createElement('dialog');dialog.id='radarSettings';dialog.setAttribute('aria-labelledby','radarSettingsTitle');
dialog.innerHTML=`<header><h2 id="radarSettingsTitle">Radar ayarları</h2><button type="button" data-close aria-label="Radar ayarlarını kapat">Kapat</button></header>
<p>Değişiklikler hemen uygulanır.</p><fieldset id="academyOptions"><legend class="sr-only">Radar seçenekleri</legend><label>Görünüm<select data-option="appearance"><option value="auto">Otomatik</option><option value="light">Aydınlık</option><option value="dark">Siyah</option></select></label>
<label class="radar-desktop-option">Belirgin kaynak işaretleri · Deneme<input data-option="statusMarkers" type="checkbox"></label>
<label><span>Listem'dekileri gizle<small class="option-hint">Radarda ve Kaynaklar'da gösterilmez.</small></span><input data-option="hideSaved" type="checkbox"></label>
<label class="radar-desktop-option">Listem'dekileri vurgula<input data-option="highlightSaved" type="checkbox"></label>
<label>Tarama ışığı<input data-option="scan" type="checkbox"></label>
<label>Tarama hızı<select data-option="speed"><option value="5000">Hızlı · 5 sn</option><option value="8500">Normal · 8,5 sn</option><option value="14000">Yavaş · 14 sn</option></select></label>
<label>Zemin<select data-option="grey"><option value="true">Gri</option><option value="false">Renkli</option></select></label>
<label>Başlık bandı<select data-option="band"><option value="true">Renkli bant</option><option value="false">Klasik yaylar</option></select></label>
<label>Kaynak çizgileri<input data-option="lines" type="checkbox"></label>
<label>Büyük etiketler · A+<input data-option="labels" type="checkbox"></label>
<label class="radar-desktop-option">Ekrana sığdır<input data-option="fit" type="checkbox"></label>
<label>Geçiş animasyonu<input data-option="animation" type="checkbox"></label>
</fieldset><footer class="radar-settings-actions"><button type="button" data-save>Tamam</button><button type="button" data-reset>Varsayılan ayarlara dön</button></footer>`;
document.body.append(dialog);
function syncControls(){dialog.querySelectorAll('[data-option]').forEach(el=>{const value=el.dataset.option==='appearance'?window.edumindAppearance?.get()||'auto':options[el.dataset.option];if(el.type==='checkbox')el.checked=value;else el.value=String(value)});dialog.querySelector('[data-option=highlightSaved]').disabled=!options.statusMarkers;refreshChoiceMenus()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(options));return true}catch{return false}}
button.onclick=()=>{syncControls();dialog.showModal()};dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.addEventListener('close',()=>button.focus({preventScroll:true}));
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
function update(){save();applyOptions();syncControls();refresh(true);sync()}
dialog.addEventListener('change',e=>{const el=e.target,k=el.dataset.option;if(!k)return;if(k==='appearance'){window.edumindAppearance?.set(el.value);refreshChoiceMenus();return}options[k]=el.type==='checkbox'?el.checked:k==='speed'?Number(el.value):['grey','band'].includes(k)?el.value==='true':el.value;update()});
dialog.querySelector('[data-save]').onclick=()=>{if(save()){dialog.close();toast('Radar ayarları kaydedildi.')}else toast('Ayarlar bu cihazda kaydedilemedi. Tarayıcı depolama ayarlarını kontrol edin.')};
dialog.querySelector('[data-reset]').onclick=()=>{Object.assign(options,defaults);update()};
document.addEventListener('visibilitychange',applyOptions);
let scanSourceMode=document.documentElement.classList.contains('mobile-source-mode');
new MutationObserver(()=>{const next=document.documentElement.classList.contains('mobile-source-mode');if(next!==scanSourceMode){scanSourceMode=next;applyOptions()}}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
// Native help text describes the currently displayed chart, without changing filters.
const help=document.querySelector('.radar-help-body');if(help)help.innerHTML='<p>İçten dışa: günlük, haftalık, dönemsel takip. Ana kategoriler renkli bantlarda, alt kategoriler dış etiketlerde görünür.</p><p>Noktaya dokunarak mevcut kaynak kartını açın. Görünüm, tarama ve hareket seçenekleri Radar Ayarları ekranındadır.</p>';
window.AcademyRadarIntegration={version:'1.17',getSettings:()=>({...options}),audit:()=>D.map(d=>{const r=mapRecord(d);return {id:d.id,name:d.n,type:sourceType(d),main:r.main,sub:r.sub,rhythm:r.rhythm,seed:assigned.has(d.n)}})};
// Shared bookmark language for source rows and saved rows.
function bookmarkActionIcon(mode){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${mode==='saved'?'<path d="m5 12 4 4L19 6"/>':mode==='remove'?'<path d="M6 12h12"/>':'<path d="M12 6v12M6 12h12"/>'}</svg>`}
function paintBookmarkActions(){
 document.querySelectorAll('#groups [data-listtoggle]').forEach(button=>{const saved=button.getAttribute('aria-pressed')==='true';button.innerHTML=bookmarkActionIcon(saved?'saved':'add');button.title=saved?'Listem\'de · çıkarmak için dokunun':'Listeme ekle';button.dataset.bookmarkState=saved?'saved':'add'});
 document.querySelectorAll('#basket [data-remove-saved]').forEach(button=>{button.innerHTML=bookmarkActionIcon('remove');button.title='Listemden çıkar'});
}
const baseRenderList=renderList,baseRenderBasket=renderBasket;
renderList=function(...args){const result=baseRenderList.apply(this,args);paintBookmarkActions();return result};
renderBasket=function(...args){const result=baseRenderBasket.apply(this,args);paintBookmarkActions();return result};
const baseToggleMyList=toggleMyList;
toggleMyList=function(name){
 const d=D.find(d=>d.n===name);if(!d)return;
 const removing=inMyList(d);
 const previous=removing?{name:d.n,basket:S.basket.has(d.n),basketIndex:[...S.basket].indexOf(d.n),follow:S.follow.has(d.n),done:[...S.done].filter(k=>FOLLOW.some(f=>k===doneKey(f.k,d)))}:null;
 baseToggleMyList(name);
 if(removing){
  myListUndo=previous;const bar=document.querySelector('#myListUndo');bar.querySelector('span').textContent='Listemden çıkarıldı';bar.hidden=false;clearTimeout(myListUndoTimer);myListUndoTimer=setTimeout(()=>{bar.hidden=true;myListUndo=null},6000);
 }
};
removeMySavedSource=function(id){const d=D.find(d=>d.id===id);if(d)toggleMyList(d.n)};

// Use the same modal shell for radar help, settings and platform preferences.
const helpPanel=document.querySelector('#radarReadPopover');
const helpModal=document.createElement('dialog');helpModal.id='radarHelpDialog';helpModal.className='academy-shared-modal';helpModal.setAttribute('aria-labelledby','radarReadTitle');document.body.append(helpModal);
helpPanel.classList.remove('radar-read-popover');helpPanel.classList.add('shared-help-body');helpPanel.removeAttribute('role');helpModal.append(helpPanel);
helpButton.onclick=()=>{helpPanel.hidden=false;helpButton.setAttribute('aria-expanded','true');helpModal.showModal()};
new MutationObserver(()=>{if(helpPanel.hidden&&helpModal.open)helpModal.close()}).observe(helpPanel,{attributes:true,attributeFilter:['hidden']});
helpModal.addEventListener('close',()=>{helpPanel.hidden=true;helpButton.setAttribute('aria-expanded','false');helpButton.focus({preventScroll:true})});
const closeIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
const platformDialog=document.querySelector('#cardPlatformDialog');
for(const modal of [dialog,platformDialog,helpModal].filter(Boolean)){
 modal.classList.add('academy-shared-modal');
 modal.addEventListener('click',event=>{if(event.target!==modal)return;const box=modal.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)modal.close()});
}
for(const closeButton of [dialog.querySelector('[data-close]'),helpPanel.querySelector('.radar-read-close'),platformDialog?.querySelector('.platform-dialog-close')].filter(Boolean)){closeButton.innerHTML=closeIcon;closeButton.classList.add('academy-modal-close')}

const baseOpenCardPlatforms=openCardPlatforms;
openCardPlatforms=function(...args){const result=baseOpenCardPlatforms.apply(this,args);const modal=document.querySelector('#cardPlatformDialog');modal.classList.add('academy-shared-modal');const close=modal.querySelector('.platform-dialog-close');close.innerHTML=closeIcon;close.classList.add('academy-modal-close');return result};
function refreshChoiceMenus(){dialog.querySelectorAll('.academy-choice').forEach(root=>{const select=root.querySelector('select'),trigger=root.querySelector('.academy-choice-trigger');trigger.querySelector('span').textContent=select.selectedOptions[0]?.textContent||'';root.querySelectorAll('[role=option]').forEach(option=>option.setAttribute('aria-selected',String(option.dataset.value===select.value)))})}
function closeChoiceMenus(){dialog.querySelectorAll('.academy-choice').forEach(root=>{root.querySelector('[role=listbox]').hidden=true;root.querySelector('.academy-choice-trigger').setAttribute('aria-expanded','false')})}
for(const select of dialog.querySelectorAll('select[data-option]')){
 const root=document.createElement('span');root.className='academy-choice';select.before(root);root.append(select);select.hidden=true;select.tabIndex=-1;select.setAttribute('aria-hidden','true');
 const trigger=document.createElement('button');trigger.type='button';trigger.className='academy-choice-trigger';trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label',select.parentElement.parentElement.firstChild.textContent.trim());trigger.innerHTML='<span></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>';
 const list=document.createElement('span');list.className='academy-choice-options';list.setAttribute('role','listbox');list.hidden=true;list.id='radar-choice-'+select.dataset.option;trigger.setAttribute('aria-controls',list.id);
 for(const original of select.options){const option=document.createElement('button');option.type='button';option.setAttribute('role','option');option.dataset.value=original.value;option.textContent=original.textContent;option.onclick=event=>{event.preventDefault();select.value=original.value;closeChoiceMenus();select.dispatchEvent(new Event('change',{bubbles:true}));trigger.focus()};list.append(option)}
 root.append(trigger,list);trigger.onclick=event=>{event.preventDefault();const opening=list.hidden;closeChoiceMenus();list.hidden=!opening;trigger.setAttribute('aria-expanded',String(opening));if(opening)(list.querySelector('[aria-selected=true]')||list.firstElementChild).focus()};
 root.addEventListener('keydown',event=>{if(event.key==='Escape'&&!list.hidden){event.preventDefault();event.stopPropagation();closeChoiceMenus();trigger.focus()}else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();if(list.hidden)trigger.click();const options=[...list.children],index=options.indexOf(document.activeElement),next=event.key==='Home'?0:event.key==='End'?options.length-1:(index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;options[next].focus()}});
}
dialog.addEventListener('click',event=>{if(!event.target.closest('.academy-choice'))closeChoiceMenus()});dialog.addEventListener('close',closeChoiceMenus);refreshChoiceMenus();

if(myListPlatform==='discord')myListPlatform='all';
applyOptions();sync();refresh(true);
})();
