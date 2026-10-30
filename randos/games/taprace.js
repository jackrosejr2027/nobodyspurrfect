// Tap Race: tap as fast as you can to outrun the cat in the next lane.
(() => {
  const W = 480, H = 240, GOAL = 100;
  window.Randos.register({ id: 'taprace', title: 'Tap Race', emoji: '🏁', mount(root, a) {
    const cv = a.canvas(root, W, H), ctx = cv.getContext('2d'), hud = a.hud(root);
    let state, me, rival, rate, won;
    function reset() { state = 'ready'; me = 0; rival = 0; rate = 13 + Math.random() * 8; won = false }
    function tap() {
      if (state === 'over') { reset(); state = 'play'; return }
      if (state === 'ready') { state = 'play'; return }
      me = Math.min(GOAL, me + 4);
    }
    a.on(cv, 'pointerdown', tap);
    a.key(e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); tap() } });
    reset();
    a.loop(dt => {
      if (state === 'play') {
        me = Math.max(0, me - 5 * dt);
        rival += rate * dt;
        if (me >= GOAL || rival >= GOAL) { won = me >= rival; state = 'over' }
      }
      const x = p => 20 + (p / GOAL) * (W - 80);
      ctx.fillStyle = '#0e2a22'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(W - 60, 40, 4, 160);
      [[me, '🐱', 70], [rival, '🐈', 150]].forEach(([p, em, y]) => {
        ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(20, y, W - 60, 6);
        ctx.font = '34px system-ui, sans-serif'; ctx.fillText(em, x(p), y + 6);
      });
      hud.textContent = state === 'play' ? 'Tap, tap, tap!' : 'Tap or press space to start';
      if (state === 'ready') a.card(ctx, W, H, 'Tap Race', 'Tap as fast as you can');
      if (state === 'over') a.card(ctx, W, H, won ? 'You win!' : 'The cat wins', 'Tap to race again');
    });
  } });
})();
