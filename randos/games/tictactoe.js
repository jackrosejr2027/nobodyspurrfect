// Tic-Tac-Toe: you are ✕, the computer is ○.
(() => {
  const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const winner = b => { for (const [x, y, z] of LINES) if (b[x] && b[x] === b[y] && b[x] === b[z]) return b[x]; return b.every(Boolean) ? '-' : '' };
  window.Randos.register({ id: 'tictactoe', title: 'Tic-Tac-Toe', emoji: '❌', mount(root, a) {
    const hud = a.hud(root), board = a.board(root, 3), again = a.button('New game', reset);
    let b, over;
    // Computer: win if it can, block a win, take the centre, else any free square.
    function pick() {
      const find = who => {
        for (const line of LINES) {
          const mine = line.filter(i => b[i] === who), free = line.filter(i => !b[i]);
          if (mine.length === 2 && free.length === 1) return free[0];
        }
        return -1;
      };
      let m = find('○');
      if (m < 0) m = find('✕');
      if (m < 0 && !b[4]) m = 4;
      if (m < 0) { const free = b.map((v, i) => v ? -1 : i).filter(i => i >= 0); m = free[a.rand(free.length)] }
      return m;
    }
    function end() {
      const w = winner(b);
      if (!w) return false;
      over = true;
      hud.textContent = w === '-' ? 'A draw' : w === '✕' ? 'You win!' : 'Computer wins';
      return true;
    }
    function play(i) {
      if (over || b[i]) return;
      b[i] = '✕';
      if (!end()) { b[pick()] = '○'; end() }
      render();
    }
    function render() {
      board.innerHTML = '';
      b.forEach((v, i) => board.appendChild(a.cell(v, () => play(i), v ? 'blank' : '')));
      if (!over) hud.textContent = 'Your turn';
    }
    function reset() { b = Array(9).fill(''); over = false; render() }
    root.appendChild(again);
    a.key(e => { const i = '123456789'.indexOf(e.key); if (i >= 0) play(i) });
    reset();
  } });
})();
