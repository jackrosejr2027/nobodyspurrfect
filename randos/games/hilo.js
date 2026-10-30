// Higher or Lower: guess whether the next card is higher or lower. Build a streak.
(() => {
  const NAMES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  window.Randos.register({ id: 'hilo', title: 'Higher or Lower', emoji: '🎲', mount(root, a) {
    const hud = a.hud(root), card = a.hud(root), row = document.createElement('div');
    card.style.fontSize = '72px'; card.style.minHeight = '90px'; card.style.fontWeight = '800';
    row.style.display = 'flex'; row.style.gap = '12px';
    row.append(a.button('Higher ▲', () => guess(1)), a.button('Lower ▼', () => guess(-1)));
    root.appendChild(row);
    let cur = a.rand(13), streak = 0, best = 0;
    function guess(dir) {
      const n = a.rand(13), tie = n === cur;
      const right = dir > 0 ? n > cur : n < cur;
      if (!tie) streak = right ? streak + 1 : 0;
      best = Math.max(best, streak);
      cur = n;
      card.textContent = NAMES[n];
      hud.textContent = tie ? 'Same rank · Streak ' + streak : right ? 'Right! Streak ' + streak : 'Wrong · Best ' + best;
    }
    a.key(e => {
      if (e.key === 'ArrowUp') { e.preventDefault(); guess(1) }
      if (e.key === 'ArrowDown') { e.preventDefault(); guess(-1) }
    });
    card.textContent = NAMES[cur];
    hud.textContent = 'Higher or lower?';
  } });
})();
