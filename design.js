/* v1.3.331 design pass: menu sections and dialog focus. Loaded last,
   after the scripts that add their own items to the Listem menu. */
(()=>{
 // The Listem menu groups list actions and app settings under two small headings.
 const panel=document.querySelector('#myListMenu .my-list-menu-panel');
 const SECTIONS=[['Liste',['myListBackup','bCsv','bOpmlAll','bClear']],['Uygulama',['academicAreasEdit','myListBadge','checkForUpdates']]];
 function group(){
  if(!panel)return;
  const wanted=SECTIONS.flatMap(([title,ids])=>{const items=ids.map(id=>panel.querySelector('#'+id)).filter(Boolean);if(!items.length)return [];
   let head=panel.querySelector(`.menu-heading[data-section="${title}"]`);
   if(!head){head=document.createElement('p');head.className='menu-heading';head.dataset.section=title;head.setAttribute('aria-hidden','true');head.textContent=title}
   return [head,...items]});
  const rest=[...panel.children].filter(e=>!wanted.includes(e));
  const order=[...wanted,...rest];
  if(order.some((e,i)=>panel.children[i]!==e))panel.append(...order);
 }
 group();new MutationObserver(group).observe(panel||document.createElement('div'),{childList:true});
 addEventListener('load',group);

 // The sort menu gets the same small heading as the other menus.
 const sort=document.querySelector('#cameraMobileSortMenu');
 if(sort&&!sort.querySelector('.menu-heading')){const head=document.createElement('p');head.className='menu-heading';head.setAttribute('aria-hidden','true');head.textContent='Sırala';sort.prepend(head)}

 // Opening a dialog focuses its close button, which then shows a focus ring as if the
 // user had tabbed to it. Focus the dialog itself instead; Tab still reaches the button.
 const DIALOGS='#radarSettings,#radarHelpDialog,#cardPlatformDialog,#transferDialog,#badgeDialog,#suggestionDialog';
 new MutationObserver(records=>records.forEach(({target})=>{
  if(!target.matches?.(DIALOGS)||!target.open)return;
  const close=target.querySelector('.academy-modal-close,.platform-dialog-head>button,[data-close]');
  if(document.activeElement===close){target.tabIndex=-1;target.focus({preventScroll:true})}
 })).observe(document.body,{attributes:true,attributeFilter:['open'],subtree:true});

})();
