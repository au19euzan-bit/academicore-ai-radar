/* AcademiCore AI Radar: main script and patch scripts moved out of index.html (v1.3.322), in their original order. */

;/* --- block-1 --- */
try{if((localStorage.getItem("edumind-theme")||"acad")==="acad")document.documentElement.classList.add("th-acad")}catch(e){document.documentElement.classList.add("th-acad")}

try{document.documentElement.lang="tr"}catch(e){}

const SECTORS=[
 {k:"kurum",n:"Kurumlar",d:"Uluslararası kurum ve ağlar"},
 {k:"uyg",n:"Uygulama",d:"Öğretmen ve yükseköğretim için uygulama odaklı"},
 {k:"akd",n:"Akademik",d:"Dergiler, konferanslar, topluluklar"},
 {k:"ars",n:"Araştırmacılar",d:"Pedagojik ve eleştirel süzgeç"},
 {k:"akis",n:"Eğitimciler",d:"Sınıftan ve kampüsten AI deneyimlerini paylaşan eğitimciler"},
 {k:"ai",n:"AI gelişmeleri",d:"Yapay zekânın genelini izlemek için uzman hesaplar"},
 {k:"plat",n:"AI platformları",d:"Şirketlerin duyuru ve eğitim kanalları"},
 {k:"tr",n:"Türkiye",d:"Ulusal politika, eğitim ve araştırma"}
];
const RH={g:"Günlük",h:"Haftalık",a:"Dönemsel"};
const LENS={
 hiz:{n:"Güncel gelişmeler",d:"Yeni modelleri erken deneyip yorumlar"},
 ars:{n:"Araştırma",d:"Kanıt temelli çalışmalar, yeni bulgular"},
 pol:{n:"Politika ve etik",d:"Çerçeveler, yeterlikler, rehberler"},
 ele:{n:"Eleştirel pedagoji",d:"Gelişmelere pedagojik süzgeçten bakar"},
 ger:{n:"Gerçekçi bakış",d:"Abartıyı ayıklar, sınırları tartışır"},
 prat:{n:"Sınıf ve kampüs",d:"Araçlar, etkinlikler, rehberler"}
};
/* Kart açıklamaları: 25–35 kelime, her kartta aynı alan */
const DX=EDUMIND_CATALOG.DX;
const META=EDUMIND_CATALOG.META;
const DEF_LISTS=[{"k": "basla", "n": "Yeni başlayanlar", "d": "Alana yeni girenler için anlaşılır ve pratik kaynaklar.", "m": ["Ethan Mollick", "AI for Education", "UNESCO – Dijital Eğitim ve AI", "TeachAI", "Code.org / CodeAI", "Leon Furze", "Khan Academy / Khanmigo", "MEB YEĞİTEK", "EdSurge", "Sal Khan"]}, {"k": "core", "n": "Çekirdek 12", "d": "Hepsinden önce izlenmesi önerilen on iki kaynak.", "core": true}, {"k": "akad", "n": "Akademik takip", "d": "Lisansüstü öğrenciler ve araştırmacılar için dergiler, konferanslar ve araştırmacılar.", "m": ["Int. Journal of AI in Education (IJAIED)", "Computers & Education: AI", "British Journal of Educational Technology", "AIED Conference", "LAK Conference", "International AIED Society (IAIED)", "Mutlu Cukurova", "Ryan S. Baker", "Wayne Holmes", "Rose Luckin", "SoLAR", "Educational Data Mining Society", "ISLS"]}, {"k": "sinif", "n": "Sınıf uygulamaları ve materyaller", "d": "Sınıfta kullanılabilecek ders etkinliği, araç ve hazır materyal sunanlar.", "m": ["AI Pedagogy Project (Harvard)", "Khan Academy / Khanmigo", "MIT RAISE", "aiEDU", "Code.org / CodeAI", "AI for Education", "Dan Fitzpatrick", "Amanda Bickerstaff", "Leon Furze", "OpenAI Eğitim", "Google for Education", "Microsoft Education", "Digital Promise", "ISTE", "Philippa Hardman", "Pat Yongpradit"]}, {"k": "olcme", "n": "Ölçme ve değerlendirme", "d": "AI çağında sınav, ödev, geri bildirim ve akademik dürüstlük.", "m": ["Leon Furze", "Jisc", "Anna Mills", "Marc Watkins", "Mike Sharples", "Journal of Learning Analytics", "EDM Conference", "Ryan S. Baker"]}, {"k": "yuksek", "n": "Yükseköğretim", "d": "Üniversitelerde AI politikaları, öğretim ve dönüşüm.", "m": ["EDUCAUSE", "Jisc", "José Antonio Bowen", "Lance Eaton", "Bryan Alexander", "Marc Watkins", "George Siemens", "YÖK", "OpenAI Eğitim", "Claude for Education", "Google for Education", "Microsoft Education"]}, {"k": "pol", "n": "Karar vericiler için", "d": "Okul, kurum ve ülke düzeyinde AI politikası yazanlar ve izleyenler.", "m": ["UNESCO – Dijital Eğitim ve AI", "OECD Education and Skills", "European Digital Education Hub", "TeachAI", "Wayne Holmes", "Timnit Gebru (DAIR)", "MEB YEĞİTEK", "YÖK", "EdTech Hub"]}, {"k": "elestirel", "n": "Seminer okumaları", "d": "Derste tartışma açmak için farklı ve eleştirel görüşler.", "m": ["Neil Selwyn", "Maha Bali", "Arvind Narayanan & Sayash Kapoor", "Gary Marcus", "Melanie Mitchell", "Emily M. Bender", "Wayne Holmes"]}, {"k": "nabiz", "n": "Teknoloji gündemi", "d": "Eğitim dışında yapay zekâda neler olduğunu izlemek için.", "m": ["Simon Willison", "Andrej Karpathy", "Andrew Ng", "Jack Clark (Import AI)", "Nathan Lambert (Interconnects)", "Ethan Mollick", "Stanford HAI", "EdTech Insiders", "ASU+GSV", "Fei-Fei Li", "Yann LeCun", "Lilian Weng"]}, {"k": "platform", "n": "Platform duyuruları", "d": "Yeni modelleri, özellikleri ve sürüm notlarını ilk elden, şirketlerin kendi kanallarından izleyin.", "m": ["OpenAI", "Anthropic (Claude)", "Google DeepMind / Gemini", "Microsoft AI (Copilot)", "Meta AI", "Mistral AI", "xAI (Grok)", "DeepSeek", "Perplexity"]}, {"k": "egitimprog", "n": "Eğitim programları", "d": "OpenAI, Google, Microsoft ve Anthropic'in okullar ve üniversiteler için sayfaları ve hesapları.", "m": ["OpenAI Eğitim", "Claude for Education", "Google for Education", "Microsoft Education"]}, {"k": "tr", "n": "Türkiye gündemi", "d": "Ulusal politika, eğitim ve araştırma kurumları.", "m": ["MEB YEĞİTEK", "MEB", "YÖK", "TÜBİTAK", "TÜBİTAK BİLGEM", "BTK Akademi", "TÜBA", "YÖKAK"]}];
const SEC1={kurum:"Kurum",ars:"Araştırmacı",plat:"Platform"};
const LI="https://www.linkedin.com/";
/* Temel liste. Platform alanları (x, li, bs, yt, md, f) Ekim 2026'da kaynağın kendi sitesinden
   ya da profil sayfasının kendisinden doğrulandı. */
const BASE=EDUMIND_CATALOG.BASE;

/* ---------- Yardımcılar ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeUrl=u=>{try{const x=new URL(String(u));return /^https?:$/.test(x.protocol)?x.href:""}catch(e){return ""}};
const norm=s=>String(s).toLocaleLowerCase("tr").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i");
const liSearch=n=>"https://www.linkedin.com/search/results/all/?keywords="+encodeURIComponent(n.replace(/\s*\(.*?\)/g,""));
const short=n=>n.replace(/\s*\(.*?\)/,"");
const prio=p=>`<span class="prio" aria-label="Öncelik ${p}/3">${[1,2,3].map(i=>`<i class="${i<=p?"on":""}"></i>`).join("")}</span>`;
const secOf=k=>SECTORS.find(s=>s.k===k)||SECTORS[0];

/* ---------- Ek bağlantılar ve doğrulama kaynakları ----------
   vs: alan → doğrulama kodu (varsayılan "s" = kendi sitesinde bağlantı).
   L: platform + url + tür biçiminde ek bağlantılar. */
const ORC=(id)=>({p:"orcid",u:"https://orcid.org/"+id,v:"o"}), OA=(id)=>({p:"openalex",u:"https://openalex.org/"+id,v:"o"});
const EXTRA=EDUMIND_CATALOG.EXTRA;

/* ---------- Platform kayıt defteri ---------- */
const GROUPS=[["ana","Ana bağlantılar"],["akd","Akademik"],["icr","İçerik"],["tek","Teknik / açık bilim"],["sos","Diğer sosyal ağlar"],["top","Topluluk"]];
const REG={
 web:{n:"Web sitesi",g:"ana",ab:"web"}, li:{n:"LinkedIn",g:"ana",ab:"in"}, x:{n:"X",g:"ana",ab:"X"}, bs:{n:"Bluesky",g:"ana",ab:"bsky"}, yt:{n:"YouTube",g:"ana",ab:"yt"},
 scholar:{n:"Google Scholar",g:"akd",ab:"gs"}, orcid:{n:"ORCID",g:"akd",ab:"orcid"}, openalex:{n:"OpenAlex",g:"akd",ab:"oa"}, researchgate:{n:"ResearchGate",g:"akd",ab:"rg"},
 academia:{n:"Academia.edu",g:"akd",ab:"acad"}, semantic:{n:"Semantic Scholar",g:"akd",ab:"s2"}, scopus:{n:"Scopus",g:"akd",ab:"scopus"}, wos:{n:"Web of Science",g:"akd",ab:"wos"},
 inst:{n:"Kurumsal profil",g:"akd",ab:"kurum"}, ssrn:{n:"SSRN",g:"akd",ab:"ssrn"}, arxiv:{n:"arXiv",g:"akd",ab:"arxiv"}, edarxiv:{n:"EdArXiv",g:"akd",ab:"edarxiv"},
 substack:{n:"Substack",g:"icr",ab:"sub"}, newsletter:{n:"Bülten",g:"icr",ab:"bülten"}, blog:{n:"Blog",g:"icr",ab:"blog"}, rss:{n:"RSS",g:"icr",ab:"rss"}, medium:{n:"Medium",g:"icr",ab:"med"},
 podcast:{n:"Podcast",g:"icr",ab:"pod"}, spotify:{n:"Spotify",g:"icr",ab:"spot"}, apple:{n:"Apple Podcasts",g:"icr",ab:"apple"},
 github:{n:"GitHub",g:"tek",ab:"gh"}, hf:{n:"Hugging Face",g:"tek",ab:"hf"}, gitlab:{n:"GitLab",g:"tek",ab:"gl"}, zenodo:{n:"Zenodo",g:"tek",ab:"zen"}, osf:{n:"OSF",g:"tek",ab:"osf"}, figshare:{n:"Figshare",g:"tek",ab:"fig"}, kaggle:{n:"Kaggle",g:"tek",ab:"kag"},
 ig:{n:"Instagram",g:"sos",ab:"ig"}, fb:{n:"Facebook",g:"sos",ab:"fb"}, threads:{n:"Threads",g:"sos",ab:"thr"}, tiktok:{n:"TikTok",g:"sos",ab:"tt"}, md:{n:"Mastodon",g:"sos",ab:"mast"}, reddit:{n:"Reddit",g:"sos",ab:"rd"}, twitch:{n:"Twitch",g:"sos",ab:"tw"},
 discord:{n:"Discord",g:"top",ab:"dc"}, slack:{n:"Slack topluluğu",g:"top",ab:"slack"}, skool:{n:"Skool",g:"top",ab:"skool"}, community:{n:"Topluluk sayfası",g:"top",ab:"top"}, events:{n:"Etkinlik sayfası",g:"top",ab:"etk"}
};
const VER={s:"Kendi sitesinde bağlantı veriliyor",p:"Profil sayfasında ad ve biyografi eşleşti",b:"Bluesky biyografisi eşleşti",o:"ORCID/OpenAlex kaydında ad ve kurum eşleşti",r:"Kişi ORCID kaydına kendisi eklemiş",k:"Kurum ya da etkinlik sayfasında bağlantı veriliyor",g:"Kurum e-postasıyla doğrulanmış profil",a:"Yönetici kontrol etti",c:"Claude önerdi, doğrulanmadı",q:"Arama bağlantısı"};
const PERSON=new Set(["ars","akis","ai"]);
const FEEDP=["substack","newsletter","blog","rss","medium","podcast","spotify","apple"];
const SINGLE=new Set(["x","li","bs","yt","ig","fb","threads","tiktok","md","orcid","openalex","scholar","researchgate","github","hf","twitch","reddit"]);

function handleFrom(p,u){
  try{const x=new URL(u),seg=x.pathname.split("/").filter(Boolean);
    if(p==="x")return seg[0]&&!/^(intent|i|home|search)$/.test(seg[0])?seg[0]:"";
    if(p==="bs")return seg[0]==="profile"?seg[1]||"":"";
    if(p==="md")return seg[0]&&seg[0].startsWith("@")?seg[0].slice(1)+"@"+x.host:"";
  }catch(e){}return "";
}
function normLink(l){ // tek bağlantıyı doğrula ve URL'ye çevir
  if(!l||!REG[l.p])return null;
  let u=String(l.u||"").trim(),h=String(l.h||"").trim().replace(/^@/,"");
  if(!/^https?:\/\//i.test(u)){ // el ile girilen hesap adı
    const raw=u.replace(/^@/,"");
    if(l.p==="x"&&/^[A-Za-z0-9_]{1,30}$/.test(raw))u="https://x.com/"+raw;
    else if(l.p==="bs"&&/^[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(raw))u="https://bsky.app/profile/"+raw;
    else if(l.p==="md"&&/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(raw)){const [a,b]=raw.split("@");u="https://"+b+"/@"+a}
    else if(l.p==="orcid"&&/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(raw))u="https://orcid.org/"+raw;
    else if(/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(raw))u="https://"+raw;
  }
  u=safeUrl(u);if(!u)return null;
  if(!h)h=handleFrom(l.p,u);
  const v=VER[l.v]?l.v:"c";
  const out={p:l.p,u,v};if(h)out.h=h;if(l.lb)out.lb=String(l.lb).slice(0,80);
  return out;
}
function baseLinks(d){
  const vs=(EXTRA[d.n]&&EXTRA[d.n].vs)||{},L=[];
  const key=u=>String(u).toLowerCase().replace(/^https?:\/\/(www\.)?/,"").replace(/\/+$/,"");const add=(p,u,v,extra)=>{const n=normLink({p,u,v,...extra});if(n&&!L.some(x=>key(x.u)===key(n.u)&&(p!=="substack"||x.p===p)))L.push(n)};
  if(d.u)add("web",d.u,"s");
  if(d.x)add("x","https://x.com/"+d.x,vs.x||"s",{h:d.x});
  if(d.li)add("li",d.li,vs.li||"s");
  if(d.bs)add("bs","https://bsky.app/profile/"+d.bs,vs.bs||"s",{h:d.bs});
  if(d.yt)add("yt",d.yt,"s");
  if(d.md)add("md",d.md.u,"s",{h:d.md.a});
  if(d.f){if(d.f.sub)add("newsletter",d.f.sub,"s",{lb:d.f.n});if(d.f.rss)add("rss",d.f.rss,"s",{lb:d.f.n})}
  ((EXTRA[d.n]&&EXTRA[d.n].L)||[]).forEach(l=>add(l.p,l.u,l.v||"s",l));
  return L;
}
function addSearchLinks(d){
  if(PERSON.has(d.s)&&!d.links.some(l=>l.p==="scholar"))d.links.push({p:"scholar",u:"https://scholar.google.com/citations?view_op=search_authors&mauthors="+encodeURIComponent(short(d.n).replace(/&.*$/,"").trim()),v:"q",lb:"Google Scholar'da ara"});
}
const real=l=>l.v!=="q";
const has=(d,p)=>d.links.some(l=>l.p===p&&real(l));
const first=(d,p)=>d.links.find(l=>l.p===p&&real(l));
const feedLinks=d=>d.links.filter(l=>FEEDP.includes(l.p)&&real(l));
const subLink=d=>feedLinks(d).find(l=>["newsletter","substack","blog","medium","podcast"].includes(l.p));
const rssLink=d=>first(d,"rss");
const labelOf=l=>l.lb||(l.h?(l.p==="md"?"@"+l.h:"@"+l.h):l.u.replace(/^https?:\/\/(www\.)?/,"").replace(/\/$/,""));

/* ---------- Takip akışları (sepet sekmeleri) ---------- */
const FOLLOW=[
 {k:"x",n:"X",go:l=>"https://x.com/intent/follow?screen_name="+encodeURIComponent(l.h||handleFrom("x",l.u)),verb:"Takip et",
  tip:`<b>Nasıl çalışır?</b> Her tıklamada X'in kendi "Takip et" onay ekranı yeni sekmede açılır. X kısa sürede çok sayıda takibi sınırlayabildiği için hesapları birkaç oturuma yaymak güvenlidir.`,
  tip2:`<b>Öğrencilerle paylaşmak için:</b> "@adları kopyala" ile listeyi alıp X'te herkese açık bir liste oluşturun; başkaları listeyi tek tıkla takip eder.`,
  copy:{label:"@adları kopyala",make:R=>R.map(([d,l])=>"@"+(l.h||"")).join(" "),msg:"X kullanıcı adı kopyalandı"}},
 {k:"li",n:"LinkedIn",go:l=>l.u,verb:"Sayfayı aç",tip:`<b>Nasıl çalışır?</b> LinkedIn'de toplu takip yolu yok. Düğme sayfayı açar; "Takip et"e basıp bu sekmeye dönün, sıradaki hazır olur.`},
 {k:"bs",n:"Bluesky",go:l=>l.u,verb:"Profili aç",tip:`<b>Nasıl çalışır?</b> Düğme profili açar; "Follow" ile takip edip geri dönün.`,
  tip2:`<b>Toplu yol:</b> Bluesky'de bir <b>başlangıç paketi (starter pack)</b> oluşturup bu hesapları ekleyin; paketi açan herkes "Follow all" ile hepsini tek seferde takip eder.`,
  copy:{label:"Hesap adlarını kopyala",make:R=>R.map(([d,l])=>"@"+(l.h||"")).join("\n"),msg:"Bluesky hesap adı kopyalandı"}},
 {k:"yt",n:"YouTube",go:l=>l.u+(l.u.includes("?")?"&":"?")+"sub_confirmation=1",verb:"Abone ol",tip:`<b>Nasıl çalışır?</b> Kanal abonelik onay penceresiyle açılır; "Abone ol"u onaylayıp geri dönün.`},
 {k:"ig",n:"Instagram",go:l=>l.u,verb:"Profili aç",tip:`<b>Nasıl çalışır?</b> Profil açılır; "Takip et"e basıp geri dönün. Instagram'da toplu takip yolu yok.`},
 {k:"fb",n:"Facebook",go:l=>l.u,verb:"Sayfayı aç",tip:`<b>Nasıl çalışır?</b> Sayfa açılır; "Takip et" ya da "Beğen"e basıp geri dönün.`},
 {k:"threads",n:"Threads",go:l=>l.u,verb:"Profili aç",tip:`<b>Nasıl çalışır?</b> Profil açılır; "Takip et"e basıp geri dönün.`},
 {k:"tiktok",n:"TikTok",go:l=>l.u,verb:"Profili aç",tip:`<b>Nasıl çalışır?</b> Profil açılır; "Takip et"e basıp geri dönün.`},
 {k:"md",n:"Mastodon",go:l=>l.u,verb:"Profili aç",
  tip:`<b>Toplu yol:</b> "CSV'yi kopyala"ya basın, metni <b>edumind-mastodon.csv</b> adıyla kaydedin. Kendi sunucunuzda Tercihler → İçe ve dışa aktar → İçe aktar → "Takip listesi" seçip yükleyin; hepsi bir seferde takip edilir.`,
  copy:{label:"CSV'yi kopyala",make:R=>"Account address,Show boosts,Notify on new posts,Languages\n"+R.map(([d,l])=>(l.h||"")+",true,false,").join("\n")+"\n",msg:"Mastodon CSV kopyalandı"}},
 {k:"substack",n:"Substack",go:l=>l.u,verb:"Abone ol",tip:"Yayın sayfası yeni sekmede açılır. Aboneliğinizi Substack üzerinden tamamlayabilirsiniz."},
 ...[['discord','Discord','Katıl'],['github','GitHub','Siteyi aç'],['spotify','Spotify','Abone ol'],['apple','Apple Podcasts','Abone ol'],['hf','Hugging Face','Siteyi aç'],['reddit','Reddit','Takip et'],['orcid','ORCID','Profili aç'],['openalex','OpenAlex','Profili aç']].map(([k,n,verb])=>({k,n,verb,go:l=>l.u})),
 {k:"feed",n:"Bültenler ve RSS"}
];
const FK=Object.fromEntries(FOLLOW.map(f=>[f.k,f]));
const followLink=(d,k)=>k==="feed"?(subLink(d)||rssLink(d)):first(d,k);


const TYPES=[{k:"org",n:"Kurum / ağ"},{k:"person",n:"Kişi"},{k:"academic",n:"Akademik yayın"},{k:"event",n:"Etkinlik"},{k:"resource",n:"Eğitim kaynağı"},{k:"platform",n:"AI şirketi"}];
function sourceType(d){
 if(d.type&&TYPES.some(t=>t.k===d.type))return d.type;
 if(["ars","akis","ai"].includes(d.s))return "person";
 if(/Conference|Konferans|ASU\+GSV|Summit/i.test(d.n))return "event";
 if(/Journal|Computers & Education|Educational Technology/i.test(d.n))return "academic";
 if(d.s==="plat")return "platform";
 if(["Jisc","ISTE","AI for Education","aiEDU"].includes(d.n))return "org";
 if(d.s==="uyg"||/BTK Akademi/i.test(d.n))return "resource";
 return "org";
}
const SOURCE_COUNTRIES={tr:'Türkiye',us:'ABD',gb:'Birleşik Krallık',fr:'Fransa',au:'Avustralya',cn:'Çin',eg:'Mısır',be:'Belçika',international:'Uluslararası',unknown:'Belirtilmemiş'};
function sourceGeo(d){
 const explicit=String(d.country||d.geo||'').trim();
 if(explicit&&explicit!=='unknown'){
  const code=explicit.toLowerCase();if(SOURCE_COUNTRIES[code])return code;
  const named=Object.keys(SOURCE_COUNTRIES).find(k=>SOURCE_COUNTRIES[k].toLocaleLowerCase('tr')===explicit.toLocaleLowerCase('tr'));if(named)return named;
 }
 if(d.s==='tr')return 'tr';
 // Affiliation / headquarters in the existing source record, not nationality.
 const loc=String(d.loc||(META[d.n]||[])[1]||'');
 const rules=[['tr',/Türkiye/iu],['us',/\bABD\b|United States|Wharton|University of Pennsylvania|University of Mississippi|Northeastern University|Georgetown University|Princeton University|Stanford University|University of Washington|Santa Fe Institute|\bNYU\b/iu],['gb',/Birleşik Krallık|United Kingdom|\bBK\b|\bUCL\b|Londra|The Open University/iu],['fr',/Fransa|Paris/iu],['au',/Avustralya|Australia/iu],['cn',/Çin|Hangzhou/iu],['eg',/Cairo|Mısır/iu],['be',/Brüksel|Brussels|Belçika/iu],['international',/Uluslararası/iu]];
 for(const [code,re] of rules)if(re.test(loc))return code;
 const parent=EDUMIND_GEN.parent[d.n];
 if(parent==='Google')return 'us';
 if(parent)return sourceGeo({n:parent});
 return 'unknown';
}
function sourceCountryName(d){return SOURCE_COUNTRIES[sourceGeo(d)]||SOURCE_COUNTRIES.unknown}
function typeName(d){return TYPES.find(t=>t.k===sourceType(d)).n}

/* ---------- Durum ---------- */
let D=[],ADMIN_DOCS=[];
const FSET=["sec","rh","lens","pf","coll","type","geo"];
const S={recent:false,sort:"type",type:new Set(),geo:new Set(),introOpen:false,view:"radar",week:null,q:"",sec:new Set(),rh:new Set(),core:false,mine:false,bask:false,pf:new Set(),lens:new Set(),sel:null,tab:"x",
  follow:new Set(),basket:new Set(),done:new Set(),pref:new Set(),admin:false,coll:new Set()};
const togg=(k,v)=>{if(!v)return;S[k].has(v)?S[k].delete(v):S[k].add(v)};
const onlyF=(k,v)=>{S[k].clear();if(v)S[k].add(v)};
let categoryListOrigin=null;
const expandedCardDescriptions=new Set();
let myListPlatform='all',myListQuery='',myListSort='added',myListUndo=null,myListUndoTimer=0;
let platformCardOrigin=null;
function captureCategoryOrigin(d){return{id:d.id,view:S.view,sets:Object.fromEntries(FSET.map(k=>[k,[...S[k]]])),values:Object.fromEntries(['q','sort','recent','week','core','mine','bask','personalIds','personalLabel'].map(k=>[k,S[k]])),sourceMode:document.documentElement.classList.contains('mobile-source-mode')||(!matchMedia('(max-width:759px)').matches&&document.querySelector('#sources').getBoundingClientRect().top<innerHeight/2),pageScroll:scrollY,cardScroll:document.querySelector('#sheetBody').scrollTop}}
function categoryOriginChanged(){document.dispatchEvent(new Event('edumind-category-origin-change'))}
function returnToCategoryCard(){
 const origin=categoryListOrigin;if(!origin)return;categoryListOrigin=null;categoryOriginChanged();clearF();FSET.forEach(k=>origin.sets[k].forEach(v=>S[k].add(v)));Object.assign(S,origin.values);document.querySelector('#q').value=S.q;sync();setView(origin.view==='follow'?'follow':origin.sourceMode?'list':'radar');
 const trigger=[...document.querySelectorAll('#groups .item')].find(el=>el.dataset.id===origin.id)||document.querySelector('.radar-scroll');openSheet(origin.id,trigger);requestAnimationFrame(()=>{scrollTo(0,origin.pageScroll);document.querySelector('#sheetBody').scrollTop=origin.cardScroll});
}

const clearF=()=>{S.personalIds=null;S.personalLabel="";FSET.forEach(k=>S[k].clear());S.week=null;S.core=S.mine=S.bask=S.recent=false;S.q="";const q=$("#q");if(q)q.value=""};
function restoreRadarSources(){if(!S.recent)return;clearF();S.sort="type";sync()}
const anyF=()=>S.personalIds||FSET.some(k=>S[k].size)||S.week||S.core||S.mine||S.bask||S.recent||S.q;
function load(k,set){try{const v=JSON.parse(localStorage.getItem(k)||"[]");if(Array.isArray(v))v.forEach(n=>set.add(n))}catch(e){}}
function store(k,set){try{localStorage.setItem(k,JSON.stringify([...set]))}catch(e){}}
const REVIEWED_RECENT=new Set();load("edumind-recent-reviewed",REVIEWED_RECENT);
const recentReviewKey=d=>JSON.stringify([d.n,d.at||""]);
load("edumind-pref",S.pref);load("edumind-follow",S.follow);load("edumind-basket",S.basket);load("edumind-done",S.done);
{const old=new Set();load("edumind-subbed",old);old.forEach(n=>S.done.add("feed|"+n));
 [...S.done].forEach(k=>{if(k.startsWith("f|")){S.done.delete(k);S.done.add("feed|"+k.slice(2))}})}
function saveAll(){store("edumind-pref",S.pref);store("edumind-follow",S.follow);store("edumind-basket",S.basket);store("edumind-done",S.done)}

const doneKey=(k,d)=>k+"|"+d.n;
const followed=d=>S.follow.has(d.n)||FOLLOW.some(f=>followLink(d,f.k)&&S.done.has(doneKey(f.k,d)));
const inMyList=d=>S.basket.has(d.n)||followed(d);
function toggleMyList(n){const d=D.find(x=>x.n===n);if(!d)return;if(inMyList(d)){S.basket.delete(n);S.follow.delete(n);FOLLOW.forEach(f=>S.done.delete(doneKey(f.k,d)))}else S.basket.add(n);saveAll();sync()}
const W=()=>360/SECTORS.length;

/* ---------- Yönetici verisini birleştir ---------- */
function cleanCore(v){
  const o={},str=(x,m=300)=>typeof x==="string"?x.trim().slice(0,m):"";
  o.n=str(v.n,120);if(SECTORS.some(s=>s.k===v.s))o.s=v.s;if(RH[v.r])o.r=v.r;
  if([1,2,3].includes(Number(v.p)))o.p=Number(v.p);if(LENS[v.l])o.l=v.l;
  o.t=str(v.t,400);o.w=str(v.w,120);o.note=str(v.note,300);o.now=str(v.now,160);
  for(const k of Object.keys(o))if(o[k]==="")delete o[k];
  return o;
}
function docLinks(v){ // yeni biçim (links) ve eski biçim (x, li, bs...) birlikte
  const L=[];
  (Array.isArray(v.links)?v.links:[]).forEach(l=>{const n=normLink(l);if(n)L.push(n)});
  const old={u:"web",x:"x",li:"li",bs:"bs",yt:"yt"};
  for(const [k,p] of Object.entries(old))if(typeof v[k]==="string"&&v[k]){const n=normLink({p,u:v[k],v:"a"});if(n)L.push(n)}
  if(v.md&&v.md.u){const n=normLink({p:"md",u:v.md.u,h:v.md.a,v:"a"});if(n)L.push(n)}
  if(v.f){if(v.f.sub){const n=normLink({p:"newsletter",u:v.f.sub,lb:v.f.n,v:"a"});if(n)L.push(n)}if(v.f.rss){const n=normLink({p:"rss",u:v.f.rss,lb:v.f.n,v:"a"});if(n)L.push(n)}}
  return L.slice(0,40);
}
function mergeLinks(target,add){
  for(const l of add){
    if(SINGLE.has(l.p)&&!(l.p==="orcid"||l.p==="bs")){const i=target.findIndex(x=>x.p===l.p&&real(x));if(i>=0){target[i]=l;continue}}
    if(!target.some(x=>x.p===l.p&&x.u===l.u))target.push(l);
  }
}
const LAUNCH="2026-10-17",NEW_DAYS=30,BASE_BY="Erol Üzan";
const lastBy=()=>{try{return localStorage.getItem("edumind-by")||BASE_BY}catch(e){return BASE_BY}};
const isRecentSource=d=>{const at=Date.parse(d.at);return Number.isFinite(at)&&at<=Date.now()&&at>=Date.now()-30*864e5};
const isNewCandidate=d=>!!(d.at&&Date.parse(d.at)<=Date.now()&&(d.added||d.nw||d.at.slice(0,10)>LAUNCH)&&(Date.now()-Date.parse(d.at))<NEW_DAYS*864e5);
const isNew=d=>isNewCandidate(d)&&!REVIEWED_RECENT.has(recentReviewKey(d));
const trDate=a=>{try{return new Date(a.length===10?a+"T12:00:00":a).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})}catch(e){return a.slice(0,10)}};
function rebuildData(){
  D=BASE.map(d=>{const n={...d};n.links=baseLinks(d);n.at=d.at||null;n.by=d.by||BASE_BY;return n});
  for(const doc of ADMIN_DOCS){
    const v=doc.v||{},core=cleanCore(v),L=docLinks(v);
    if(doc.kind==="patch"){const b=D.find(d=>d.n===doc.base);if(b){const {n,...rest}=core;Object.assign(b,rest);mergeLinks(b.links,L);b.upd=doc.at||true}}
    else if(doc.kind==="new"&&core.n&&!D.some(d=>d.n===core.n)){const web=L.find(l=>l.p==="web");D.push({p:2,r:"a",s:"kurum",t:"",w:"",...core,u:web?web.u:"",links:L,added:true,at:doc.at||new Date().toISOString(),by:String(doc.oneren||"").slice(0,40)})}
  }
  D.forEach((d,i)=>{d.id="k"+i;
    if(!d.links.some(l=>l.p==='substack'&&l.v!=='q')){const link=d.links.find(l=>l.v!=='q'&&/^https?:\/\/[^/]*\.substack\.com(?:\/|$)/i.test(l.u));if(link)d.links.push({p:'substack',u:link.u.replace(/\/(?:subscribe|feed)\/?(?:\?.*)?$/,''),lb:link.lb||d.n,v:link.v})}
    addSearchLinks(d);
    if(!d.w||d.added){const names=[...new Set(d.links.filter(real).filter(l=>l.p!=="web").map(l=>REG[l.p].n))].slice(0,5);if(names.length&&!d.w)d.w=names.join(" · ")}});
}

function academicSourcePool(){return window.academicSourceMatches?D.filter(window.academicSourceMatches):D}
function match(d){
  if(window.academicSourceMatches&&!window.academicSourceMatches(d))return false;
  if(S.personalIds&&!S.personalIds.includes(d.id))return false;
  if(S.recent&&!isNewCandidate(d))return false;
  if(S.type.size&&!S.type.has(sourceType(d)))return false;
  if(S.geo.size&&!S.geo.has(sourceGeo(d)))return false;
  if(S.sec.size&&!S.sec.has(d.s))return false;
  if(S.rh.size&&!S.rh.has(d.r))return false;
  if(S.core&&!d.c)return false;
  if(S.mine&&!followed(d))return false;
  if(S.bask&&!inMyList(d))return false;
  if(S.pf.size&&![...S.pf].some(k=>k==="akd"?d.links.some(l=>REG[l.p].g==="akd"&&real(l)):followLink(d,k)))return false;
  if(S.lens.size&&!S.lens.has(d.l))return false;
  if(S.coll.size&&![...S.coll].some(k=>{const c=LISTS.find(x=>x.k===k);return c&&(c.core?d.c:(c.m||[]).includes(d.n))}))return false;
  if(S.week){const w=WEEK.find(x=>x.d===S.week);if(w&&!w.f(d))return false}
  if(S.q){const h=norm([d.n,d.t,d.w,DX[d.n]||"",...(META[d.n]||[]),...listsOf(d).map(c=>c.n),d.now||"",secOf(d.s).n,RH[d.r],...d.links.map(l=>(l.h||"")+" "+(l.lb||""))].filter(Boolean).join(" "));if(!norm(S.q).split(/\s+/).every(w=>h.includes(w.replace(/^@/,""))))return false}
  return true;
}

/* ---------- Radar ---------- */
/* Bir dilim-halka hücresine noktaları çakışmadan yerleştir: gerekirse halkayı alt sıralara böl. */
function buildRadar(){
  // The old SVG radar is no longer drawn; academy-radar.js renders the radar
  // and only uses #radar as its mount point.
  $("#radar").replaceChildren();
}
function showTip(g){
  if(matchMedia("(max-width:759px)").matches)return;
  highlightSource(g.dataset.id,true);
  const d=D.find(x=>x.id===g.dataset.id);if(!d)return;
  const tip=$("#tip"),box=$("#radarBox").getBoundingClientRect(),r=(g.querySelector(".av-rim")||g.querySelector(".hit")).getBoundingClientRect();
  const km=META[d.n]||[secLabel(d.s),""];
  tip.innerHTML=`<span class="tiphead">${avatar(d,42)}<span class="tipnm"><b>${esc(d.n)}</b><span class="m">${esc(km[0])}${km[1]?" · "+esc(km[1]):""}</span></span></span>
    <span class="tipmeta"><span class="tr tr-${d.r}"><i></i>${RH[d.r]}</span><span class="tp" title="Öncelik">${"●".repeat(d.p)}${"○".repeat(3-d.p)}</span>${d.c?`<span class="tb">Çekirdek 12</span>`:""}${followed(d)?`<span class="tb ok">Takipteyim</span>`:""}</span>
    <span class="pfs">${marks(d,false,6)}</span><span class="h">Ayrıntı için tıklayın</span>`;
  tip.hidden=false;
  const cx=r.left+r.width/2-box.left,cy=r.top+r.height/2-box.top,tw=tip.offsetWidth,th=tip.offsetHeight;
  const left=Math.max(8,Math.min(box.width-tw-8,cx-tw/2)),below=cy-th-16<4;
  tip.style.left=left+"px";tip.style.top=(below?cy+16:cy-th-16)+"px";
  tip.style.setProperty("--ax",(cx-left)+"px");tip.classList.toggle("below",below);
}
function hideTip(){highlightSource(null);const t=$("#tip");if(t)t.hidden=true}
function paintRadar(){
  // Same set the old radar drew a dot for: a known type and a follow rhythm.
  const vis=D.filter(d=>TYPES.some(s=>s.k===sourceType(d))&&["g","h","a"].includes(d.r)&&match(d)).length;
  const n=$("#ctrN");if(n)n.textContent=vis;
  const act=[];
  act.push(...activeF());if(S.core)act.push(["core","Çekirdek 12"]);if(S.q)act.push(["q",`"${S.q}"`]);
  if(S.week){const w=WEEK.find(x=>x.d===S.week);if(w)act.push(["week",w.n+": "+w.t])}if(S.mine)act.push(["mine","Takip ettiklerim"]);if(S.bask)act.push(["bask","Listem"]);
  $("#radarTools").innerHTML=`<span class="rcount"><b>${vis}</b> / ${academicSourcePool().length} kaynak</span>${act.length?'<button class="chip" data-clear="all" type="button">Süzgeçleri temizle</button>':""}`;
  $("#radarTools").querySelectorAll("[data-clear]").forEach(b=>b.onclick=()=>{const k=b.dataset.clear;
    if(k==="all"){clearF()}else{const[g,v]=k.split(":");
      if(FSET.includes(g))S[g].delete(v);
      else if(g==="core")S.core=false;else if(g==="mine")S.mine=false;else if(g==="bask")S.bask=false;
      else if(g==="week")S.week=null;else if(g==="q"){S.q="";const e=$("#q");if(e)e.value=""}}
    sync()});
}

