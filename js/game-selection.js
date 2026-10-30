// Device-local library selection, shared by every arcade view.
(() => {
 const storageKey='card-arcade-included-games';
 let included=null,groups=[],dialog,firstLaunch=false,opener;
 try { const saved=JSON.parse(localStorage.getItem(storageKey));if(Array.isArray(saved)&&saved.every(k=>typeof k==='string'))included=new Set(saved); } catch(_) {}
 const enabled=key=>included===null||included.has(key);
 function gear(){const b=document.createElement('button');b.type='button';b.className='alt game-settings';b.textContent='⚙';b.title='Choose games';b.setAttribute('aria-label','Choose games');b.onclick=()=>open();return b}
 function open(first=false){
  if(dialog?.open)return;
  if(typeof g!=='undefined'&&g?.busy)return toast('Finishing this turn...');
  firstLaunch=first;opener=document.activeElement;
  window.CarouselArcade?.cleanup?.();
  dialog=document.createElement('dialog');dialog.className='game-selection';dialog.setAttribute('aria-labelledby','game-selection-title');
  const head=document.createElement('header');const title=document.createElement('h2');title.id='game-selection-title';title.textContent='Choose your games';head.append(title);dialog.append(head);
  const intro=document.createElement('p');intro.textContent='Check the games you want in your arcade. Change this anytime with ⚙.';dialog.append(intro);
  const form=document.createElement('form');form.method='dialog';
  for(const [name,entries]of groups){const field=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=name;field.append(legend);const list=document.createElement('div');list.className='game-selection-list';for(const entry of entries){const label=document.createElement('label'),input=document.createElement('input'),text=document.createElement('span');input.type='checkbox';input.value=entry.preview;input.checked=included!==null&&included.has(entry.preview);text.textContent=entry.t.replace(/^\d+[a-z]?\. /,'');label.append(input,text);list.append(label)}field.append(list);form.append(field)}
  const footer=document.createElement('footer'),count=document.createElement('output'),save=document.createElement('button');save.type='submit';save.textContent=first?'Open my arcade':'Save changes';const update=()=>{count.textContent=form.querySelectorAll('input:checked').length+' games selected'};form.onchange=update;update();footer.append(count);
  if(!first){const cancel=document.createElement('button');cancel.type='button';cancel.className='alt';cancel.textContent='Cancel';cancel.onclick=close;footer.append(cancel)}footer.append(save);form.append(footer);dialog.append(form);document.body.append(dialog);
  dialog.addEventListener('cancel',event=>{if(firstLaunch)event.preventDefault();else{event.preventDefault();close()}});
  form.onsubmit=event=>{event.preventDefault();included=new Set([...form.querySelectorAll('input:checked')].map(input=>input.value));try{localStorage.setItem(storageKey,JSON.stringify([...included]))}catch(_){toast('Selection could not be saved on this device.')}close();window.CarouselArcade?.refreshSelection?.();A.menu()};
  dialog.showModal();dialog.scrollTop=0;
 }
 // Keep game hotkeys from acting behind the selection page; native checkbox, Tab and Escape behavior remains intact.
 addEventListener('keydown',event=>{if(dialog?.open)event.stopImmediatePropagation()},true);
 function close(){dialog?.close();dialog?.remove();dialog=null;opener?.focus()}
 window.GameSelection={enabled,gear,open,init(collections){groups=collections;for(const selector of ['#top>div','#g2t>span','#mtop'])document.querySelector(selector)?.append(gear());if(included===null)open(true);else A.menu()}};
})();
