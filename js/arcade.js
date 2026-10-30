// The hub uses the same game registry as the individual game overlay.
(() => {
  const arcade = window.CardArcade;
  const puzzleKeys=['bowling','memory'];
  const gameEntry=key=>{const g=arcade.games[key];return {key,t:g.t,d:g.d,action:'arcade',preview:key}};
  // Card Puzzles and Solo Adventures live inside Solitaire.
  const solitaireKeys=()=>{const keys=Object.keys(arcade.games).filter(k=>!['board','duel','classic'].includes(arcade.games[k].category));for(const k of puzzleKeys)if(!keys.includes(k))keys.push(k);return keys};
  // Popular solitaire games first; unlisted games keep their registry order.
  const POPULAR=['klondike','spider','freecell','pyramid','tripeaks','golf','yukon','fortythieves','canfield','scorpion','montecarlo','eightoff','accordion','bakersdozen','seahaven','ginrummy','simplesimon','russian','duchess','bristol','flowergarden','gaps','josephine','acesup','bisley','littlespider','wasp','nestor','lucie','falk','memory','bowling'];
  const popularity=k=>{const i=POPULAR.indexOf(k);return i<0?POPULAR.length:i};
  const HIDE_KEY='arcade_hidden',hidden=new Set();
  try{for(const k of JSON.parse(localStorage.getItem(HIDE_KEY)||'[]'))hidden.add(k)}catch(e){}
  // Grab Bag: a mixed shelf of favourites from every cabinet.
  const GRAB_BAG=['klondike','freecell','spider','pyramid','golf','tripeaks','clock','montecarlo','memory','checkers','chinesecheckers','mancala','mahjong','classic-cube','sudoku','chess','classic-mastermind','classic-battleship','backgammon','connectfour','tictactoe','jewels','classic-simon','classic-etch','classic-litebrite','classic-lightsout'];
  function allCollections(){return [
    ['Grab Bag',[{key:'randos',t:'Randos',d:'',action:'randos',preview:'',image:'img/randos.webp'},...GRAB_BAG.filter(k=>arcade.games[k]).map(gameEntry)]],
    ['Solitaire',solitaireKeys().sort((a,b)=>popularity(a)-popularity(b)).map(gameEntry).concat([{key:'stack',t:'Stack Showdown',d:'Levels & the dealer',action:'stack',preview:'stack'}])],
    ['Board Games',Object.keys(arcade.games).filter(k=>arcade.games[k].category==='board').map(gameEntry)],
    ['Classic Games',(window.ClassicCabinet?.keys||[]).map(gameEntry)],
    
    
    
  ]}
  function collections(all=false){return allCollections().map(([title,games])=>[title,all?games:games.filter(e=>!hidden.has(e.key))])}
  window.ArcadeHub={collections,hidden,popularity,setShown:(key,on)=>{on?hidden.delete(key):hidden.add(key);try{localStorage.setItem(HIDE_KEY,JSON.stringify([...hidden]))}catch(e){}}};
  const escape=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cats=['🐱','😺','😸','😻','😽','🐈','🐈‍⬛'];
  const props={board:'♟️',rpg:'🌙',classic:'🧶'};
  const tile=(e,i)=>{const category=arcade.games[e.key]?.category,prop=props[category]||'🐾',photo=window.NetworkMode?.online?'<span class="art-photo" style="--art:url('+window.NetworkMode.artUrl(e.key,category)+')" aria-hidden="true"></span>':'';const art=e.image?'<span class="game-art"><img src="'+e.image+'" alt=""></span>':'<span class="game-art cat-scene cat-scene-'+(i%4)+'" aria-hidden="true">'+photo+'<span class="scene-cat">'+cats[i%cats.length]+'</span><span class="scene-prop">'+prop+'</span></span><span class="game-symbol" aria-hidden="true">'+cats[i%cats.length]+'</span>';return '<button class="arcade-tile alt illustrated" data-a="'+e.action+'" data-v="'+e.key+'" data-preview="'+e.preview+'">'+art+'<span class="game-copy"><b>'+escape(e.t)+'</b><small>'+escape(e.d)+'</small></span><span class="game-arrow" aria-hidden="true">↗</span><span class="game-play" aria-hidden="true">Let’s play <span>↗</span></span></button>'};
  const gridMenu = function (view='grid',category=null,search='') {
    if(g&&g.busy)return toast('Finishing this turn...');
    arcade.stopSolitaire();arcade.leave();window.MagicArcade.stop();window.MagicArcade.stopExtra();
    $('#g2').style.display='none';$('#magic').style.display='none';$('#box').classList.add('arcade-box');header();
    const groups=collections(),query=search.trim().toLowerCase();
    let html='<div class="hub-heading"><h2><span class="brand-mark" aria-hidden="true">🐱</span> Nobody&#39;s Purrfect1!</h2><input class="hub-search" type="search" aria-label="Search games" placeholder="Search games" value="'+escape(search)+'"></div>';
    if(view==='shelves')html+='<nav class="category-shelf" aria-label="Game categories">'+groups.filter(([,g])=>g.length).map(([name,games])=>'<button class="shelf-category alt" data-a="shelfCategory" data-v="'+name+'" aria-expanded="'+(name===category)+'"><b>'+name+'</b><small>'+games.length+'</small></button>').join('')+'</nav>';
    let shown=0;
    for(const [title,all]of groups){if(view==='shelves'&&!query&&title!==category)continue;const games=all.filter(e=>!query||(e.t+' '+e.d+' '+title).toLowerCase().includes(query));if(!games.length)continue;shown+=games.length;html+='<section class="hub-collection'+(!query&&title==='Solitaire'?' featured-collection':'')+'"><div class="collection-heading"><h3 class="hub-label">'+title+'</h3><span class="collection-count">'+games.length+' games</span></div><div class="arcade-grid">'+games.map(tile).join('')+'</div></section>'}
    if(query&&!shown)html+='<p class="hub-empty">No matching games.</p>';
    html+='<div class="hub-tools"><button class=alt data-a=carousel>Carousel view</button><button class=alt data-a=guides>How to Play</button><button class=alt data-a=io>Save / Load</button><button class=alt data-a=about>About</button><button class=alt data-a=notes>Release Notes</button></div>';modal(html);
  };
  menu=gridMenu;
  A.menu=menu;
  A.trick=key=>{A.magic();(document.querySelector('[data-extra="'+key+'"]')||document.querySelector('[data-id="'+key+'"]'))?.click()};
  A.arcade=key=>{ $('#box').classList.remove('arcade-box'); arcade.open(key); };
  A.stack=()=>{ $('#box').classList.remove('arcade-box'); stackMenu(); };
  A.randos=()=>window.Randos.open(()=>menu());
  const oldModal=modal;
  modal=function(html){if(!html.includes('hub-heading'))$('#box').classList.remove('arcade-box');oldModal(html)};
  $('#hm').onclick=menu;
  $('#hm').textContent='Arcade';
  $('#g2x').onclick=menu;
  $('#g2s').onclick=menu;
  $('#g2s').textContent='Arcade';
  $('#g2q').title='Rules for this game';
  $('#mx').addEventListener('click',()=>menu());
  $('#box').onclick=e=>{const b=e.target.closest('[data-a]');if(b&&A[b.dataset.a])A[b.dataset.a](b.dataset.v)};
  // Refresh Stack Showdown's setup without mixing the other games into it.
  const originalStack=stackMenu;
  stackMenu=function(){
    originalStack();
    const box=$('#box');
    const buttons=Array.from(box.querySelectorAll('button'));
    for(const b of buttons)if(['hilo','magic','more','io','about','notes'].includes(b.dataset.a))b.remove();
    for(const p of box.querySelectorAll('p'))if(p.textContent.startsWith('Side games')||!p.textContent.trim())p.remove();
    if(g&&g.left>=0&&!g.finished){const resume=h('button','','Resume game');resume.onclick=()=>{$('#modal').style.display='none';render()};box.appendChild(resume)}
    const back=h('button','alt','Back to Arcade');back.dataset.a='menu';box.appendChild(back);
  };
  if(window.CarouselArcade)window.CarouselArcade.install(gridMenu);
  menu();
})();