/* ---------- Görünümler ve alt menü ---------- */
const ICON={
 discover:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4z"/></svg>`,
 radar:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12 L12 3"/><circle cx="16" cy="8" r="1.4" fill="currentColor"/></svg>`,
 list:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2" fill="currentColor"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor"/><circle cx="4.5" cy="18" r="1.2" fill="currentColor"/></svg>`,
 follow:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4z"/></svg>`,
 rhythm:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
 admin:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`
};
const VIEWS=[{k:"radar",n:"Radar"},{k:"discover",n:"Keşfet"},{k:"follow",n:"Listem"},{k:"admin",n:"Yönetim",admin:true}];
const MQ=window.matchMedia?matchMedia("(max-width:759px)"):{matches:false,addEventListener(){}};
const isApp=()=>MQ.matches;
const PAGED=()=>true;
let introSeen=false;try{introSeen=localStorage.getItem("edumind-intro-v1")==="1"}catch(e){}
function renderNav(){
  const cnt=D.filter(d=>S.basket.has(d.n)||followed(d)).length;
  const html=VIEWS.filter(v=>!v.admin||S.admin).map(v=>`<button type="button" class="navbtn" aria-label="${v.n}" title="${v.n}" data-view-go="${v.k}" ${S.view===v.k?'aria-current="page"':""}>${ICON[v.k]}<span>${v.n}</span>${v.k==="follow"&&cnt?`<em class="badge">${cnt}</em>`:""}</button>`).join("");
  $("#topnav").innerHTML=html;$("#bottomnav").innerHTML=html;
  document.querySelectorAll("[data-view-go]").forEach(b=>b.onclick=()=>setView(b.dataset.viewGo));
}
/* Telefonda: tek ekranlı uygulama. Bilgisayarda: tüm bölümler tek sayfada. */
function applyLayout(){
  if(S.view==="list")S.view="radar";
  const app=isApp(),root=document.documentElement;
  root.classList.toggle("app",app);root.classList.toggle("page",!app);root.classList.toggle("mobile-my-list-mode",app&&S.view==="follow");
  document.querySelectorAll(".view").forEach(v=>{const k=v.dataset.view;
    if(k==="admin"&&!S.admin){v.hidden=true;return}
    if(k==="intro"){v.hidden=S.view!=="intro";return}
    v.hidden=S.view!==k});
  root.classList.toggle("intro-mode",S.view==="intro");root.classList.toggle("mobile-discover-mode",app&&S.view==="discover");
  hideTip();renderNav();if(S.view==="follow")requestAnimationFrame(centerMyListPlatform);
}
function setView(k,keepScroll){
  if(k==="rhythm")k="follow";
  if(platformCardOrigin){platformCardOrigin=null;const back=document.querySelector("#platformCardBack");if(back)back.hidden=true}
  if(categoryListOrigin){categoryListOrigin=null;categoryOriginChanged()}
  const toSources=k==="list";if(k==="radar"){restoreRadarSources();document.dispatchEvent(new Event("edumind-return-radar"))}if(toSources){document.dispatchEvent(new Event("edumind-open-sources"));k="radar";}
  if(toSources)requestAnimationFrame(()=>{const source=document.querySelector("#sources");if(matchMedia('(max-width:759px)').matches){const top=Math.max(0,document.querySelector('.appbar')?.getBoundingClientRect().bottom||0);scrollTo(0,scrollY+source.getBoundingClientRect().top-top-60)}else source.scrollIntoView({block:"start"})});
  if(k!=="intro"&&(!VIEWS.some(v=>v.k===k)||(k==="admin"&&!S.admin)))k="radar";
  if(k==="intro"){S.introOpen=true;S.view="intro";applyLayout();window.scrollTo({top:0,behavior:"auto"});const c=$("#introStart");if(c)c.focus({preventScroll:true});return}
  if(k==="follow"&&S.view!=="follow"){myListPlatform="all";renderBasket()}
  S.view=k;if(k!=="intro")try{localStorage.setItem("edumind-view",k)}catch(e){}
  applyLayout();
  if(PAGED()){if(!keepScroll)window.scrollTo({top:0,behavior:"auto"})}
  else if(!keepScroll){const sec=document.querySelector(`.view[data-view="${k}"]`);if(sec){pageScrollLock=Date.now();sec.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"start"})}}
  if(typeof writeHash==="function")writeHash();
}
function closeIntro(then){
  introSeen=true;try{localStorage.setItem("edumind-intro-v1","1")}catch(e){}
  S.introOpen=false;
  if(PAGED()){S.view=then||"radar";applyLayout();window.scrollTo({top:0,behavior:"auto"})}
  else{applyLayout();if(then)setView(then)}
}
/* Sayfa modunda kaydırırken menüdeki etkin bölümü güncelle */
let pageScrollLock=0;
function initScrollSpy(){
  if(!("IntersectionObserver" in window))return;
  const io=new IntersectionObserver(es=>{if(PAGED()||Date.now()-pageScrollLock<900)return;
    const vis=es.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];
    if(vis&&vis.target.dataset.view!=="intro"&&S.view!==vis.target.dataset.view){S.view=vis.target.dataset.view;renderNav()}},{rootMargin:"-30% 0px -60% 0px"});
  document.querySelectorAll(".view").forEach(v=>io.observe(v));
}

/* ---------- Detay kartı (alt panel) ---------- */
let sheetTrigger=null,sheetOrder=[],closingProfileFromHistory=false,sheetHistoryBackPending=false;
window.addEventListener('popstate',()=>{if(sheetHistoryBackPending){sheetHistoryBackPending=false;if(!$('#sheet').hidden)history.pushState({...history.state,edumindProfile:true},'',location.href);return}if(!$('#sheet').hidden&&!history.state?.edumindProfile){closingProfileFromHistory=true;closeSheet();closingProfileFromHistory=false}});
function openSheet(id,trigger){
  const d=D.find(x=>x.id===id);if(!d)return;
  sheetTrigger=trigger||document.activeElement;
  const vis=D.filter(match);sheetOrder=(vis.some(x=>x.id===id)?vis:D).map(x=>x.id);
  const firstReview=isNew(d);if(firstReview){REVIEWED_RECENT.add(recentReviewKey(d));store("edumind-recent-reviewed",REVIEWED_RECENT);document.dispatchEvent(new Event("edumind-recent-reviewed"))}
  S.sel=id;renderDetail();paintRadar();if(firstReview){renderNewStrip();const row=document.querySelector(`#groups .item[data-id="${d.id}"]`);if(row){row.classList.remove("isnew");row.querySelector(".source-new-label")?.remove()}}
  document.querySelectorAll(".item").forEach(r=>r.classList.toggle("sel",r.dataset.id===S.sel));
  const wrap=$("#sheet");
  if(wrap.hidden){if(!sheetHistoryBackPending)history.pushState({...history.state,edumindProfile:true},'',location.href);wrap.hidden=false;document.documentElement.classList.add("sheet-open");
    requestAnimationFrame(()=>requestAnimationFrame(()=>{if(!wrap.hidden)wrap.classList.add("show")}));}
  $("#sheetBody").scrollTop=0;$("#sheetPanel").focus({preventScroll:true});
}
function closeSheet(){
  const wrap=$("#sheet");if(wrap.hidden)return;
  const returnHistory=history.state?.edumindProfile&&!closingProfileFromHistory&&!sheetHistoryBackPending;
  wrap.hidden=true;wrap.classList.remove("show");document.documentElement.classList.remove("sheet-open");$("#sheetPanel").style.transform="";
  if(returnHistory){sheetHistoryBackPending=true;history.back()}
  S.sel=null;paintRadar();if(S.sort==='new')renderList();document.querySelectorAll(".item").forEach(r=>r.classList.remove("sel"));
  if(sheetTrigger&&document.contains(sheetTrigger))try{sheetTrigger.focus({preventScroll:true})}catch(e){}
  else if(sheetTrigger?.matches(".ncard")){const next=document.querySelector("#newStrip .ncard")||document.querySelector("#radarBox .radar-scroll");next?.focus({preventScroll:true})}
}
function stepSheet(dir){if(!S.sel)return;const i=sheetOrder.indexOf(S.sel);const n=sheetOrder[(i+dir+sheetOrder.length)%sheetOrder.length];if(n)openSheet(n,sheetTrigger)}
function initSheet(){
  $("#profileBack").onclick=closeSheet;
  $("#sheetClose").onclick=closeSheet;$("#sheetBackdrop").onclick=closeSheet;
  $("#sheetPrev").onclick=()=>stepSheet(-1);$("#sheetNext").onclick=()=>stepSheet(1);
  document.addEventListener("keydown",e=>{if(document.querySelector("#cardPlatformDialog[open]"))return;if($("#sheet").hidden)return;
    if(e.key==="Escape"){e.preventDefault();closeSheet()}
    else if(e.key==="ArrowRight"&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))stepSheet(1);
    else if(e.key==="ArrowLeft"&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))stepSheet(-1);
    else if(e.key==="Tab"){const f=[...$("#sheetPanel").querySelectorAll("a[href],button:not([disabled]),summary,[tabindex]:not([tabindex='-1'])")].filter(x=>x.offsetParent);if(!f.length)return;
      const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
  // aşağı sürükleyerek kapat (mobil)
  const grab=$("#sheetGrab"),panel=$("#sheetPanel");let y0=null,dy=0;
  grab.addEventListener("pointerdown",e=>{if(e.target.closest("button")||!matchMedia("(max-width:759px)").matches)return;y0=e.clientY;dy=0;grab.setPointerCapture(e.pointerId);panel.style.transition="none"});
  grab.addEventListener("pointermove",e=>{if(y0===null)return;dy=Math.max(0,e.clientY-y0);panel.style.transform=`translateY(${dy}px)`});
  const end=()=>{if(y0===null)return;y0=null;panel.style.transition="";if(dy>110)closeSheet();else panel.style.transform=""};
  grab.addEventListener("pointerup",end);grab.addEventListener("pointercancel",end);
}

/* ---------- Simgeler: platform türüne göre sade, markasız simgeler ---------- */
const SV=(d,extra="")=>`<svg class="pi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
const GLYPH={
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
 briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18"/>',
 post:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
 cloud:'<path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.4 1.5A3.3 3.3 0 0 0 7 18z"/>',
 video:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
 camera:'<rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/>',
 people:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M16 14.2c2.9.3 5 2.7 5 5.8"/>',
 phone:'<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 9.5v5l4-2.5z"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6l8.5 7 8.5-7"/>',
 rss:'<path d="M5 19.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" fill="currentColor"/><path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14"/>',
 pen:'<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
 cap:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/>',
 book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3"/><path d="M20 4v14h-7"/>',
 id:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.3"/><path d="M5.5 16.5c.6-1.6 2-2.5 3.5-2.5s2.9.9 3.5 2.5M14.5 10h4M14.5 13.5h3"/>',
 code:'<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/>',
 data:'<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
 tv:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M9 3l3 3 3-3M10 10v4l3.5-2z"/>',
 cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'
};
const PGLYPH={web:"globe",li:"briefcase",x:"post",threads:"post",md:"post",bs:"cloud",yt:"video",tiktok:"phone",twitch:"tv",ig:"camera",fb:"people",reddit:"people",discord:"people",slack:"people",skool:"people",community:"people",events:"cal",
 substack:"mail",newsletter:"mail",rss:"rss",blog:"pen",medium:"pen",podcast:"mic",spotify:"mic",apple:"mic",
 scholar:"cap",openalex:"book",orcid:"id",researchgate:"book",academia:"book",semantic:"book",scopus:"book",wos:"book",inst:"id",ssrn:"book",arxiv:"book",edarxiv:"book",
 github:"code",gitlab:"code",hf:"code",kaggle:"code",zenodo:"data",osf:"data",figshare:"data"};
/* Platform simgeleri: kullanıcının sağladığı paket — Font Awesome Free 6.7.2 (CC BY 4.0) ve Academicons (SIL OFL 1.1) */
const ICONSET={"web":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M352 256c0 22.2-1.2 43.6-3.3 64l-185.3 0c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64l185.3 0c2.2 20.4 3.3 41.8 3.3 64zm28.8-64l123.1 0c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64l-123.1 0c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32l-116.7 0c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0l-176.6 0c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0L18.6 160C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192l123.1 0c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64L8.1 320C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6l176.6 0c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352l116.7 0zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6l116.7 0z\"/></svg>","li":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><path d=\"M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z\"/></svg>","x":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z\"/></svg>","bs":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2c42.1-31.6 110.3-56 110.3 21.8c0 15.5-8.9 130.5-14.1 149.2C478.2 298 412 314.6 353.1 304.5c102.9 17.5 129.1 75.5 72.5 133.5c-107.4 110.2-154.3-27.6-166.3-62.9l0 0c-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8l0 0c-12 35.3-59 173.1-166.3 62.9c-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1C10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z\"/></svg>","yt":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 576 512\"><path d=\"M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z\"/></svg>","scholar":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M390.9 298.5c0 0 0 .1 .1 .1c9.2 19.4 14.4 41.1 14.4 64C405.3 445.1 338.5 512 256 512s-149.3-66.9-149.3-149.3c0-22.9 5.2-44.6 14.4-64h0c1.7-3.6 3.6-7.2 5.6-10.7c4.4-7.6 9.4-14.7 15-21.3c27.4-32.6 68.5-53.3 114.4-53.3c33.6 0 64.6 11.1 89.6 29.9c9.1 6.9 17.4 14.7 24.8 23.5c5.6 6.6 10.6 13.8 15 21.3c2 3.4 3.8 7 5.5 10.5zm26.4-18.8c-30.1-58.4-91-98.4-161.3-98.4s-131.2 40-161.3 98.4L0 202.7 256 0 512 202.7l-94.7 77.1z\"/></svg>","orcid":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M294.75 188.19h-45.92V342h47.47c67.62 0 83.12-51.34 83.12-76.91 0-41.64-26.54-76.9-84.67-76.9zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm-80.79 360.76h-29.84v-207.5h29.84zm-14.92-231.14a19.57 19.57 0 1 1 19.57-19.57 19.64 19.64 0 0 1-19.57 19.57zM300 369h-81V161.26h80.6c76.73 0 110.44 54.83 110.44 103.85C410 318.39 368.38 369 300 369z\"/></svg>","openalex":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-label=\"OpenAlex\">\n  <circle cx=\"12\" cy=\"12\" r=\"8.5\"/>\n  <path d=\"M8 15V9h2.5c2.2 0 3.5 1.1 3.5 3s-1.3 3-3.5 3H8z\"/>\n  <path d=\"m14.5 15 3-6M15.3 12h1.4\"/>\n</svg>","researchgate":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><path d=\"M0 32v448h448V32H0zm262.2 334.4c-6.6 3-33.2 6-50-14.2-9.2-10.6-25.3-33.3-42.2-63.6-8.9 0-14.7 0-21.4-.6v46.4c0 23.5 6 21.2 25.8 23.9v8.1c-6.9-.3-23.1-.8-35.6-.8-13.1 0-26.1.6-33.6.8v-8.1c15.5-2.9 22-1.3 22-23.9V225c0-22.6-6.4-21-22-23.9V193c25.8 1 53.1-.6 70.9-.6 31.7 0 55.9 14.4 55.9 45.6 0 21.1-16.7 42.2-39.2 47.5 13.6 24.2 30 45.6 42.2 58.9 7.2 7.8 17.2 14.7 27.2 14.7v7.3zm22.9-135c-23.3 0-32.2-15.7-32.2-32.2V167c0-12.2 8.8-30.4 34-30.4s30.4 17.9 30.4 17.9l-10.7 7.2s-5.5-12.5-19.7-12.5c-7.9 0-19.7 7.3-19.7 19.7v26.8c0 13.4 6.6 23.3 17.9 23.3 14.1 0 21.5-10.9 21.5-26.8h-17.9v-10.7h30.4c0 20.5 4.7 49.9-34 49.9zm-116.5 44.7c-9.4 0-13.6-.3-20-.8v-69.7c6.4-.6 15-.6 22.5-.6 23.3 0 37.2 12.2 37.2 34.5 0 21.9-15 36.6-39.7 36.6z\"/></svg>","academia":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 384\" fill=\"currentColor\" role=\"img\">\n  <path d=\"M220 363Q256 361 264 348Q267 336 259 314Q255 305 248.0 287.5Q241 270 240 267Q217 266 170.5 266.0Q124 266 101 266Q85 306 78 326Q69 344 79 353Q85 358 114 363V384H0Q0 384 0 364Q26 357 30 345Q110 143 148 42Q145 35 139.5 21.0Q134 7 131 0H230Q257 67 307.5 191.5Q358 316 369 344Q373 359 400 363V384Q400 384 220 384Q220 384 220 363ZM115 230Q115 230 170 230Q170 230 225 230Q215 207 196.5 159.0Q178 111 169 88Q160 112 142.0 159.0Q124 206 115 230Z\"/>\n</svg>","semantic":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 496 362\" fill=\"currentColor\" role=\"img\">\n  <path d=\"M371 0Q390 43 404 127Q403 127 400 128Q397 121 397 121Q386 80 382 65Q379 57 369 51Q356 44 345 33Q337 26 329 26Q306 27 261.0 27.0Q216 27 196 27Q190 27 187.0 30.0Q184 33 162 56Q204 158 195 264Q187 259 183.5 256.0Q180 253 176.5 247.0Q173 241 172 233Q168 101 89 5Q89 5 86 0ZM41 33Q73 33 79 33Q84 33 86 37Q152 143 157 234Q157 234 156 237Q125 130 40 36Q40 35 40.5 34.0Q41 33 41 33ZM0 86Q39 85 49 84Q50 84 53 88Q107 147 127 198Q127 199 135 223Q111 186 79.5 155.0Q48 124 0 86ZM194 362Q112 230 102 215L103 214Q175 272 184.5 279.5Q194 287 203 279Q317 187 476 120Q478 119 492 114Q494 114 496 114Q395 173 322.0 230.0Q249 287 194 362Z\"/>\n</svg>","scopus":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 384 384\" fill=\"currentColor\" role=\"img\">\n  <path d=\"M0 0H384V384H0ZM117 100Q94 100 80.0 113.5Q66 127 66 147Q66 152 67.0 156.5Q68 161 69.5 164.0Q71 167 74.5 171.0Q78 175 79.5 177.0Q81 179 87.0 183.0Q93 187 94.0 188.0Q95 189 102.0 193.0Q109 197 110 198Q112 199 116.0 201.0Q120 203 122.0 204.5Q124 206 127.0 208.0Q130 210 132.0 211.5Q134 213 136.0 215.0Q138 217 139.5 219.5Q141 222 141.5 225.0Q142 228 142 231Q142 243 132.5 251.0Q123 259 110 259Q88 259 68 247L65 268Q85 277 111 277Q133 277 149.0 264.0Q165 251 165 228Q165 217 158.5 208.0Q152 199 145.5 194.5Q139 190 126 182Q124 181 122 180Q120 179 114.5 175.5Q109 172 106.5 170.5Q104 169 100.0 166.0Q96 163 94.0 160.5Q92 158 90.5 154.0Q89 150 89 145Q89 134 96.5 125.5Q104 117 118 117Q142 117 161 129L163 108Q143 100 117 100ZM279 100Q241 100 215.5 125.5Q190 151 190 189Q190 229 217.0 252.5Q244 276 278 276Q311 276 330 266L329 247Q307 259 280 259Q261 259 246.0 249.5Q231 240 222.5 223.5Q214 207 214 187Q214 156 232.0 136.5Q250 117 276 117Q307 117 329 129L330 110Q310 100 279 100Z\"/>\n</svg>","wos":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-label=\"Web of Science\">\n  <circle cx=\"12\" cy=\"12\" r=\"8.5\"/>\n  <path d=\"m7.5 9 2 6 2.5-6 2.5 6 2-6\"/>\n</svg>","inst":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M243.4 2.6l-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160l0 8c0 13.3 10.7 24 24 24l400 0c13.3 0 24-10.7 24-24l0-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8-3.4-17.2-3.4-25.2 0zM128 224l-64 0 0 196.3c-.6 .3-1.2 .7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512l448 0c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1L448 224l-64 0 0 192-40 0 0-192-64 0 0 192-48 0 0-192-64 0 0 192-40 0 0-192zM256 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64z\"/></svg>","ssrn":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 496 196\" fill=\"currentColor\" role=\"img\">\n  <path d=\"M64 0Q77 0 97 8Q99 9 100 9Q101 9 105 6Q106 5 106 5Q110 5 110 12Q110 13 114 39Q115 44 115 45Q115 49 112 49Q110 49 108 43Q103 28 88.0 18.5Q73 9 54 9Q44 9 36.5 13.0Q29 17 24.5 24.0Q20 31 20 40Q20 52 28 61Q33 67 39.5 70.0Q46 73 70 81Q120 97 120 135Q120 160 101.5 176.5Q83 193 55 193Q25 193 12 183Q9 180 7 170Q7 169 4 158Q0 146 0 140Q0 136 3 136Q5 136 6 139Q12 157 22 167Q38 183 62 183Q81 183 94.0 172.0Q107 161 107 145Q107 129 93 118Q86 113 59 104Q29 94 17 81Q4 68 4 49Q4 27 20.5 13.5Q37 0 64 0ZM172 0Q187 0 205 9Q208 9 208 9Q210 9 213 6Q214 6 215 6Q218 6 218 12Q218 14 222 40Q222 41 223 43Q223 45 223 46Q223 50 220 50Q218 50 216 44Q211 29 196.0 19.5Q181 10 163 10Q153 10 145.0 13.5Q137 17 132.5 24.5Q128 32 128 41Q128 52 136 61Q141 68 147.0 70.5Q153 73 179 82Q229 98 230 135Q230 160 211.5 176.5Q193 193 164 193Q135 193 121 183Q118 181 116 171Q120 165 123 157Q127 163 131 167Q147 183 171 183Q190 183 203.0 172.0Q216 161 216 145Q216 129 202 118Q197 114 168 105Q138 94 126 82Q115 71 113 55Q121 53 121 45Q121 43 121 41L119 27Q133 0 172 0ZM269 4Q299 4 314 15Q331 28 331 51Q331 81 297 98L335 153Q348 173 356.5 180.0Q365 187 376 187Q378 187 378 189Q377 194 359 194Q335 194 317 165L283 114Q283 114 281 111Q278 105 271 105H256Q251 105 249.5 106.0Q248 107 248 110V152V159Q247 174 252.5 180.0Q258 186 273 187Q277 189 278 190Q278 193 273 193Q272 193 265 192Q260 191 235 191Q223 191 216 192Q211 193 209 193Q206 193 206 190Q206 189 209 188Q218 185 221.5 181.5Q225 178 226 169Q236 154 236 135Q236 118 227 105V55V53Q230 50 230 46Q230 44 230 42L227 27Q226 19 225 12Q225 8 224 6H227Q234 6 248 5Q263 4 269 4ZM492 6Q496 6 496 9Q496 11 493 12Q484 14 481.5 20.5Q479 27 480 51L479 60V148Q479 178 479 186V188Q479 196 475 196Q473 196 468 191L354 60Q352 58 350 58Q348 58 348 64V156V161Q347 159 344.5 155.5Q342 152 340 150L337 145V64V58Q338 54 338 51Q338 24 318 10Q317 9 316 8Q314 7 313 7Q317 7 324 7H326Q328 7 331 7Q335 7 338 11L463 153Q466 156 467 156Q468 157 468 151V86Q469 52 467.0 39.0Q465 26 460.0 20.5Q455 15 441 13Q437 12 437.0 9.5Q437 7 441 7H447Q462 8 473 8Q480 8 485 7Q491 6 492 6ZM261 13Q252 13 249 18Q248 20 248 30V85Q248 92 249.0 93.5Q250 95 257 95H272Q290 95 300.5 85.0Q311 75 311 58Q311 37 295 25Q283 13 261 13Z\"/>\n</svg>","arxiv":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 393.333 384\" fill=\"currentColor\" role=\"img\">\n  <path d=\"M164.66666666666666 125.0Q168.66666666666666 133 168.66666666666666 144.5Q168.66666666666666 156 164.66666666666666 164.5Q160.66666666666666 173 155.16666666666666 173.0Q149.66666666666666 173 145.66666666666666 164.5Q141.66666666666666 156 141.66666666666666 144.5Q141.66666666666666 133 145.66666666666666 125.0Q149.66666666666666 117 155.16666666666666 117.0Q160.66666666666666 117 164.66666666666666 125.0ZM238.66666666666666 173Q234.66666666666666 173 231.66666666666666 169.0Q228.66666666666666 165 226.66666666666666 158.5Q224.66666666666666 152 224.66666666666666 144.5Q224.66666666666666 137 226.66666666666666 130.5Q228.66666666666666 124 231.66666666666666 120.5Q234.66666666666666 117 238.66666666666666 117Q243.66666666666666 117 247.66666666666666 125.0Q251.66666666666666 133 251.66666666666666 144.5Q251.66666666666666 156 247.66666666666666 164.5Q243.66666666666666 173 238.66666666666666 173ZM273.6666666666667 206Q273.6666666666667 211 276.1666666666667 215.0Q278.6666666666667 219 283.1666666666667 221.5Q287.6666666666667 224 292.6666666666667 224V238Q284.6666666666667 238 277.6666666666667 234Q269.6666666666667 248 247.66666666666669 257.0Q225.66666666666666 266 196.66666666666666 266.0Q167.66666666666666 266 145.66666666666666 257.0Q123.66666666666667 248 115.66666666666667 234Q108.66666666666667 238 100.66666666666667 238V224Q108.66666666666667 224 114.16666666666667 219.0Q119.66666666666667 214 119.66666666666667 206H133.66666666666666Q133.66666666666666 217 126.66666666666667 226Q129.66666666666666 232 138.66666666666666 238.0Q147.66666666666666 244 163.66666666666666 248.0Q179.66666666666666 252 196.66666666666666 252Q222.66666666666666 252 242.66666666666669 243.5Q262.6666666666667 235 266.6666666666667 226Q259.6666666666667 217 259.6666666666667 206ZM390.6666666666667 316Q394.6666666666667 325 392.6666666666667 334Q389.6666666666667 344 373.6666666666667 346Q369.6666666666667 347 368.6666666666667 348.0Q367.6666666666667 349 368.1666666666667 351.5Q368.6666666666667 354 368.6666666666667 356Q368.6666666666667 372 355.6666666666667 380Q348.6666666666667 384 333.6666666666667 384Q315.6666666666667 383 310.6666666666667 373Q308.6666666666667 366 314.6666666666667 356Q319.6666666666667 347 311.6666666666667 337Q310.6666666666667 337 286.6666666666667 311Q246.66666666666666 342 196.66666666666666 342.0Q146.66666666666666 342 106.66666666666667 311Q82.66666666666667 337 81.66666666666667 337Q73.66666666666667 347 79.66666666666667 356Q84.66666666666667 366 82.66666666666667 373Q77.66666666666667 383 59.66666666666667 384Q44.66666666666667 384 37.66666666666667 380Q24.666666666666668 372 24.666666666666668 356Q24.666666666666668 354 25.666666666666668 351Q25.666666666666668 348 22.666666666666668 347Q21.666666666666668 347 20.666666666666668 346Q3.666666666666668 344 0.6666666666666679 334Q-1.3333333333333321 325 2.666666666666668 316Q7.666666666666668 308 17.666666666666668 305Q27.666666666666668 301 41.66666666666667 307Q41.66666666666667 307 47.66666666666667 310Q55.66666666666667 314 61.66666666666667 308Q62.66666666666667 307 65.16666666666667 304.5Q67.66666666666667 302 72.66666666666667 297.0Q77.66666666666667 292 82.66666666666667 288Q46.66666666666667 246 46.66666666666667 192.0Q46.66666666666667 138 82.66666666666667 96Q77.66666666666667 92 72.66666666666667 87.0Q67.66666666666667 82 65.16666666666667 79.5Q62.66666666666667 77 61.66666666666667 76Q55.66666666666667 70 47.66666666666667 74Q47.66666666666667 74 45.66666666666667 75.0Q43.66666666666667 76 41.66666666666667 77Q27.666666666666668 83 17.666666666666668 79Q7.666666666666668 76 2.666666666666668 68Q-1.3333333333333321 59 0.6666666666666679 50Q3.666666666666668 40 20.666666666666668 38Q24.666666666666668 37 25.666666666666668 35Q25.666666666666668 35 25.666666666666668 33L24.666666666666668 28Q24.666666666666668 12 37.66666666666667 4Q44.66666666666667 0 59.66666666666667 0Q77.66666666666667 1 82.66666666666667 11Q84.66666666666667 18 79.66666666666667 28Q73.66666666666667 38 81.66666666666667 47Q82.66666666666667 47 106.66666666666667 73Q146.66666666666666 43 196.66666666666666 43.0Q246.66666666666666 43 286.6666666666667 73Q310.6666666666667 48 311.6666666666667 47Q319.6666666666667 37 313.6666666666667 28Q308.6666666666667 18 310.6666666666667 11Q315.6666666666667 1 333.6666666666667 0Q348.6666666666667 0 355.6666666666667 4Q368.6666666666667 12 368.6666666666667 28Q368.6666666666667 36 369.6666666666667 36.5Q370.6666666666667 37 372.6666666666667 38Q389.6666666666667 40 391.6666666666667 50Q394.6666666666667 59 390.6666666666667 68Q385.6666666666667 76 375.6666666666667 79Q365.6666666666667 83 351.6666666666667 77Q349.6666666666667 76 347.6666666666667 75L345.6666666666667 74Q337.6666666666667 70 331.6666666666667 76Q330.6666666666667 77 328.1666666666667 79.5Q325.6666666666667 82 320.1666666666667 87.0Q314.6666666666667 92 310.6666666666667 96Q346.6666666666667 138 346.6666666666667 192.0Q346.6666666666667 246 310.6666666666667 288Q315.6666666666667 292 320.6666666666667 297.0Q325.6666666666667 302 328.1666666666667 304.5Q330.6666666666667 307 331.6666666666667 308Q337.6666666666667 314 345.6666666666667 310Q351.6666666666667 307 351.6666666666667 307Q365.6666666666667 301 375.6666666666667 305Q385.6666666666667 308 390.6666666666667 316ZM196.66666666666666 52Q168.66666666666666 52 142.66666666666666 63.0Q116.66666666666667 74 97.66666666666667 93.0Q78.66666666666667 112 67.66666666666667 138.0Q56.66666666666667 164 56.66666666666667 192Q56.66666666666667 250 97.66666666666666 291.0Q138.66666666666666 332 196.66666666666666 332.0Q254.66666666666666 332 295.6666666666667 291.0Q336.6666666666667 250 336.6666666666667 192.0Q336.6666666666667 134 295.6666666666667 93.0Q254.66666666666666 52 196.66666666666666 52Z\"/>\n</svg>","edarxiv":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 393.333 384\" fill=\"currentColor\" role=\"img\">\n  <path d=\"M164.66666666666666 125.0Q168.66666666666666 133 168.66666666666666 144.5Q168.66666666666666 156 164.66666666666666 164.5Q160.66666666666666 173 155.16666666666666 173.0Q149.66666666666666 173 145.66666666666666 164.5Q141.66666666666666 156 141.66666666666666 144.5Q141.66666666666666 133 145.66666666666666 125.0Q149.66666666666666 117 155.16666666666666 117.0Q160.66666666666666 117 164.66666666666666 125.0ZM238.66666666666666 173Q234.66666666666666 173 231.66666666666666 169.0Q228.66666666666666 165 226.66666666666666 158.5Q224.66666666666666 152 224.66666666666666 144.5Q224.66666666666666 137 226.66666666666666 130.5Q228.66666666666666 124 231.66666666666666 120.5Q234.66666666666666 117 238.66666666666666 117Q243.66666666666666 117 247.66666666666666 125.0Q251.66666666666666 133 251.66666666666666 144.5Q251.66666666666666 156 247.66666666666666 164.5Q243.66666666666666 173 238.66666666666666 173ZM273.6666666666667 206Q273.6666666666667 211 276.1666666666667 215.0Q278.6666666666667 219 283.1666666666667 221.5Q287.6666666666667 224 292.6666666666667 224V238Q284.6666666666667 238 277.6666666666667 234Q269.6666666666667 248 247.66666666666669 257.0Q225.66666666666666 266 196.66666666666666 266.0Q167.66666666666666 266 145.66666666666666 257.0Q123.66666666666667 248 115.66666666666667 234Q108.66666666666667 238 100.66666666666667 238V224Q108.66666666666667 224 114.16666666666667 219.0Q119.66666666666667 214 119.66666666666667 206H133.66666666666666Q133.66666666666666 217 126.66666666666667 226Q129.66666666666666 232 138.66666666666666 238.0Q147.66666666666666 244 163.66666666666666 248.0Q179.66666666666666 252 196.66666666666666 252Q222.66666666666666 252 242.66666666666669 243.5Q262.6666666666667 235 266.6666666666667 226Q259.6666666666667 217 259.6666666666667 206ZM390.6666666666667 316Q394.6666666666667 325 392.6666666666667 334Q389.6666666666667 344 373.6666666666667 346Q369.6666666666667 347 368.6666666666667 348.0Q367.6666666666667 349 368.1666666666667 351.5Q368.6666666666667 354 368.6666666666667 356Q368.6666666666667 372 355.6666666666667 380Q348.6666666666667 384 333.6666666666667 384Q315.6666666666667 383 310.6666666666667 373Q308.6666666666667 366 314.6666666666667 356Q319.6666666666667 347 311.6666666666667 337Q310.6666666666667 337 286.6666666666667 311Q246.66666666666666 342 196.66666666666666 342.0Q146.66666666666666 342 106.66666666666667 311Q82.66666666666667 337 81.66666666666667 337Q73.66666666666667 347 79.66666666666667 356Q84.66666666666667 366 82.66666666666667 373Q77.66666666666667 383 59.66666666666667 384Q44.66666666666667 384 37.66666666666667 380Q24.666666666666668 372 24.666666666666668 356Q24.666666666666668 354 25.666666666666668 351Q25.666666666666668 348 22.666666666666668 347Q21.666666666666668 347 20.666666666666668 346Q3.666666666666668 344 0.6666666666666679 334Q-1.3333333333333321 325 2.666666666666668 316Q7.666666666666668 308 17.666666666666668 305Q27.666666666666668 301 41.66666666666667 307Q41.66666666666667 307 47.66666666666667 310Q55.66666666666667 314 61.66666666666667 308Q62.66666666666667 307 65.16666666666667 304.5Q67.66666666666667 302 72.66666666666667 297.0Q77.66666666666667 292 82.66666666666667 288Q46.66666666666667 246 46.66666666666667 192.0Q46.66666666666667 138 82.66666666666667 96Q77.66666666666667 92 72.66666666666667 87.0Q67.66666666666667 82 65.16666666666667 79.5Q62.66666666666667 77 61.66666666666667 76Q55.66666666666667 70 47.66666666666667 74Q47.66666666666667 74 45.66666666666667 75.0Q43.66666666666667 76 41.66666666666667 77Q27.666666666666668 83 17.666666666666668 79Q7.666666666666668 76 2.666666666666668 68Q-1.3333333333333321 59 0.6666666666666679 50Q3.666666666666668 40 20.666666666666668 38Q24.666666666666668 37 25.666666666666668 35Q25.666666666666668 35 25.666666666666668 33L24.666666666666668 28Q24.666666666666668 12 37.66666666666667 4Q44.66666666666667 0 59.66666666666667 0Q77.66666666666667 1 82.66666666666667 11Q84.66666666666667 18 79.66666666666667 28Q73.66666666666667 38 81.66666666666667 47Q82.66666666666667 47 106.66666666666667 73Q146.66666666666666 43 196.66666666666666 43.0Q246.66666666666666 43 286.6666666666667 73Q310.6666666666667 48 311.6666666666667 47Q319.6666666666667 37 313.6666666666667 28Q308.6666666666667 18 310.6666666666667 11Q315.6666666666667 1 333.6666666666667 0Q348.6666666666667 0 355.6666666666667 4Q368.6666666666667 12 368.6666666666667 28Q368.6666666666667 36 369.6666666666667 36.5Q370.6666666666667 37 372.6666666666667 38Q389.6666666666667 40 391.6666666666667 50Q394.6666666666667 59 390.6666666666667 68Q385.6666666666667 76 375.6666666666667 79Q365.6666666666667 83 351.6666666666667 77Q349.6666666666667 76 347.6666666666667 75L345.6666666666667 74Q337.6666666666667 70 331.6666666666667 76Q330.6666666666667 77 328.1666666666667 79.5Q325.6666666666667 82 320.1666666666667 87.0Q314.6666666666667 92 310.6666666666667 96Q346.6666666666667 138 346.6666666666667 192.0Q346.6666666666667 246 310.6666666666667 288Q315.6666666666667 292 320.6666666666667 297.0Q325.6666666666667 302 328.1666666666667 304.5Q330.6666666666667 307 331.6666666666667 308Q337.6666666666667 314 345.6666666666667 310Q351.6666666666667 307 351.6666666666667 307Q365.6666666666667 301 375.6666666666667 305Q385.6666666666667 308 390.6666666666667 316ZM196.66666666666666 52Q168.66666666666666 52 142.66666666666666 63.0Q116.66666666666667 74 97.66666666666667 93.0Q78.66666666666667 112 67.66666666666667 138.0Q56.66666666666667 164 56.66666666666667 192Q56.66666666666667 250 97.66666666666666 291.0Q138.66666666666666 332 196.66666666666666 332.0Q254.66666666666666 332 295.6666666666667 291.0Q336.6666666666667 250 336.6666666666667 192.0Q336.6666666666667 134 295.6666666666667 93.0Q254.66666666666666 52 196.66666666666666 52Z\"/>\n</svg>","substack":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-label=\"Substack\">\n  <path d=\"M5 5h14\"/>\n  <path d=\"M5 8.5h14\"/>\n  <path d=\"M6.5 12h11v8l-5.5-3-5.5 3z\"/>\n</svg>","newsletter":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z\"/></svg>","blog":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 384 512\"><path d=\"M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z\"/></svg>","rss":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><path d=\"M0 64C0 46.3 14.3 32 32 32c229.8 0 416 186.2 416 416c0 17.7-14.3 32-32 32s-32-14.3-32-32C384 253.6 226.4 96 32 96C14.3 96 0 81.7 0 64zM0 416a64 64 0 1 1 128 0A64 64 0 1 1 0 416zM32 160c159.1 0 288 128.9 288 288c0 17.7-14.3 32-32 32s-32-14.3-32-32c0-123.7-100.3-224-224-224c-17.7 0-32-14.3-32-32s14.3-32 32-32z\"/></svg>","medium":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 512\"><path d=\"M180.5,74.262C80.813,74.262,0,155.633,0,256S80.819,437.738,180.5,437.738,361,356.373,361,256,280.191,74.262,180.5,74.262Zm288.25,10.646c-49.845,0-90.245,76.619-90.245,171.095s40.406,171.1,90.251,171.1,90.251-76.619,90.251-171.1H559C559,161.5,518.6,84.908,468.752,84.908Zm139.506,17.821c-17.526,0-31.735,68.628-31.735,153.274s14.2,153.274,31.735,153.274S640,340.631,640,256C640,171.351,625.785,102.729,608.258,102.729Z\"/></svg>","podcast":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><path d=\"M319.4 372c48.5-31.3 80.6-85.9 80.6-148c0-97.2-78.8-176-176-176S48 126.8 48 224c0 62.1 32.1 116.6 80.6 148c1.2 17.3 4 38 7.2 57.1l.2 1C56 395.8 0 316.5 0 224C0 100.3 100.3 0 224 0S448 100.3 448 224c0 92.5-56 171.9-136 206.1l.2-1.1c3.1-19.2 6-39.8 7.2-57zm-2.3-38.1c-1.6-5.7-3.9-11.1-7-16.2c-5.8-9.7-13.5-17-21.9-22.4c19.5-17.6 31.8-43 31.8-71.3c0-53-43-96-96-96s-96 43-96 96c0 28.3 12.3 53.8 31.8 71.3c-8.4 5.4-16.1 12.7-21.9 22.4c-3.1 5.1-5.4 10.5-7 16.2C99.8 307.5 80 268 80 224c0-79.5 64.5-144 144-144s144 64.5 144 144c0 44-19.8 83.5-50.9 109.9zM224 312c32.9 0 64 8.6 64 43.8c0 33-12.9 104.1-20.6 132.9c-5.1 19-24.5 23.4-43.4 23.4s-38.2-4.4-43.4-23.4c-7.8-28.5-20.6-99.7-20.6-132.8c0-35.1 31.1-43.8 64-43.8zm0-144a56 56 0 1 1 0 112 56 56 0 1 1 0-112z\"/></svg>","spotify":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 496 512\"><path d=\"M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z\"/></svg>","apple":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><path d=\"M319.4 372c48.5-31.3 80.6-85.9 80.6-148c0-97.2-78.8-176-176-176S48 126.8 48 224c0 62.1 32.1 116.6 80.6 148c1.2 17.3 4 38 7.2 57.1l.2 1C56 395.8 0 316.5 0 224C0 100.3 100.3 0 224 0S448 100.3 448 224c0 92.5-56 171.9-136 206.1l.2-1.1c3.1-19.2 6-39.8 7.2-57zm-2.3-38.1c-1.6-5.7-3.9-11.1-7-16.2c-5.8-9.7-13.5-17-21.9-22.4c19.5-17.6 31.8-43 31.8-71.3c0-53-43-96-96-96s-96 43-96 96c0 28.3 12.3 53.8 31.8 71.3c-8.4 5.4-16.1 12.7-21.9 22.4c-3.1 5.1-5.4 10.5-7 16.2C99.8 307.5 80 268 80 224c0-79.5 64.5-144 144-144s144 64.5 144 144c0 44-19.8 83.5-50.9 109.9zM224 312c32.9 0 64 8.6 64 43.8c0 33-12.9 104.1-20.6 132.9c-5.1 19-24.5 23.4-43.4 23.4s-38.2-4.4-43.4-23.4c-7.8-28.5-20.6-99.7-20.6-132.8c0-35.1 31.1-43.8 64-43.8zm0-144a56 56 0 1 1 0 112 56 56 0 1 1 0-112z\"/></svg>","github":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 496 512\"><path d=\"M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z\"/></svg>","hf":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" role=\"img\" aria-label=\"Hugging Face\">\n  <circle cx=\"12\" cy=\"11\" r=\"5.5\"/>\n  <path d=\"M9.7 10h.01M14.3 10h.01\"/>\n  <path d=\"M9.7 12.8c1.4 1.4 3.2 1.4 4.6 0\"/>\n  <path d=\"M6.8 12.5 3.4 15.2M17.2 12.5l3.4 2.7\"/>\n  <path d=\"M3.4 15.2 2 13.8M3.4 15.2 2 16.8M20.6 15.2 22 13.8M20.6 15.2 22 16.8\"/>\n</svg>","gitlab":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M503.5 204.6L502.8 202.8L433.1 21.02C431.7 17.45 429.2 14.43 425.9 12.38C423.5 10.83 420.8 9.865 417.9 9.57C415 9.275 412.2 9.653 409.5 10.68C406.8 11.7 404.4 13.34 402.4 15.46C400.5 17.58 399.1 20.13 398.3 22.9L351.3 166.9H160.8L113.7 22.9C112.9 20.13 111.5 17.59 109.6 15.47C107.6 13.35 105.2 11.72 102.5 10.7C99.86 9.675 96.98 9.295 94.12 9.587C91.26 9.878 88.51 10.83 86.08 12.38C82.84 14.43 80.33 17.45 78.92 21.02L9.267 202.8L8.543 204.6C-1.484 230.8-2.72 259.6 5.023 286.6C12.77 313.5 29.07 337.3 51.47 354.2L51.74 354.4L52.33 354.8L158.3 434.3L210.9 474L242.9 498.2C246.6 500.1 251.2 502.5 255.9 502.5C260.6 502.5 265.2 500.1 268.9 498.2L300.9 474L353.5 434.3L460.2 354.4L460.5 354.1C482.9 337.2 499.2 313.5 506.1 286.6C514.7 259.6 513.5 230.8 503.5 204.6z\"/></svg>","zenodo":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 232\" fill=\"currentColor\" role=\"img\">\n  <path d=\"M0 0H640V232H0ZM452 29Q449 29 447 31Q444 33 444 37V68Q440 64 434.0 62.0Q428 60 422 60Q414 60 407.0 63.0Q400 66 395.0 71.5Q390 77 387 84Q387 84 386 85Q386 84 386 84Q383 77 377.5 71.5Q372 66 365.0 63.0Q358 60 351 60Q343 60 336.0 63.0Q329 66 323.5 71.5Q318 77 315 84Q315 85 315.0 85.0Q315 85 315.0 84.5Q315 84 314 84Q311 77 306.0 71.5Q301 66 294.0 63.0Q287 60 279 60Q271 60 264.0 63.0Q257 66 252.0 71.5Q247 77 244 84Q243 84 243 85Q243 84 243 84Q240 77 234.5 71.5Q229 66 222.5 63.0Q216 60 208 60Q200 60 193 63Q186 66 181 71V69Q181 61 173 61H116Q107 61 107.0 69.5Q107 78 116 78H161L108 149Q106 151 106 154V159Q106 168 114 168H176Q183 168 184 160Q188 163 193 165Q200 168 208 168Q220 168 229 162Q236 157 241 149V160Q241 164 243.0 166.0Q245 168 249 168Q252 168 254.5 166.0Q257 164 257 160V131H237Q234 131 232.0 132.5Q230 134 229 137L228 139Q225 145 219.5 148.5Q214 152 208 152Q203 152 199.0 150.5Q195 149 192.0 146.0Q189 143 187.0 139.0Q185 135 185 130V123H237H241H257V99Q257 94 258.5 90.0Q260 86 263.0 83.0Q266 80 270.0 78.0Q274 76 279.0 76.0Q284 76 288.0 78.0Q292 80 295.0 83.0Q298 86 299.5 90.0Q301 94 301 99V160Q301 164 304 166Q307 168 309 168Q313 168 315.5 166.0Q318 164 318 160V149Q320 154 324 157Q329 162 336.0 165.0Q343 168 351.0 168.0Q359 168 365.5 165.0Q372 162 377.5 157.0Q383 152 386 145Q386 145 386 144Q386 144 387 145Q390 152 395.0 157.0Q400 162 407.0 165.0Q414 168 422 168Q430 168 437.0 165.0Q444 162 449.0 157.0Q454 152 457 145Q458 145 458 144Q458 145 458 145Q461 152 466.5 157.0Q472 162 479.0 165.0Q486 168 493.5 168.0Q501 168 508.0 165.0Q515 162 520.5 157.0Q526 152 529.0 145.0Q532 138 532 130V99Q532 91 529.0 84.0Q526 77 520.5 71.5Q515 66 508.0 63.0Q501 60 494 60Q486 60 479 63Q475 65 472 67Q469 69 466 71Q465 73 463.5 75.0Q462 77 460 79Q458 83 457 87Q457 76 460 71V37Q460 33 458 31Q455 29 452 29ZM208 76Q212 76 216.0 78.0Q220 80 223.0 83.0Q226 86 228.0 90.0Q230 94 230 99V107H185V99Q185 94 187.0 90.0Q189 86 192.0 83.0Q195 80 199.0 78.0Q203 76 208 76ZM351 76Q355 76 359.0 78.0Q363 80 366.0 83.0Q369 86 371.0 90.0Q373 94 373 99V130Q373 135 371.5 139.0Q370 143 366.5 146.0Q363 149 359.0 150.5Q355 152 351 152Q346 152 342.0 150.5Q338 149 335.0 146.0Q332 143 330.0 139.0Q328 135 328 130V99Q328 94 330.0 90.0Q332 86 335.0 83.0Q338 80 342.0 78.0Q346 76 351 76ZM422 76Q427 76 431.0 78.0Q435 80 438.0 83.0Q441 86 442.5 90.0Q444 94 444 99V130Q444 135 442.5 139.0Q441 143 438.0 146.0Q435 149 431.0 150.5Q427 152 422 152Q417 152 413.0 150.5Q409 149 406.0 146.0Q403 143 401.5 139.0Q400 135 400 130V99Q400 94 401.5 90.0Q403 86 406.0 83.0Q409 80 413.5 78.0Q418 76 422 76ZM494 76Q498 76 502.0 78.0Q506 80 509.0 83.0Q512 86 514.0 90.0Q516 94 516 99V130Q516 135 514.0 139.0Q512 143 509.0 146.0Q506 149 502.0 150.5Q498 152 494 152Q489 152 485.0 150.5Q481 149 478.0 146.0Q475 143 473.0 139.0Q471 135 471 130V99Q471 94 473.0 90.0Q475 86 478.0 83.0Q481 80 485.0 78.0Q489 76 494 76ZM170 93Q169 96 169 99V130Q169 138 172 145Q174 148 176 151H127Z\"/>\n</svg>","osf":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 496 496\" fill=\"currentColor\" role=\"img\">\n  <path d=\"M310 62.0Q310 93.0 285 112.0Q285 96.0 274.0 85.5Q263 75.0 248.0 75.0Q233 75.0 222.0 85.5Q211 96.0 211 112.0Q186 93.0 186 62.0Q186 36.0 204.0 18.0Q222 0.0 248.0 0.0Q274 0.0 292.0 18.0Q310 36.0 310 62.0ZM285 384.0Q310 403.0 310 434.0Q310 460.0 292.0 478.0Q274 496.0 248.0 496.0Q222 496.0 204.0 478.0Q186 460.0 186 434.0Q186 403.0 211 384.0Q211 394.0 216.0 402.5Q221 411.0 229.5 416.0Q238 421.0 248 421.0Q263 421.0 274.0 410.5Q285 400.0 285 384.0ZM434 186.0Q460 186.0 478.0 204.0Q496 222.0 496.0 248.0Q496 274.0 478.0 292.0Q460 310.0 434 310.0Q403 310.0 384 285.0Q400 285.0 410.5 274.0Q421 263.0 421.0 248.0Q421 233.0 410.5 222.0Q400 211.0 384 211.0Q403 186.0 434 186.0ZM112 285.0Q93 310.0 62 310.0Q45 310.0 31.0 302.0Q17 294.0 8.5 279.5Q0 265.0 0 248.0Q0 222.0 18.0 204.0Q36 186.0 62 186.0Q93 186.0 112 211.0Q96 211.0 85.5 222.0Q75 233.0 75.0 248.0Q75 263.0 85.5 274.0Q96 285.0 112 285.0ZM423 161.0Q402 182.0 371 178.0Q360 189.0 344.5 189.0Q329 189.0 318.0 178.0Q307 167.0 307.0 151.5Q307 136.0 318 125.0Q314 94.0 335 73.0Q347 61.0 363.0 56.5Q379 52.0 395.0 56.5Q411 61.0 423.0 73.0Q435 85.0 439.5 101.0Q444 117.0 439.5 133.0Q435 149.0 423 161.0ZM178 371.0Q182 402.0 161 423.0Q142 442.0 116.5 442.0Q91 442.0 72.5 423.5Q54 405.0 54.0 379.5Q54 354.0 73 335.0Q94 314.0 125 318.0Q136 307.0 151.5 307.0Q167 307.0 178.0 318.0Q189 329.0 189.0 344.5Q189 360.0 178 371.0ZM178 125.0Q189 136.0 189.0 151.5Q189 167.0 178.0 178.0Q167 189.0 151.5 189.0Q136 189.0 125 178.0Q94 182.0 73 161.0Q54 142.0 54.0 116.5Q54 91.0 73 73.0Q82 64.0 93.5 59.0Q105 54.0 116.5 54.0Q128 54.0 140.0 59.0Q152 64.0 161 73.0Q182 94.0 178 125.0ZM423 335.0Q442 354.0 442.0 379.5Q442 405.0 423.5 423.5Q405 442.0 379.5 442.0Q354 442.0 335 423.0Q314 402.0 318 371.0Q311 363.0 308.0 353.5Q305 344.0 308.0 334.5Q311 325.0 318 318.0Q329 307.0 344.5 307.0Q360 307.0 371 318.0Q402 314.0 423 335.0Z\"/>\n</svg>","figshare":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 496 496\" fill=\"currentColor\" role=\"img\">\n  <path d=\"M114.0 85.0Q106.0 85.0 99.5 78.5Q93.0 72.0 93.0 63.5Q93.0 55.0 99.5 49.0Q106.0 43.0 114.0 43.0Q123.0 43.0 129.0 49.0Q135.0 55.0 135.0 64.0Q135.0 73.0 129.0 79.0Q123.0 85.0 114.0 85.0ZM485.0 318.0Q485.0 327.0 478.5 333.0Q472.0 339.0 463.5 339.0Q455.0 339.0 449.0 333.0Q443.0 327.0 443.0 318.0Q443.0 310.0 449.0 303.5Q455.0 297.0 464.0 297.0Q473.0 297.0 479.0 303.0Q485.0 309.0 485.0 318.0ZM360.0 64.0Q360.0 59.0 363.0 54.0Q366.0 49.0 371.0 46.0Q376.0 43.0 381.0 43.0Q387.0 43.0 392.0 45.5Q397.0 48.0 399.5 53.0Q402.0 58.0 402.0 64.0Q402.0 73.0 396.0 79.0Q390.0 85.0 381.5 85.0Q373.0 85.0 366.5 79.0Q360.0 73.0 360.0 64.0ZM248.0 454.0Q257.0 454.0 263.0 460.0Q269.0 466.0 269.0 475.0Q269.0 484.0 262.5 490.0Q256.0 496.0 247.5 496.0Q239.0 496.0 233.0 489.5Q227.0 483.0 227.0 475.0Q227.0 467.0 233.0 460.5Q239.0 454.0 248.0 454.0ZM318.0 443.0Q327.0 443.0 333.0 449.0Q339.0 455.0 339.0 463.5Q339.0 472.0 333.0 478.5Q327.0 485.0 318.0 485.0Q310.0 485.0 303.5 478.5Q297.0 472.0 297.0 464.0Q297.0 458.0 300.0 453.5Q303.0 449.0 307.5 446.0Q312.0 443.0 318.0 443.0ZM475.0 227.0Q481.0 227.0 486.0 230.0Q491.0 233.0 493.5 237.5Q496.0 242.0 496.0 247.5Q496.0 253.0 493.0 258.0Q490.0 263.0 485.5 266.0Q481.0 269.0 475.0 269.0Q467.0 269.0 460.5 262.5Q454.0 256.0 454.0 247.5Q454.0 239.0 460.5 233.0Q467.0 227.0 475.0 227.0ZM64.0 361.0Q70.0 361.0 74.5 363.5Q79.0 366.0 82.0 371.0Q85.0 376.0 85.0 381.0Q85.0 390.0 79.0 396.0Q73.0 402.0 64.0 402.0Q56.0 402.0 49.5 396.0Q43.0 390.0 43.0 381.0Q43.0 372.0 49.0 366.0Q55.0 360.0 64.0 361.0ZM78.5 129.5Q72.0 136.0 63.5 135.5Q55.0 135.0 49.0 129.0Q43.0 123.0 43.0 114.0Q43.0 105.0 49.0 99.5Q55.0 94.0 64.0 94.0Q73.0 94.0 79.0 100.0Q85.0 106.0 85.0 114.5Q85.0 123.0 78.5 129.5ZM318.0 53.0Q313.0 53.0 308.0 50.0Q303.0 47.0 300.0 42.5Q297.0 38.0 297.0 32.5Q297.0 27.0 300.0 22.0Q303.0 17.0 307.5 14.0Q312.0 11.0 318.0 11.0Q323.0 11.0 328.0 13.5Q333.0 16.0 336.0 21.0Q339.0 26.0 339.0 32.0Q339.0 36.0 337.5 40.0Q336.0 44.0 333.0 47.0Q330.0 50.0 326.0 51.5Q322.0 53.0 318.0 53.0ZM11.0 318.0Q11.0 309.0 17.0 303.0Q23.0 297.0 32.0 297.0Q41.0 297.0 47.0 303.5Q53.0 310.0 53.0 318.5Q53.0 327.0 46.5 333.0Q40.0 339.0 31.5 339.0Q23.0 339.0 17.0 332.5Q11.0 326.0 11.0 318.0ZM446.5 129.0Q440.0 135.0 431.5 135.0Q423.0 135.0 417.0 129.0Q411.0 123.0 411.0 114.5Q411.0 106.0 417.0 100.0Q423.0 94.0 432.0 94.0Q441.0 94.0 447.0 100.0Q453.0 106.0 453.0 114.5Q453.0 123.0 446.5 129.0ZM41.0 248.0Q41.0 252.0 39.5 256.0Q38.0 260.0 35.5 262.5Q33.0 265.0 29.0 267.0Q25.0 269.0 21.0 269.0Q12.0 269.0 6.0 263.0Q0.0 257.0 0.0 248.0Q0.0 239.0 6.0 233.0Q12.0 227.0 20.5 227.0Q29.0 227.0 35.0 233.0Q41.0 239.0 41.0 248.0ZM262.5 36.0Q256.0 42.0 247.5 42.0Q239.0 42.0 233.0 35.5Q227.0 29.0 227.0 20.5Q227.0 12.0 233.5 6.0Q240.0 0.0 248.5 0.0Q257.0 0.0 263.0 6.0Q269.0 12.0 269.0 21.0Q269.0 30.0 262.5 36.0ZM432.0 361.0Q437.0 361.0 442.0 363.5Q447.0 366.0 450.0 370.5Q453.0 375.0 453.0 381.0Q453.0 390.0 446.5 396.0Q440.0 402.0 432.0 402.0Q424.0 402.0 417.5 396.0Q411.0 390.0 411.0 381.5Q411.0 373.0 417.0 367.0Q423.0 361.0 432.0 361.0ZM449.0 192.0Q443.0 186.0 443.0 177.5Q443.0 169.0 449.5 163.0Q456.0 157.0 464.5 157.0Q473.0 157.0 479.0 163.0Q485.0 169.0 485.0 177.5Q485.0 186.0 478.5 192.5Q472.0 199.0 463.5 198.5Q455.0 198.0 449.0 192.0ZM11.0 178.0Q11.0 172.0 14.0 167.0Q17.0 162.0 21.5 159.5Q26.0 157.0 32.0 157.0Q40.0 157.0 46.0 163.0Q52.0 169.0 52.0 177.5Q52.0 186.0 46.5 192.5Q41.0 199.0 32.0 199.0Q23.0 199.0 17.0 192.5Q11.0 186.0 11.0 178.0ZM178.0 53.0Q172.0 53.0 167.5 50.0Q163.0 47.0 160.0 42.5Q157.0 38.0 157.0 32.0Q157.0 23.0 163.0 17.0Q169.0 11.0 177.5 11.0Q186.0 11.0 192.0 17.0Q198.0 23.0 198.0 31.5Q198.0 40.0 192.0 46.5Q186.0 53.0 178.0 53.0ZM135.0 431.0Q135.0 437.0 132.5 442.0Q130.0 447.0 125.0 449.5Q120.0 452.0 114.5 452.0Q109.0 452.0 104.0 449.5Q99.0 447.0 96.5 442.0Q94.0 437.0 93.0 432.0Q93.0 423.0 99.5 417.0Q106.0 411.0 114.5 411.0Q123.0 411.0 129.0 417.0Q135.0 423.0 135.0 431.0ZM367.0 417.0Q373.0 411.0 381.5 411.0Q390.0 411.0 396.0 417.0Q402.0 423.0 402.0 431.5Q402.0 440.0 396.0 446.0Q390.0 452.0 381.5 452.0Q373.0 452.0 367.0 446.0Q361.0 440.0 361.0 431.5Q361.0 423.0 367.0 417.0ZM163.0 449.0Q169.0 443.0 178.0 443.0Q187.0 443.0 193.0 449.0Q199.0 455.0 198.5 464.0Q198.0 473.0 192.0 479.0Q186.0 485.0 177.5 484.5Q169.0 484.0 163.0 478.0Q157.0 472.0 157.0 463.5Q157.0 455.0 163.0 449.0ZM353.0 77.0Q353.0 84.0 347.5 89.5Q342.0 95.0 335.0 95.0Q328.0 95.0 322.5 90.0Q317.0 85.0 317.0 77.5Q317.0 70.0 322.5 64.5Q328.0 59.0 335.0 59.0Q342.0 59.0 347.5 64.5Q353.0 70.0 353.0 77.0ZM64.5 322.0Q69.0 317.0 77.0 317.0Q85.0 317.0 90.0 322.0Q95.0 327.0 95.0 334.5Q95.0 342.0 89.5 347.5Q84.0 353.0 77.0 352.5Q70.0 352.0 65.0 347.0Q60.0 342.0 60.0 334.5Q60.0 327.0 64.5 322.0ZM130.0 112.0Q130.0 120.0 125.0 125.0Q120.0 130.0 112.5 130.0Q105.0 130.0 99.5 124.5Q94.0 119.0 94.0 112.0Q95.0 107.0 97.0 103.0Q99.0 99.0 103.5 97.0Q108.0 95.0 112.5 95.0Q117.0 95.0 121.0 97.0Q125.0 99.0 127.5 103.5Q130.0 108.0 130.0 112.0ZM425.0 205.5Q430.0 200.0 437.5 200.0Q445.0 200.0 450.0 205.5Q455.0 211.0 455.0 218.0Q455.0 225.0 449.5 230.5Q444.0 236.0 437.0 236.0Q430.0 236.0 425.0 230.5Q420.0 225.0 420.0 218.0Q420.0 211.0 425.0 205.5ZM125.0 395.5Q120.0 401.0 112.5 401.0Q105.0 401.0 100.0 395.5Q95.0 390.0 95.0 383.0Q95.0 376.0 100.0 371.0Q105.0 366.0 112.5 366.0Q120.0 366.0 125.0 371.0Q130.0 376.0 130.0 383.0Q130.0 390.0 125.0 395.5ZM437.0 295.0Q433.0 295.0 428.5 293.0Q424.0 291.0 422.0 287.0Q420.0 283.0 419.0 278.0Q419.0 271.0 424.5 265.5Q430.0 260.0 438.0 260.0Q441.0 260.0 444.5 261.5Q448.0 263.0 450.0 265.5Q452.0 268.0 453.5 271.0Q455.0 274.0 455.0 278.0Q455.0 285.0 450.0 290.0Q445.0 295.0 437.0 295.0ZM278.0 419.0Q285.0 419.0 290.5 424.5Q296.0 430.0 296.0 437.5Q296.0 445.0 290.5 450.0Q285.0 455.0 277.5 455.0Q270.0 455.0 265.0 449.5Q260.0 444.0 260.0 437.0Q260.0 434.0 261.0 431.5Q262.0 429.0 263.5 426.5Q265.0 424.0 267.5 422.5Q270.0 421.0 272.5 420.0Q275.0 419.0 278.0 419.0ZM265.5 71.0Q260.0 66.0 260.0 58.5Q260.0 51.0 265.5 46.0Q271.0 41.0 278.0 41.0Q285.0 41.0 290.5 46.5Q296.0 52.0 296.0 59.0Q296.0 66.0 290.5 71.0Q285.0 76.0 278.0 76.0Q271.0 76.0 265.5 71.0ZM65.0 173.5Q60.0 168.0 59.5 161.0Q59.0 154.0 64.5 148.5Q70.0 143.0 77.0 143.0Q84.0 143.0 89.5 148.0Q95.0 153.0 95.0 160.5Q95.0 168.0 90.0 173.0Q85.0 178.0 77.5 178.5Q70.0 179.0 65.0 173.5ZM436.0 334.0Q437.0 339.0 434.5 343.0Q432.0 347.0 428.0 349.5Q424.0 352.0 419.0 352.0Q412.0 352.0 406.5 347.0Q401.0 342.0 401.0 335.0Q401.0 328.0 406.5 322.5Q412.0 317.0 419.0 317.0Q426.0 317.0 431.0 322.0Q436.0 327.0 436.0 334.0ZM76.0 218.0Q76.0 225.0 71.0 230.5Q66.0 236.0 58.5 235.5Q51.0 235.0 46.0 230.0Q41.0 225.0 41.0 218.0Q41.0 210.0 46.0 205.0Q51.0 200.0 58.0 200.0Q62.0 200.0 65.0 201.5Q68.0 203.0 70.5 205.5Q73.0 208.0 74.5 211.0Q76.0 214.0 76.0 218.0ZM322.0 406.5Q327.0 401.0 334.5 401.0Q342.0 401.0 347.5 406.0Q353.0 411.0 353.0 418.5Q353.0 426.0 348.0 431.0Q343.0 436.0 335.5 436.0Q328.0 436.0 322.5 431.0Q317.0 426.0 317.0 419.0Q317.0 412.0 322.0 406.5ZM218.0 76.0Q213.0 76.0 209.0 73.5Q205.0 71.0 202.5 67.0Q200.0 63.0 201.0 58.0Q201.0 51.0 206.0 46.0Q211.0 41.0 218.0 41.0Q225.0 41.0 230.0 46.0Q235.0 51.0 235.0 58.5Q235.0 66.0 230.0 71.0Q225.0 76.0 218.0 76.0ZM419.0 143.0Q424.0 143.0 428.0 145.5Q432.0 148.0 434.0 152.0Q436.0 156.0 436.0 161.0Q436.0 168.0 431.0 173.5Q426.0 179.0 418.5 178.5Q411.0 178.0 406.0 173.0Q401.0 168.0 401.0 161.0Q401.0 154.0 406.5 148.5Q412.0 143.0 419.0 143.0ZM395.5 396.0Q390.0 401.0 383.0 401.0Q376.0 401.0 371.0 396.0Q366.0 391.0 366.0 383.5Q366.0 376.0 371.0 371.0Q376.0 366.0 383.5 366.0Q391.0 366.0 396.0 371.0Q401.0 376.0 401.0 383.5Q401.0 391.0 395.5 396.0ZM143.0 77.0Q143.0 72.0 145.5 68.0Q148.0 64.0 152.0 62.0Q156.0 60.0 160.5 59.5Q165.0 59.0 169.0 61.5Q173.0 64.0 175.5 68.0Q178.0 72.0 178.0 77.0Q178.0 84.0 173.0 89.5Q168.0 95.0 161.0 95.0Q154.0 95.0 148.5 89.5Q143.0 84.0 143.0 77.0ZM41.0 277.0Q41.0 270.0 46.0 265.0Q51.0 260.0 59.0 260.0Q66.0 260.0 71.0 265.5Q76.0 271.0 76.0 278.0Q76.0 285.0 71.0 290.0Q66.0 295.0 58.5 295.0Q51.0 295.0 46.0 290.0Q41.0 285.0 41.0 277.0ZM384.0 95.0Q389.0 95.0 393.0 97.5Q397.0 100.0 399.0 104.0Q401.0 108.0 401.0 112.0Q401.0 120.0 396.0 125.0Q391.0 130.0 383.5 130.0Q376.0 130.0 371.0 125.0Q366.0 120.0 366.0 112.5Q366.0 105.0 371.5 100.0Q377.0 95.0 384.0 95.0ZM143.0 418.0Q144.0 411.0 149.0 406.0Q154.0 401.0 161.0 401.0Q168.0 401.0 173.0 406.0Q178.0 411.0 178.0 418.5Q178.0 426.0 173.0 431.0Q168.0 436.0 160.5 436.0Q153.0 436.0 148.0 431.0Q143.0 426.0 143.0 418.0ZM218.0 454.0Q210.0 454.0 205.5 449.0Q201.0 444.0 201.0 437.0Q200.0 430.0 205.5 425.0Q211.0 420.0 218.0 420.0Q225.0 420.0 230.0 425.0Q235.0 430.0 235.0 437.5Q235.0 445.0 230.0 450.0Q225.0 455.0 218.0 454.0ZM312.0 400.0Q312.0 406.0 307.5 410.5Q303.0 415.0 297.0 415.0Q294.0 415.0 291.5 413.5Q289.0 412.0 287.0 410.0Q285.0 408.0 283.5 405.5Q282.0 403.0 282.0 400.0Q282.0 394.0 286.5 389.5Q291.0 385.0 297.0 385.0Q304.0 385.0 308.0 389.0Q312.0 393.0 312.0 400.0ZM119.0 327.0Q125.0 327.0 129.5 331.5Q134.0 336.0 134.0 342.0Q134.0 348.0 129.0 352.5Q124.0 357.0 118.0 357.0Q112.0 357.0 108.0 352.0Q104.0 347.0 104.0 341.0Q104.0 335.0 108.5 331.0Q113.0 327.0 119.0 327.0ZM423.0 248.0Q422.0 252.0 420.0 255.5Q418.0 259.0 414.5 261.0Q411.0 263.0 407.0 263.0Q401.0 262.0 397.0 257.5Q393.0 253.0 393.0 247.0Q394.0 233.0 409.0 233.0Q414.0 233.0 418.5 237.5Q423.0 242.0 423.0 248.0ZM312.0 96.0Q312.0 100.0 310.0 103.5Q308.0 107.0 304.5 109.0Q301.0 111.0 297.0 111.0Q292.0 111.0 287.0 106.5Q282.0 102.0 282.0 96.0Q282.0 90.0 286.5 85.5Q291.0 81.0 297.5 81.0Q304.0 81.0 308.0 85.5Q312.0 90.0 312.0 96.0ZM104.0 154.0Q104.0 148.0 108.0 143.5Q112.0 139.0 119.0 139.0Q125.0 139.0 129.5 143.5Q134.0 148.0 134.0 154.0Q134.0 160.0 129.0 164.5Q124.0 169.0 118.5 169.0Q113.0 169.0 108.5 164.5Q104.0 160.0 104.0 154.0ZM385.0 198.0Q385.0 195.0 387.0 191.5Q389.0 188.0 392.5 186.0Q396.0 184.0 400.0 184.0Q406.0 184.0 410.0 188.0Q414.0 192.0 414.5 198.0Q415.0 204.0 410.5 208.5Q406.0 213.0 400.0 213.0Q394.0 213.0 389.5 208.5Q385.0 204.0 385.0 198.0ZM342.0 362.0Q346.0 362.0 349.5 364.0Q353.0 366.0 355.0 369.5Q357.0 373.0 356.0 377.0Q356.0 384.0 352.0 388.0Q348.0 392.0 342.0 392.0Q336.0 391.0 331.5 387.0Q327.0 383.0 327.0 377.0Q327.0 371.0 331.5 366.5Q336.0 362.0 342.0 362.0ZM96.0 184.0Q102.0 184.0 106.5 188.0Q111.0 192.0 111.0 199.0Q110.0 205.0 106.0 209.0Q102.0 213.0 96.0 213.0Q90.0 213.0 85.5 208.5Q81.0 204.0 81.0 198.0Q81.0 192.0 85.5 188.0Q90.0 184.0 96.0 184.0ZM169.0 377.0Q169.0 381.0 167.0 384.5Q165.0 388.0 161.5 390.0Q158.0 392.0 154.0 392.0Q148.0 391.0 143.5 387.0Q139.0 383.0 139.0 377.0Q139.0 371.0 143.5 366.5Q148.0 362.0 154.0 362.0Q158.0 362.0 161.5 364.0Q165.0 366.0 167.0 369.5Q169.0 373.0 169.0 377.0ZM387.5 164.5Q383.0 169.0 377.0 169.0Q371.0 169.0 367.0 164.5Q363.0 160.0 363.0 154.0Q363.0 148.0 367.0 144.0Q371.0 140.0 377.0 139.5Q383.0 139.0 387.5 143.5Q392.0 148.0 392.0 154.0Q392.0 160.0 387.5 164.5ZM387.5 331.5Q392.0 336.0 392.0 341.5Q392.0 347.0 387.5 351.5Q383.0 356.0 377.0 356.0Q371.0 356.0 367.0 352.0Q363.0 348.0 363.0 341.5Q363.0 335.0 367.0 331.0Q371.0 327.0 377.0 327.0Q383.0 327.0 387.5 331.5ZM73.0 248.0Q74.0 245.0 75.0 242.0Q76.0 239.0 78.0 237.5Q80.0 236.0 82.5 234.5Q85.0 233.0 88.0 233.0Q94.0 233.0 98.5 237.5Q103.0 242.0 103.0 248.0Q103.0 254.0 98.5 258.0Q94.0 262.0 88.0 262.5Q82.0 263.0 77.5 258.0Q73.0 253.0 73.0 248.0ZM356.0 119.0Q356.0 123.0 354.5 126.0Q353.0 129.0 349.5 131.0Q346.0 133.0 342.0 133.0Q336.0 133.0 331.5 129.0Q327.0 125.0 327.0 119.0Q327.0 113.0 331.5 108.5Q336.0 104.0 342.0 104.0Q348.0 104.0 352.0 108.5Q356.0 113.0 356.0 119.0ZM154.0 133.0Q150.0 133.0 146.5 131.0Q143.0 129.0 141.0 126.0Q139.0 123.0 139.0 119.0Q139.0 113.0 143.5 108.5Q148.0 104.0 154.0 104.0Q160.0 104.0 164.5 108.5Q169.0 113.0 168.5 119.0Q168.0 125.0 164.0 129.0Q160.0 133.0 154.0 133.0ZM258.0 418.0Q254.0 422.0 248.0 422.0Q242.0 422.0 237.5 417.5Q233.0 413.0 233.0 407.0Q233.0 401.0 237.5 397.0Q242.0 393.0 248.0 393.0Q254.0 393.0 258.0 397.0Q262.0 401.0 262.0 407.5Q262.0 414.0 258.0 418.0ZM248.0 74.0Q254.0 74.0 258.5 78.0Q263.0 82.0 263.0 89.0Q262.0 95.0 258.0 99.0Q254.0 103.0 248.0 103.0Q242.0 103.0 237.5 98.5Q233.0 94.0 233.0 88.0Q233.0 82.0 237.5 78.0Q242.0 74.0 248.0 74.0ZM385.0 297.0Q385.0 291.0 389.5 287.0Q394.0 283.0 400.0 283.0Q406.0 283.0 410.5 287.0Q415.0 291.0 414.5 297.0Q414.0 303.0 410.0 307.5Q406.0 312.0 400.0 312.0Q394.0 312.0 389.5 307.5Q385.0 303.0 385.0 297.0ZM198.0 81.0Q204.0 81.0 208.5 85.0Q213.0 89.0 213.0 95.5Q213.0 102.0 209.0 106.5Q205.0 111.0 199.0 111.0Q193.0 111.0 188.5 106.5Q184.0 102.0 184.0 96.0Q184.0 93.0 185.0 90.5Q186.0 88.0 188.0 86.0Q190.0 84.0 192.5 83.0Q195.0 82.0 198.0 81.0ZM96.0 312.0Q90.0 312.0 85.5 307.5Q81.0 303.0 81.0 297.0Q81.0 291.0 85.5 287.0Q90.0 283.0 96.0 283.0Q102.0 283.0 106.5 287.0Q111.0 291.0 110.0 297.0Q110.0 301.0 108.5 304.5Q107.0 308.0 103.5 310.0Q100.0 312.0 96.0 312.0ZM209.0 389.5Q213.0 394.0 213.0 400.0Q213.0 406.0 208.5 410.0Q204.0 414.0 198.5 414.0Q193.0 414.0 188.5 409.5Q184.0 405.0 184.0 399.0Q184.0 393.0 188.5 389.0Q193.0 385.0 199.0 385.0Q205.0 385.0 209.0 389.5ZM154.0 330.0Q166.0 330.0 166.0 342.0Q166.0 347.0 162.5 350.5Q159.0 354.0 154.0 354.0Q149.0 354.0 145.0 350.5Q141.0 347.0 141.0 342.0Q141.0 337.0 145.0 333.0Q149.0 329.0 154.0 330.0ZM367.0 227.0Q367.0 215.0 379.0 215.0Q384.0 215.0 388.0 218.5Q392.0 222.0 392.0 227.0Q392.0 232.0 388.0 235.5Q384.0 239.0 379.0 239.0Q374.0 239.0 370.5 235.5Q367.0 232.0 367.0 227.0ZM296.0 366.0Q296.0 361.0 299.5 357.5Q303.0 354.0 309.0 354.0Q321.0 354.0 321.0 366.0Q321.0 372.0 317.0 375.5Q313.0 379.0 308.0 379.0Q303.0 379.0 299.5 375.0Q296.0 371.0 296.0 366.0ZM117.0 187.0Q117.0 184.0 118.5 181.0Q120.0 178.0 123.0 176.5Q126.0 175.0 129.0 175.0Q141.0 175.0 141.0 187.0Q142.0 193.0 138.5 196.5Q135.0 200.0 129.0 200.0Q124.0 200.0 120.5 196.0Q117.0 192.0 117.0 187.0ZM281.0 116.0Q281.0 129.0 268.0 129.0Q265.0 129.0 262.5 127.0Q260.0 125.0 258.0 122.5Q256.0 120.0 256.0 116.0Q256.0 112.0 260.0 108.0Q264.0 104.0 269.0 104.0Q274.0 104.0 277.5 107.5Q281.0 111.0 281.0 116.0ZM116.0 239.0Q111.0 239.0 107.5 235.5Q104.0 232.0 104.0 226.5Q104.0 221.0 108.0 218.0Q112.0 215.0 117.0 215.0Q122.0 215.0 125.5 218.5Q129.0 222.0 129.0 227.0Q129.0 232.0 125.0 235.5Q121.0 239.0 116.0 239.0ZM367.0 200.0Q362.0 200.0 358.0 196.5Q354.0 193.0 354.0 188.0Q354.0 183.0 358.0 179.0Q362.0 175.0 367.0 175.0Q379.0 176.0 379.0 188.0Q379.0 190.0 378.0 192.5Q377.0 195.0 375.5 196.5Q374.0 198.0 371.5 199.0Q369.0 200.0 367.0 200.0ZM342.0 354.0Q339.0 354.0 336.0 352.5Q333.0 351.0 331.5 348.0Q330.0 345.0 330.0 342.0Q330.0 337.0 333.5 333.5Q337.0 330.0 342.5 330.0Q348.0 330.0 351.0 333.5Q354.0 337.0 354.0 342.0Q354.0 347.0 350.5 350.5Q347.0 354.0 342.0 354.0ZM187.0 379.0Q183.0 379.0 179.0 375.0Q175.0 371.0 175.0 366.0Q175.0 361.0 178.5 357.5Q182.0 354.0 187.0 354.0Q199.0 354.0 200.0 366.0Q200.0 371.0 196.5 375.0Q193.0 379.0 187.0 379.0ZM218.5 125.5Q215.0 122.0 215.0 116.5Q215.0 111.0 218.5 107.5Q222.0 104.0 227.0 104.0Q232.0 104.0 235.5 108.0Q239.0 112.0 239.0 117.0Q239.0 122.0 235.5 125.5Q232.0 129.0 227.0 129.0Q222.0 129.0 218.5 125.5ZM227.0 391.0Q222.0 391.0 218.5 387.5Q215.0 384.0 215.0 379.0Q215.0 374.0 218.5 370.5Q222.0 367.0 227.0 367.0Q230.0 367.0 233.0 368.5Q236.0 370.0 237.5 373.0Q239.0 376.0 239.0 379.5Q239.0 383.0 237.5 385.5Q236.0 388.0 233.0 389.5Q230.0 391.0 227.0 391.0ZM166.0 154.0Q166.0 159.0 162.5 162.5Q159.0 166.0 154.0 166.0Q151.0 166.0 149.0 165.0Q147.0 164.0 145.0 162.5Q143.0 161.0 142.5 158.5Q142.0 156.0 142.0 154.0Q142.0 151.0 143.5 148.0Q145.0 145.0 147.5 143.5Q150.0 142.0 153.5 142.0Q157.0 142.0 160.0 143.5Q163.0 145.0 164.5 147.5Q166.0 150.0 166.0 154.0ZM299.5 120.5Q303.0 117.0 308.5 117.0Q314.0 117.0 317.0 120.5Q320.0 124.0 320.0 129.0Q320.0 134.0 316.5 138.0Q313.0 142.0 308.0 141.5Q303.0 141.0 299.5 137.5Q296.0 134.0 296.0 129.0Q296.0 124.0 299.5 120.5ZM277.5 370.5Q281.0 374.0 281.0 379.0Q281.0 384.0 277.5 387.5Q274.0 391.0 269.0 391.0Q264.0 391.0 260.0 387.5Q256.0 384.0 256.5 379.0Q257.0 374.0 260.5 370.5Q264.0 367.0 269.0 367.0Q274.0 367.0 277.5 370.5ZM388.0 277.5Q384.0 281.0 379.0 281.0Q374.0 281.0 370.5 277.5Q367.0 274.0 367.0 269.0Q367.0 264.0 370.5 260.5Q374.0 257.0 379.5 257.0Q385.0 257.0 388.5 260.5Q392.0 264.0 392.0 269.0Q392.0 274.0 388.0 277.5ZM125.5 260.5Q129.0 264.0 129.0 269.0Q129.0 274.0 125.0 277.5Q121.0 281.0 116.0 281.0Q111.0 281.0 107.5 277.0Q104.0 273.0 104.0 268.0Q104.0 263.0 107.5 260.0Q111.0 257.0 116.5 257.0Q122.0 257.0 125.5 260.5ZM379.0 308.0Q379.0 313.0 375.5 316.5Q372.0 320.0 367.0 320.0Q364.0 320.0 361.0 318.5Q358.0 317.0 356.5 314.5Q355.0 312.0 354.5 308.5Q354.0 305.0 356.0 302.5Q358.0 300.0 360.5 298.0Q363.0 296.0 366.0 296.0Q378.0 296.0 379.0 308.0ZM179.5 138.5Q176.0 135.0 175.5 130.0Q175.0 125.0 178.5 121.0Q182.0 117.0 187.0 117.0Q192.0 117.0 195.5 120.5Q199.0 124.0 199.5 129.0Q200.0 134.0 196.5 137.5Q193.0 141.0 188.0 141.5Q183.0 142.0 179.5 138.5ZM130.0 296.0Q141.0 296.0 141.0 308.0Q141.0 311.0 140.0 313.0Q139.0 315.0 137.5 317.0Q136.0 319.0 133.5 319.5Q131.0 320.0 129.0 320.0Q124.0 320.0 120.5 316.5Q117.0 313.0 117.0 308.0Q117.0 305.0 119.0 302.0Q121.0 299.0 123.5 297.5Q126.0 296.0 130.0 296.0ZM342.0 142.0Q354.0 142.0 354.0 154.0Q354.0 159.0 350.5 162.5Q347.0 166.0 342.0 166.0Q330.0 166.0 330.0 154.0Q330.0 149.0 333.5 145.5Q337.0 142.0 342.0 142.0ZM249.0 148.0Q244.0 148.0 241.0 145.0Q238.0 142.0 238.0 138.0Q238.0 134.0 241.0 131.0Q244.0 128.0 248.0 127.5Q252.0 127.0 255.0 130.0Q258.0 133.0 258.5 137.0Q259.0 141.0 256.0 144.5Q253.0 148.0 249.0 148.0ZM330.0 190.0Q327.0 187.0 327.0 183.0Q327.0 179.0 330.0 176.0Q333.0 173.0 337.0 173.0Q341.0 173.0 344.0 176.0Q347.0 179.0 347.0 183.0Q347.0 187.0 344.0 190.0Q341.0 193.0 337.0 193.0Q333.0 193.0 330.0 190.0ZM312.0 327.0Q317.0 326.0 320.0 329.5Q323.0 333.0 323.0 337.0Q323.0 347.0 313.0 347.0Q309.0 347.0 305.5 344.0Q302.0 341.0 302.0 337.0Q302.0 333.0 305.0 330.0Q308.0 327.0 312.0 327.0ZM154.0 214.0Q154.0 216.0 152.5 218.5Q151.0 221.0 148.5 222.5Q146.0 224.0 144.0 224.0Q139.0 224.0 136.0 221.0Q133.0 218.0 133.0 214.0Q133.0 210.0 136.0 207.0Q139.0 204.0 143.0 204.0Q147.0 204.0 150.5 207.0Q154.0 210.0 154.0 214.0ZM193.0 337.0Q193.0 347.0 183.0 347.0Q173.0 347.0 173.0 336.5Q173.0 326.0 183.0 326.5Q193.0 327.0 193.0 337.0ZM337.0 322.0Q327.0 322.0 327.0 312.0Q327.0 303.0 337.0 302.0Q347.0 302.0 347.0 312.0Q347.0 317.0 344.0 319.5Q341.0 322.0 337.0 322.0ZM353.0 204.0Q363.0 204.0 363.0 214.0Q363.0 224.0 352.5 224.0Q342.0 224.0 342.5 214.0Q343.0 204.0 353.0 204.0ZM214.0 363.0Q204.0 362.0 204.0 352.0Q204.0 348.0 207.0 345.0Q210.0 342.0 214.0 342.0Q218.0 342.0 221.0 345.5Q224.0 349.0 224.0 353.0Q224.0 357.0 221.0 360.0Q218.0 363.0 214.0 363.0ZM128.0 248.0Q128.0 237.0 138.0 238.0Q148.0 238.0 148.0 248.0Q148.0 252.0 145.0 255.0Q142.0 258.0 138.0 258.0Q134.0 258.0 131.0 255.0Q128.0 252.0 128.0 248.0ZM204.0 144.0Q204.0 133.0 214.0 133.0Q224.0 133.0 224.0 143.0Q224.0 153.0 214.0 153.0Q204.0 153.0 204.0 144.0ZM272.0 144.0Q272.0 134.0 282.0 133.0Q292.0 133.0 292.0 143.0Q292.0 153.0 282.5 153.0Q273.0 153.0 272.0 144.0ZM183.0 169.0Q179.0 169.0 176.0 166.0Q173.0 163.0 173.0 159.0Q173.0 149.0 184.0 149.0Q193.0 149.0 193.0 159.0Q193.0 169.0 183.0 169.0ZM313.0 149.0Q323.0 149.0 323.0 159.0Q323.0 163.0 319.5 166.0Q316.0 169.0 312.0 169.0Q303.0 169.0 303.0 159.0Q303.0 149.0 313.0 149.0ZM159.0 173.0Q169.0 173.0 169.0 183.0Q169.0 185.0 168.0 187.0Q167.0 189.0 166.0 190.5Q165.0 192.0 163.0 192.5Q161.0 193.0 159.0 193.0Q155.0 193.0 152.0 190.0Q149.0 187.0 149.0 183.0Q149.0 179.0 152.0 176.0Q155.0 173.0 159.0 173.0ZM169.0 312.0Q169.0 322.0 159.0 322.0Q149.0 322.0 149.0 313.0Q149.0 308.0 152.0 305.0Q155.0 302.0 159.0 302.0Q169.0 303.0 169.0 312.0ZM248.0 368.0Q244.0 368.0 241.0 365.0Q238.0 362.0 238.0 358.0Q238.0 348.0 248.0 348.0Q258.0 348.0 258.0 357.0Q258.0 360.0 256.5 362.5Q255.0 365.0 253.0 366.5Q251.0 368.0 248.0 368.0ZM353.0 292.0Q343.0 292.0 343.0 282.0Q343.0 278.0 345.5 275.0Q348.0 272.0 353.0 272.0Q362.0 272.0 362.5 281.5Q363.0 291.0 353.0 292.0ZM292.0 352.0Q292.0 362.0 282.0 362.0Q279.0 363.0 277.0 361.5Q275.0 360.0 273.5 357.5Q272.0 355.0 272.0 352.0Q272.0 343.0 282.0 342.0Q286.0 342.0 289.0 345.0Q292.0 348.0 292.0 352.0ZM368.0 247.0Q368.0 252.0 365.0 255.0Q362.0 258.0 358.0 258.0Q354.0 258.0 351.0 255.0Q348.0 252.0 348.0 248.0Q348.0 238.0 358.0 238.0Q368.0 238.0 368.0 247.0ZM143.0 292.0Q133.0 291.0 133.0 281.0Q134.0 272.0 144.0 272.0Q147.0 272.0 150.0 275.0Q153.0 278.0 153.0 282.0Q153.0 286.0 150.0 289.0Q147.0 292.0 143.0 292.0ZM159.0 225.0Q167.0 225.0 167.0 234.0Q167.0 237.0 164.5 239.5Q162.0 242.0 158.0 242.0Q150.0 242.0 150.0 234.0Q150.0 230.0 152.5 227.5Q155.0 225.0 159.0 225.0ZM159.0 270.0Q155.0 270.0 152.5 267.5Q150.0 265.0 150.0 262.0Q150.0 254.0 158.5 254.0Q167.0 254.0 167.0 262.0Q167.0 270.0 159.0 270.0ZM304.0 184.0Q304.0 176.0 312.0 175.5Q320.0 175.0 320.0 183.0Q321.0 187.0 318.5 189.5Q316.0 192.0 312.5 192.0Q309.0 192.0 306.0 189.5Q303.0 187.0 304.0 184.0ZM207.0 337.0Q205.0 337.0 203.0 336.0Q201.0 335.0 199.5 333.0Q198.0 331.0 198.0 329.0Q198.0 325.0 200.5 322.5Q203.0 320.0 206.5 320.0Q210.0 320.0 213.0 322.5Q216.0 325.0 215.0 329.0Q215.0 336.0 207.0 337.0ZM234.0 346.0Q231.0 346.0 228.0 343.5Q225.0 341.0 225.0 337.0Q225.0 329.0 233.0 329.0Q237.0 328.0 239.5 331.0Q242.0 334.0 242.0 337.0Q243.0 345.0 234.0 346.0ZM225.0 158.0Q225.0 150.0 233.0 150.0Q237.0 150.0 239.5 152.5Q242.0 155.0 242.0 159.0Q242.0 167.0 234.0 167.0Q225.0 167.0 225.0 158.0ZM167.5 280.5Q176.0 281.0 175.5 289.0Q175.0 297.0 167.0 297.0Q159.0 297.0 159.0 288.5Q159.0 280.0 167.5 280.5ZM312.0 320.0Q303.0 320.0 303.0 312.0Q303.0 304.0 312.0 304.0Q320.0 303.0 320.0 312.0Q321.0 320.0 312.0 320.0ZM320.0 207.0Q320.0 198.0 329.0 199.0Q337.0 199.0 337.0 207.0Q337.0 216.0 328.0 215.0Q320.0 214.0 320.0 207.0ZM320.0 289.0Q320.0 281.0 328.0 280.0Q337.0 280.0 337.0 288.5Q337.0 297.0 329.0 297.5Q321.0 298.0 320.0 289.0ZM215.0 167.0Q216.0 175.0 207.0 175.0Q199.0 175.0 198.5 167.0Q198.0 159.0 206.5 159.0Q215.0 159.0 215.0 167.0ZM254.0 158.0Q254.0 150.0 262.5 150.5Q271.0 151.0 270.5 159.0Q270.0 167.0 262.0 166.5Q254.0 166.0 254.0 158.0ZM281.0 167.0Q281.0 159.0 289.0 159.0Q297.0 159.0 297.0 167.0Q297.0 175.0 289.0 175.0Q281.0 175.0 281.0 167.0ZM262.0 329.0Q270.0 329.0 270.0 337.5Q270.0 346.0 262.0 345.5Q254.0 345.0 254.0 337.0Q254.0 329.0 262.0 329.0ZM184.0 320.0Q176.0 320.0 176.0 311.5Q176.0 303.0 184.0 303.5Q192.0 304.0 192.0 312.0Q192.0 320.0 184.0 320.0ZM329.0 233.5Q329.0 225.0 337.5 225.5Q346.0 226.0 345.5 234.0Q345.0 242.0 337.0 242.0Q329.0 242.0 329.0 233.5ZM159.0 206.5Q159.0 198.0 167.5 198.5Q176.0 199.0 175.5 207.0Q175.0 215.0 167.0 215.0Q159.0 215.0 159.0 206.5ZM289.0 320.0Q297.0 320.0 297.0 328.5Q297.0 337.0 289.0 337.0Q281.0 337.0 281.0 328.5Q281.0 320.0 289.0 320.0ZM337.0 270.0Q329.0 270.0 329.0 262.0Q329.0 254.0 337.5 254.0Q346.0 254.0 345.5 262.0Q345.0 270.0 337.0 270.0ZM176.0 183.5Q176.0 175.0 184.0 175.5Q192.0 176.0 192.0 184.0Q192.0 192.0 184.0 192.0Q176.0 192.0 176.0 183.5Z\"/>\n</svg>","kaggle":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\"><path d=\"M304.2 501.5L158.4 320.3 298.2 185c2.6-2.7 1.7-10.5-5.3-10.5h-69.2c-3.5 0-7 1.8-10.5 5.3L80.9 313.5V7.5q0-7.5-7.5-7.5H21.5Q14 0 14 7.5v497q0 7.5 7.5 7.5h51.9q7.5 0 7.5-7.5v-109l30.8-29.3 110.5 140.6c3 3.5 6.5 5.3 10.5 5.3h66.9q5.25 0 6-3z\"/></svg>","ig":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><path d=\"M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z\"/></svg>","fb":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z\"/></svg>","threads":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><path d=\"M331.5 235.7c2.2 .9 4.2 1.9 6.3 2.8c29.2 14.1 50.6 35.2 61.8 61.4c15.7 36.5 17.2 95.8-30.3 143.2c-36.2 36.2-80.3 52.5-142.6 53h-.3c-70.2-.5-124.1-24.1-160.4-70.2c-32.3-41-48.9-98.1-49.5-169.6V256v-.2C17 184.3 33.6 127.2 65.9 86.2C102.2 40.1 156.2 16.5 226.4 16h.3c70.3 .5 124.9 24 162.3 69.9c18.4 22.7 32 50 40.6 81.7l-40.4 10.8c-7.1-25.8-17.8-47.8-32.2-65.4c-29.2-35.8-73-54.2-130.5-54.6c-57 .5-100.1 18.8-128.2 54.4C72.1 146.1 58.5 194.3 58 256c.5 61.7 14.1 109.9 40.3 143.3c28 35.6 71.2 53.9 128.2 54.4c51.4-.4 85.4-12.6 113.7-40.9c32.3-32.2 31.7-71.8 21.4-95.9c-6.1-14.2-17.1-26-31.9-34.9c-3.7 26.9-11.8 48.3-24.7 64.8c-17.1 21.8-41.4 33.6-72.7 35.3c-23.6 1.3-46.3-4.4-63.9-16c-20.8-13.8-33-34.8-34.3-59.3c-2.5-48.3 35.7-83 95.2-86.4c21.1-1.2 40.9-.3 59.2 2.8c-2.4-14.8-7.3-26.6-14.6-35.2c-10-11.7-25.6-17.7-46.2-17.8H227c-16.6 0-39 4.6-53.3 26.3l-34.4-23.6c19.2-29.1 50.3-45.1 87.8-45.1h.8c62.6 .4 99.9 39.5 103.7 107.7l-.2 .2zm-156 68.8c1.3 25.1 28.4 36.8 54.6 35.3c25.6-1.4 54.6-11.4 59.5-73.2c-13.2-2.9-27.8-4.4-43.4-4.4c-4.8 0-9.6 .1-14.4 .4c-42.9 2.4-57.2 23.2-56.2 41.8l-.1 .1z\"/></svg>","tiktok":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><path d=\"M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z\"/></svg>","md":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><path d=\"M433 179.11c0-97.2-63.71-125.7-63.71-125.7-62.52-28.7-228.56-28.4-290.48 0 0 0-63.72 28.5-63.72 125.7 0 115.7-6.6 259.4 105.63 289.1 40.51 10.7 75.32 13 103.33 11.4 50.81-2.8 79.32-18.1 79.32-18.1l-1.7-36.9s-36.31 11.4-77.12 10.1c-40.41-1.4-83-4.4-89.63-54a102.54 102.54 0 0 1-.9-13.9c85.63 20.9 158.65 9.1 178.75 6.7 56.12-6.7 105-41.3 111.23-72.9 9.8-49.8 9-121.5 9-121.5zm-75.12 125.2h-46.63v-114.2c0-49.7-64-51.6-64 6.9v62.5h-46.33V197c0-58.5-64-56.6-64-6.9v114.2H90.19c0-122.1-5.2-147.9 18.41-175 25.9-28.9 79.82-30.8 103.83 6.1l11.6 19.5 11.6-19.5c24.11-37.1 78.12-34.8 103.83-6.1 23.71 27.3 18.4 53 18.4 175z\"/></svg>","reddit":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M0 256C0 114.6 114.6 0 256 0S512 114.6 512 256s-114.6 256-256 256L37.1 512c-13.7 0-20.5-16.5-10.9-26.2L75 437C28.7 390.7 0 326.7 0 256zM349.6 153.6c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7c-20.6 0-37.8 14.6-41.8 34c-34.5 3.7-61.4 33-61.4 68.4l0 .2c-37.5 1.6-71.8 12.3-99 29.1c-10.1-7.8-22.8-12.5-36.5-12.5c-33 0-59.8 26.8-59.8 59.8c0 24 14.1 44.6 34.4 54.1c2 69.4 77.6 125.2 170.6 125.2s168.7-55.9 170.6-125.3c20.2-9.6 34.1-30.2 34.1-54c0-33-26.8-59.8-59.8-59.8c-13.7 0-26.3 4.6-36.4 12.4c-27.4-17-62.1-27.7-100-29.1l0-.2c0-25.4 18.9-46.5 43.4-49.9l0 0c4.4 18.8 21.3 32.8 41.5 32.8zM177.1 246.9c16.7 0 29.5 17.6 28.5 39.3s-13.5 29.6-30.3 29.6s-31.4-8.8-30.4-30.5s15.4-38.3 32.1-38.3zm190.1 38.3c1 21.7-13.7 30.5-30.4 30.5s-29.3-7.9-30.3-29.6c-1-21.7 11.8-39.3 28.5-39.3s31.2 16.6 32.1 38.3zm-48.1 56.7c-10.3 24.6-34.6 41.9-63 41.9s-52.7-17.3-63-41.9c-1.2-2.9 .8-6.2 3.9-6.5c18.4-1.9 38.3-2.9 59.1-2.9s40.7 1 59.1 2.9c3.1 .3 5.1 3.6 3.9 6.5z\"/></svg>","discord":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 512\"><path d=\"M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z\"/></svg>","slack":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><path d=\"M94.12 315.1c0 25.9-21.16 47.06-47.06 47.06S0 341 0 315.1c0-25.9 21.16-47.06 47.06-47.06h47.06v47.06zm23.72 0c0-25.9 21.16-47.06 47.06-47.06s47.06 21.16 47.06 47.06v117.84c0 25.9-21.16 47.06-47.06 47.06s-47.06-21.16-47.06-47.06V315.1zm47.06-188.98c-25.9 0-47.06-21.16-47.06-47.06S139 32 164.9 32s47.06 21.16 47.06 47.06v47.06H164.9zm0 23.72c25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06H47.06C21.16 243.96 0 222.8 0 196.9s21.16-47.06 47.06-47.06H164.9zm188.98 47.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06s-21.16 47.06-47.06 47.06h-47.06V196.9zm-23.72 0c0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06V79.06c0-25.9 21.16-47.06 47.06-47.06 25.9 0 47.06 21.16 47.06 47.06V196.9zM283.1 385.88c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06-25.9 0-47.06-21.16-47.06-47.06v-47.06h47.06zm0-23.72c-25.9 0-47.06-21.16-47.06-47.06 0-25.9 21.16-47.06 47.06-47.06h117.84c25.9 0 47.06 21.16 47.06 47.06 0 25.9-21.16 47.06-47.06 47.06H283.1z\"/></svg>","skool":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 512\"><path d=\"M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM609.3 512l-137.8 0c5.4-9.4 8.6-20.3 8.6-32l0-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2l61.4 0C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z\"/></svg>","community":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 512\"><path d=\"M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM609.3 512l-137.8 0c5.4-9.4 8.6-20.3 8.6-32l0-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2l61.4 0C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z\"/></svg>","events":"<svg class=\"pi pib\" aria-hidden=\"true\" focusable=\"false\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><path d=\"M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z\"/></svg>"};
ICONSET.substack='<svg class="pi pib" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 3h16v2H4zm0 4h16v2H4zm0 4h16v11l-8-5-8 5z"/></svg>';
const picon=p=>ICONSET[p]||SV(GLYPH[PGLYPH[p]||"globe"]);
const IC_ADD=SV('<path d="M6 3h12v18l-6-4-6 4z"/>');
const IC_ADDED=SV('<path d="M6 3h12v18l-6-4-6 4z" fill="currentColor"/><path d="M9 10l2.2 2.2L15 8.4" stroke="var(--accent-ink)"/>');
const TIP_ADD="Listeme ekle: kaynağı kişisel listene kaydeder.";
const TIP_ADDED="Takip listende. Listeden çıkarmak için dokun.";

/* ---------- Profil görselleri: X profil fotoğraflarının 64 px kopyaları (17 Ekim 2026) ---------- */
const AV=EDUMIND_GEN.av;
const ORGSEC=new Set(["kurum","uyg","akd","tr","plat"]);
const INI=EDUMIND_GEN.ini;
function initials(n){if(INI[n])return INI[n];const ac=(n.match(/\(([A-ZİÇŞĞÜÖ]{2,5})\)/)||[])[1];if(ac&&ORGSEC.has((D.find(x=>x.n===n)||{}).s))return ac;const w=short(n).replace(/[^\p{L}\p{N}\s]/gu," ").split(/\s+/).filter(Boolean);return((w[0]||"?")[0]+(w.length>1?w[w.length-1][0]:"")).toLocaleUpperCase("tr")}
let AVO={};
const okImg=u=>typeof u==="string"&&/^data:image\/(webp|png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(u)&&u.length<120000;
function avState(d){const o=AVO[d.n];if(o&&o.removed)return{src:"",kind:"removed",at:o.at};if(o&&okImg(o.img))return{src:o.img,kind:"admin",at:o.at};
  const x=d.links.find(l=>l.p==="x"&&l.v!=="q");const a=EDUMIND_GEN.avByName[d.n]||(x&&x.h&&AV[x.h.toLowerCase()]);return a?{src:a,kind:"x"}:{src:"",kind:"none"}}
function avatar(d,size){const src=avState(d).src;const shape=ORGSEC.has(d.s)||/Labs|GAIL/.test(d.n)?"sq":"ci";
  if(src)return`<img class="av av-${shape}" src="${src}" width="${size}" height="${size}" alt="" loading="lazy" style="--s:${size}px">`;
  const t=initials(d.n);return`<span class="av av-${shape} av-mono${t.length>2?" l"+Math.min(t.length,4):""}" style="--s:${size}px" aria-hidden="true">${esc(t)}</span>`}


/* ---------- Simge düğmeleri: yalnızca logo; adı ve ayrıntısı üzerine gelince ---------- */
const GORD=["ana","sos","icr","akd","tek","top"],AORD=["web","x","li","bs","yt"];
const PFOPTS=[["x","X"],["li","LinkedIn"],["bs","Bluesky"],["yt","YouTube"],["ig","Instagram"],["fb","Facebook"],["threads","Threads"],["tiktok","TikTok"],["md","Mastodon"],["substack","Substack"],["github","GitHub"],["spotify","Spotify"],["apple","Apple Podcasts"],["hf","Hugging Face"],["reddit","Reddit"],["feed","Bülten / RSS"],["orcid","ORCID"],["openalex","OpenAlex"]];
const prefKey=p=>S.pref.has(p)?p:REG[p]&&REG[p].g==="icr"?"feed":p;
function prefRank(p){const a=[...S.pref],i=a.indexOf(prefKey(p));return i<0?99:i}
function prefChips(id){return`<div class="pfpick" id="${id}" role="group" aria-label="Platformlarım">${PFOPTS.map(([k,n])=>`<button type="button" class="pfc" data-pref="${k}" aria-pressed="${S.pref.has(k)}">${picon(k==="feed"?"newsletter":k)}<span>${n}</span></button>`).join("")}</div>`}
function bindPref(root){root.querySelectorAll("[data-pref]").forEach(b=>b.onclick=()=>{const k=b.dataset.pref;S.pref.has(k)?S.pref.delete(k):S.pref.add(k);saveAll();
  document.querySelectorAll(`[data-pref="${k}"]`).forEach(x=>x.setAttribute("aria-pressed",S.pref.has(k)));sync()})}
function uniqLinks(d){const seen=new Set();const L=sortLinks(d.links.filter(real)).filter(l=>{if(seen.has(l.p))return false;seen.add(l.p);return true});
  if(!S.pref.has("feed"))return L;const fi=L.findIndex(l=>prefKey(l.p)==="feed");if(fi<0)return L;
  const extra=L.filter((l,i)=>i!==fi&&prefKey(l.p)==="feed"),base=L.filter(l=>!extra.includes(l));
  return base.concat(extra)}
function sortLinks(L){return L.slice().sort((a,b)=>{const ra=prefRank(a.p),rb=prefRank(b.p);if(ra!==rb)return ra-rb;const ga=GORD.indexOf(REG[a.p].g),gb=GORD.indexOf(REG[b.p].g);if(ga!==gb)return ga-gb;
  if(REG[a.p].g==="ana")return AORD.indexOf(a.p)-AORD.indexOf(b.p);return 0})}
function tipText(l){return REG[l.p].n}
function ibtn(l,size){return`<a class="ib${size==="sm"?" sm":""}${l.v==="c"?" unv":""}" href="${esc(l.u)}" target="_blank" rel="noopener" aria-label="${esc(REG[l.p].n)}${l.h?" @"+esc(l.h):""} – yeni sekmede açılır" data-tip="${esc(tipText(l))}">${picon(l.p)}</a>`}
/* ---------- Detay ---------- */
const firstSentence=t=>t?(t.match(/^.+?[.!?](?=\s|$)/)||[t])[0]:"";
const secLabel=k=>SEC1[k]||secOf(k).n;
const IC_CK=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>`;

const IC_BMF=`<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>`;
const IC_BMP=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>`;
const IC_X=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`;
function fitLogos(box){if(!box)return;const I=[...box.children];const step=(I[0]?I[0].getBoundingClientRect().width:44)+8;
  const cap=Math.max(2,Math.floor((box.clientWidth+8)/step));if(I.length<=cap)return;
  const hide=I.slice(cap-1);hide.forEach(a=>a.classList.add("hid"));
  const b=document.createElement("button");b.type="button";b.className="ib more";b.textContent="+"+hide.length;b.dataset.tip="Diğer bağlantılar";b.setAttribute("aria-expanded","false");b.setAttribute("aria-label",hide.length+" bağlantı daha göster");box.appendChild(b);
  b.onclick=()=>{const open=b.getAttribute("aria-expanded")!=="true";hide.forEach(a=>a.classList.toggle("hid",!open));b.setAttribute("aria-expanded",String(open));
    b.textContent=open?"−":"+"+hide.length;b.dataset.tip=open?"Daha az göster":"Diğer bağlantılar";b.setAttribute("aria-label",open?"Daha az göster":hide.length+" bağlantı daha göster");if(open)hide[0].focus({preventScroll:true})}}
function profileActions(d,detail=false){
 const listed=inMyList(d);
 return `<div class="profile-actions${detail?' detail-actions':''}" aria-label="Kaynak işlemleri"><button type="button" class="profile-action list-action" ${detail?'id="dAdd"':`data-listtoggle="${esc(d.n)}"`} aria-pressed="${listed}" aria-label="${esc(d.n)}: ${listed?'Listemden çıkar':'Listeme ekle'}">${detail?(listed?'Listeme eklendi':'Listeme ekle'):SV(listed?'<path d="m5 12 4 4L19 6"/>':'<path d="M6 3h12v18l-6-4-6 4z"/><path d="M12 7v6M9 10h6"/>')}</button></div>`;
}
function toggleProfileFollow(n){const d=D.find(x=>x.n===n);if(!d)return;if(followed(d)){S.follow.delete(n);FOLLOW.forEach(f=>S.done.delete(doneKey(f.k,d)))}else{S.follow.add(n);S.basket.delete(n)}saveAll();sync()}
function renderDetail(){
  const el=$("#sheetBody"),foot=$("#sheetFoot");const d=D.find(x=>x.id===S.sel);
  if(!d)return;
  $("#sheetPanel").dataset.category=sourceType(d);
  {const color=getComputedStyle($("#sheetPanel")).getPropertyValue('--card-header-color').trim()||getComputedStyle($("#sheetPanel")).getPropertyValue('--card-category-dark').trim();if(color){document.documentElement.style.setProperty('--browser-header-color',color);const theme=document.querySelector('meta[name="theme-color"]');if(theme)theme.content=color}}
  const f=false,inB=inMyList(d),st=inB?1:0;
  const lens=d.l&&LENS[d.l];
  const seen=new Set(),U=sortLinks(d.links.filter(real)).filter(l=>{const k=l.p+"|"+l.u;if(seen.has(k))return false;seen.add(k);return true});
  const ghost=!has(d,"li")?`<a class="ib ghost" href="${liSearch(d.n)}" target="_blank" rel="noopener" aria-label="LinkedIn'de ara" data-tip="LinkedIn">${picon("li")}</a>`:"";
  const mine=U.filter(l=>prefRank(l.p)<99),rest=U.filter(l=>prefRank(l.p)===99);
  const rows=[];const liPref=S.pref.has("li");
  {const h=mine.map(l=>ibtn(l)).join("")+(ghost&&liPref?ghost:"");rows.push(["Platformlarımda aç",h||`<span class="lgnone">${S.pref.size?"Seçtiğiniz platformlarda hesabı yok":"Kullandığınız platformları seçin"}</span>`,"mine"])}
  {const h=rest.map(l=>ibtn(l)).join("")+(ghost&&!liPref?ghost:"");if(h)rows.push(["Diğer bağlantılar",h,"oth"])}
  const logos=rows.map(([n,h,c])=>`<div class="lgrow${c?" "+c:""}">${n==="Platformlarımda aç"?`<button type="button" class="lgn card-platform-settings" aria-label="Platformlarım" aria-haspopup="dialog">${n}${SV('<path d="M4 7h7m4 0h5M4 17h3m4 0h9"/><circle cx="13" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>')}</button>`:`<span class="lgn">${n}</span>`}<div class="lgi">${h}</div></div>`).join("");
  const IC_O=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8.5"/></svg>`;
  const btn=profileActions(d,true);
  const av=S.admin?`<button class="avedit" id="dAvEdit" type="button" aria-label="Görseli düzenle" data-tip="Yönetici: bu kaynağın görselini değiştir ya da kaldır">${avatar(d,88)}<span>Düzenle</span></button>`:avatar(d,88);
  const km=META[d.n]||[secLabel(d.s),d.loc||""];
  const pos=$("#sheetPos");if(pos){const i=sheetOrder.indexOf(d.id);pos.textContent=i>=0?`${i+1}/${sheetOrder.length}`:""}
  const cardToolbar=$("#sheetGrab"),floatingToolbar=matchMedia('(max-width:759px)').matches;
  if(cardToolbar){if(floatingToolbar){if(cardToolbar.parentNode!==$("#sheetPanel"))$("#sheetPanel").insertBefore(cardToolbar,el)}else cardToolbar.remove()}
  el.innerHTML=`<div class="cd">
    <div class="profile-cover"></div>
    <div class="cd-hd"><div class="avw${f?" on":""}">${av}${f?`<span class="okb" aria-label="Takipte">${IC_CK}</span>`:""}${inB?`<span class="okb list-badge${f?" with-follow":""}" aria-label="Listeme eklendi">${IC_BMP}</span>`:""}</div>
      <div class="cd-nm"><h2 id="sheetTitle">${esc(d.n)}${isNew(d)?` <span class="pill new">Yeni</span>`:""}</h2><div class="cd-sub"><button type="button" class="profile-category-badge" aria-label="${esc(km[0])}: ilgili kategorideki kaynakları listele">${esc(km[0])}</button>${km[1]?`<i aria-hidden="true">·</i><span>${esc(km[1])}</span>`:""}</div></div></div>${d.now?`<p class="cd-now"><b>Neden şimdi?</b> ${esc(d.now)}</p>`:""}
    <button type="button" class="cd-desc${expandedCardDescriptions.has(d.id)?" is-expanded":""}" aria-expanded="${expandedCardDescriptions.has(d.id)}">${esc(DX[d.n]||d.dx||d.t||"")}</button>${btn}
    <section class="cd-why" aria-label="Bu kaynağı neden izlemeli?">
      <div class="card-topic"><h3><button type="button" class="card-topic-link" aria-label="${esc(lens?lens.n:secOf(d.s).n)} konusundaki kaynakları göster">${SV('<path d="M20 13l-7 7a2 2 0 0 1-3 0l-7-7V3h10l7 7a2 2 0 0 1 0 3Z"/><circle cx="7.5" cy="7.5" r="1"/>')}<span>${esc(lens?lens.n:secOf(d.s).n)}</span></button></h3><p>${esc(lens?lens.d:secOf(d.s).d)}</p></div>
      <button type="button" class="card-rhythm-link" aria-label="${esc(RH[d.r])} sıklığındaki kaynakları göster">${SV('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')}<span>${esc(RH[d.r])} takip</span></button>
      <div class="cd-lists"><span class="cd-row-label">${SV('<rect x="7" y="7" width="14" height="14" rx="2"/><path d="M17 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2M11 12h6M11 16h6"/>')}<span>Listeler</span></span><div class="lchips">${listsOf(d).map(c=>`<button type="button" class="lchip" data-coll="${esc(c.k)}">${esc(c.n)}</button>`).join("")||`<span class="lgnone">Henüz bir hazır listede değil</span>`}</div></div>
    </section>
    <div class="cd-logos" aria-label="Bağlantılar">${logos}</div></div>`;
  if(cardToolbar&&!floatingToolbar)el.querySelector(".profile-cover").append(cardToolbar);
  const description=el.querySelector('.cd-desc');description.onclick=()=>{const expanded=!description.classList.contains('is-expanded');description.classList.toggle('is-expanded',expanded);description.setAttribute('aria-expanded',String(expanded));expanded?expandedCardDescriptions.add(d.id):expandedCardDescriptions.delete(d.id)};

  const openCardFilter=(group,value)=>{
    const origin=captureCategoryOrigin(d),show=()=>{clearF();onlyF(group,value);S.sort='type';sync();setView('list');categoryListOrigin=origin;categoryOriginChanged()};
    closeSheet();if(sheetHistoryBackPending)window.addEventListener('popstate',show,{once:true});else show();
  };
  el.querySelector('.profile-category-badge').onclick=()=>openCardFilter('type',sourceType(d));
  el.querySelector('.card-rhythm-link').onclick=()=>openCardFilter('rh',d.r);
  el.querySelector('.card-topic-link').onclick=()=>openCardFilter(lens?'lens':'sec',lens?d.l:d.s);
  el.querySelector(".card-platform-settings").onclick=()=>openCardPlatforms(d);
  foot.innerHTML="";
  el.querySelectorAll("[data-coll]").forEach(b=>b.onclick=()=>openCardFilter("coll",b.dataset.coll));
  const ae=$("#dAvEdit");if(ae)ae.onclick=()=>{closeSheet();editAvatar(d.n)};
  {const bx=el.querySelector(".lgrow.oth .lgi");const run=(n)=>{if(!bx.isConnected)return;if(bx.clientWidth<10&&n<20)return requestAnimationFrame(()=>run(n+1));fitLogos(bx)};if(bx)run(0)}
  const mb=null;if(mb)mb.onclick=()=>{const x=$("#dXtra"),open=x.hidden;x.hidden=!open;mb.setAttribute("aria-expanded",String(open));mb.textContent=open?"−":`+${more}`;mb.dataset.tip=open?"Daha az göster":"Diğer bağlantılar";
    if(open){const a=x.querySelector("a");if(a)a.focus({preventScroll:true});requestAnimationFrame(()=>x.lastElementChild&&x.lastElementChild.scrollIntoView({block:"nearest",behavior:"smooth"}))}};
  const ba=$("#dAdd");
  if(ba)ba.onclick=(event)=>{const keyboard=event.detail===0,listed=inMyList(d);toggleMyList(d.n);try{navigator.vibrate?.(12)}catch{}toast(listed?"Listemden çıkarıldı":"Listeme eklendi");if(keyboard)$("#dAdd")?.focus({preventScroll:true})};
}

/* ---------- Liste ---------- */
function marks(d,linked,max=5){
  const R=uniqLinks(d),pick=R.slice(0,R.length>max?max-1:max),rest=R.length-pick.length;
  const parts=pick.map(l=>linked?ibtn(l,"sm"):`<span class="ib sm static">${picon(l.p)}</span>`);
  if(rest>0)parts.push(linked?`<button class="ib sm more" type="button" data-more="${d.id}" data-tip="Diğer bağlantılar">+${rest}</button>`:`<span class="ib sm static more">+${rest}</span>`);
  return parts.join("");
}
const SOURCE_PAGE_SIZE=10;
let sourceLimit=SOURCE_PAGE_SIZE,sourceSignature='',sourceSelectionMode=false;
const sourceSelected=new Set();
function orderedSources(){
 const date=d=>{const t=Date.parse(d.at);return Number.isFinite(t)&&t<=Date.now()?t:0};
 const cmp=(a,b)=>(S.sort!=='name'?Number(inMyList(b))-Number(inMyList(a)):0)||(S.sort==='new'?Number(isNew(b))-Number(isNew(a))||date(b)-date(a)||a.n.localeCompare(b.n,'tr'):S.sort==='name'?a.n.localeCompare(b.n,'tr'):S.sort==='rhythm'?"gha".indexOf(a.r)-"gha".indexOf(b.r)||a.n.localeCompare(b.n,'tr'):b.p-a.p||"gha".indexOf(a.r)-"gha".indexOf(b.r)||a.n.localeCompare(b.n,'tr'));
 const all=D.filter(match);
 return S.sort==='type'?TYPES.flatMap(t=>all.filter(d=>sourceType(d)===t.k).sort(cmp)):all.sort(cmp);
}
function updateSourceSelection(){
 const button=$("#saveSelected");button.hidden=!sourceSelectionMode;button.disabled=!sourceSelected.size;button.textContent=`Seçilenleri kaydet${sourceSelected.size?' ('+sourceSelected.size+')':''}`;
 $("#addVisible").textContent=sourceSelectionMode?'Seçimi iptal et':'Kaynak seç';$("#addVisible").setAttribute('aria-pressed',sourceSelectionMode);
}

function highlightSource(id,reveal=false){
  if(reveal&&id&&!sourceSelectionMode){const index=orderedSources().findIndex(d=>d.id===id);if(index>=sourceLimit){sourceLimit=Math.ceil((index+1)/SOURCE_PAGE_SIZE)*SOURCE_PAGE_SIZE;renderList()}}
  document.querySelectorAll('#groups .item').forEach(el=>el.classList.toggle('source-linked',!!id&&el.dataset.id===id));
}
let sourceSaveInPlace=false;
function renderList(){
  const vis=orderedSources(),signature=S.sort+'|'+vis.map(d=>d.id).join('|');
  if(sourceSaveInPlace&&signature===sourceSignature){
   document.querySelectorAll('#groups .item[data-id]').forEach(row=>{
    const d=D.find(d=>d.id===row.dataset.id),button=row.querySelector('[data-listtoggle]'),visual=row.querySelector('.source-avatar-wrap');if(!d||!button)return;
    const listed=inMyList(d);button.setAttribute('aria-pressed',String(listed));button.setAttribute('aria-label',d.n+': '+(listed?'Listemden çıkar':'Listeme ekle'));
    button.innerHTML=SV(listed?'<path d="m5 12 4 4L19 6"/>':'<path d="M6 3h12v18l-6-4-6 4z"/><path d="M12 7v6M9 10h6"/>');
    const badge=visual?.querySelector('.source-saved-badge');if(listed&&!badge)visual?.insertAdjacentHTML('beforeend',`<span class="source-saved-badge" aria-label="Listemde">${IC_BMP}</span>`);else if(!listed)badge?.remove();
   });
   return;
  }
  const eligible=new Set(vis.map(d=>d.n));sourceSelected.forEach(n=>{if(!eligible.has(n))sourceSelected.delete(n)});updateSourceSelection();
  if(signature!==sourceSignature){sourceLimit=SOURCE_PAGE_SIZE;sourceSignature=signature}
  const mobileList=matchMedia("(max-width:759px)").matches;
  const shown=mobileList?vis:vis.slice(0,sourceLimit);
  $("#moreSources").hidden=mobileList||shown.length>=vis.length;
  $("#sourceProgress").textContent=vis.length?`${vis.length} kaynaktan ${shown.length} gösteriliyor`:'';$("#count").textContent=`${vis.length} / ${academicSourcePool().length} kaynak`;
  if(!vis.length){$("#groups").innerHTML=`<div class="empty">${S.recent?'Bu seçimlerle eşleşen, son 30 günde eklenmiş kaynak yok. Eklenme tarihi bilinmeyen kaynaklar burada gösterilmez.':'Bu filtrelerle eşleşen kaynak yok. Aramayı kısaltın ya da bir filtreyi kaldırın.'}</div>`;return}
  const sections=S.sort==='type'?TYPES:S.sort==='rhythm'?[{k:'g',n:'Günlük'},{k:'h',n:'Haftalık'},{k:'a',n:'Dönemsel'}]:S.sort==='new'?[{k:'unread',n:'Henüz incelenmeyen yeni kaynaklar'},{k:'other',n:'Diğer kaynaklar'}]:[{k:'all',n:'Alfabetik'}];
  const inSection=(d,s)=>s.k==='all'||(S.sort==='new'?(s.k==='unread'?isNew(d):!isNew(d)):S.sort==='rhythm'?d.r===s.k:sourceType(d)===s.k);
  $("#groups").innerHTML=sections.map(s=>{const it=shown.filter(d=>inSection(d,s));
    if(!it.length)return"";
    return`<div class="group source-heading-group${S.sort==='type'?' source-type-group':''}"><h3>${s.n}<small>${vis.filter(d=>inSection(d,s)).length} kaynak</small></h3><div class="items">${it.map(d=>`
      <div class="item${S.sel===d.id?" sel":""}${isNew(d)?" isnew":""}" data-id="${d.id}" tabindex="0" role="button" aria-label="${esc(d.n)} kartını aç">
        <div class="rav">${sourceSelectionMode?`<input class="source-select" type="checkbox" data-name="${esc(d.n)}" aria-label="${esc(d.n)} seç" ${sourceSelected.has(d.n)?'checked':''}>`:`<span class="source-avatar-wrap">${avatar(d,56)}${inMyList(d)?`<span class="source-saved-badge" aria-label="Listemde">${IC_BMP}</span>`:""}</span>`}</div>
        <div class="rinfo"><div class="rtx"><span class="source-name-line"><b class="rn">${esc(d.n)}</b>${isNew(d)?`<span class="source-new-label">Yeni</span>`:""}</span><span class="rsub"><span class="source-kind">${esc((META[d.n]||[])[0]||typeName(d))}</span>${((META[d.n]||[])[1]||d.loc)?'<span class="source-kind-separator" aria-hidden="true"> · </span>':''}<span class="source-location${((META[d.n]||[])[1]||d.loc)?'':' source-location-fallback'}">${esc((META[d.n]||[])[1]||d.loc||secLabel(d.s))}</span></span></div></div>
        ${profileActions(d)}
      </div>`).join("")}</div></div>`}).join("");
  document.querySelectorAll('.source-select').forEach(input=>input.addEventListener('change',()=>{input.checked?sourceSelected.add(input.dataset.name):sourceSelected.delete(input.dataset.name);updateSourceSelection()}));
  document.querySelectorAll(".item").forEach(r=>r.addEventListener("click",e=>{
    if(e.target.closest(".source-select"))return;
    const listButton=e.target.closest('[data-listtoggle]');if(listButton){e.stopPropagation();const y=scrollY;sourceSaveInPlace=true;try{toggleBasket(listButton.dataset.listtoggle)}finally{sourceSaveInPlace=false}if(Math.abs(scrollY-y)>1)window.scrollTo({top:y,behavior:'instant'});return}
    const followButton=e.target.closest('[data-followtoggle]');if(followButton){e.stopPropagation();toggleProfileFollow(followButton.dataset.followtoggle);return}
    const lc=e.target.closest(".ilc");if(lc){e.stopPropagation();onlyF("coll",lc.dataset.coll);sync();const g=$("#groups");if(g)g.scrollIntoView({behavior:"smooth",block:"start"});return}
    if(e.target.closest("a.ib"))return;
    openSheet(r.dataset.id,r)}));
  document.querySelectorAll(".item").forEach(r=>r.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target===r){e.preventDefault();openSheet(r.dataset.id,r)}}));
}

