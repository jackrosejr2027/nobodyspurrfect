// Cat Memory: find all the matching pairs.
(() => {
  const CATS = ['🐱', '😺', '😸', '😹', '😻', '😼', '😽', '🙀'];
  window.Randos.register({ id: 'memory', title: 'Cat Memory', emoji: '🃏', mount(root, a) {
    const hud = a.hud(root), board = a.board(root, 4), again = a.button('New game', deal);
    let cards, open = [], moves, locked, done;
    root.appendChild(again);
    function deal() {
      const deck = [...CATS, ...CATS];
      for (let i = deck.length - 1; i > 0; i--) { const j = a.rand(i + 1); [deck[i], deck[j]] = [deck[j], deck[i]] }
      cards = deck.map((face, i) => ({ face, i, shown: false, matched: false }));
      open = []; moves = 0; locked = false; done = false;
      render();
    }
    function flip(card) {
      if (locked || card.shown || card.matched || done) return;
      card.shown = true; open.push(card);
      if (open.length === 2) {
        moves++; locked = true;
        const [x, y] = open;
        a.after(700, () => {
          if (x.face === y.face) { x.matched = true; y.matched = true }
          else { x.shown = false; y.shown = false }
          open = []; locked = false;
          if (cards.every(c => c.matched)) done = true;
          render();
        });
      }
      render();
    }
    function render() {
      board.innerHTML = '';
      cards.forEach(card => {
        const up = card.shown || card.matched;
        const node = a.cell(up ? card.face : '?', () => flip(card), up ? 'on' : 'hidden');
        if (card.matched) node.classList.add('blank');
        board.appendChild(node);
      });
      hud.textContent = done ? 'Solved in ' + moves + ' moves!' : 'Moves ' + moves;
      again.textContent = done ? 'Play again' : 'New game';
    }
    deal();
  } });
})();
