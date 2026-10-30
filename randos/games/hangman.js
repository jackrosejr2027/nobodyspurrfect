// Hangman: guess the cat word one letter at a time. Six misses and it's over.
(() => {
  const WORDS = ['CATNAP', 'YARN', 'WHISKERS', 'PURR', 'KITTEN', 'MOUSE', 'TUNA', 'LITTERBOX', 'SCRATCH', 'FELINE'];
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', MAX = 6;
  window.Randos.register({ id: 'hangman', title: 'Hangman', emoji: '🔤', mount(root, a) {
    const hud = a.hud(root), word = a.hud(root), board = a.board(root, 7), again = a.button('New word', deal);
    word.style.fontSize = '30px'; word.style.letterSpacing = '4px';
    let target = '', guessed = new Set(), misses = 0;
    const won = () => [...target].every(c => guessed.has(c));
    const done = () => misses >= MAX || won();
    function guess(l) {
      if (!target || done() || guessed.has(l)) return;
      guessed.add(l);
      if (!target.includes(l)) misses++;
      render();
    }
    function deal() {
      target = WORDS[a.rand(WORDS.length)]; guessed = new Set(); misses = 0;
      render();
    }
    function render() {
      board.innerHTML = '';
      LETTERS.split('').forEach(l => {
        const used = guessed.has(l);
        const b = a.cell(l, () => guess(l), used ? (target.includes(l) ? 'blank' : 'off') : '');
        b.disabled = used || done();
        board.appendChild(b);
      });
      const lost = misses >= MAX;
      word.textContent = lost ? target : [...target].map(c => guessed.has(c) ? c : '_').join(' ');
      hud.textContent = won() ? 'You got it!' : lost ? 'The word was ' + target : '❤️'.repeat(MAX - misses) + ' guesses left';
    }
    root.appendChild(again);
    a.key(e => { const k = e.key.toUpperCase(); if (k.length === 1 && LETTERS.includes(k)) guess(k) });
    deal();
  } });
})();