/* ---------- Filtreler, süzgeçler, ritim ---------- */
function buildPfChips(){}
const FLBL={type:"Kaynak türü",geo:"Ülke",sec:"Eski koleksiyon",rh:"Takip sıklığı",lens:"Konu / yaklaşım",pf:"Platform",coll:"Hazır liste"};
function fOpts(g){
  const cnt=f=>D.filter(f).length;
  if(g==="type")return TYPES.map(t=>[t.k,t.n,cnt(d=>sourceType(d)===t.k)]);
  if(g==="geo")return Object.entries(SOURCE_COUNTRIES).map(([k,n])=>[k,n,cnt(d=>sourceGeo(d)===k)]).filter(o=>o[2]).sort((a,b)=>{const rank=k=>k==='tr'?0:k==='international'?2:k==='unknown'?3:1;return rank(a[0])-rank(b[0])||a[1].localeCompare(b[1],'tr')});
  if(g==="sec")return SECTORS.map(x=>[x.k,x.n,cnt(d=>d.s===x.k)]);
  if(g==="rh")return Object.entries(RH).map(([k,v])=>[k,v,cnt(d=>d.r===k)]);
  if(g==="lens")return Object.entries(LENS).map(([k,v])=>[k,v.n,cnt(d=>d.l===k)]);
  if(g==="coll")return LISTS.map(c=>[c.k,c.n,listMembers(c).length]);
  return [...FOLLOW.map(f=>[f.k,f.k==="feed"?"Bülten / RSS":f.n,cnt(d=>followLink(d,f.k))]),["akd","Akademik profil",cnt(d=>d.links.some(l=>REG[l.p].g==="akd"&&real(l)))]].filter(o=>o[2]);
}
const fName=(g,v)=>{const o=fOpts(g).find(x=>x[0]===v);return o?o[1]:v};
function renderFChips(){
  const A=activeF();
  [["#fChips","#fWrapBox"],["#rChips",null]].forEach(([sel])=>{const el=$(sel);if(!el)return;
    el.innerHTML=A.length?A.map(([k,n])=>`<button class="chip on-chip" type="button" data-fx="${esc(k)}">${esc(n)} ✕</button>`).join("")
      +`<button class="chip" type="button" data-fx="all">Hepsini temizle</button>`:`<span class="fnone">Süzgeç seçilmedi · tüm kaynaklar gösteriliyor</span>`;
    el.querySelectorAll("[data-fx]").forEach(b=>b.onclick=()=>{const k=b.dataset.fx;
      if(k==="all")clearF();else if(k==="personal"){S.personalIds=null;S.personalLabel=""}else{const[g,v]=k.split(":");if(FSET.includes(g))S[g].delete(v)}sync()})});
}
function activeF(){const a=S.personalIds?[["personal",S.personalLabel]]:[];FSET.forEach(g=>S[g].forEach(v=>a.push([g+":"+v,(g==="coll"?"Liste: ":"")+fName(g,v)])));return a}
const IC_CARD=`<svg class="fdcar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;
function fdClose(except){document.querySelectorAll(".fd.open").forEach(h=>{if(h!==except){h.classList.remove("open");const b=h.querySelector(".fdbtn");if(b)b.setAttribute("aria-expanded","false")}})}
function fillSelects(){
  document.querySelectorAll(".fd").forEach(host=>{
    const g=host.dataset.g;
    if(!host.dataset.init){
      host.dataset.init="1";
      host.innerHTML=`<span class="fdlab">${esc(FLBL[g])}</span><button class="fdbtn" type="button" aria-expanded="false" aria-haspopup="true"><span class="fdsum">Tümü</span>${IC_CARD}</button><div class="fdmenu"></div>`;
      const btn=host.querySelector(".fdbtn");
      btn.onclick=e=>{e.stopPropagation();const open=!host.classList.contains("open");fdClose(host);host.classList.toggle("open",open);btn.setAttribute("aria-expanded",String(open));
        if(open){const f=host.querySelector(".fdopt");if(f)f.focus({preventScroll:true})}};
      host.addEventListener("click",e=>e.stopPropagation());
      host.addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();host.classList.remove("open");btn.setAttribute("aria-expanded","false");btn.focus()}});
    }
    const menu=host.querySelector(".fdmenu");
    menu.innerHTML=fOpts(g).map(o=>`<button class="fdopt" type="button" role="checkbox" aria-checked="${S[g].has(o[0])}" data-v="${esc(o[0])}"><i class="fdbox" aria-hidden="true"></i><span>${esc(o[1])}</span><em>${o[2]}</em></button>`).join("")
      +`<div class="fdfoot"><button class="btn sm" type="button" data-fdclr>Bu süzgeci temizle</button></div>`;
    menu.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{togg(g,b.dataset.v);sync()});
    menu.querySelector("[data-fdclr]").onclick=()=>{S[g].clear();sync()};
  });
  fdPaint();
}
function fdPaint(){
  document.querySelectorAll(".fd").forEach(host=>{const g=host.dataset.g,n=S[g].size;
    const sum=host.querySelector(".fdsum");if(sum)sum.textContent=n?(n===1?fName(g,[...S[g]][0]):n+" seçili"):"Tümü";
    host.classList.toggle("on",n>0);
    host.querySelectorAll("[data-v]").forEach(b=>b.setAttribute("aria-checked",String(S[g].has(b.dataset.v))))});
}
function paintSourceSort(){
 const select=$("#sourceSort"),label=$("#sourceSortValue");
 if(label)label.textContent=select.selectedOptions[0]?.textContent||'Kaynak türü';
 document.querySelectorAll('#sourceSortMenu [data-sort]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.sort===S.sort)));
}
function initSourceSort(){
 const host=$("#sourceSortControl"),btn=$("#sourceSortButton"),menu=$("#sourceSortMenu"),select=$("#sourceSort");
 menu.innerHTML=[...select.options].map(o=>`<button type="button" class="fdopt" role="menuitemradio" aria-checked="${o.value===S.sort}" data-sort="${o.value}"><i class="fdbox" aria-hidden="true"></i><span>${o.textContent}</span></button>`).join('');
 const options=()=>[...menu.querySelectorAll('[data-sort]')];
 const close=()=>{host.classList.remove('open');menu.hidden=true;btn.setAttribute('aria-expanded','false')};
 const open=()=>{fdClose(null);host.classList.add('open');menu.hidden=false;btn.setAttribute('aria-expanded','true');(options().find(b=>b.dataset.sort===S.sort)||options()[0]).focus()};
 btn.onclick=e=>{e.stopPropagation();menu.hidden?open():close()};
 menu.onclick=e=>{const b=e.target.closest('[data-sort]');if(!b)return;S.sort=b.dataset.sort;select.value=S.sort;close();sync();btn.focus({preventScroll:true})};
 host.addEventListener('keydown',e=>{const list=options(),index=list.indexOf(document.activeElement);
  if(e.key==='Escape'){close();btn.focus();e.preventDefault()}
  else if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();if(menu.hidden){open();return}const n=e.key==='Home'?0:e.key==='End'?list.length-1:(index+(e.key==='ArrowDown'?1:-1)+list.length)%list.length;list[n].focus()}
  else if(e.key==='Tab')close();
 });
 document.addEventListener('click',e=>{if(!host.contains(e.target))close()});
 paintSourceSort();
}
function setSourceView(view){S.mine=view==='mine';S.bask=view==='saved';S.recent=view==='new';if(S.recent)S.sort='new';sourceSelectionMode=false;sourceSelected.clear();sync()}
function buildChips(){
  fillSelects();initSourceSort();
  document.addEventListener("click",()=>fdClose(null));
  $("#fClear").onclick=()=>{clearF();sync()};
  {const rc=$("#rClear");if(rc)rc.onclick=()=>{clearF();sync()}}
  $("#fCore").onclick=()=>{S.core=!S.core;sync()};
  {const sh=$("#fShare");if(sh)sh.onclick=shareLink;
   const cv=$("#fCsvV");if(cv)cv.onclick=()=>{const L=D.filter(match);dl("edumind-kaynaklar.csv",csvText(L),`${L.length} kaynak CSV olarak indirildi`)}}
  $("#fMine").onclick=()=>setSourceView("mine");
  $("#fBasket").onclick=()=>setSourceView("saved");
  $("#fAll").onclick=()=>setSourceView("all");$("#fNew").onclick=()=>setSourceView("new");
  $("#sourceSort").onchange=e=>{S.sort=e.target.value;sync()};
  $("#q").addEventListener("input",e=>{S.q=e.target.value.trim();sync()});
  $("#addVisible").onclick=()=>{sourceSelectionMode=!sourceSelectionMode;sourceSelected.clear();renderList()};
  $("#saveSelected").onclick=()=>{let n=0;D.filter(match).filter(d=>sourceSelected.has(d.n)).forEach(d=>{if(!S.basket.has(d.n)){S.basket.add(d.n);n++}});sourceSelected.clear();sourceSelectionMode=false;saveAll();sync();toast(n?`${n} kaynak kaydedildi`:'Seçilen kaynaklar zaten kayıtlı')};
  $("#bClear").onclick=()=>{if(S.clearArm){S.basket.clear();S.follow.clear();S.done.clear();S.clearArm=false;saveAll();sync();toast("Takip listesi boşaltıldı")}else{S.clearArm=true;$("#bClear").textContent="Emin misiniz? Tekrar tıklayın";setTimeout(()=>{S.clearArm=false;const b=$("#bClear");if(b)b.textContent="Listeyi boşalt"},3000)}};
}
function buildLenses(){
  if(!$("#lenses"))return;
  $("#lenses").innerHTML=Object.entries(LENS).map(([k,v])=>`<button class="lens" data-lens="${k}" aria-pressed="false"><small>${D.filter(d=>d.l===k).length} kaynak</small><b>${v.n}</b><span>${v.d}</span></button>`).join("");
  document.querySelectorAll(".lens").forEach(b=>b.onclick=()=>{togg("lens",b.dataset.lens);sync()});
}
function buildRhythm(){
  const cols=[
    {k:"g",t:"Her gün · akışta",p:"Öne çıkan araştırmacılar ve yapay zekâ şirketlerinin duyuru kanalları.",f:d=>d.r==="g"&&d.s!=="tr"},
    {k:"h",t:"Haftalık · tarama",p:"Dergiler, kurumlar, çerçeveler, politika belgeleri ve bültenler.",f:d=>d.r==="h"&&d.s!=="tr"},
    {k:"a",t:"Dönemsel · gerektikçe",p:"Belirli bir konu, ders ya da proje için başvurulacaklar.",f:d=>d.r==="a"&&d.s!=="tr"},
    {k:"tr",t:"Türkiye · kurumlar",p:"Ulusal politika, eğitim ve araştırma kurumları; hepsi tek yerde. Ritimleri kartlarında yazar.",f:d=>d.s==="tr"}];
  $("#rhythm").innerHTML=cols.map(c=>`<div class="rh ${c.k==="g"?"g":""}"><h4>${c.t}</h4><p>${c.p}</p><ul>${D.filter(c.f).map(d=>`<li><button data-id="${d.id}">${esc(short(d.n))}</button></li>`).join("")}</ul></div>`).join("");
  document.querySelectorAll(".rh button").forEach(b=>b.onclick=()=>openSheet(b.dataset.id,b));
}
function buildStats(){
  $("#sTotal").textContent=D.length;$("#sCore").textContent=D.filter(d=>d.c).length;
  $("#sDaily").textContent=D.filter(d=>d.r==="g").length;
  $("#sLinks").textContent=D.reduce((a,d)=>a+d.links.filter(real).length,0);
  document.querySelectorAll(".iTotal").forEach(e=>e.textContent=D.length);
}
function rebuildAll(){
  const selName=(D.find(d=>d.id===S.sel)||{}).n;
  rebuildData();
  S.sel=selName?((D.find(d=>d.n===selName)||{}).id||null):null;
  buildRadar();buildLenses();buildRhythm();renderWeek();buildStats();buildPfChips();fillSelects();sync();
}

/* ---------- Sepet ---------- */
async function copyText(txt,msg){
  try{await navigator.clipboard.writeText(txt);toast(msg)}
  catch(e){const ta=document.createElement("textarea");ta.value=txt;ta.setAttribute("readonly","");ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();
    let ok=false;try{ok=document.execCommand("copy")}catch(_){}ta.remove();toast(ok?msg:"Kopyalanamadı; tarayıcı panoya erişime izin vermedi")}
}
const xmlEsc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]));
let LISTS=DEF_LISTS.map(x=>({...x})),LOVR={};
function rebuildLists(){const out=[];DEF_LISTS.forEach((x,i)=>{const o=LOVR[x.k];if(o&&o.deleted)return;out.push({...x,...(o?{n:o.n||x.n,d:o.d??x.d,m:Array.isArray(o.m)?o.m:x.m}:{}),ord:o&&typeof o.ord==="number"?o.ord:i,ovr:!!o})});
  Object.values(LOVR).forEach(o=>{if(!o||o.deleted||DEF_LISTS.some(x=>x.k===o.k)||!o.k||!o.n)return;out.push({k:o.k,n:o.n,d:o.d||"",m:Array.isArray(o.m)?o.m:[],ord:typeof o.ord==="number"?o.ord:99,custom:true,ovr:true})});
  LISTS=out.sort((a,b)=>a.ord-b.ord);[...S.coll].forEach(k=>{if(!LISTS.some(x=>x.k===k))S.coll.delete(k)})}
const listMembers=c=>D.filter(d=>c.core?d.c:(c.m||[]).includes(d.n));
const listsOf=d=>LISTS.filter(c=>c.core?d.c:(c.m||[]).includes(d.n));
function renderColls(){const el=$("#colls");if(!el)return;
  el.innerHTML=LISTS.map(c=>{const M=listMembers(c),inB=M.filter(inMyList).length,fol=0,todo=M.filter(d=>!inMyList(d)).length;
    const st=[`${M.length} kaynak`];if(inB)st.push(`${inB} listende`);if(fol)st.push(`${fol} takipte`);
    return`<article class="coll"><div class="ch"><b>${esc(c.n)}</b></div><p>${esc(c.d)}</p>
      <div class="cav">${M.slice(0,6).map(d=>avatar(d,30)).join("")}${M.length>6?`<span class="more">+${M.length-6}</span>`:""}</div>
      <div class="cst">${st.join(" · ")}</div>
      <div class="cact"><button class="btn ${todo?"primary":""} sm" type="button" data-cadd="${c.k}"${todo?"":" disabled"}>${todo?`${todo} kaynağı ekle`:(fol===M.length?"Hepsini takip ediyorsun":"Hepsi listende")}</button><button class="btn sm" type="button" data-cview="${c.k}">Kaynakları gör</button></div></article>`}).join("");
  el.querySelectorAll("[data-cadd]").forEach(b=>b.onclick=()=>{const c=LISTS.find(x=>x.k===b.dataset.cadd);let n=0;listMembers(c).forEach(d=>{if(!S.basket.has(d.n)&&!followed(d)){S.basket.add(d.n);n++}});saveAll();sync();toast(`${c.n}: ${n} kaynak takip listene eklendi`)});
  el.querySelectorAll("[data-cview]").forEach(b=>b.onclick=()=>{onlyF("coll",b.dataset.cview);sync();setView("list")});
}
function renderBasket(){
 document.querySelector('.my-list-toolbar-search')?.classList.toggle('has-query',!!myListQuery);
 const B=D.filter(inMyList);renderNav();$("#bClear").hidden=!B.length;
 const csv=$("#bCsv"),opml=$("#bOpmlAll");csv.hidden=!B.length;csv.onclick=()=>{dl("edumind-listem.csv",csvText(B),`${B.length} kaynak indirildi`);$("#myListMenu").open=false};
 const feeds=B.map(d=>[d,rssLink(d)]).filter(x=>x[1]);opml.hidden=!feeds.length;opml.onclick=()=>{dl("edumind-listem.opml",opmlText(feeds),`${feeds.length} akış indirildi`);$("#myListMenu").open=false};
 const otherPlatforms=PFOPTS.filter(([k])=>k!=='feed'&&k!=='yt');
 const platformDefs=[['feed','Bülten / RSS'],['yt','YouTube'],['web','Web'],['all','Tümü'],...otherPlatforms.filter(([k])=>S.pref.has(k)),...otherPlatforms.filter(([k])=>!S.pref.has(k))],counts=Object.fromEntries(platformDefs.map(([k])=>[k,k==='all'?B.length:B.filter(d=>myListAccount(d,k)).length]));
 const platforms=platformDefs.filter(([k])=>k==='all'||counts[k]||k===myListPlatform);
 $("#myListPlatforms").innerHTML=platforms.map(([k,n])=>`<button type="button" data-my-platform="${k}" aria-pressed="${myListPlatform===k}">${k==='all'?'':picon(k==='feed'?'newsletter':k)}<span>${n}</span><small>${counts[k]}</small></button>`).join('');
 $("#myListPlatforms").querySelectorAll('button').forEach(button=>button.onclick=()=>{myListPlatform=button.dataset.myPlatform;renderBasket()});
 const order=new Map();[...S.basket,...S.follow,...B.map(d=>d.n)].forEach(n=>{if(!order.has(n))order.set(n,order.size)});
 const query=norm(myListQuery),R=B.filter(d=>(myListPlatform==='all'||myListAccount(d,myListPlatform))&&(!query||norm(d.n+' '+(META[d.n]||[]).join(' ')+' '+d.t).includes(query)));
 R.sort((a,b)=>myListSort==='name'?a.n.localeCompare(b.n,'tr'):myListSort==='rhythm'?(['g','h','a'].indexOf(a.r)-['g','h','a'].indexOf(b.r)||a.n.localeCompare(b.n,'tr')):order.get(b.n)-order.get(a.n));
 $("#myListCount").innerHTML=`<span class="toolbar-page-label">Listem</span> · <b>${R.length===B.length?B.length:R.length+'/'+B.length}</b>`;
 $("#myListResult").textContent=B.length?`${R.length} / ${B.length} kaynak${myListPlatform==='all'?'':' · '+platformDefs.find(([k])=>k===myListPlatform)[1]}`:'';
 const box=$("#basket");box.innerHTML=R.length?`<div class="my-saved-items">${R.map(d=>{const link=myListPlatform==='all'?null:myListAccount(d,myListPlatform),platformName=platformDefs.find(([k])=>k===myListPlatform)[1],verb=['yt','feed','substack','spotify','apple'].includes(myListPlatform)?'Abone ol':myListPlatform==='discord'?'Katıl':['orcid','openalex'].includes(myListPlatform)?'Profili aç':['web','github','hf'].includes(myListPlatform)?'Siteyi aç':'Takip et';return `<article class="my-saved-row"><button type="button" class="my-saved-card" data-saved-id="${esc(d.id)}" aria-label="${esc(d.n)}: kaynak kartını aç"><span class="my-saved-avatar">${avatar(d,44)}<span class="my-saved-badge" aria-label="Listemde">${IC_BMP}</span></span><span class="my-saved-info"><b>${esc(d.n)}</b><small><span class="my-saved-kind">${esc((META[d.n]||[])[0]||typeName(d))}</span>${link&&link.h?`<span class="my-saved-handle"> · @${esc(link.h.replace(/^@/,''))}</span>`:!link&&((META[d.n]||[])[1]||d.loc)?`<span class="my-saved-handle"> · ${esc((META[d.n]||[])[1]||d.loc)}</span>`:''}</small></span></button><div class="my-saved-actions">${link?`<a class="my-platform-go" href="${esc(link.u)}" target="_blank" rel="noopener" aria-label="${esc(d.n)}: ${esc(platformName)} sayfasını yeni sekmede aç">${verb}<span aria-hidden="true">↗</span></a>`:''}${!link?`<button type="button" class="my-list-remove" data-remove-saved="${esc(d.id)}" aria-label="${esc(d.n)}: Listemden çıkar" title="Listemden çıkar">${IC_CK}</button>`:''}</div></article>`}).join('')}</div>`:`<div class="my-list-empty">${!B.length?'Listeniz boş. Kaynaklar sayfasından kaynak ekleyebilir veya Keşfet sayfasındaki önerileri inceleyebilirsiniz.':'Bu seçimlerle eşleşen kayıtlı kaynak yok.'}${B.length?'<button type="button" id="myListReset">Seçimleri temizle</button>':''}</div>`;
 box.querySelectorAll('[data-saved-id]').forEach(button=>button.onclick=()=>openSheet(button.dataset.savedId,button));
 box.querySelectorAll('[data-remove-saved]').forEach(button=>button.onclick=()=>removeMySavedSource(button.dataset.removeSaved));
 $("#myListReset")?.addEventListener('click',()=>{myListPlatform='all';myListQuery='';$("#myListSearch").value='';renderBasket()});
 centerMyListPlatform();
}
function centerMyListPlatform(){
 const rail=document.querySelector('#myListPlatforms');if(!rail||!rail.clientWidth||!rail.firstElementChild)return;
 rail.style.paddingLeft=Math.max(4,(rail.clientWidth-rail.firstElementChild.offsetWidth)/2)+'px';
 rail.style.paddingRight=Math.max(4,(rail.clientWidth-rail.lastElementChild.offsetWidth)/2)+'px';
 const selected=rail.querySelector('[aria-pressed="true"]');if(!selected)return;
 const r=rail.getBoundingClientRect(),s=selected.getBoundingClientRect();rail.scrollTo({left:rail.scrollLeft+s.left+s.width/2-r.left-rail.clientLeft-rail.clientWidth/2,behavior:'instant'});
}
function myListAccount(d,k){return k==='web'?first(d,'web'):(k==='feed'?followLink(d,k):first(d,k))}
function removeMySavedSource(id){
 const d=D.find(d=>d.id===id);if(!d)return;
 myListUndo={name:d.n,basket:S.basket.has(d.n),basketIndex:[...S.basket].indexOf(d.n),follow:S.follow.has(d.n),done:[...S.done].filter(k=>FOLLOW.some(f=>k===doneKey(f.k,d)))};
 toggleMyList(d.n);const bar=document.querySelector('#myListUndo');bar.querySelector('span').textContent=d.n+' Listem\'den çıkarıldı';bar.hidden=false;clearTimeout(myListUndoTimer);myListUndoTimer=setTimeout(()=>{bar.hidden=true;myListUndo=null},6000);
}
function undoMySavedRemoval(){
 if(!myListUndo)return;const u=myListUndo;
 if(u.basket&&!S.basket.has(u.name)){const names=[...S.basket];names.splice(Math.max(0,Math.min(u.basketIndex,names.length)),0,u.name);S.basket.clear();names.forEach(n=>S.basket.add(n))}if(u.follow)S.follow.add(u.name);u.done.forEach(k=>S.done.add(k));saveAll();sync();clearTimeout(myListUndoTimer);document.querySelector('#myListUndo').hidden=true;myListUndo=null;
}
function wireBasket(el,F,R){
  el.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{S.tab=b.dataset.tab;S.tabTouched=true;renderBasket()});
  const mark=n=>{setTimeout(()=>{S.done.add(F.k+"|"+n);saveAll();sync()},150)};
  el.querySelectorAll("#qNext,[data-open]").forEach(a=>a.addEventListener("click",()=>mark(a.dataset.n||a.dataset.open)));
  el.querySelectorAll("[data-mark]").forEach(b=>b.onclick=()=>mark(b.dataset.mark));
  el.querySelectorAll("[data-undo]").forEach(b=>b.onclick=()=>{S.done.delete(F.k+"|"+b.dataset.undo);saveAll();sync()});
  el.querySelectorAll("[data-rss]").forEach(b=>b.onclick=()=>copyText(b.dataset.rss,"RSS adresi kopyalandı"));
}


/* ---------- v51: ilerleme, yeni eklenenler, haftalık rota, dışa aktarma, adres çubuğu ---------- */
function renderProg(){
  const el=$("#progStrip");if(!el)return;
  const fol=D.filter(followed).length,bas=D.filter(inMyList).length,tot=D.length;
  const core=D.filter(d=>d.c),cf=core.filter(followed).length;
  el.hidden=false;
  const pct=Math.round(fol/tot*100),cpct=Math.round(cf/core.length*100);
  let txt,trk,act="";
  if(!fol&&!bas){txt=`<b>${tot} kaynak</b> hazır. Çekirdek 12 ile başlamak en hızlısı.`;trk=0;
    act=`<button class="btn primary sm" type="button" data-pg="core">Çekirdek 12'yi aç</button>`}
  else if(cf<core.length){txt=`Çekirdek 12'nin <b>${cf}</b> tanesini takip ediyorsunuz${bas?` · ${bas} kaynak listenizde`:""}.`;trk=cpct;
    act=`<button class="btn sm" type="button" data-pg="core">Eksik çekirdekleri gör</button>`}
  else {txt=`<b>${fol} / ${tot}</b> kaynağı takip ediyorsunuz · çekirdeğin hepsi tamam.`;trk=pct;
    act=`<button class="btn sm" type="button" data-pg="mine">Takip ettiklerim</button>`}
  el.innerHTML=`<span class="pt">${txt}</span><span class="ptrk"><i class="${cf===core.length&&fol?"ok":""}" style="width:${Math.max(trk,2)}%"></i></span>${act}`;
  el.querySelectorAll("[data-pg]").forEach(b=>b.onclick=()=>{const k=b.dataset.pg;
    if(k==="core"){onlyF("coll","core");S.mine=false}else{S.mine=true;S.coll.clear()}
    sync();setView("list")});
}
function renderNewStrip(){
  const el=$("#newStrip");if(!el)return;
  const latest=academicSourcePool().filter(isNewCandidate).sort((a,b)=>String(b.at).localeCompare(String(a.at))||a.n.localeCompare(b.n,"tr"));
  const shown=latest.slice(0,innerWidth<360?3:innerWidth<420?4:6),remaining=latest.length-shown.length;
  el.hidden=false;
  el.innerHTML=`<button type="button" class="recent-summary" ${latest.length?"":"hidden"} aria-label="Yeni eklenen ${latest.length} kaynağı listede gör" ${latest.length?"":"disabled"}><span class="recent-summary-label">Yeni:</span><span class="recent-avatar-stack" aria-hidden="true">${shown.map(d=>avatar(d,36)).join("")}</span>${remaining?`<span class="recent-summary-more" aria-hidden="true">+${remaining}</span>`:""}${latest.length?"":`<span class="recent-summary-empty">Henüz yok</span>`}</button><span class="recent-source-count" aria-live="polite">Radarda: <b>${D.filter(match).length}</b> / ${academicSourcePool().length}</span>`;
  el.querySelector('.recent-summary').onclick=()=>{if(!latest.length)return;clearF();S.recent=true;S.sort="new";sourceSelectionMode=false;sourceSelected.clear();sync();setView("list")};
}

