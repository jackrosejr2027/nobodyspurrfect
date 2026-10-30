// Color Tap: tap the colour the ink is, not the word. Thirty seconds.
(() => {
  const NAMES = ['RED', 'GREEN', 'BLUE', 'GOLD'];
  const HEX = ['#e8604c', '#3fbf78', '#4f8ff0', '#f6c26b'];
  window.Randos.register({ id: 'colortap', title: 'Color Tap', emoji: '🎨', mount(root, a) {
    const hud = a.hud(root), word = a.hud(root), board = a.board(root, 4), start = a.button('Start', begin);
    word.style.fontSize = '44px'; word.style.minHeight = '60px';
    HEX.forEach((h, i) => {
      const n = a.cell('', () => answer(i));
      n.style.background = h; n.style.aspectRatio = 'auto'; n.style.height = '64px';
      board.appendChild(n);
    });
    root.appendChild(start);
    let live = false, over = false, timeLeft = 30, score = 0, shown = 0, ink = 0;
    function next() {
      shown = a.rand(4); ink = a.rand(4);
      if (ink === shown) ink = (ink + 1) % 4;
      word.textContent = NAMES[shown];
      word.style.color = HEX[ink];
    }
    function begin() { live = true; over = false; timeLeft = 30; score = 0; start.style.display = 'none'; next() }
    function answer(i) {
      if (!live) return;
      score = i === ink ? score + 1 : Math.max(0, score - 1);
      next();
    }
    a.key(e => { const i = '1234'.indexOf(e.key); if (i >= 0) answer(i) });
    a.loop(dt => {
      if (live) {
        timeLeft -= dt;
        if (timeLeft <= 0) {
          live = false; over = true; timeLeft = 0;
          word.textContent = ''; start.textContent = 'Play again'; start.style.display = '';
        }
      }
      hud.textContent = live ? 'Score ' + score + ' · ' + Math.ceil(timeLeft) + 's' : over ? 'Final score ' + score : 'Tap the colour of the ink';
    });
  } });
})();
