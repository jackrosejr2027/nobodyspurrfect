// Shared presentation only. Game rules, card ranks, suits and saved progress stay intact.
(() => {
 const api=window.CardArcade;
 const names={klondike:'Catnap Solitaire',freecell:'FreeCell Felines',spider:'Spider & Whiskers',chess:'Cat Chess',checkers:'Cat Checkers',mahjong:'Meowjong Solitaire',memory:'Kitten Memory',bowling:'Alley Cat Bowling',jewels:'Paw-some Jewels',sudoku:'Sudokitty',game2048:'2048 Catnap',minesweeper:'Curious Cat Sweeper',longroad:'The Long Prowl',scoundrel:'Dungeon Cat',quiet:'The Quiet Cat Colony',savage:'Alley Cat Skirmish',falk:'Whisker Challenges'};
 for(const [key,game] of Object.entries(api.games)){
  if(game.category==='duel'){delete api.games[key];delete api.help[key];if(api.strategy)delete api.strategy[key];continue}
  if(names[key])game.t=names[key];
 }
 const original=card;
 card=function(c,up){const el=original(c,up),face=el.querySelector('.f');
  const court=face?.querySelector('.deck-court');
  if(court){court.replaceChildren();const cat=h('span','cat-court',c.r===11?'😼':c.r===10?'😻':'🐱');cat.setAttribute('aria-hidden','true');court.appendChild(cat)}
  if(face){const stamp=h('i','cat-card-stamp','🐾');stamp.setAttribute('aria-hidden','true');face.appendChild(stamp)}
  return el;
 };
 const previous=api.onOpen;
 api.onOpen=key=>{previous?.(key);const title=document.getElementById('g2h');if(title)title.dataset.cat='true'};
 document.querySelector('#top h2').textContent="🐱 Nobody's Purrfect1!";
 document.querySelector('#mtop h2').textContent='🐈 Cat Tricks';
})();