const WEEK=[
 {d:1,n:"Pazartesi",t:"Haftaya bakış",s:"Bültenler ve yapay zekâ şirketlerinin duyuruları",f:d=>d.s==="plat"||(d.r!=="a"&&feedLinks(d).length>0)},
 {d:3,n:"Çarşamba",t:"Araştırma taraması",s:"Dergiler, konferanslar ve kurum raporları",f:d=>d.s==="akd"||(d.s==="kurum"&&d.r!=="a")},
 {d:5,n:"Cuma",t:"Türkiye ve sınıf",s:"Ulusal gündem ile sınıfta işe yarayan uygulamalar",f:d=>d.s==="tr"||d.l==="prat"}
];
function renderWeek(){
  const el=$("#week");if(!el)return;
  const today=new Date().getDay(),G=D.filter(d=>d.r==="g");
  el.innerHTML=`<h3>Haftalık rota</h3>
    <p>Her gün her şeye bakmak gerekmez. Önerilen düzen: her sabah birkaç dakika akış, haftada üç gün derinlemesine tarama.</p>
    <ul class="wdays">
      <li class="${[1,3,5].includes(today)?"":"today"}"><span class="wd">Her sabah <em>5 dk</em></span><b>Akış taraması</b><span>Günlük ritimdeki hesaplara göz atın.</span><span class="wcount">${G.length} kaynak</span><button class="btn sm" type="button" data-wk="g">Aç</button></li>
      ${WEEK.map(w=>{const n=D.filter(w.f).length;return`<li class="${today===w.d?"today":""}"><span class="wd">${w.n} <em>${today===w.d?"bugün":"20–30 dk"}</em></span><b>${w.t}</b><span>${w.s}</span><span class="wcount">${n} kaynak</span><button class="btn sm" type="button" data-wk="${w.d}">Aç</button></li>`}).join("")}
    </ul>`;
  el.querySelectorAll("[data-wk]").forEach(b=>b.onclick=()=>{const k=b.dataset.wk;
    clearF();
    if(k==="g"){S.rh.add("g");S.week=null}else{const w=WEEK.find(x=>String(x.d)===k);S.week=w?w.d:null}
    sync();setView("list")});
}
/* Dışa aktarma */
let DLCAP;
async function dl(filename,data,msg){
  if(DLCAP===undefined)DLCAP=await (window.claude&&claude.use?claude.use("downloads"):null).catch(()=>null);
  if(DLCAP&&DLCAP.save){try{await DLCAP.save({filename,data});toast(msg);return true}catch(e){if(e&&e.code==="declined")return false}}
  try{const b=new Blob([data],{type:"text/plain;charset=utf-8"}),u=URL.createObjectURL(b),a=document.createElement("a");
    a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);toast(msg);return true}
  catch(e){copyText(data,"İndirilemedi; metin panoya kopyalandı");return false}
}
function opmlText(RL){
  const body=RL.map(([d,l])=>`      <outline type="rss" text="${xmlEsc(l.lb||d.n)}" title="${xmlEsc(l.lb||d.n)}" xmlUrl="${xmlEsc(l.u)}"/>`).join("\n");
  return`<?xml version="1.0" encoding="UTF-8"?>\n<opml version="2.0">\n  <head><title>AcademiCore AI Radar</title></head>\n  <body>\n    <outline text="AcademiCore AI Radar" title="AcademiCore AI Radar">\n${body}\n    </outline>\n  </body>\n</opml>\n`;
}
function csvText(L){
  const q=v=>`"${String(v==null?"":v).replace(/"/g,'""')}"`;
  const head=["Ad","Tür","Kurum/Konum","Kategori","Ritim","Öncelik","Süzgeç","Listeler","Durum","Bağlantılar"];
  const rows=L.map(d=>[d.n,(META[d.n]||[])[0]||secLabel(d.s),(META[d.n]||[])[1]||"",secOf(d.s).n,RH[d.r],d.p,d.l?LENS[d.l].n:"",
    listsOf(d).map(c=>c.n).join(" | "),followed(d)?"Takipte":(S.basket.has(d.n)?"Listemde":""),
    d.links.filter(real).map(l=>l.u).join(" | ")]);
  return"﻿"+[head,...rows].map(r=>r.map(q).join(";")).join("\r\n")+"\r\n";
}
/* Adres çubuğunda süzgeç durumu */
const HKEY={type:"tur",geo:"cografya",sec:"dilim",rh:"ritim",lens:"suzgec",coll:"liste",pf:"platform",q:"ara",recent:"yeni",sort:"sirala"};
let hashLock=false;
function writeHash(){
  if(hashLock)return;
  const vk={radar:"radar",list:"liste",follow:"sepet",discover:"kesfet",rhythm:"ritim",admin:"yonetim",intro:"tanitim"}[S.view]||"radar";
  const prm=[];
  Object.entries(HKEY).forEach(([k,n])=>{const v=S[k];
    if(v instanceof Set){if(v.size)prm.push(n+"="+[...v].map(encodeURIComponent).join(","))}
    else if(v)prm.push(n+"="+encodeURIComponent(v))});
  if(S.week)prm.push("gun="+S.week);
  if(S.core)prm.push("cekirdek=1");if(S.mine)prm.push("takipte=1");if(S.bask)prm.push("listemde=1");
  const h="#"+vk+(prm.length?"?"+prm.join("&"):"");
  if(location.hash!==h){hashLock=true;try{history.replaceState(null,"",h)}catch(e){}hashLock=false}
}
function readHash(){
  const raw=String(location.hash||"").replace(/^#/,""),[vk,qs]=raw.split("?");
  const vm={radar:"radar",liste:"list",sepet:"follow",kesfet:"discover",ritim:"rhythm",yonetim:"admin",tanitim:"intro"};
  const out={view:vm[vk]||null};
  if(qs){const u=new URLSearchParams(qs);
    Object.entries(HKEY).forEach(([k,n])=>{const v=u.get(n);if(v)out[k]=FSET.includes(k)?v.split(","):v});
    const g=u.get("gun");if(g)out.week=Number(g);
    if(u.get("cekirdek"))out.core=true;if(u.get("takipte"))out.mine=true;if(u.get("listemde"))out.bask=true}
  return out;
}
function applyHash(h){
  if(h.sort&&! ["type","new","name","rhythm"].includes(h.sort))delete h.sort;
  if(h.recent!==undefined)h.recent=h.recent==="1"||h.recent==="true";
  Object.keys(HKEY).forEach(k=>{if(h[k]===undefined)return;
    if(FSET.includes(k)){S[k].clear();[].concat(h[k]).forEach(v=>S[k].add(v))}else S[k]=h[k]});
  if(h.week&&WEEK.some(x=>x.d===h.week))S.week=h.week;
  if(h.core)S.core=true;if(h.mine)S.mine=true;if(h.bask)S.bask=true;
  [...S.sec].forEach(v=>{if(!SECTORS.some(x=>x.k===v))S.sec.delete(v)});
  [...S.rh].forEach(v=>{if(!RH[v])S.rh.delete(v)});
  [...S.lens].forEach(v=>{if(!LENS[v])S.lens.delete(v)});
  [...S.coll].forEach(v=>{if(!LISTS.some(x=>x.k===v))S.coll.delete(v)});
  if($("#q"))$("#q").value=S.q||"";
}
function shareLink(){
  writeHash();
  copyText(location.href,"Bağlantı kopyalandı · bu süzgeçlerle açılır");
}

/* ---------- Çekirdek ---------- */
function select(id){openSheet(id)}
function toggleBasket(n){toggleMyList(n)}
function sync(){
  $("#fAll").setAttribute('aria-pressed',!S.mine&&!S.bask&&!S.recent);$("#fNew").setAttribute('aria-pressed',!!S.recent);
  $("#sourceSort").value=S.sort;paintSourceSort();$("#sourceViewNote").hidden=!S.recent;
  document.querySelectorAll("[data-rh]").forEach(b=>b.setAttribute("aria-pressed",S.rh.has(b.dataset.rh)));
  if($("#sColl")){if($("#sColl").options.length!==LISTS.length+1)fillSelects();
    $("#fClear").hidden=!anyF()}
  fillSelects();renderFChips();
  document.querySelectorAll(".lens").forEach(b=>{const on=S.lens.has(b.dataset.lens);b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)});
  $("#fCore").setAttribute("aria-pressed",S.core);$("#fMine").setAttribute("aria-pressed",S.mine);$("#fBasket").setAttribute("aria-pressed",S.bask);
  $("#sMine").textContent=D.filter(followed).length;
  $("#sBasket").textContent=D.filter(inMyList).length;
  renderList();renderDetail();paintRadar();renderBasket();renderColls();renderProg();renderNewStrip();
  {const fs=$("#fSum");if(fs){const a=activeF().map(x=>x[1]);
    fs.textContent=a.length?a.join(" · "):"Tümü";const fw=$("#fWrap");if(fw&&a.length&&!fw.open)fw.open=true}}
  {const ps=$("#pfSum");if(ps)ps.textContent=S.pref.size?[...S.pref].map(k=>(PFOPTS.find(o=>o[0]===k)||[,k])[1]).join(", "):"Henüz seçmediniz"}
  writeHash();
}
function toast(t){const e=$("#toast");e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,2400)}


