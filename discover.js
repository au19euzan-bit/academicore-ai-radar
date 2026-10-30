/* Move existing suggestion tools without cloning their state or event handlers. */
(()=>{
 const page=document.querySelector('#discover'),sections=page.querySelector('.discovery-sections');
 for(const selector of ['#sepet .my-list-route','#sepet .my-list-discover']){
  const section=document.querySelector(selector);if(section){sections.append(section);section.open=true}
 }
 const back=document.querySelector('#myListClose');page.querySelector('.discover-back').onclick=()=>back?.click();
 renderNav();
})();
