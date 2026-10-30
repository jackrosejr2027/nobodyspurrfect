(() => {
 // cat.html loads cat-theme.css; dad.html does not. Cat mode defaults to the cat tile set.
 const catMode=!!document.querySelector('link[href="cat-theme.css"]');
 const styles=['Cat','Ivory','Jade','Porcelain','Amber','Midnight'];let style=catMode?'Cat':'Ivory';
 if(!window.DemoSession)try{const saved=localStorage.getItem('arcade_mahjong_style');if(styles.includes(saved))style=saved}catch(e){}
 const layouts={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8],7:[0,2,3,4,5,6,8],8:[0,1,2,3,5,6,7,8],9:[0,1,2,3,4,5,6,7,8]};
 // Cat tile images in img/cat-mahjong/, keyed by the same face values as the classic faces.
 const catName=value=>value<9?'bam-'+(value+1):value<18?'dot-'+(value-8):value<27?'char-'+(value-17):value<31?['wind-east','wind-south','wind-west','wind-north'][value-27]:value<34?['dragon-red','dragon-green','dragon-white'][value-31]:value===34?'flower-plum':'season-spring';
 function face(value){const el=document.createElement('span');el.className='mah-face';el.setAttribute('aria-hidden','true');
  if(style==='Cat'){const img=document.createElement('img');img.className='mah-cat-img';img.alt='';img.src='img/cat-mahjong/'+catName(value)+'.webp';el.appendChild(img);return el}
  if(value<18){const bamboo=value<9,n=value%9+1;if(bamboo&&n===1){el.appendChild(h('span','mah-bird','鳥'));return el}const pips=h('span','mah-pips'+(bamboo?' bamboo':''));for(let i=0;i<9;i++)pips.appendChild(h('i',layouts[n].includes(i)?'mah-mark tone-'+(i%3):''));el.appendChild(pips)}else if(value<27){el.append(h('span','mah-character',String(value-17)),h('span','mah-myriad','萬'))}else if(value<31)el.appendChild(h('span','mah-honor','東南西北'[value-27]));else if(value===31)el.appendChild(h('span','mah-honor dragon-red','中'));else if(value===32)el.appendChild(h('span','mah-honor dragon-green','發'));else if(value===33)el.appendChild(h('span','mah-white-dragon'));else el.append(h('span',value===34?'mah-flower':'mah-season',value===34?'梅':'春'));return el}
 window.MahjongTiles={styles,face,get style(){return style},set style(value){if(!styles.includes(value))return;style=value;if(!window.DemoSession)try{localStorage.setItem('arcade_mahjong_style',style)}catch(e){}}};
})();