/* ---------- Yönetici: kaynak görselleri ---------- */
const avSlug=n=>"a_"+norm(n).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,80);
function avFill(){const sel=$("#avSel");if(!sel)return;const q=norm($("#avFind").value||"");const cur=sel.value;
  const L=D.filter(d=>!q||norm(d.n).includes(q)).sort((a,b)=>a.n.localeCompare(b.n,"tr"));
  sel.innerHTML=L.map(d=>{const k=avState(d).kind;return`<option value="${esc(d.n)}">${esc(d.n)}${k==="admin"?" · yüklendi":k==="removed"?" · kaldırıldı":k==="none"?" · görsel yok":""}</option>`}).join("");
  if(L.some(d=>d.n===cur))sel.value=cur}
function renderAvAdmin(){
  if(!$("#avSel"))return;avFill();const d=D.find(x=>x.n===$("#avSel").value);
  if(!d){$("#avPrev").innerHTML="";$("#avName").textContent="Kaynak bulunamadı";$("#avStat").textContent="";return}
  const st=avState(d);$("#avPrev").innerHTML=avatar(d,96);$("#avName").textContent=d.n;
  $("#avStat").textContent=st.kind==="x"?"X profilinden alınan görsel (17 Ekim 2026)":st.kind==="admin"?`Yönetici yükledi · ${new Date(st.at||0).toLocaleString("tr-TR")}`:st.kind==="removed"?"Görsel kaldırıldı; baş harfler gösteriliyor":"Görsel yok; baş harfler gösteriliyor";
  $("#avDel").disabled=st.kind==="removed"||st.kind==="none";$("#avReset").disabled=!AVO[d.n];
  [$("#avDel"),$("#avReset"),$("#avUpLbl")].forEach(b=>b&&b.classList.toggle("busy",false));
}
async function avSave(name,body){if(!A.db){toast("Veritabanına ulaşılamıyor");return false}
  try{await A.db.collection("avatars").doc(avSlug(name)).set({name,...body,at:new Date().toISOString(),...(A.uid?{by:A.uid}:{})});return true}
  catch(e){toast(e&&e.code==="invalid_argument"?"Bu hesapla kaydetme yetkiniz yok":"Kaydedilemedi; tekrar deneyin");return false}}
