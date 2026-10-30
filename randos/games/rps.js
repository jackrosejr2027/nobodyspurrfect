// Rock-Paper-Scissors: first to three rounds wins the match.
(() => {
  const MOVES = ['✊', '✋', '✌️'];
  const BEATS = [2, 0, 1]; // rock beats scissors, paper beats rock, scissors beat paper
  const KEYS = { r: 0, p: 1, s: 2 };
  window.Randos.register({ id: 'rps', title: 'Rock-Paper-Scissors', emoji: '✊', mount(root, a) {
    const hud = a.hud(root), row = a.board(root, 3), again = a.button('New match', reset);
    const cells = MOVES.map((m, i) => { const c = a.cell(m, () => play(i)); row.appendChild(c); return c });
    let you = 0, them = 0, last = '';
    function reset() { you = 0; them = 0; last = ''; render() }
    function play(i) {
      if (you >= 3 || them >= 3) return;
      const c = a.rand(3);
      if (i === c) last = 'Tie';
      else if (BEATS[i] === c) { you++; last = 'You win the round' }
      else { them++; last = 'Computer wins the round' }
      last = MOVES[i] + ' vs ' + MOVES[c] + ' · ' + last;
      render();
    }
    function render() {
      const over = you >= 3 || them >= 3;
      cells.forEach(c => { c.disabled = over });
      hud.textContent = over ? (you > them ? 'You win the match!' : 'Computer wins the match') : 'You ' + you + ' – ' + them + ' Computer' + (last ? ' · ' + last : '');
    }
    root.appendChild(again);
    a.key(e => { const i = KEYS[e.key.toLowerCase()]; if (i !== undefined) play(i) });
    reset();
  } });
})();
