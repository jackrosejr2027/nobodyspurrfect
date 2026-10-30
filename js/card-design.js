// Presentation only: every face is a bundled picture from img/cards. Ranks, suits and click targets stay intact.
(() => {
 const FILE={'10':'10','J':'j','Q':'q','K':'k','A':'a'};
 const SUIT=['s','h','d','c'];// same order as S in game.js: ♠ ♥ ♦ ♣
 const original=card;
 card=function(c,up){
  const d=original(c,up),face=d.querySelector('.f');
  if(!face)return d;
  const rank=c.r===13?'Joker':R[c.r];
  const name=c.r===13?'joker':(FILE[rank]||rank)+'-'+SUIT[c.s];
  d.dataset.rank=rank;d.dataset.suit=String(c.s);
  d.classList.add('pic');
  face.style.setProperty('--face','url("img/cards/'+name+'.webp")');
  return d;
 };
 const api=window.CardArcade,previous=api.onOpen;
 api.onOpen=key=>{const game=api.games[key];document.getElementById('g2').classList.toggle('solitaire-deck',!!game&&!['rpg','board','duel','classic'].includes(game.category));previous?.(key)};
})();