async function avFromFile(file){
  const name=$("#avSel").value;if(!name)return;
  if(!file||!/^image\/(png|jpeg|webp|gif)$/.test(file.type)){toast("PNG, JPG, WebP ya da GIF bir görsel seçin");return}
  if(file.size>15*1024*1024){toast("Görsel 15 MB'tan küçük olmalı");return}
  try{const bm=await createImageBitmap(file);const sz=Math.min(bm.width,bm.height);const c=document.createElement("canvas");c.width=c.height=128;
    const g=c.getContext("2d");g.imageSmoothingQuality="high";g.drawImage(bm,(bm.width-sz)/2,(bm.height-sz)/2,sz,sz,0,0,128,128);
    let u=c.toDataURL("image/webp",0.85);if(!u.startsWith("data:image/webp"))u=c.toDataURL("image/jpeg",0.85);
    if(await avSave(name,{img:u,removed:false}))toast("Görsel kaydedildi")}
  catch(e){toast("Görsel okunamadı; başka bir dosya deneyin")}
}
function initAvAdmin(){
  if(!$("#avSel"))return;
  $("#avFind").addEventListener("input",renderAvAdmin);$("#avSel").onchange=renderAvAdmin;
  $("#avFile").onchange=e=>{const f=e.target.files&&e.target.files[0];e.target.value="";avFromFile(f)};
  $("#avUpLbl").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();$("#avFile").click()}});
  const dz=$("#avDrop");dz.addEventListener("dragover",e=>{e.preventDefault();dz.classList.add("over")});dz.addEventListener("dragleave",()=>dz.classList.remove("over"));
  dz.addEventListener("drop",e=>{e.preventDefault();dz.classList.remove("over");const f=e.dataTransfer.files&&e.dataTransfer.files[0];avFromFile(f)});
  $("#avAdmin").addEventListener("paste",e=>{const it=[...(e.clipboardData||{}).items||[]].find(i=>i.kind==="file");if(it){e.preventDefault();avFromFile(it.getAsFile())}});
  $("#avDel").onclick=async()=>{const b=$("#avDel");if(b.dataset.arm!=="1"){b.dataset.arm="1";b.textContent="Emin misiniz?";setTimeout(()=>{b.dataset.arm="";b.textContent="Görseli kaldır"},3000);return}
    b.dataset.arm="";b.textContent="Görseli kaldır";if(await avSave($("#avSel").value,{removed:true,img:""}))toast("Görsel kaldırıldı")};
  $("#avReset").onclick=async()=>{const n=$("#avSel").value;if(!A.db||!AVO[n])return;try{await A.db.collection("avatars").doc(avSlug(n)).delete();toast("Varsayılan görsele dönüldü")}catch(e){toast("İşlem yapılamadı")}};
  renderAvAdmin();
}
function editAvatar(name){setView("admin");setTimeout(()=>{if(!$("#avSel"))return;$("#avFind").value="";avFill();$("#avSel").value=name;renderAvAdmin();$("#avAdmin").scrollIntoView({block:"start"})},PAGED()?50:500)}

/* ---------- Yönetici ---------- */
const A={db:null,sample:null,uid:null,ctl:null,prop:null};
async function initRuntime(){ S.admin=false; }

const LS={sel:null,draft:null};
function renderListAdmin(){const sel=$("#lsSel");if(!sel)return;
  if(!LS.sel||(!LISTS.some(x=>x.k===LS.sel)&&!(LS.draft&&LS.draft.k===LS.sel)))LS.sel=(LISTS[0]||{}).k;
  sel.innerHTML=LISTS.map(c=>`<option value="${esc(c.k)}"${c.k===LS.sel?" selected":""}>${esc(c.n)}${c.ovr?" •":""}</option>`).join("")+(LS.draft&&!LISTS.some(x=>x.k===LS.draft.k)?`<option value="${esc(LS.draft.k)}" selected>${esc(LS.draft.n||"Yeni liste")}</option>`:"");
  sel.onchange=()=>{LS.sel=sel.value;LS.draft=null;renderListForm()};
  $("#lsNew").onclick=()=>{const k="u"+Date.now().toString(36);LS.draft={k,n:"",d:"",m:[],custom:true,isNew:true};LS.sel=k;renderListAdmin()};
  renderListForm()}
