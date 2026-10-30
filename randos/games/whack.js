// Whack-a-Cat: tap the cats before they hide. Thirty seconds.
(() => {
  const SECONDS = 30;
  window.Randos.register({ id: 'whack', title: 'Whack-a-Cat', emoji: '🔨', mount(root, a) {
    const hud = a.hud(root), board = a.board(root, 3);
    const cells = [];
    let live = false, timeLeft = 0, score = 0, clock = 0, nextSpawn = 0, over = false;
    const startBtn = a.button('Start', start);
    root.appendChild(startBtn);
    for (let i = 0; i < 9; i++) {
      const c = { up: false, until: 0 };
      c.node = a.cell('🕳️', () => { if (live && c.up) { score++; hide(c) } }, 'hidden');
      board.appendChild(c.node);
      cells.push(c);
    }
    function show(c) { c.up = true; c.until = clock + 0.9; c.node.textContent = '🐱'; c.node.classList.remove('hidden') }
    function hide(c) { c.up = false; c.node.textContent = '🕳️'; c.node.classList.add('hidden') }
    function start() {
      cells.forEach(hide);
      live = true; over = false; timeLeft = SECONDS; score = 0; clock = 0; nextSpawn = 0.4;
      startBtn.style.display = 'none';
    }
    function end() {
      live = false; over = true; cells.forEach(hide);
      startBtn.textContent = 'Play again'; startBtn.style.display = '';
    }
    a.loop(dt => {
      if (live) {
        timeLeft -= dt; clock += dt;
        if (clock >= nextSpawn) {
          const free = cells.filter(c => !c.up);
          if (free.length) show(free[a.rand(free.length)]);
          nextSpawn = clock + 0.45 + Math.random() * 0.4;
        }
        cells.forEach(c => { if (c.up && clock >= c.until) hide(c) });
        if (timeLeft <= 0) end();
      }
      hud.textContent = live ? 'Score ' + score + ' · ' + Math.ceil(timeLeft) + 's' : over ? 'Final score ' + score : 'Tap a cat to whack it';
    });
  } });
})();
