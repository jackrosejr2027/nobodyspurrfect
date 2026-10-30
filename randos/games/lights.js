// Lights Out: a tap flips a light and its neighbours. Switch them all off.
(() => {
  const N = 5;
  window.Randos.register({ id: 'lights', title: 'Lights Out', emoji: '💡', mount(root, a) {
    const hud = a.hud(root), board = a.board(root, N), again = a.button('New puzzle', deal);
    let lit, moves, solved;
    root.appendChild(again);
    function flip(i) {
      const r = Math.floor(i / N), c = i % N;
      const at = (rr, cc) => { if (rr >= 0 && rr < N && cc >= 0 && cc < N) lit[rr * N + cc] = !lit[rr * N + cc] };
      at(r, c); at(r - 1, c); at(r + 1, c); at(r, c - 1); at(r, c + 1);
    }
    function deal() {
      // Scramble from solved by random presses, so every puzzle can be solved.
      do {
        lit = Array(N * N).fill(false);
        for (let k = 0; k < 14; k++) flip(a.rand(N * N));
      } while (!lit.some(Boolean));
      moves = 0; solved = false;
      render();
    }
    function press(i) {
      if (solved) return;
      flip(i); moves++;
      solved = !lit.some(Boolean);
      render();
    }
    function render() {
      board.innerHTML = '';
      for (let i = 0; i < N * N; i++) board.appendChild(a.cell('', () => press(i), lit[i] ? 'on' : 'off'));
      hud.textContent = solved ? 'Solved in ' + moves + ' moves!' : 'Moves ' + moves;
    }
    deal();
  } });
})();