function renderListForm(){const f=$("#lsForm");if(!f)return;
  const c=(LS.draft&&LS.draft.k===LS.sel)?LS.draft:LISTS.find(x=>x.k===LS.sel);if(!c){f.innerHTML="";return}
  const mem=new Set(c.core?D.filter(d=>d.c).map(d=>d.n):(c.m||[]));const def=DEF_LISTS.find(x=>x.k===c.k);
  f.innerHTML=`<div class="lsf"><label class="fld"><span>Liste adı</span><input id="lsN" type="text" maxlength="40" value="${esc(c.n)}"></label>
    <label class="fld"><span>Kısa açıklama</span><input id="lsD" type="text" maxlength="110" value="${esc(c.d||"")}"></label></div>
    ${c.core?`<p class="note">Bu listenin üyeleri kaynakların "Çekirdek 12" işaretinden gelir; burada yalnızca adı ve açıklaması değişir.</p>`:`<div class="arow"><input id="lsFind" type="search" placeholder="Kaynak ara" aria-label="Kaynak ara"><span class="hint" id="lsCnt"></span></div>
    <div class="lsgrid" id="lsGrid">${SECTORS.map(s=>{const L=D.filter(d=>d.s===s.k);if(!L.length)return"";return`<fieldset><legend>${esc(s.n)}</legend>${L.map(d=>`<label class="lsit" data-n="${esc(norm(d.n))}"><input type="checkbox" value="${esc(d.n)}"${mem.has(d.n)?" checked":""}><span>${esc(d.n)}</span></label>`).join("")}</fieldset>`}).join("")}</div>`}
    <div class="arow"><button class="btn primary" id="lsSave" type="button">Kaydet</button>${def&&c.ovr?`<button class="btn" id="lsReset" type="button">Varsayılana dön</button>`:""}${!c.core&&!c.isNew?`<button class="btn" id="lsDel" type="button">Listeyi kaldır</button>`:""}<span class="astatus" id="lsSt" aria-live="polite"></span></div>`;
  const cnt=()=>{const e=$("#lsCnt");if(e)e.textContent=`${f.querySelectorAll(".lsit input:checked").length} kaynak seçili`};cnt();
  f.querySelectorAll(".lsit input").forEach(i=>i.onchange=cnt);
  const fi=$("#lsFind");if(fi)fi.oninput=()=>{const q=norm(fi.value);f.querySelectorAll(".lsit").forEach(l=>l.hidden=!!q&&!l.dataset.n.includes(q))};
  const st=$("#lsSt");const ord=LISTS.findIndex(x=>x.k===c.k);
  const put=async(body,msg)=>{if(!A.db){st.textContent="Veritabanına ulaşılamıyor.";st.className="astatus err";return}
    const keepDraft=LS.draft;LS.draft=null;try{await A.db.collection("lists").doc(c.k).set({k:c.k,...body,at:new Date().toISOString(),...(A.uid?{by:A.uid}:{})});LS.sel=c.k;renderListAdmin();const s2=$("#lsSt");if(s2){s2.textContent=msg;s2.className="astatus ok"}}catch(e){LS.draft=keepDraft;st.textContent="Kaydedilemedi: "+(e&&e.message||e);st.className="astatus err"}};
  $("#lsSave").onclick=()=>{const n=$("#lsN").value.trim(),d=$("#lsD").value.trim();if(!n){st.textContent="Liste adını yazın.";st.className="astatus err";return}
    const body={n,d,ord:ord>=0?ord:LISTS.length};if(!c.core)body.m=[...f.querySelectorAll(".lsit input:checked")].map(i=>i.value);
    if(!c.core&&!body.m.length){st.textContent="En az bir kaynak seçin.";st.className="astatus err";return}
    put(body,"Kaydedildi.")};
  const r=$("#lsReset");if(r)r.onclick=async()=>{try{await A.db.collection("lists").doc(c.k).delete();st.textContent="Varsayılana dönüldü.";st.className="astatus ok"}catch(e){st.textContent="İşlem yapılamadı.";st.className="astatus err"}};
  const dl=$("#lsDel");if(dl)dl.onclick=()=>{if(def)put({deleted:true,n:c.n},"Liste kaldırıldı.");else A.db.collection("lists").doc(c.k).delete().then(()=>{st.textContent="Liste silindi.";st.className="astatus ok"}).catch(()=>{st.textContent="Silinemedi.";st.className="astatus err"})};
}
function renderAdmin(){
  const el=$("#admin");
  el.innerHTML=`<span class="lock">Yalnızca yönetici</span>
    <div><h3 class="ah">Kaynak ekle ya da güncelle</h3>
    <p class="note">Bir bağlantı (site, X, LinkedIn, Bluesky, YouTube, Instagram, TikTok, bülten, Google Scholar…), bir hesap adı (@kullanici) ya da profil biyografisi gibi bir metin yapıştırın. Claude girdiyi tarar; mevcut bir kaynağa aitse o kaynağa ekler, değilse yeni kaynak önerir, uygun dilimi, ritmi ve süzgeci seçer, açıklamayı Türkçe yazar ve bulduğu her bağlantının nereden geldiğini belirtir.</p></div>
    <textarea id="aIn" placeholder="Örnek: @kullaniciadi  ·  https://www.tiktok.com/@hesap  ·  https://scholar.google.com/citations?user=…  ·  ya da profil biyografisi"></textarea>
    <div class="arow">
      <input id="aCtx" type="text" placeholder="Kurum / meslek ipucu (aynı adlı kişileri ayırmak için), ör. University College London" aria-label="Kurum ya da meslek ipucu">
      <select id="aHint" aria-label="Kategori ipucu"><option value="">Kategori: Claude seçsin</option>${SECTORS.map(s=>`<option value="${s.k}">${s.n}</option>`).join("")}</select>
    </div>
    <div class="arow">
      <button class="btn primary" id="aScan" type="button">Tara ve öner</button>
      <button class="btn" id="aStop" type="button" hidden>Durdur</button>
      <button class="btn" id="aManual" type="button">Elle doldur</button>
    </div>
    <div class="astatus" id="aStatus" aria-live="polite"></div>
    <div id="aProp"></div>
    <p class="note">Claude canlı sayfaları açmaz; girdideki bilgiyi ve kendi bilgisini kullanır. Girdide geçmeyen bağlantılar "Claude önerdi, doğrulanmadı" olarak gelir ve kırmızı çerçevelenir; açıp kontrol ettikten sonra doğrulama sütununu "Yönetici kontrol etti" yapın. Doğrulanmamış bağlantılar sayfada etiketiyle görünür.</p>
    <div><h3 class="ah">Eklenenler ve güncellemeler</h3><ul class="alist" id="aList"></ul></div>
    <div class="avadmin" id="avAdmin"><h3 class="ah">Kaynak görselleri</h3>
      <p class="note">Bir kaynak seçin; görselini yükleyin, kaldırın ya da X profilinden alınan varsayılana döndürün. Yüklenen görsel kare olarak ortadan kırpılır ve 128 piksele küçültülür; değişiklik herkeste hemen görünür.</p>
      <div class="arow"><input id="avFind" type="search" placeholder="Kaynak ara" aria-label="Kaynak ara" autocomplete="off"><select id="avSel" aria-label="Kaynak seç"></select></div>
      <div class="avrow" id="avDrop">
        <div id="avPrev"></div>
        <div class="avinfo"><b id="avName"></b><small id="avStat"></small>
          <div class="arow"><label class="btn primary" for="avFile" tabindex="0" id="avUpLbl">Görsel yükle</label><input type="file" id="avFile" accept="image/png,image/jpeg,image/webp,image/gif" hidden>
          <button class="btn" id="avDel" type="button">Görseli kaldır</button><button class="btn" id="avReset" type="button">Varsayılana dön</button></div>
          <small class="hint">Görseli bu kutuya sürükleyip bırakabilir ya da panodan yapıştırabilirsiniz.</small></div>
      </div></div>
    <div class="avadmin lsadmin" id="lsAdmin"><h3 class="ah">Hazır listeler</h3>
      <p class="note">Bir liste seçin; adını, açıklamasını ve içindeki kaynakları düzenleyin. Kaydettiğiniz değişiklik herkeste hemen görünür. "Varsayılana dön" ilk hâline döndürür.</p>
      <div class="arow"><select id="lsSel" aria-label="Liste seç"></select><button class="btn" id="lsNew" type="button">+ Yeni liste</button></div>
      <div id="lsForm"></div></div>`;
  if(!A.db){$("#aStatus").textContent="Paylaşılan veritabanına bu görünümde ulaşılamıyor; eklemeler kaydedilemez.";$("#aStatus").className="astatus err"}
  if(!A.sample){$("#aScan").disabled=true;$("#aScan").title="Claude'a bu görünümde ulaşılamıyor"}
  $("#aScan").onclick=scan;$("#aStop").onclick=()=>A.ctl?.abort();
  $("#aManual").onclick=()=>{A.prop={mode:"new",v:{n:"",s:$("#aHint").value||"kurum",r:"a",p:2,links:[{p:"web",u:"",v:"a"}]}};renderProposal()};
  renderAdminList();initAvAdmin();renderListAdmin();
}
function buildPrompt(input,ctx,hint){
  const list=D.map(d=>`- ${d.n} [${d.s}] ${d.links.filter(real).filter(l=>l.h||l.p==="web").slice(0,4).map(l=>l.p+":"+(l.h||l.u.replace(/^https?:\/\//,""))).join(" ")}`).join("\n");
  return `Sen "AcademiCore AI Radar" adlı, eğitimde yapay zekâ ve genel AI gelişmelerini izlemek için kaynak listesi tutan Türkçe bir sitenin editörüsün. Yönetici aşağıdaki GİRDİ'yi verdi. Görevin: girdinin hangi kişi/kurum/yayına ait olduğunu bulmak; mevcut listede varsa ona eklenecek bağlantıları, yoksa yeni bir kaynak kaydı önermek; o kişiye/kuruma ait bildiğin tüm herkese açık hesapları platform + url biçiminde çıkarmak.

Bugün: 17 Ekim 2026. Canlı web'e erişimin yok.

KATEGORİLER (s):
${SECTORS.map(s=>`${s.k}: ${s.n} — ${s.d}`).join("\n")}
RİTİM (r): g = her gün, h = haftalık, a = ara sıra
ÖNCELİK (p): 3 en yüksek, 2 orta, 1 düşük
SÜZGEÇ (l, isteğe bağlı): ${Object.entries(LENS).map(([k,v])=>`${k} = ${v.n}`).join("; ")}
PLATFORM ANAHTARLARI (links[].p): ${Object.entries(REG).map(([k,v])=>`${k}=${v.n}`).join(", ")}
${ctx?`Yöneticinin kurum/meslek ipucu: ${ctx}\n`:""}${hint?`Yöneticinin kategori ipucu: ${hint}\n`:""}
MEVCUT LİSTE:
${list}

KURALLAR:
- Girdi mevcut listedeki bir kaynağa aitse action = "update" ve base = listedeki adın birebir aynısı; değilse action = "new", base = null.
- Aynı adı taşıyan birden çok kişi olabilir ve girdi ile ipucu hangisi olduğunu ayırmaya yetmiyorsa, links'i boş bırak ve "question" alanına yöneticiye kısa bir Türkçe netleştirme sorusu yaz (ör. kurum ya da meslek bilgisi iste). Aksi hâlde question = "".
- links: her eleman {"p":"<platform anahtarı>","u":"<tam https URL>","src":"girdi"|"bilgi"}. Girdide açıkça geçen bağlantı/hesap için src = "girdi". Girdide geçmeyen bir hesabı yalnızca o kişinin/kurumun resmi hesabı olduğundan kesin eminsen ekle ve src = "bilgi" yaz; emin değilsen hiç ekleme. Arama sayfası bağlantısı verme.
- X için https://x.com/ad, Bluesky için https://bsky.app/profile/ad, Mastodon için https://sunucu/@ad biçimini kullan.
- t: kaynağın neden izlenmeye değer olduğunu anlatan 1 cümlelik Türkçe açıklama (en çok 160 karakter); özel adlar özgün dilinde kalır. w: kısa Türkçe kanal listesi, ör. "X · LinkedIn · Bülten". n: yaygın kullanılan ad ("update" ise mevcut ad).
- note: varsa yöneticiye kısa Türkçe not (belirsizlik, eski kullanıcı adları vb.).

Yalnızca şu biçimde tek bir JSON nesnesi döndür:
{"action":"new","base":null,"question":"","n":"","s":"ai","r":"a","p":2,"l":"","t":"","w":"","links":[{"p":"x","u":"https://x.com/ornek","src":"girdi"}],"note":""}

GİRDİ:
"""
${input.slice(0,6000)}
"""`;
}
async function scan(){
  const input=$("#aIn").value.trim();if(!input){$("#aStatus").textContent="Önce bir bağlantı, hesap adı ya da metin yapıştırın.";$("#aStatus").className="astatus err";return}
  if(!A.sample)return;
  A.ctl=new AbortController();$("#aScan").disabled=true;$("#aStop").hidden=false;
  $("#aStatus").className="astatus";$("#aStatus").textContent="Claude girdiyi tarıyor… (ilk kullanımda izin isteyebilir)";
  try{
    const r=await A.sample.json(buildPrompt(input,$("#aCtx").value.trim(),$("#aHint").value),{signal:A.ctl.signal,cache:false});
    if(!r||typeof r!=="object")throw{code:"invalid_json"};
    const links=(Array.isArray(r.links)?r.links:[]).map(l=>({p:REG[l&&l.p]?l.p:"web",u:String(l&&l.u||""),v:l&&l.src==="girdi"?"a":"c"}));
    if(r.question&&!links.length){
      A.prop=null;renderProposal();
      $("#aStatus").className="astatus";$("#aStatus").innerHTML=`<b>Claude netleştirme istiyor:</b> ${esc(r.question)} <br>Cevabı "Kurum / meslek ipucu" alanına yazıp yeniden tarayın.`;
      $("#aCtx").focus();return;
    }
    const base=r.action==="update"&&D.some(d=>d.n===r.base)?r.base:null;
    A.prop={mode:base?"patch":"new",base,v:{...r,links}};
    $("#aStatus").textContent=(base?`Mevcut kaynakla eşleşti: ${base}. `:"Yeni kaynak önerisi hazır. ")+`${links.length} bağlantı bulundu; ${links.filter(l=>l.v==="c").length} tanesi girdide geçmiyor, kontrol edin.`;
    renderProposal();
  }catch(e){
    const m={cancelled:"Durduruldu.",not_granted:"Claude kullanımına izin verilmedi; alanları elle doldurabilirsiniz.",rate_limited:"Çok sık istek gönderildi; biraz sonra tekrar deneyin.",invalid_json:"Claude'un cevabı okunamadı. Girdiyi kısaltıp tekrar deneyin.",refused:"Claude bu girdiyi işlemedi; farklı bir metin deneyin."};
    $("#aStatus").textContent=m[e&&e.code]||"Tarama tamamlanamadı. Tekrar deneyin ya da elle doldurun.";$("#aStatus").className="astatus err";
  }finally{$("#aScan").disabled=false;$("#aStop").hidden=true}
}
const CORE_FIELDS=[["n","Ad","text"],["s","Kategori (dilim)","sec"],["r","Ritim","rh"],["p","Öncelik","p"],["l","Süzgeç","lens"],["w","Kanallar","text"],["t","Açıklama (Türkçe)","area"],["now","Neden şimdi? (kartta vurgulanır)","text"],["note","Not","area"]];
function renderProposal(){
  const P=A.prop,el=$("#aProp");if(!P){el.innerHTML="";return}
  const v=P.v;
  const opt=(arr,cur)=>arr.map(([k,n])=>`<option value="${esc(k)}"${String(cur)===String(k)?" selected":""}>${esc(n)}</option>`).join("");
  const field=([k,lab,type])=>{const cur=v[k]??"";const id="pf_"+k;let inp;
    if(type==="sec")inp=`<select id="${id}">${opt(SECTORS.map(s=>[s.k,s.n]),cur)}</select>`;
    else if(type==="rh")inp=`<select id="${id}">${opt(Object.entries(RH),cur)}</select>`;
    else if(type==="p")inp=`<select id="${id}">${opt([[3,"●●● Yüksek"],[2,"●● Orta"],[1,"● Düşük"]],cur||2)}</select>`;
    else if(type==="lens")inp=`<select id="${id}"><option value="">Yok</option>${opt(Object.entries(LENS).map(([k,x])=>[k,x.n]),cur)}</select>`;
    else if(type==="area")inp=`<textarea id="${id}">${esc(cur)}</textarea>`;
    else inp=`<input id="${id}" type="text" value="${esc(cur)}" autocomplete="off">`;
    return`<label class="${type==="area"?"wide":""}" for="${id}"><span>${lab}</span>${inp}</label>`};
  const regOpts=GROUPS.map(([g,gn])=>`<optgroup label="${gn}">${Object.entries(REG).filter(([k,x])=>x.g===g).map(([k,x])=>`<option value="${k}">${x.n}</option>`).join("")}</optgroup>`).join("");
  const verOpts=["a","c","s","p","k","g","r","o"].map(k=>`<option value="${k}">${VER[k]}</option>`).join("");
  el.innerHTML=`<div class="proposal">
    <h4>${P.mode==="patch"?"Mevcut kaynağa eklenecek":"Yeni kaynak önerisi"}</h4>
    <div class="modes">
      <label><input type="radio" name="pmode" value="new" ${P.mode==="new"?"checked":""}> Yeni kaynak olarak ekle</label>
      <label><input type="radio" name="pmode" value="patch" ${P.mode==="patch"?"checked":""}> Mevcut kaynağa ekle:</label>
      <select id="pBase" aria-label="Mevcut kaynak">${D.filter(d=>!d.added).map(d=>`<option${d.n===P.base?" selected":""}>${esc(d.n)}</option>`).join("")}</select>
    </div>
    <div class="fgrid">${CORE_FIELDS.map(field).join("")}</div>
    <div><b class="lh">Bağlantılar</b> <span class="hint">platform + bağlantı + doğrulama</span></div>
    <div class="lrows" id="lrows">${(v.links||[]).map((l,i)=>`<div class="lrow${l.v==="c"?" warn":""}" data-i="${i}">
      <select class="lp" aria-label="Platform">${regOpts}</select>
      <input class="lu" type="text" value="${esc(l.u)}" placeholder="https://… ya da @hesap" aria-label="Bağlantı">
      <select class="lv" aria-label="Doğrulama">${verOpts}</select>
      <button class="btn sm lx" type="button" aria-label="Bağlantıyı sil">Sil</button></div>`).join("")}</div>
    <div class="arow"><button class="btn sm" id="lAdd" type="button">+ Bağlantı ekle</button></div>
    ${v.note?`<p class="note"><b>Claude'un notu:</b> ${esc(v.note)}</p>`:""}
    ${P.mode==="new"?`<label class="fld obyl"><span>Öneren</span><input id="pBy" type="text" maxlength="40" value="${esc(P.by??lastBy())}" placeholder="Ad ya da baş harfler (ör. EÜ)"></label>`:""}
    <div class="arow"><button class="btn primary" id="pSave" type="button">${P.mode==="patch"?"Güncellemeyi kaydet":"Kaynağı ekle"}</button><button class="btn" id="pCancel" type="button">Vazgeç</button></div>
  </div>`;
  el.querySelectorAll(".lrow").forEach(r=>{const l=v.links[+r.dataset.i];r.querySelector(".lp").value=l.p;r.querySelector(".lv").value=l.v;
    r.querySelector(".lv").onchange=e=>r.classList.toggle("warn",e.target.value==="c");
    r.querySelector(".lx").onclick=()=>{collect();v.links.splice(+r.dataset.i,1);renderProposal()}});
  $("#lAdd").onclick=()=>{collect();(v.links=v.links||[]).push({p:"web",u:"",v:"a"});renderProposal()};
  el.querySelectorAll("[name=pmode]").forEach(r=>r.onchange=()=>{collect();P.mode=r.value;renderProposal()});
  $("#pBase").onchange=()=>{P.base=$("#pBase").value};
  $("#pCancel").onclick=()=>{A.prop=null;renderProposal()};
  $("#pSave").onclick=saveProposal;
}
function collect(){
  const P=A.prop,v=P.v;
  CORE_FIELDS.forEach(([k])=>{const e=document.getElementById("pf_"+k);if(e)v[k]=k==="p"?Number(e.value):e.value.trim()});
  v.links=[...document.querySelectorAll("#lrows .lrow")].map(r=>({p:r.querySelector(".lp").value,u:r.querySelector(".lu").value.trim(),v:r.querySelector(".lv").value}));
  const b=$("#pBase");if(P.mode==="patch"&&b)P.base=b.value;
  const by=$("#pBy");if(by)P.by=by.value.trim();
  return P;
}
async function saveProposal(){
  const P=collect();const st=$("#aStatus");
  if(!A.db){st.textContent="Veritabanına ulaşılamıyor; kaydedilemedi.";st.className="astatus err";return}
  const core=cleanCore(P.v);
  const links=P.v.links.filter(l=>l.u).map(normLink).filter(Boolean);
  const bad=P.v.links.filter(l=>l.u).length-links.length;
  if(bad){st.textContent=`${bad} bağlantı geçerli bir adres değil; düzeltin ya da silin.`;st.className="astatus err";return}
  if(P.mode==="new"){
    if(!core.n){st.textContent="Kaynağın adını yazın.";st.className="astatus err";return}
    if(D.some(d=>d.n===core.n&&!d.added)){st.textContent=`"${core.n}" listede zaten var. "Mevcut kaynağa ekle"yi seçin.`;st.className="astatus err";return}
  } else {
    if(!P.base){st.textContent="Eklenecek mevcut kaynağı seçin.";st.className="astatus err";return}
    delete core.n;const b=BASE.find(d=>d.n===P.base);
    if(b)for(const k of ["s","r","p","l","t","w"])if(String(core[k]??"")===String(b[k]??""))delete core[k];
    const cur=D.find(d=>d.n===P.base);if(cur)for(let i=links.length-1;i>=0;i--)if(cur.links.some(x=>x.p===links[i].p&&x.u===links[i].u&&x.v!=="c"))links.splice(i,1);
    if(!links.length&&!Object.keys(core).length){st.textContent="Eklenecek yeni bilgi yok; bu bağlantılar zaten kayıtlı.";st.className="astatus err";return}
  }
  const id=(P.mode==="patch"?"p_":"n_")+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  const docBody={kind:P.mode,base:P.mode==="patch"?P.base:null,v:{...core,links},at:new Date().toISOString(),...(A.uid?{by:A.uid}:{}),...(P.mode==="new"&&P.by?{oneren:P.by.slice(0,40)}:{})};
  if(P.mode==="new"&&P.by){try{localStorage.setItem("edumind-by",P.by)}catch(e){}}
  st.className="astatus";st.textContent="Kaydediliyor…";$("#pSave").disabled=true;
  try{
    await A.db.collection("sources").doc(id).set(docBody);
    st.textContent=P.mode==="patch"?`Kaydedildi: ${P.base} için ${links.length} bağlantı eklendi.`:`Kaydedildi: ${core.n} ${secOf(core.s).n} dilimine ${links.length} bağlantıyla eklendi.`;
    A.prop=null;renderProposal();$("#aIn").value="";
  }catch(e){
    st.className="astatus err";
    st.textContent=e&&e.code==="quota_exceeded"?"Veritabanı dolu; eski eklemelerden bazılarını kaldırın.":e&&e.code==="invalid_argument"?"Bu hesapla kaydetme yetkiniz yok.":"Kaydedilemedi; bağlantıyı kontrol edip tekrar deneyin.";
    const b=$("#pSave");if(b)b.disabled=false;
  }
}
function renderAdminList(){
  const el=$("#aList");if(!el)return;
  if(!ADMIN_DOCS.length){el.innerHTML=`<li><span class="hint">Henüz ekleme yok. İlk kaynağı yukarıdan ekleyin; burada listelenir ve buradan kaldırılabilir.</span></li>`;return}
  el.innerHTML=ADMIN_DOCS.slice().reverse().map(d=>{const v=d.v||{};const L=docLinks(v);
    return`<li><div><b>${esc(d.kind==="patch"?d.base:v.n)}</b> <span class="pill ${d.kind==="patch"?"":"new"}">${d.kind==="patch"?"Güncelleme":"Yeni"}</span>
      <small>${esc(new Date(d.at||0).toLocaleString("tr-TR"))} · ${L.length} bağlantı${L.length?": "+esc([...new Set(L.map(l=>REG[l.p].n))].join(", ")):""}${L.some(l=>l.v==="c")?" · doğrulanmamış bağlantı var":""}</small></div>
      <button class="btn sm" data-del="${esc(d.id)}">Kaldır</button></li>`}).join("");
  el.querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{
    if(b.dataset.arm!=="1"){b.dataset.arm="1";b.textContent="Emin misiniz?";setTimeout(()=>{b.dataset.arm="";b.textContent="Kaldır"},3000);return}
    b.disabled=true;try{await A.db.collection("sources").doc(b.dataset.del).delete();toast("Kaldırıldı")}catch(e){toast("Kaldırılamadı");b.disabled=false}});
}

rebuildData();buildRadar();buildChips();buildPfChips();buildLenses();buildRhythm();renderWeek();buildStats();initSheet();
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>setView(b.dataset.go));
{const ab=()=>document.documentElement.style.setProperty("--appbar-h",$("#appbar").offsetHeight+"px");ab();addEventListener("resize",ab)}
{const H=readHash();let v=H.view||"radar";
 applyHash(H);clearF();S.sort="type";

 if(!introSeen){S.introOpen=true;S.view=PAGED()?"intro":"radar"}else S.view=v==="intro"?"radar":v;
 applyLayout();
 if(!PAGED()&&!S.introOpen&&S.view!=="radar"&&S.view!=="admin")setTimeout(()=>setView(S.view),60);}
$("#introBtn").onclick=()=>setView("intro");
$("#introStart").onclick=()=>closeIntro("radar");
$("#introClose").onclick=()=>closeIntro(PAGED()?"radar":null);
if($("#introCore"))$("#introCore").onclick=()=>{S.core=true;closeIntro("radar");sync()};
{const tb=$("#themeBtn"),lbl=()=>{const a=document.documentElement.classList.contains("th-acad");tb.querySelector(".thlbl").textContent=a?"Akademik":"Klasik";tb.setAttribute("aria-label","Görünüm: "+(a?"Akademik":"Klasik")+" — değiştirmek için dokunun");tb.dataset.tip=a?"Klasik görünüme dön":"Akademik görünüme geç"};lbl();
  tb.onclick=()=>{const a=document.documentElement.classList.toggle("th-acad");try{localStorage.setItem("edumind-theme",a?"acad":"klasik")}catch(e){}lbl();buildRadar();sync();toast(a?"Akademik görünüm":"Klasik görünüm")}}
{const db=$("#darkBtn"),M=["auto","light","dark"],N={auto:"Otomatik",light:"Aydınlık",dark:"Siyah"},darkMQ=matchMedia("(prefers-color-scheme: dark)");
 let cur="auto";try{cur=localStorage.getItem("edumind-dark")||"auto"}catch(e){}
 if(!M.includes(cur))cur="auto";
 const put=()=>{const r=document.documentElement;
   if(cur==="auto")r.removeAttribute("data-theme");else r.setAttribute("data-theme",cur);
   // look-black: the black appearance is in effect (chosen, or Otomatik on a dark phone)
   r.classList.toggle("look-black",cur==="dark"||(cur==="auto"&&darkMQ.matches));
   const l=$("#darkLbl");if(l)l.textContent=N[cur];
   db.setAttribute("aria-label","Renk: "+N[cur]+" — değiştirmek için dokunun");db.dataset.tip="Renk: "+N[cur]+" (otomatik / aydınlık / siyah)"};
 put();
 darkMQ.addEventListener("change",()=>{if(cur==="auto")put()});
 document.addEventListener("edumind-preferences-restored",()=>{cur=localStorage.getItem("edumind-dark")||"auto";if(!M.includes(cur))cur="auto";put()});
 // Settings › Görünüm uses the same choice.
 const set=v=>{if(!M.includes(v))return;cur=v;try{localStorage.setItem("edumind-dark",cur)}catch(e){}put();buildRadar();sync()};
 window.edumindAppearance={get:()=>cur,set};
 db.onclick=()=>{set(M[(M.indexOf(cur)+1)%3]);toast("Renk: "+N[cur])}}
if($("#introLists"))$("#introLists").onclick=()=>{closeIntro("discover");setTimeout(()=>{const c=document.querySelector(".colls-wrap");if(c)c.scrollIntoView({behavior:"smooth",block:"start"})},80)};
MQ.addEventListener&&MQ.addEventListener("change",()=>applyLayout());
addEventListener("hashchange",()=>{if(hashLock)return;const H=readHash();applyHash(H);if(H.view&&H.view!==S.view)setView(H.view);else sync()});
initScrollSpy();
{const ip=$("#introPref"),bp=$("#basketPref");if(ip){ip.innerHTML=prefChips("pfIntro");bindPref(ip)}if(bp){bp.innerHTML=prefChips("pfBasket");bindPref(bp)}}
sync();

const LINK_AUDIT=EDUMIND_GEN.linkAudit;
// Akademi usability upgrade: independent facets, transparent provenance, local route.
const radarBox=document.querySelector('#radarBox');
radarBox.insertAdjacentHTML('afterbegin',`<div class="radar-intro"><h2>Radar</h2><details class="radar-help"><summary>Radar rehberi</summary><div class="radar-help-body"><p><b>İçten dışa, koyudan açığa</b><br>Günlük: düz çizgi<br>Haftalık: sık kesikli<br>Dönemsel: seyrek kesikli</p><p>Her kaynak türünün rengi sabittir. Dilim genişliği görünen kaynak sayısını gösterir. Kaynak bulunmayan halka alanları renksizdir.</p><div class="help-key"><i class="help-core" aria-hidden="true"></i><span>Bordo: çekirdek kaynak</span></div><div class="help-key"><i class="help-follow" aria-hidden="true"></i><span>Yeşil çerçeve: takip ettiğiniz</span></div><p>Bir noktaya dokunarak kaynağı açın.</p></div></details></div>`);
const oldGuide=document.querySelector('#guide');if(oldGuide){const container=oldGuide.parentElement;oldGuide.remove();if(!container.children.length)container.remove();}


document.addEventListener('click',e=>{const help=document.querySelector('.radar-help');if(help&&!help.contains(e.target))help.open=false});
document.addEventListener('keydown',e=>{const help=document.querySelector('.radar-help');if(e.key==='Escape'&&help?.open){help.open=false;help.querySelector('summary').focus()}});
const zoomBar=document.createElement('div');zoomBar.className='radar-selections';
zoomBar.innerHTML=`<div class="selection-active"><span>Seçilenler</span><div id="selectionChips"></div></div><p id="zoomStatus" hidden></p>`;

// The radar itself is drawn by academy-radar.js; this keeps the selection bar
// state and the status text in step with the filters.
function focusRadar(){
 const counts=Object.fromEntries(TYPES.map(t=>[t.k,D.filter(d=>match(d)&&sourceType(d)===t.k).length]));
 const active=TYPES.filter(t=>counts[t.k]);
 zoomBar.classList.toggle('no-selection',activeF().length===0);
 document.querySelector('#zoomStatus').textContent=active.length?`${active.length} parça · ${D.filter(match).length} kaynak. Dilim genişliği görünen kaynak sayısıyla orantılıdır.`:'Bu seçimlerle eşleşen kaynak yok. Tüm parçaları geri getirebilirsiniz.';
}
const oldPaint=paintRadar;
paintRadar=function(){oldPaint();focusRadar();};
function followReason(d){
 const topic=d.t||DX[d.n]||'Bu kaynağın içerikleri';
 const purpose={pol:'Politika veya etik kararları hazırlarken bu kapsamı izleyebilirsiniz.',ars:'Araştırma sorusu ve literatür taraması için başlangıç noktası olarak kullanabilirsiniz.',prat:'Ders veya mesleki gelişim planınıza uygun örnekler aramak için izleyebilirsiniz.',ele:'Eğitimde AI kullanımının pedagojik varsayımlarını sorgulamak için izleyebilirsiniz.',ger:'AI iddialarını farklı bakış açılarıyla karşılaştırmak için izleyebilirsiniz.',hiz:'Yeni araç ve model duyurularını izlemek için kullanabilirsiniz.'};
 return `${d.n}: ${topic.replace(/[.。]$/,'')}. ${purpose[d.l]||'İhtiyacınıza uygun içerikleri seçerek takip edebilirsiniz.'}`;
}
function auditHtml(d){const audit=LINK_AUDIT[d.n];if(!audit||audit.url!==d.u)return 'Bu bağlantı için kontrol kaydı yok';
 const labels={reachable:'Erişim yanıtı alındı',missing:'Temel web adresi kayıtlı değil',not_found:'Sayfa bulunamadı',restricted:'Otomatik erişim kısıtlandı',http_error:'Sunucu hata yanıtı verdi',unconfirmed:'Erişim doğrulanamadı'};
 return `${labels[audit.status]||'Kontrol edilmedi'}${audit.code?' · HTTP '+audit.code:''}<br><small>${esc(new Date(audit.checkedAt).toLocaleString('tr-TR',{timeZone:'Europe/Istanbul'}))} (Türkiye saati)</small>`;
}
const oldDetail=renderDetail;
renderDetail=function(){oldDetail();const d=D.find(d=>d.id===S.sel);if(!d)return;
 const reasons={g:'Kısa ve sık göz atmak için önerilen akış.',h:'Haftalık toplu inceleme için önerilen kaynak.',a:'İhtiyaç veya belirli bir konu ortaya çıktığında başvurmak için önerilen kaynak.'};
 document.querySelector('#sheetBody').insertAdjacentHTML('beforeend',`<details class="audit"><summary>Kaynak ayrıntıları</summary><dl><dt>Radara eklenme tarihi</dt><dd>${d.at?trDate(d.at):"—"}</dd>${d.by?`<dt>Öneren</dt><dd>${esc(d.by)}</dd>`:""}<dt>Kaynak türü</dt><dd>${esc(typeName(d))}</dd><dt class="audit-country-heading">Ülke / merkez <button type="button" class="audit-country-info" aria-label="Ülke ve merkez bilgisi hakkında açıklama" aria-expanded="false" aria-controls="auditCountryNote">${SV('<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7" r=".7"/>')}</button></dt><dd>${esc(sourceCountryName(d))}<div id="auditCountryNote" class="audit-country-note" role="note" hidden>Kişilerde kayıtlı kurum veya çalışma konumu; kuruluşlarda merkez bilgisi esas alınır.</div></dd><dt>Konu / yaklaşım</dt><dd>${esc(LENS[d.l]?.n||'Henüz sınıflandırılmadı')}</dd><dt>Takip gerekçesi</dt><dd class="audit-reason"><span>${esc(followReason(d))}</span><span>${esc(reasons[d.r]||'Henüz belirlenmedi')}</span></dd></dl><p class="audit-disclaimer">Takip önerisi mevcut kaynak açıklamasından türetilmiştir. Erişim kontrolü, sitenin kimliğini veya içerik kalitesini doğrulamaz; sosyal hesapları kapsamaz.</p></details>`);
 const countryInfo=document.querySelector('.audit-country-info'),countryNote=document.querySelector('#auditCountryNote');let countryTimer;
 const hideCountry=()=>{clearTimeout(countryTimer);countryNote.hidden=true;countryInfo.setAttribute('aria-expanded','false')};
 const showCountry=()=>{clearTimeout(countryTimer);countryNote.hidden=false;countryInfo.setAttribute('aria-expanded','true');const r=countryInfo.getBoundingClientRect(),w=countryNote.offsetWidth,h=countryNote.offsetHeight;countryNote.style.left=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2))+'px';countryNote.style.top=Math.max(12,Math.min(innerHeight-h-12,r.top-h-8>=12?r.top-h-8:r.bottom+8))+'px'};
 countryInfo.onclick=()=>{if(matchMedia('(hover:hover)').matches)showCountry();else countryNote.hidden?showCountry():hideCountry()};
 countryInfo.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')showCountry()});
 const leaveCountry=()=>{countryTimer=setTimeout(hideCountry,100)};countryInfo.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')leaveCountry()});countryNote.addEventListener('pointerenter',()=>clearTimeout(countryTimer));countryNote.addEventListener('pointerleave',leaveCountry);
 countryInfo.addEventListener('focus',()=>{if(countryInfo.matches(':focus-visible'))showCountry()});countryInfo.addEventListener('blur',hideCountry);
 document.querySelector('#sheetBody').onscroll=hideCountry;
 countryInfo.setAttribute('aria-describedby','auditCountryNote');countryNote.setAttribute('role','tooltip');

};
const route=document.createElement('section');route.className='route';route.style.width='100%';
route.innerHTML=`<p>Haftalık ayırabileceğin zamanı seç; sana uygun başlangıç listelerini incele.</p><div class="route-controls"><span id="routeTimeLabel" class="route-time-label">Haftalık ayırabileceğin zaman</span><div class="route-time-options" role="group" aria-labelledby="routeTimeLabel"><button type="button" data-route-minutes="10" aria-pressed="false">10 dk</button><button type="button" data-route-minutes="20" aria-pressed="true">20 dk</button><button type="button" data-route-minutes="30" aria-pressed="false">30 dk</button><button type="button" data-route-minutes="40" aria-pressed="false">40 dk</button><button type="button" data-route-minutes="50" aria-pressed="false">50 dk</button><button type="button" data-route-minutes="60" aria-pressed="false">60 dk</button></div><input type="hidden" id="routeTime" value="20"></div><div id="routeResult" aria-live="polite"></div>`;
const routeDisclosure=document.createElement('details');routeDisclosure.className='my-list-route';routeDisclosure.innerHTML='<summary>Bana kişisel liste öner</summary>';routeDisclosure.append(route);document.querySelector(':is(#sepet,#discover) .my-list-discover').before(routeDisclosure);
const filters=document.querySelector('.rbelow .fbox');radarBox.before(filters);const emptyBelow=document.querySelector('.rbelow');if(emptyBelow&&!emptyBelow.children.length)emptyBelow.remove();
filters.classList.add('filter-panel');radarBox.parentElement.classList.add('radar-workspace');
// Keep all variable-height controls outside the fixed chart viewport.
radarBox.append(zoomBar);document.querySelector('#selectionChips').replaceWith(document.querySelector('#rChips'));document.querySelector('#rChips').setAttribute('aria-label','Aktif seçimler; kaldırmak için seçin');
const jumpSources=document.createElement('button');
jumpSources.type='button';jumpSources.id='sectionJump';jumpSources.className='btn section-jump';jumpSources.hidden=true;
document.body.append(jumpSources);
const jumpTo=el=>el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
function updateSectionJump(){
 const view=document.querySelector('.view[data-view="radar"]'),sources=document.querySelector('#sources'),sheet=document.querySelector('#sheet');
 jumpSources.hidden=view.hidden||!!(sheet&&!sheet.hidden);
 if(jumpSources.hidden)return;
 const inSources=sources.getBoundingClientRect().top<=window.innerHeight*.5;
 const target=inSources?'radarBox':'sources';
 if(jumpSources.dataset.target!==target){
  jumpSources.dataset.target=target;
  jumpSources.innerHTML=inSources
   ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12 18.4 5.6"/><circle cx="8" cy="15" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="8" r="1" fill="currentColor" stroke="none"/></svg>'
   : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/></svg>';
  jumpSources.title=inSources?'Radara dön':'Kaynaklara geç';
  jumpSources.setAttribute('aria-label',inSources?'Radara dön':'Kaynaklara geç');
  jumpSources.setAttribute('aria-controls',target);
 }
}
let sectionJumpFrame=0;
function scheduleSectionJump(){if(!sectionJumpFrame)sectionJumpFrame=requestAnimationFrame(()=>{sectionJumpFrame=0;updateSectionJump()})}
window.addEventListener('scroll',scheduleSectionJump,{passive:true});
window.addEventListener('resize',scheduleSectionJump,{passive:true});
const sectionJumpObserver=new MutationObserver(scheduleSectionJump);
sectionJumpObserver.observe(document.querySelector('.view[data-view="radar"]'),{attributes:true,attributeFilter:['hidden']});
sectionJumpObserver.observe(document.querySelector('#sheet'),{attributes:true,attributeFilter:['hidden']});
jumpSources.onclick=()=>{if(jumpSources.dataset.target==="radarBox")restoreRadarSources();jumpTo(document.getElementById(jumpSources.dataset.target))};
updateSectionJump();
const exportMenu=document.querySelector('#sourceExport');
exportMenu.addEventListener('click',e=>{if(e.target.closest('button'))exportMenu.open=false});
document.addEventListener('click',e=>{if(!exportMenu.contains(e.target))exportMenu.open=false});
exportMenu.addEventListener('keydown',e=>{if(e.key==='Escape'){exportMenu.open=false;exportMenu.querySelector('summary').focus()}});
document.querySelector('#moreSources').onclick=()=>{sourceLimit+=SOURCE_PAGE_SIZE;renderList()};
document.querySelector('#groups').addEventListener('pointerover',e=>{const row=e.target.closest('.item');if(row)highlightSource(row.dataset.id)});
document.querySelector('#groups').addEventListener('pointerleave',()=>highlightSource(null));
document.querySelector('#groups').addEventListener('focusin',e=>{const row=e.target.closest('.item');if(row)highlightSource(row.dataset.id)});
document.querySelector('#groups').addEventListener('focusout',()=>highlightSource(null));

const personalRoles=[['teacher','Öğretmen için başlangıç','Ders hazırlığı, sınıf uygulamaları ve değerlendirme için pratik kaynaklar.',['prat','ele']],['research','Akademisyen için başlangıç','Araştırma, öğrenme bilimleri ve akademik çalışmalar için kaynaklar.',['ars','ger']],['leader','Eğitim yöneticisi için başlangıç','Kurum politikaları, yapay zekâ stratejisi ve dönüşüm için kaynaklar.',['pol','ger']]];
function personalRecommendations(role,mins){const wanted=personalRoles.find(r=>r[0]===role)[3];return D.map(d=>({d,score:d.p+(wanted.includes(d.l)?4:0)+(d.c?1:0)})).sort((a,b)=>b.score-a.score||a.d.n.localeCompare(b.d.n,'tr')).slice(0,mins/5).map(x=>x.d)}
function renderPersonalRecommendations(){
 const mins=Number(document.querySelector('#routeTime').value);
 document.querySelector('#routeResult').innerHTML=`<div class="colls personal-role-cards">${personalRoles.map(([key,name,description])=>{const sources=personalRecommendations(key,mins),missing=sources.filter(d=>!inMyList(d)).length;return `<article class="coll"><div class="ch"><b>${name}</b></div><p>${description}</p><div class="cav">${sources.slice(0,6).map(d=>avatar(d,30)).join('')}${sources.length>6?`<span class="more">+${sources.length-6}</span>`:''}</div><div class="cst personal-role-count">${sources.length} kaynak · ${mins} dk</div><div class="cact"><button type="button" class="btn primary" data-personal-add="${key}" ${missing?'':'disabled'}>${missing?`${missing} kaynağı ekle`:'Tümü listemde'}</button><button type="button" class="btn" data-personal-view="${key}">Kaynakları gör</button></div></article>`}).join('')}</div><p class="personal-time-note">Kaynak başına yaklaşık 5 dakikalık ilk göz atma önerilir; süreler tahminidir.</p>`;
 document.querySelectorAll('[data-personal-add]').forEach(button=>button.onclick=()=>{personalRecommendations(button.dataset.personalAdd,mins).forEach(d=>S.basket.add(d.n));saveAll();sync();renderPersonalRecommendations();toast('Önerilen kaynaklar listene eklendi')});
 document.querySelectorAll('[data-personal-view]').forEach(button=>button.onclick=()=>{const key=button.dataset.personalView,sources=personalRecommendations(key,mins);clearF();S.personalIds=sources.map(d=>d.id);S.personalLabel=personalRoles.find(r=>r[0]===key)[1]+' · '+mins+' dk';S.sort='type';sync();setView('list')});
}
document.querySelectorAll('[data-route-minutes]').forEach(button=>button.onclick=()=>{
 document.querySelector('#routeTime').value=button.dataset.routeMinutes;
 document.querySelectorAll('[data-route-minutes]').forEach(option=>option.setAttribute('aria-pressed',String(option===button)));
 renderPersonalRecommendations();
 const rail=button.parentElement;rail.scrollTo({left:rail.scrollLeft+button.getBoundingClientRect().left+button.offsetWidth/2-rail.getBoundingClientRect().left-rail.clientWidth/2,behavior:"instant"});
});
renderPersonalRecommendations();

buildRadar();sync();


const auditPanel=document.createElement('details');auditPanel.className='route';
const ac={};Object.values(LINK_AUDIT).forEach(r=>ac[r.status]=(ac[r.status]||0)+1);
auditPanel.innerHTML=`<summary>Bağlantı kontrol özeti · 18 Ekim 2026</summary><p>${ac.reachable||0} temel web adresinden başarılı HTTP yanıtı alındı. ${ac.restricted||0} adres otomatik erişimi kısıtladı. ${ac.missing||0} kaynakta ayrı bir temel web adresi kayıtlı değil; diğer kanalları olabilir.</p><p>Kontrol yalnızca mevcut temel web adreslerini kapsar. Başarılı yanıt; doğru kurum, güncel içerik veya güvenilirlik onayı değildir. Kısıtlanan adresler kırık olarak işaretlenmedi.</p>`;
document.querySelector('[data-view="rhythm"]').append(auditPanel);

initRuntime();

;/* --- block-2 --- */
(()=>{
const workspace=document.querySelector('.radar-workspace'),panel=workspace?.querySelector('.filter-panel');
if(!workspace||!panel)return;
if(!panel.id)panel.id='mobileRadarFilters';
const toggle=document.createElement('button');toggle.type='button';toggle.className='mobile-filter-toggle';
toggle.setAttribute('aria-controls',panel.id);toggle.setAttribute('aria-expanded','false');
const update=()=>{const open=workspace.classList.contains('mobile-filters-open');toggle.setAttribute('aria-expanded',String(open));toggle.innerHTML='<span>Filtreleri '+(open?'gizle':'göster')+'</span><span class="arrow" aria-hidden="true">⌄</span>'};
toggle.addEventListener('click',()=>{workspace.classList.toggle('mobile-filters-open');update()});
workspace.prepend(toggle);update();
})();

;/* --- edumind-camera-filters-runtime-v1-3-0 --- */
(()=>{
 const workspace=document.querySelector('.radar-workspace');if(!workspace)return;
 const groups=[['type','Kaynak türü'],['coll','Hazır listeler'],['lens','Konu'],['rh','Takip sıklığı'],['geo','Ülke']];
 const dock=document.createElement('section');dock.className='camera-filters';dock.setAttribute('aria-label','Radar filtreleri');
 dock.innerHTML='<div class="camera-filter-modes" role="tablist" aria-label="Filtre başlıkları"></div><div class="camera-filter-options" role="tabpanel" id="cameraFilterOptions" tabindex="0"></div><div class="camera-filter-head"><span class="camera-result-count" aria-live="polite" aria-atomic="true"></span><button class="camera-filter-clear" type="button">Temizle</button></div>';
 workspace.append(dock);
 const modes=dock.querySelector('.camera-filter-modes'),options=dock.querySelector('.camera-filter-options'),clear=dock.querySelector('.camera-filter-clear');
 const radarCount=document.createElement('span');radarCount.className='radar-visible-count';radarCount.setAttribute('aria-live','polite');dock.querySelector('.camera-filter-head').prepend(radarCount);
 const selectedGroups=document.createElement('div');selectedGroups.className='radar-selected-groups';selectedGroups.setAttribute('aria-label','Seçili filtre kategorileri');dock.querySelector('.camera-filter-head').append(selectedGroups);
 const empty=document.createElement('div');empty.className='radar-no-results';empty.hidden=true;empty.innerHTML='<p>Bu filtrelerle kaynak bulunamadı.</p><button type="button">Filtreleri temizle</button>';document.querySelector('#radarBox .radar-scroll').append(empty);empty.querySelector('button').onclick=()=>{clear.onclick();const popover=document.querySelector('.source-filter-popover');if(popover)popover.hidden=true;clear.setAttribute('aria-expanded','false')};
 let current='type',signature='',modeScrollFrame=0;
 modes.innerHTML=groups.map(([g,n])=>`<button class="camera-filter-mode" id="cameraTab-${g}" role="tab" type="button" data-group="${g}" aria-controls="cameraFilterOptions" aria-selected="${g===current}" tabindex="${g===current?0:-1}"><span>${n}</span><span class="camera-mode-count" aria-hidden="true"></span></button>`).join('');
 const mobile=matchMedia('(max-width:759px)');
 function addRailControls(rail,label,isModes){
  const frame=document.createElement('div');frame.className='camera-rail-frame';rail.before(frame);
  const buttons=[-1,1].map(dir=>{const b=document.createElement('button');b.type='button';b.className='camera-rail-arrow';b.setAttribute('aria-label',(dir<0?'Önceki ':'Sonraki ')+label);b.innerHTML=SV(dir<0?'<path d="m14 6-6 6 6 6"/>':'<path d="m10 6 6 6-6 6"/>');b.onclick=()=>{const items=[...rail.children];if(!items.length)return;const r=rail.getBoundingClientRect(),cx=r.left+r.width/2;let index=0,distance=Infinity;items.forEach((el,i)=>{const a=el.getBoundingClientRect(),d=Math.abs(a.left+a.width/2-cx);if(d<distance){distance=d;index=i}});const target=items[Math.max(0,Math.min(items.length-1,index+dir))];if(isModes)selectGroup(target.dataset.group);else center(target,rail)};return b});
  frame.append(buttons[0],rail,buttons[1]);
 }
 addRailControls(modes,'filtre başlığı',true);addRailControls(options,'filtre seçeneği',false);
 function center(el,rail,smooth=true){if(!mobile.matches||!el)return;if(rail.children.length){rail.style.paddingLeft=`calc(50% - ${rail.firstElementChild.offsetWidth/2}px)`;rail.style.paddingRight=`calc(50% - ${rail.lastElementChild.offsetWidth/2}px)`}const a=el.getBoundingClientRect(),b=rail.getBoundingClientRect(),left=rail.scrollLeft+a.left+a.width/2-b.left-b.width/2;rail.scrollTo({left,behavior:'instant'})}
 function selectGroup(g,centerMode=true){if(current!==g){current=g;signature='';paint()}if(centerMode)center(modes.querySelector(`[data-group="${g}"]`),modes)}
 let summaryFitWidth=0;
 function fitSelectedGroups(){
  if(!mobile.matches)return;
  const head=selectedGroups.parentElement,style=getComputedStyle(head);
  const available=head.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)-72-2*(parseFloat(style.columnGap)||0)-24;
  if(available<=0||available===summaryFitWidth)return;
  summaryFitWidth=available;
  const probe=selectedGroups.cloneNode(false);probe.hidden=false;probe.setAttribute('aria-hidden','true');
  probe.style.cssText='position:fixed;left:0;top:-1000px;visibility:hidden;pointer-events:none;width:max-content;display:flex!important';
  probe.innerHTML=groups.map(([g,n])=>`<button type="button" tabindex="-1">${g==='type'?'Kaynak':g==='coll'?'Liste':n}<span>99</span></button>`).join('');head.append(probe);
  const gap=parseFloat(getComputedStyle(probe).gap)||0,buttons=[...probe.children];
  let low=7,high=14;
  const fits=size=>{probe.style.setProperty('--summary-font-size',size+'px');return buttons.reduce((n,b)=>n+b.getBoundingClientRect().width,0)+gap*(buttons.length-1)<=available-2};
  for(let i=0;i<9;i++){const size=(low+high)/2;if(fits(size))low=size;else high=size}
  const size=(Math.floor(low*.92*10)/10)+'px';selectedGroups.style.setProperty('--summary-font-size',size);head.style.setProperty('--summary-font-size',size);probe.remove();
 }
 new ResizeObserver(fitSelectedGroups).observe(selectedGroups.parentElement);
 function paint(){
  const opts=fOpts(current),next=current+'|'+opts.map(o=>o.join(':')).join('|');
  groups.forEach(([g,n])=>{const b=modes.querySelector(`[data-group="${g}"]`),active=g===current;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;b.setAttribute('aria-label',n+(S[g].size?', '+S[g].size+' seçili':''));b.classList.toggle('has-selections',S[g].size>0);b.querySelector('.camera-mode-count').textContent=S[g].size?String(S[g].size):''});
  options.setAttribute('aria-labelledby','cameraTab-'+current);
  if(next!==signature){
   signature=next;
   options.innerHTML=`<button class="camera-filter-option" type="button" data-option="all"><span class="camera-option-label">Tümü</span></button>`+opts.map(([v,n])=>`<button class="camera-filter-option" type="button" data-option="${esc(v)}" title="${esc(n)}" aria-label="${esc(n)}"><span class="camera-option-label">${esc(n)}</span></button>`).join('');
   options.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>{const v=b.dataset.option;if(v==='all')S[current].clear();else togg(current,v);sync();center(b,options)});
   requestAnimationFrame(()=>{const selected=[...options.children].find(b=>S[current].has(b.dataset.option));center(selected||options.firstElementChild,options,false)});
  }
  options.querySelectorAll('[data-option]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.option==='all'?S[current].size===0:S[current].has(b.dataset.option))));
  selectedGroups.innerHTML=groups.filter(([g])=>S[g].size).map(([g,n])=>`<button type="button" data-selected-group="${g}" aria-label="${n}, ${S[g].size} seçili; seçenekleri göster">${g==='type'?'Kaynak':g==='coll'?'Liste':n}<span>${S[g].size}</span></button>`).join('');
  selectedGroups.hidden=!selectedGroups.children.length;
  selectedGroups.querySelectorAll('button').forEach(b=>b.onclick=()=>selectGroup(b.dataset.selectedGroup));fitSelectedGroups();
  const visibleCount=D.filter(match).length;radarCount.textContent=visibleCount+' kaynak gösteriliyor';empty.hidden=visibleCount>0;empty.parentElement.classList.toggle('has-no-results',!visibleCount);dock.querySelector('.camera-result-count').innerHTML=`<span class="toolbar-page-label">Kaynaklar</span> · <b>${visibleCount}/${academicSourcePool().length}</b>`;
  clear.disabled=!anyF();
  const count=FSET.reduce((n,g)=>n+S[g].size,0)+['week','core','mine','bask','recent','personalIds'].filter(k=>!!S[k]).length+(S.q?1:0);
  clear.dataset.count=count;clear.setAttribute('aria-label',count?`${count} seçili filtreyi temizle`:'Temizle');clear.title=count?`${count} seçili filtreyi temizle`:'Temizle';
 }
 modes.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>selectGroup(b.dataset.group));
 modes.addEventListener('scroll',()=>{if(!mobile.matches||modeScrollFrame)return;modeScrollFrame=requestAnimationFrame(()=>{modeScrollFrame=0;const r=modes.getBoundingClientRect(),cx=r.left+r.width/2;const nearest=[...modes.children].reduce((a,b)=>Math.abs(b.getBoundingClientRect().left+b.offsetWidth/2-cx)<Math.abs(a.getBoundingClientRect().left+a.offsetWidth/2-cx)?b:a);if(nearest.dataset.group!==current)selectGroup(nearest.dataset.group,false)})},{passive:true});
 modes.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const index=groups.findIndex(([g])=>g===current),next=e.key==='Home'?0:e.key==='End'?groups.length-1:(index+(e.key==='ArrowRight'?1:-1)+groups.length)%groups.length;selectGroup(groups[next][0]);modes.querySelector(`[data-group="${current}"]`).focus({preventScroll:true})});
 options.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;const buttons=[...options.children],i=buttons.indexOf(document.activeElement);if(i<0)return;e.preventDefault();const next=buttons[(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length];next.focus({preventScroll:true});center(next,options)});
 clear.onclick=()=>{clearF();selectGroup('type');sync();center(options.firstElementChild,options,false)};
 const previousSync=sync;sync=function(...args){const result=previousSync.apply(this,args);paint();return result};
 const layout=()=>{if(mobile.matches)requestAnimationFrame(()=>{center(modes.querySelector(`[data-group="${current}"]`),modes,false);const selected=[...options.children].find(b=>b.getAttribute('aria-pressed')==='true');if(selected)center(selected,options,false)})};
 mobile.addEventListener('change',layout);window.addEventListener('resize',layout);
 paint();layout();
})();

;/* --- edumind-inline-section-nav-runtime-v1-3-6 --- */
(()=>{
 const head=document.querySelector('.camera-filter-head'),clear=head?.querySelector('.camera-filter-clear'),sources=document.querySelector('#sources'),radar=document.querySelector('.radar-workspace');if(!head||!clear||!sources||!radar)return;
 const actions=document.createElement('div');actions.className='camera-head-actions';
 const button=document.createElement('button');button.type='button';button.className='camera-list-jump';button.textContent='Kaynaklar';button.setAttribute('aria-controls','sources');
 head.append(actions);actions.append(clear,button);
 const placeholder=document.createElement('div');placeholder.className='camera-nav-placeholder';placeholder.setAttribute('aria-hidden','true');head.after(placeholder);
 const mobile=matchMedia('(max-width:759px)');let frame=0,inSources=false,listOpened=false;
 function update(){
  frame=0;const top=Math.max(0,document.querySelector('.appbar')?.getBoundingClientRect().bottom||0),view=document.querySelector('.view[data-view="radar"]');
  const next=mobile.matches&&listOpened&&!view.hidden;
  if(document.documentElement.classList.contains('mobile-source-mode')!==next)document.documentElement.classList.toggle('mobile-source-mode',next);
  if(next&&!head.classList.contains('is-source-navigation'))placeholder.style.height=head.getBoundingClientRect().height+'px';
  head.classList.toggle('is-source-navigation',next);placeholder.classList.toggle('is-active',next);
  head.style.setProperty('--camera-nav-top',top+'px');inSources=next;
  const back=next&&!!categoryListOrigin;
  button.innerHTML=next?`<svg class="radar-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${back?'M19 12H5m7-7-7 7 7 7':'M19 12H5m7-7-7 7 7 7'}"/></svg>`:SV('<path d="M9 6h12M9 12h12M9 18h12M3 6h1M3 12h1M3 18h1"/>');button.setAttribute('aria-controls',next?(back?'sheet':'radarBox'):'sources');button.setAttribute('aria-label',next?(back?'Kaynak kartına dön':'Önceki sayfaya dön'):'Kaynaklar: seçili filtrelerle kaynakları göster');button.title=next?(back?'Kaynak kartına dön':'Önceki sayfaya dön'):'Kaynaklar';

 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update)}
 function openSourceList(){listOpened=true;document.documentElement.classList.add('mobile-source-mode')}
 document.addEventListener('edumind-category-origin-change',schedule);
 document.addEventListener('edumind-open-sources',()=>{if(mobile.matches){openSourceList();schedule()}});
 document.addEventListener('edumind-return-radar',()=>{listOpened=false;document.documentElement.classList.remove('mobile-source-mode');schedule()});
 button.onclick=()=>{if(inSources&&categoryListOrigin){returnToCategoryCard();return}const returning=inSources,top=Math.max(0,document.querySelector('.appbar')?.getBoundingClientRect().bottom||0);
  if(returning){listOpened=false;document.documentElement.classList.remove('mobile-source-mode');restoreRadarSources()}else openSourceList();
  const target=returning?radar:sources,offset=returning?8:60;
  window.scrollTo({top:mobile.matches?0:Math.max(0,scrollY+target.getBoundingClientRect().top-top-offset),behavior:mobile.matches?'instant':'smooth'});schedule()};
 window.addEventListener('resize',schedule);mobile.addEventListener('change',schedule);
 new MutationObserver(schedule).observe(document.querySelector('.view[data-view="radar"]'),{attributes:true,attributeFilter:['hidden']});
 update();
})();

;/* --- block-5 --- */
matchMedia('(max-width:759px)').addEventListener('change',()=>renderList());

;/* --- edumind-fit-radar-runtime-v1-3-15 --- */
(()=>{
 const strip=document.querySelector('#newStrip'),radar=document.querySelector('#radarBox'),workspace=document.querySelector('.radar-workspace'),view=document.querySelector('.view[data-view="radar"]');if(!strip||!radar||!workspace)return;
 const parent=strip.parentNode,next=strip.nextSibling,mobile=matchMedia('(max-width:759px)');let pending=0;
 function fit(){
  pending=0;
  if(mobile.matches){if(strip.parentNode!==radar)radar.prepend(strip)}else if(strip.parentNode!==parent)parent.insertBefore(strip,next);
  const active=mobile.matches&&!view.hidden&&!document.documentElement.classList.contains('mobile-source-mode');
  const entering=active&&!document.documentElement.classList.contains('mobile-radar-screen');
  if(document.documentElement.classList.contains('mobile-radar-screen')!==active)document.documentElement.classList.toggle('mobile-radar-screen',active);
  const viewport=window.visualViewport;
  const height=viewport?.height||innerHeight;
  const safeBottom=parseFloat(getComputedStyle(document.documentElement).paddingBottom)||0;
  const navRect=document.querySelector('#bottomnav').getBoundingClientRect();
  const nav=getComputedStyle(document.querySelector('#bottomnav')).display==='none'?0:navRect.height;
  const top=workspace.getBoundingClientRect().top+scrollY;
  const available=Math.max(120,Math.floor(height-top-safeBottom-nav-2));workspace.style.setProperty('--radar-available',available+'px');view.style.setProperty('--radar-available',available+'px');if(entering)scrollTo(0,0);
 }
 function schedule(){if(!pending)pending=requestAnimationFrame(fit)}
 mobile.addEventListener('change',schedule);window.addEventListener('resize',schedule);window.visualViewport?.addEventListener('resize',schedule);window.visualViewport?.addEventListener('scroll',schedule);window.addEventListener('pageshow',schedule);window.addEventListener('load',schedule);window.addEventListener('edumind-viewport-ready',schedule);new ResizeObserver(schedule).observe(document.querySelector('.appbar'));
 new MutationObserver(schedule).observe(view,{attributes:true,attributeFilter:['hidden']});new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 fit();
})();

;/* --- edumind-mobile-sort-runtime-v1-3-18 --- */
(()=>{
 const actions=document.querySelector('.camera-head-actions'),jump=document.querySelector('.camera-list-jump'),select=document.querySelector('#sourceSort');if(!actions||!select)return;
 const button=document.createElement('button');button.type='button';button.className='camera-mobile-sort';button.textContent='Sırala';button.setAttribute('aria-haspopup','menu');button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','cameraMobileSortMenu');actions.insertBefore(button,jump);
 const menu=document.createElement('div');menu.id='cameraMobileSortMenu';menu.className='camera-mobile-sort-menu';menu.hidden=true;menu.setAttribute('role','menu');menu.setAttribute('aria-label','Kaynakları sırala');
 for(const option of select.options){const item=document.createElement('button');item.type='button';item.textContent=option.textContent;item.dataset.sort=option.value;item.setAttribute('role','menuitemradio');menu.append(item)}document.body.append(menu);
 const items=[...menu.children];
 function close(focus=false){menu.hidden=true;button.setAttribute('aria-expanded','false');if(focus)button.focus({preventScroll:true})}
 function open(){items.forEach(item=>item.setAttribute('aria-checked',String(item.dataset.sort===S.sort)));menu.hidden=false;button.setAttribute('aria-expanded','true');const r=button.getBoundingClientRect(),w=menu.getBoundingClientRect().width,h=menu.getBoundingClientRect().height;menu.style.left=Math.max(12,Math.min(innerWidth-w-12,r.right-w))+'px';menu.style.top=Math.max(8,Math.min(r.bottom+6,innerHeight-h-8))+'px';(items.find(item=>item.dataset.sort===S.sort)||items[0]).focus({preventScroll:true})}
 button.onclick=()=>menu.hidden?open():close();
 menu.onclick=e=>{const item=e.target.closest('[data-sort]');if(!item)return;S.sort=item.dataset.sort;select.value=S.sort;close(true);sync()};
 document.addEventListener('click',e=>{if(!menu.contains(e.target)&&!button.contains(e.target))close()});
 function keys(e){if(e.key==='Escape'){close(true);e.preventDefault()}else if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();if(menu.hidden){open();return}const i=items.indexOf(document.activeElement),n=e.key==='Home'?0:e.key==='End'?items.length-1:(i+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;items[n].focus({preventScroll:true})}else if(e.key==='Tab')close()}
 button.addEventListener('keydown',keys);menu.addEventListener('keydown',keys);
 window.addEventListener('resize',()=>close());window.addEventListener('scroll',()=>close(),{passive:true});
 new MutationObserver(()=>{if(!document.documentElement.classList.contains('mobile-source-mode'))close()}).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
})();

;/* --- edumind-source-end-runtime-v1-3-19 --- */
(()=>{const nav=document.querySelector('#bottomnav');if(!nav)return;const fit=()=>document.documentElement.style.setProperty('--source-nav-height',nav.getBoundingClientRect().height+'px');new ResizeObserver(fit).observe(nav);fit()})();

;/* --- edumind-mobile-list-search-runtime-v1-3-34 --- */
(()=>{
 const input=document.querySelector('#q'),head=document.querySelector('.camera-filter-head');if(!input||!head)return;
 const search=input.closest('label'),parent=search.parentNode,next=search.nextSibling,placeholder=input.placeholder,mobile=matchMedia('(max-width:759px)');
 function place(){if(mobile.matches){search.classList.add('mobile-source-search');head.append(search);input.placeholder='Kaynaklarda ara'}else{search.classList.remove('mobile-source-search');parent.insertBefore(search,next);input.placeholder=placeholder}}
 function size(){document.documentElement.style.setProperty('--mobile-source-header-height',head.getBoundingClientRect().height+'px')}
 mobile.addEventListener('change',place);new ResizeObserver(size).observe(head);place();size();
})();

;/* --- edumind-round-list-actions-runtime-v1-3-40 --- */
(()=>{
 const icons=[['.camera-filter-clear','Temizle','<path d="m14 3 7 7-10 10H7l-4-4L14 3Z"/><path d="m8 11 7 7M11 20h10"/>'],['.camera-mobile-sort','Sırala','<path d="M4 6h16M4 12h10M4 18h6M18 12v8m-3-3 3 3 3-3"/>']];
 for(const [selector,label,paths] of icons){const button=document.querySelector(selector);if(!button)continue;button.setAttribute('aria-label',label);button.title=label;button.innerHTML=`<svg class="camera-toolbar-icon" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg><span class="camera-toolbar-label">${label}</span>`}
})();

;/* --- edumind-expandable-search-runtime-v1-3-42 --- */
(()=>{const input=document.querySelector('#q'),search=input?.closest('label');if(!input||!search)return;const paint=()=>search.classList.toggle('has-query',!!input.value);input.addEventListener('input',paint);const previousSync=sync;sync=function(...args){const result=previousSync.apply(this,args);paint();return result};paint()})();

;/* --- edumind-count-source-alignment-runtime-v1-3-47 --- */
(()=>{const sources=document.querySelector('#sources'),groups=document.querySelector('#groups');if(!sources||!groups)return;let frame=0;function measure(){frame=0;const title=groups.querySelector('.item .rinfo');if(!title)return;const rect=title.getBoundingClientRect();if(rect.width>0)document.documentElement.style.setProperty('--source-title-left',rect.left+'px')}function schedule(){if(!frame)frame=requestAnimationFrame(measure)}new ResizeObserver(schedule).observe(sources);new MutationObserver(schedule).observe(groups,{childList:true});window.addEventListener('resize',schedule);schedule()})();

;/* --- edumind-browser-header-color-v1-3-51 --- */
(()=>{
 const theme=document.querySelector('meta[name="theme-color"]'),sheet=document.querySelector('#sheet'),panel=document.querySelector('#sheetPanel'),root=document.documentElement;if(!theme||!sheet||!panel)return;
 function update(){
  let color;
  if(!sheet.hidden)color=getComputedStyle(panel).getPropertyValue('--card-header-color').trim()||getComputedStyle(panel).getPropertyValue('--card-category-dark').trim();
  else if(root.classList.contains('mobile-source-mode'))color='#000000';
  else color=getComputedStyle(document.querySelector('.appbar')).backgroundColor;
  if(color){if(theme.content!==color)theme.content=color;if(root.style.getPropertyValue('--browser-header-color')!==color)root.style.setProperty('--browser-header-color',color)}
 }
 const observer=new MutationObserver(update);observer.observe(sheet,{attributes:true,attributeFilter:['hidden']});observer.observe(panel,{attributes:true,attributeFilter:['data-category']});observer.observe(root,{attributes:true,attributeFilter:['class','data-theme']});
 matchMedia('(prefers-color-scheme:dark)').addEventListener('change',update);window.addEventListener('load',update);window.addEventListener('resize',update);requestAnimationFrame(update);update();
})();

;/* --- edumind-stable-card-header-resize-v1-3-54 --- */
matchMedia('(max-width:759px)').addEventListener('change',()=>{if(S.sel&&!document.querySelector('#sheet').hidden)renderDetail()});

;/* --- edumind-desktop-category-return-v1-3-60 --- */
(()=>{const heading=document.querySelector('#sources .source-heading');if(!heading)return;const back=document.createElement('button');back.type='button';back.className='btn sm source-card-back';back.textContent='← Karta dön';back.hidden=true;heading.prepend(back);back.onclick=returnToCategoryCard;document.addEventListener('edumind-category-origin-change',()=>{back.hidden=!categoryListOrigin})})();

;/* --- edumind-immediate-search-focus-v1-3-62 --- */
(()=>{const input=document.querySelector('#q'),search=input?.closest('label');if(!input||!search)return;search.addEventListener('pointerdown',e=>{if(matchMedia('(max-width:759px)').matches&&e.button===0&&e.isPrimary!==false)input.focus({preventScroll:true})})})();

;/* --- edumind-top-navigation-v1-3-70 --- */
(()=>{const nav=document.querySelector('#topnav'),actions=document.querySelector('.appbar-r');if(nav&&actions)actions.insertBefore(nav,document.querySelector('#introBtn'))})();

;/* --- edumind-card-platform-navigation-v1-3-99 --- */
let platformDialogKeyboard=false;
document.addEventListener('pointerdown',()=>{platformDialogKeyboard=false},true);
document.addEventListener('keydown',()=>{platformDialogKeyboard=true;document.querySelectorAll('.platform-pointer-return').forEach(el=>el.classList.remove('platform-pointer-return'))},true);
function openCardPlatforms(d){
 let dialog=document.querySelector('#cardPlatformDialog');
 if(!dialog){
  dialog=document.createElement('dialog');dialog.id='cardPlatformDialog';dialog.setAttribute('aria-labelledby','cardPlatformDialogTitle');
  dialog.innerHTML=`<div class="platform-dialog-head"><h2 id="cardPlatformDialogTitle">Platformlarım</h2><button type="button" class="platform-dialog-close" aria-label="Pencereyi kapat">${SV('<path d="m6 6 12 12M18 6 6 18"/>')}</button></div><p class="platform-dialog-intro">Kullandığınız platformları işaretleyin.</p><div class="platform-dialog-options">${[['Platformlar',PFOPTS.filter(([k])=>!['orcid','openalex'].includes(k))],['Akademik profiller',PFOPTS.filter(([k])=>['orcid','openalex'].includes(k))]].map(([title,items])=>`<fieldset class="platform-choice-group"><legend>${title}</legend>${items.map(([k,n])=>`<label><input type="checkbox" data-platform-choice="${k}">${picon(k==='feed'?'newsletter':k)}<span>${n}</span></label>`).join('')}</fieldset>`).join('')}</div><button type="button" class="platform-dialog-done">Tamam</button>`;
  document.body.append(dialog);
  dialog.querySelector('.platform-dialog-close').onclick=()=>dialog.close();dialog.querySelector('.platform-dialog-done').onclick=()=>dialog.close();
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
  dialog.addEventListener('close',()=>{const target=document.querySelector('#sheet').hidden?document.querySelector('#myListPrefs'):document.querySelector('#sheetBody .card-platform-settings');if(target){target.classList.toggle('platform-pointer-return',!platformDialogKeyboard);target.focus({preventScroll:true})}});
  dialog.querySelectorAll('[data-platform-choice]').forEach(input=>input.onchange=()=>{const k=input.dataset.platformChoice,body=document.querySelector('#sheetBody'),scroll=body.scrollTop;input.checked?S.pref.add(k):S.pref.delete(k);saveAll();document.querySelectorAll(`[data-pref="${k}"]`).forEach(b=>b.setAttribute('aria-pressed',String(S.pref.has(k))));sync();body.scrollTop=scroll});
 }
 dialog.querySelectorAll('[data-platform-choice]').forEach(input=>input.checked=S.pref.has(input.dataset.platformChoice));
 dialog.style.setProperty('--platform-dialog-accent',getComputedStyle(document.querySelector('#sheetPanel')).getPropertyValue('--card-category-dark'));
 dialog.showModal();
}

(()=>{
 const follow=document.querySelector('#sepet');if(!follow)return;
 const back=document.createElement('button');back.type='button';back.id='platformCardBack';back.className='btn sm';back.textContent='← Karta dön';back.hidden=true;follow.prepend(back);
 back.onclick=()=>{const origin=platformCardOrigin;if(!origin)return;platformCardOrigin=null;back.hidden=true;categoryListOrigin=origin;returnToCategoryCard()};
})();

;/* --- edumind-radar-legend-runtime-v1-3-109 --- */
(()=>{const box=document.querySelector('#radarBox');if(!box)return;const key=document.createElement('aside');key.className='radar-color-key';key.setAttribute('aria-label','Radar renkleri ve çemberler');key.innerHTML='<div class="radar-ring-key"><span class="radar-frequency-key"><svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="11" cy="11" r="4"/></svg>Günlük</span><span class="radar-frequency-key"><svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke-dasharray="1.5 2"/></svg>Haftalık</span><span class="radar-frequency-key"><svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="11" cy="11" r="9" stroke-dasharray="4 3"/></svg>Dönemsel</span></div>';box.append(key)})();

;/* --- edumind-radar-reading-popover-runtime-v1-3-130 --- */
(()=>{
 const key=document.querySelector('.radar-color-key');if(!key)return;
 const frequency=key.querySelector('.radar-ring-key').outerHTML;
 key.innerHTML=`<button type="button" class="radar-read-toggle" aria-expanded="false" aria-controls="radarReadPopover">${SV('<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7" r=".7"/>')}<span>Radar rehberi</span></button>`;
 const button=key.querySelector('button'),pop=document.createElement('aside');pop.id='radarReadPopover';pop.className='radar-read-popover';pop.hidden=true;pop.setAttribute('role','dialog');pop.setAttribute('aria-labelledby','radarReadTitle');
 pop.innerHTML=`<div class="radar-read-head"><h3 id="radarReadTitle">Radar rehberi</h3><button type="button" class="radar-read-close" aria-label="Açıklamayı kapat">${SV('<path d="m6 6 12 12M18 6 6 18"/>')}</button></div>
<div class="radar-guide-section"><strong>Radarı okuyun</strong><p>Her nokta bir kaynaktır. Renkler kategorileri, halkalar içten dışa <b>Günlük, Haftalık ve Dönemsel</b> takip sıklığını gösterir. Noktaya dokunarak kaynak kartını açın.</p><p>Üstteki <b>Yeni</b> alanı son eklenenleri listeler. <b>Radarda</b> sayacı, görünen / mevcut kaynak sayısıdır.</p></div>
<div class="radar-guide-section"><strong>İşaretleri tanıyın</strong><p><b>Bordo yer imi:</b> Listem'de. <b>Büyüyüp küçülen nokta:</b> Henüz incelenmemiş, Listem'de olmayan yeni kaynak. Bu işaretler Radar ayarları'ndan kapatılabilir.</p></div>
<div class="radar-guide-section"><strong>Görünümü değiştirin</strong><p><b>Tarama</b> düğmesi ışığı durdurur veya başlatır. <b>Listem'dekileri gizle</b>, kayıtlı kaynakları radardan ve Kaynaklar'dan gizler; listenizi silmez. <b>Göster</b> ile geri getirin.</p><p>Sağ üstteki <b>dişli</b> ile görünüm ve hareket ayarlarını değiştirin; isterseniz önceki radara dönün.</p></div>
<div class="radar-guide-section"><strong>Kaynakları süzün</strong><p>Üst şeritten filtre başlığını, alt şeritten seçenekleri seçin. Birden fazla seçim yapabilir, şeritleri yana kaydırabilirsiniz. <b>Huni</b> ile seçimleri görün veya temizleyin.</p></div>
<div class="radar-guide-section"><strong>Listenizi oluşturun</strong><p>Alt menüden <b>Kaynaklar</b>'ı açın. <b>+</b> listeye ekler, <b>✓</b> listede olduğunu gösterir; tekrar dokunmak çıkarır. <b>Listem</b> ekranında <b>−</b> ile çıkarın. Yanlışlıkla çıkardıysanız <b>Geri al</b>’a dokunun.</p></div>`;

 document.body.append(pop);
 function close(focus=false){pop.hidden=true;button.setAttribute('aria-expanded','false');if(focus)button.focus({preventScroll:true})}
 button.onclick=()=>{if(!pop.hidden){close();return}pop.hidden=false;button.setAttribute('aria-expanded','true');const r=button.getBoundingClientRect(),w=pop.offsetWidth,h=pop.offsetHeight;pop.style.left=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2))+'px';pop.style.top=Math.max(12,Math.min(innerHeight-h-12,r.top-h-10>=12?r.top-h-10:r.bottom+10))+'px'};
 pop.querySelector('.radar-read-close').onclick=()=>close(true);
 document.addEventListener('pointerdown',e=>{if(!pop.hidden&&!pop.contains(e.target)&&!button.contains(e.target))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!pop.hidden){e.preventDefault();close(true)}});
 window.addEventListener('resize',()=>close());
 const view=document.querySelector('.view[data-view="radar"]');new MutationObserver(()=>{if(view.hidden)close()}).observe(view,{attributes:true,attributeFilter:['hidden']});
 document.addEventListener('edumind-open-sources',()=>close());
})();

