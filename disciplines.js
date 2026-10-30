/* Local academic interests, separate from source records and saved lists. */
(()=>{
 const key='edumind-disciplines';
 const areas=[
 ['education','Eğitim bilimleri',[
 'Öğretmen eğitimi ve mesleki gelişim','Ölçme ve değerlendirme',
 'Eğitim programları ve öğretim','Eğitim teknolojileri ve öğrenme tasarımı',
 'Eğitim yönetimi ve politikaları','Rehberlik ve psikolojik danışmanlık',
 'Özel eğitim ve kapsayıcı eğitim',null,null,
 'Yükseköğretim','Yetişkin eğitimi ve yaşam boyu öğrenme',
 {id:'subject',name:'Alan eğitimi',children:[
 'Matematik eğitimi','Fen bilimleri eğitimi','Fizik eğitimi','Kimya eğitimi',
 'Biyoloji eğitimi','Türkçe eğitimi','Türk dili ve edebiyatı eğitimi',
 'Yabancı dil eğitimi','Sosyal bilgiler eğitimi','Tarih eğitimi','Coğrafya eğitimi',
 'Felsefe grubu eğitimi','Din kültürü ve ahlak bilgisi eğitimi',
 'Bilgisayar ve bilişim eğitimi','Beden eğitimi ve spor','Müzik eğitimi',
 'Görsel sanatlar eğitimi','Mesleki ve teknik eğitim',{leaf:'education:7',name:'Okul öncesi eğitimi'},{leaf:'education:8',name:'Sınıf eğitimi'}]}
 ]],
 ['law','Hukuk',['Hukuk teknolojileri','AI düzenlemeleri']],
 ['business','İşletme ve ekonomi',['Yönetim','Finans','Pazarlama']],
 ['health','Sağlık bilimleri',['Tıp','Diş hekimliği','Hemşirelik','Eczacılık']],
 ['engineering','Mühendislik ve bilişim',['Bilgisayar','Elektrik-elektronik','Endüstri']],
 ['humanities','Sosyal ve beşerî bilimler',['Psikoloji','Sosyoloji','Dilbilim','Tarih']],
 ['science','Fen bilimleri',['Biyoloji','Fizik','Kimya','Matematik']],
 ['arts','Sanat, tasarım ve mimarlık',['Tasarım','Güzel sanatlar','Mimarlık']]
 ];
 function leaves(prefix,children){return children.flatMap((child,i)=>!child?[]:child.leaf?[child.leaf]:typeof child==='string'?[prefix+':'+i]:leaves(prefix+':'+child.id,child.children))}
 const ids=new Set(areas.flatMap(([id,,children])=>leaves(id,children)));
 function renderChildren(prefix,children){return children.map((child,i)=>{
  if(!child)return '';
  if(child.leaf)return '<label><input type="checkbox" data-subarea="'+child.leaf+'"><span>'+child.name+'</span></label>';
  if(typeof child==='string')return '<label><input type="checkbox" data-subarea="'+prefix+':'+i+'"><span>'+child+'</span></label>';
  const id=prefix+':'+child.id,dom=id.replaceAll(':','-');
  return '<section class="area-subgroup"><div class="area-group-head"><label><input type="checkbox" data-branch="'+id+'"><span>'+child.name+'</span></label><button type="button" class="area-expand" aria-label="'+child.name+' alt alanları" aria-expanded="false" aria-controls="area-'+dom+'">⌄</button></div><div id="area-'+dom+'" class="area-children" hidden>'+renderChildren(id,child.children)+'</div></section>';
 }).join('')}
 const read=()=>{try{const a=JSON.parse(localStorage.getItem(key));return Array.isArray(a)?a.filter(x=>ids.has(x)):[]}catch{return[]}};
 window.academicSourceMatches=d=>{const selected=read();return !selected.length||(window.ACADEMIC_SOURCE_AREAS?.[d.n]||[]).some(id=>selected.includes(id))};
 document.addEventListener('academic-areas-changed',()=>{sync();refreshEmptyArea();});
 const dialog=document.createElement('dialog');dialog.id='academicAreasDialog';dialog.setAttribute('aria-labelledby','academicAreasTitle');
 dialog.innerHTML='<form method="dialog" class="academic-areas-form"><header><div><span class="areas-eyebrow">AcademiCore AI Radar</span><h2 id="academicAreasTitle">Akademik alanlarınız</h2></div><button type="button" class="areas-close" aria-label="Vazgeç">×</button></header><p>İlgilendiğiniz alanları seçin. Birden fazla alan ve alt alan seçebilirsiniz.</p><p class="areas-catalog-note">Mevcut kaynaklar seçtiğiniz alanlarla eşleştirilerek gösterilir. Bazı alanlarda henüz uygun kaynak bulunmayabilir; birden fazla alan seçebilirsiniz. Listem → … → Akademik alanlarım yolundan değiştirebilirsiniz.</p><div class="areas-options">'+areas.map(([id,name,children])=>'<section class="area-group"><div class="area-group-head"><label><input type="checkbox" data-area="'+id+'"><span>'+name+'</span></label><button type="button" class="area-expand" aria-label="'+name+' alt alanları" aria-expanded="false" aria-controls="area-'+id+'">⌄</button></div><div id="area-'+id+'" class="area-children" hidden>'+renderChildren(id,children)+'</div></section>').join('')+'</div><footer><span class="areas-count" aria-live="polite"></span><p class="areas-error" role="alert" hidden></p><button type="submit" class="areas-save">Seçimlerimi kaydet</button></footer></form>';
 document.body.append(dialog);let mandatory=false,opener=null;
 const all=()=>[...dialog.querySelectorAll('[data-subarea]')];
 function refresh(){
  for(const input of dialog.querySelectorAll('[data-area],[data-branch]')){const children=[...input.closest('section').querySelectorAll('[data-subarea]')],n=children.filter(e=>e.checked).length;input.checked=n===children.length;input.indeterminate=n>0&&n<children.length}
  const n=all().filter(e=>e.checked).length;dialog.querySelector('.areas-count').textContent=n+' alt alan seçildi';dialog.querySelector('.areas-error').hidden=true;
 }
 function open(first=false){mandatory=first;opener=document.activeElement;const selected=new Set(read());all().forEach(e=>e.checked=selected.has(e.dataset.subarea));dialog.querySelector('.areas-close').hidden=first;dialog.querySelector('.areas-save').textContent=first?'Seçimlerimle devam et':'Seçimlerimi kaydet';refresh();if(!dialog.open)dialog.showModal()}
 dialog.addEventListener('change',e=>{if(e.target.dataset.area||e.target.dataset.branch){[...e.target.closest('section').querySelectorAll('[data-subarea]')].forEach(x=>x.checked=e.target.checked)}refresh()});
 dialog.querySelectorAll('.area-expand').forEach(b=>b.onclick=()=>{const child=document.getElementById(b.getAttribute('aria-controls')),expanded=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!expanded));child.hidden=expanded});
 dialog.querySelector('.areas-close').onclick=()=>dialog.close();
 dialog.addEventListener('cancel',e=>{if(mandatory)e.preventDefault()});
 dialog.querySelector('form').onsubmit=e=>{e.preventDefault();const selected=all().filter(x=>x.checked).map(x=>x.dataset.subarea),error=dialog.querySelector('.areas-error');if(!selected.length){error.textContent='Devam etmek için en az bir alan seçin.';error.hidden=false;return}try{localStorage.setItem(key,JSON.stringify(selected))}catch{error.textContent='Seçimler kaydedilemedi. Cihaz depolamasını kontrol edip yeniden deneyin.';error.hidden=false;return}dialog.close();document.dispatchEvent(new CustomEvent('academic-areas-changed',{detail:selected}));};
 dialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus({preventScroll:true})});
 const menu=document.querySelector('#myListMenu .my-list-menu-panel');
 if(menu){const b=document.createElement('button');b.type='button';b.id='academicAreasEdit';b.textContent='Akademik alanlarım';b.onclick=()=>{document.querySelector('#myListMenu').open=false;open(false)};menu.prepend(b)}
 const emptyArea=document.createElement('div');emptyArea.className='academic-empty-area';emptyArea.hidden=true;emptyArea.innerHTML='<p>Seçtiğiniz akademik alanlar için henüz uygun kaynak eklenmedi.</p><button type="button">Alan seçimlerimi değiştir</button>';document.querySelector('#radarBox')?.before(emptyArea);emptyArea.querySelector('button').onclick=()=>open(false);
 function refreshEmptyArea(){emptyArea.hidden=!read().length||D.some(window.academicSourceMatches)}
 sync();refreshEmptyArea();
 // Open after the first render, including for existing installations without interests.
 if(!read().length&&!document.documentElement.classList.contains('radar-desktop'))requestAnimationFrame(()=>open(true));
})();
