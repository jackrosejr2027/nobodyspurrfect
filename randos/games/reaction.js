// Reaction: tap the moment the screen turns green. Tapping early costs you the round.
(() => {
  const W = 480, H = 300;
  window.Randos.register({ id: 'reaction', title: 'Reaction', emoji: '⚡', mount(root, a) {
    const cv = a.canvas(root, W, H), ctx = cv.getContext('2d'), hud = a.hud(root);
    let state = 'ready', t = 0, wait = 0, ms = 0, best = 0;
    function go() { state = 'wait'; t = 0; wait = 1.5 + Math.random() * 3 }
    function tap() {
      if (state === 'wait') { state = 'early'; return }
      if (state === 'go') { ms = Math.round(t * 1000); best = best ? Math.min(best, ms) : ms; state = 'result'; return }
      go();
    }
    a.on(cv, 'pointerdown', tap);
    a.key(e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); tap() } });
    a.loop(dt => {
      if (state === 'wait') { t += dt; if (t >= wait) { state = 'go'; t = 0 } }
      else if (state === 'go') t += dt;
      ctx.fillStyle = state === 'go' ? '#3fbf78' : state === 'wait' ? '#c2453a' : '#0e2a22';
      ctx.fillRect(0, 0, W, H);
      hud.textContent = 'Best ' + (best ? best + ' ms' : '–');
      if (state === 'ready') a.card(ctx, W, H, 'Reaction', 'Tap to start');
      if (state === 'wait') a.card(ctx, W, H, 'Wait for green…', 'Tap only when it turns green');
      if (state === 'early') a.card(ctx, W, H, 'Too soon!', 'Tap to try again');
      if (state === 'go') a.card(ctx, W, H, 'Tap!', '');
      if (state === 'result') a.card(ctx, W, H, ms + ' ms', 'Tap to go again');
    });
  } });
})();