;/* --- edumind-contextual-radar-help-runtime-v1-3-132 --- */
(()=>{
 const button=document.querySelector('.radar-read-toggle'),key=document.querySelector('.radar-color-key'),head=document.querySelector('.camera-filter-head');if(!button||!key||!head)return;
 const mobile=matchMedia('(max-width:759px)');
 function update(){if(mobile.matches){if(button.parentElement!==head)head.append(button);button.hidden=!!anyF()}else{if(button.parentElement!==key)key.append(button);button.hidden=false}}
 const previous=sync;sync=function(...args){const result=previous.apply(this,args);update();return result};
 mobile.addEventListener('change',update);update();
})();

;/* --- edumind-audit-country-note-runtime-v1-3-135 --- */
(()=>{function close(){const note=document.querySelector('#auditCountryNote'),button=document.querySelector('.audit-country-info');if(note&&!note.hidden){note.hidden=true;button?.setAttribute('aria-expanded','false')}}document.addEventListener('pointerdown',e=>{if(!e.target.closest('.audit-country-info,#auditCountryNote'))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){const note=document.querySelector('#auditCountryNote');if(note&&!note.hidden){e.stopImmediatePropagation();e.preventDefault();close();document.querySelector('.audit-country-info')?.focus({preventScroll:true})}}},true)})();

;/* --- edumind-personal-list-workspace-runtime-v1-3-137 --- */
(()=>{
 document.querySelector('#myListSearch').addEventListener('input',e=>{myListQuery=e.target.value;renderBasket()});
 document.querySelector('#myListSort').onchange=e=>{myListSort=e.target.value;renderBasket()};
 document.querySelector('#myListPrefs').onclick=()=>openCardPlatforms();
 const menu=document.querySelector('#myListMenu');document.addEventListener('pointerdown',e=>{if(!menu.contains(e.target))menu.open=false});menu.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.open=false;e.preventDefault();menu.querySelector('summary').focus()}});
 const undo=document.createElement('div');undo.id='myListUndo';undo.hidden=true;undo.setAttribute('role','status');undo.innerHTML='<span></span><button type="button">Geri al</button>';undo.querySelector('button').onclick=undoMySavedRemoval;document.body.append(undo);
})();

;/* --- edumind-personal-list-toolbar-runtime-v1-3-140 --- */
document.querySelector('#myListClose').onclick=()=>setView('radar');

;/* --- edumind-my-list-header-search-runtime-v1-3-143 --- */
(()=>{
 const input=document.querySelector('#myListSearch'),label=input.closest('label'),parent=label.parentElement,next=label.nextSibling,tools=document.querySelector('.my-list-tools'),mobile=matchMedia('(max-width:759px)');
 function place(){if(mobile.matches){label.classList.add('my-list-toolbar-search');tools.prepend(label)}else{label.classList.remove('my-list-toolbar-search');parent.insertBefore(label,next)}}
 label.addEventListener('pointerdown',e=>{if(mobile.matches&&e.button===0&&e.isPrimary!==false)input.focus({preventScroll:true})});mobile.addEventListener('change',place);place();
})();

;/* --- edumind-center-personal-list-platform-v1-3-147 --- */
window.addEventListener('resize',()=>requestAnimationFrame(centerMyListPlatform));
window.addEventListener('load',()=>requestAnimationFrame(()=>requestAnimationFrame(centerMyListPlatform)));

;/* --- edumind-return-to-origin-v1-3-154 --- */
(()=>{
 const trail=[];let returning=false;
 const route=()=>S.view==='radar'&&document.documentElement.classList.contains('mobile-source-mode')?'list':S.view;
 const snapshot=()=>({route:route(),y:scrollY,platform:myListPlatform,query:myListQuery,sets:Object.fromEntries(FSET.map(k=>[k,[...S[k]]])),values:Object.fromEntries(['q','sort','recent','week','core','mine','bask','personalIds','personalLabel'].map(k=>[k,S[k]]))});
 const originalSetView=setView;
 setView=function(k,...args){if(!returning&&k!==route())trail.push(snapshot());return originalSetView(k,...args)};
 function back(){
  const origin=trail.pop();returning=true;
  try{
   if(!origin){originalSetView('radar');return}
   clearF();FSET.forEach(k=>origin.sets[k].forEach(v=>S[k].add(v)));Object.assign(S,origin.values);document.querySelector('#q').value=S.q;
   originalSetView(origin.route,true);myListPlatform=origin.platform;myListQuery=origin.query;document.querySelector('#myListSearch').value=myListQuery;sync();
   requestAnimationFrame(()=>{window.scrollTo({top:origin.y,behavior:'instant'});if(origin.route==='follow')centerMyListPlatform()});
  }finally{returning=false}
 }
 const sourceButton=document.querySelector('.camera-list-jump');
 sourceButton?.addEventListener('click',e=>{
  if(document.documentElement.classList.contains('mobile-source-mode')){
   e.preventDefault();e.stopImmediatePropagation();
   if(categoryListOrigin){trail.pop();returning=true;try{returnToCategoryCard()}finally{returning=false}}else back();
  }else if(!returning)trail.push(snapshot());
 },true);
 const listClose=document.querySelector('#myListClose');listClose.onclick=back;listClose.setAttribute('aria-label','Önceki sayfaya dön');
 document.querySelector('#introClose').onclick=()=>{S.introOpen=false;introSeen=true;try{localStorage.setItem('edumind-intro-v1','1')}catch(e){}back()};
})();

;/* --- edumind-reading-guidance-v1-3-155 --- */
(()=>{
 const help=document.querySelector('.radar-read-popover');
 help?.insertAdjacentHTML('beforeend','<div class="radar-guide-section"><strong>Başlangıç önerisi alın</strong><p>Keşfet → Bana kişisel liste öner alanından size uygun kaynaklarla başlayabilirsiniz.</p></div>');
 if(S.view==='rhythm')setView('follow');else renderNav();
})();

;/* --- edumind-refresh-personal-roles-v1-3-158 --- */
(()=>{const previous=sync;sync=function(...args){const result=previous.apply(this,args);renderPersonalRecommendations();return result}})();

;/* --- edumind-unified-navigation-v1-3-185 --- */
(()=>{
 const arrow=SV('<path d="M19 12H5m7-7-7 7 7 7"/>');document.querySelector('#myListClose').innerHTML=arrow;
 const info=document.querySelector('#introBtn');info?.setAttribute('aria-label','Radar hakkında');info?.setAttribute('title','Radar hakkında');
 const head=document.querySelector('.camera-filter-head'),button=head.querySelector('.camera-filter-clear'),originalMarkup=button.innerHTML,clear=button.onclick;
 const panel=document.createElement('div');panel.className='source-filter-popover';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Seçili filtreler');document.body.append(panel);
 const inSources=()=>S.view==='radar'&&!document.documentElement.classList.contains('sheet-open');
 function close(){panel.hidden=true;button.setAttribute('aria-expanded','false')}
 function position(){
  const r=button.getBoundingClientRect();
  if(r.top>=180){panel.style.top='auto';panel.style.bottom=Math.max(12,innerHeight-r.top+10)+'px';panel.style.maxHeight=(r.top-22)+'px'}
  else{panel.style.bottom='auto';panel.style.top=(r.bottom+10)+'px';panel.style.maxHeight=Math.max(100,innerHeight-r.bottom-22)+'px'}
  panel.style.left=Math.max(12,Math.min(innerWidth-panel.offsetWidth-12,r.right-panel.offsetWidth))+'px';
 }
 function paint(){
  if(!inSources()){close();return}
  const filters=activeF();if(S.recent)filters.push(['recent','Yeni eklenenler']);if(S.q)filters.push(['query','Arama: '+S.q]);if(S.bask)filters.push(['basket','Listemdekiler']);if(S.mine)filters.push(['mine','Takiptekiler']);if(S.core)filters.push(['core','Çekirdek 12']);if(S.week)filters.push(['week','Haftalık rota']);
  panel.innerHTML=`<div class="source-filter-popover-head"><b>Seçili filtreler</b><button type="button" data-filter-close aria-label="Filtre menüsünü kapat">${SV('<path d="m6 6 12 12M18 6 6 18"/>')}</button></div><div class="source-filter-popover-options">${filters.length?filters.map(([key,label])=>`<button type="button" data-remove-filter="${esc(key)}">${esc(label)} <span aria-hidden="true">×</span></button>`).join(''):'<p>Filtre seçilmedi.</p>'}</div><button type="button" class="source-filter-reset" ${anyF()?'':'disabled'}>Filtreleri temizle</button>`;
  panel.querySelector('[data-filter-close]').onclick=close;
  panel.querySelector('.source-filter-reset').onclick=()=>{clear();close()};
  panel.querySelectorAll('[data-remove-filter]').forEach(el=>el.onclick=()=>{const k=el.dataset.removeFilter;if(k==='recent')S.recent=false;else if(k==='query'){S.q='';document.querySelector('#q').value=''}else if(k==='personal'){S.personalIds=null;S.personalLabel=''}else if(k==='basket')S.bask=false;else if(k==='mine')S.mine=false;else if(k==='core')S.core=false;else if(k==='week')S.week=null;else{const [g,v]=k.split(':');S[g]?.delete(v)}sync();paint()});
 }
 function update(){
  const source=inSources();
  if(source){if(button.dataset.menuMode!=='source'){button.innerHTML=SV('<path d="M4 7h7m4 0h5M4 17h3m4 0h9"/><circle cx="13" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>');button.dataset.menuMode='source'}if(button.disabled)button.disabled=false;button.setAttribute('aria-label','Filtreler'+(+button.dataset.count?', '+button.dataset.count+' seçili':''));button.title='Filtreler';button.setAttribute('aria-haspopup','dialog')}
  else{if(button.dataset.menuMode==='source'){button.innerHTML=originalMarkup;button.dataset.menuMode='radar';button.disabled=!anyF();button.removeAttribute('aria-haspopup')}close()}
 }
 button.addEventListener('click',e=>{if(!inSources())return;e.preventDefault();e.stopImmediatePropagation();if(!panel.hidden){close();return}paint();panel.hidden=false;button.setAttribute('aria-expanded','true');position()},true);
 document.addEventListener('pointerdown',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!button.contains(e.target))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();e.stopImmediatePropagation();close();button.focus({preventScroll:true})}},true);
 window.addEventListener('resize',close);window.addEventListener('scroll',close,{passive:true});
 new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['class']});new MutationObserver(update).observe(button,{attributes:true,attributeFilter:['disabled','data-count']});update();
})();

;/* --- edumind-transient-menu-behavior-v1-3-186 --- */
(()=>{
 const root=document.documentElement;
 const entries=[
  {trigger:document.querySelector('#myListMenu>summary'),panel:document.querySelector('#myListMenu .my-list-menu-panel'),details:document.querySelector('#myListMenu')},
  {trigger:document.querySelector('.camera-filter-clear'),panel:document.querySelector('.source-filter-popover')},
  {trigger:document.querySelector('.camera-mobile-sort'),panel:document.querySelector('#cameraMobileSortMenu')},
  {trigger:document.querySelector('.radar-read-toggle'),panel:document.querySelector('.radar-read-popover')}
 ].filter(e=>e.trigger&&e.panel);
 const close=entry=>{if(entry.details)entry.details.open=false;else entry.panel.hidden=true;entry.trigger.setAttribute('aria-expanded','false')};
 entries.forEach(entry=>{
  let timer;const cancel=()=>clearTimeout(timer);
  const leave=e=>{if(e.pointerType!=='mouse')return;if(entry.trigger.contains(e.relatedTarget)||entry.panel.contains(e.relatedTarget))return;cancel();timer=setTimeout(()=>close(entry),180)};
  [entry.trigger,entry.panel].forEach(el=>{el.addEventListener('pointerenter',cancel);el.addEventListener('pointerleave',leave)});
 });
 document.addEventListener('pointerdown',e=>{
  root.dataset.navInput='pointer';
  const active=entries.find(entry=>entry.trigger.contains(e.target)||entry.panel.contains(e.target));
  if(active)entries.forEach(entry=>{if(entry!==active)close(entry)});
 },true);
 document.addEventListener('keydown',()=>root.dataset.navInput='keyboard',true);
})();
