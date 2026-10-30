// Sliding Puzzle: slide the numbers into order, 1 to 8 with the gap at the end.
(() => {
  const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  window.Randos.register({ id: 'slide', title: 'Sliding Puzzle', emoji: '🔢', mount(root, a) {
    const hud = a.hud(root), board = a.board(root, 3), again = a.button('Shuffle', deal);
    let t, blank, moves, done;
    root.appendChild(again);
    const neighbours = b => {
      const r = Math.floor(b / 3), c = b % 3, out = [];
      if (r > 0) out.push(b - 3); if (r < 2) out.push(b + 3);
      if (c > 0) out.push(b - 1); if (c < 2) out.push(b + 1);
      return out;
    };
    function deal() {
      // A random walk from the solved board only makes reachable (solvable) positions.
      t = [...SOLVED]; let b = 8, last = -1;
      for (let k = 0; k < 300; k++) {
        const options = neighbours(b).filter(n => n !== last);
        const n = options[a.rand(options.length)];
        [t[b], t[n]] = [t[n], t[b]]; last = b; b = n;
      }
      blank = b; moves = 0; done = false;
      render();
    }
    function move(i) {
      if (done || !neighbours(blank).includes(i)) return;
      [t[blank], t[i]] = [t[i], t[blank]]; blank = i; moves++;
      done = t.every((v, k) => v === SOLVED[k]);
      render();
    }
    function render() {
      board.innerHTML = '';
      t.forEach((v, i) => board.appendChild(a.cell(v ? String(v) : '', () => move(i), v ? '' : 'blank')));
      hud.textContent = done ? 'Solved in ' + moves + ' moves!' : 'Moves ' + moves;
      again.textContent = done ? 'Play again' : 'Shuffle';
    }
    deal();
  } });
})();
