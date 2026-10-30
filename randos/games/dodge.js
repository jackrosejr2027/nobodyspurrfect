// Dodge: stay out of the way of the falling rocks. Longer survival is the score.
(() => {
  const W = 360, H = 540, SPEED = 360, PS = 32;
  window.Randos.register({ id: 'dodge', title: 'Dodge', emoji: '☄️', mount(root, a) {
    const cv = a.canvas(root, W, H), ctx = cv.getContext('2d'), hud = a.hud(root);
    let player, rocks, time, best = 0, state, spawnT, keys = {};
    function reset() { player = { x: W / 2 - PS / 2, y: H - 60 }; rocks = []; time = 0; spawnT = 0; state = 'ready' }
    function action() { if (state === 'ready') state = 'play'; else if (state === 'over') reset() }
    function update(dt) {
      if (keys.ArrowLeft || keys.a) player.x -= SPEED * dt;
      if (keys.ArrowRight || keys.d) player.x += SPEED * dt;
      player.x = Math.max(0, Math.min(W - PS, player.x));
      if (state !== 'play') return;
      time += dt; spawnT += dt;
      const interval = Math.max(0.22, 0.8 - time * 0.015);
      if (spawnT >= interval) {
        spawnT = 0;
        const w = 22 + a.rand(40), h = 20 + a.rand(18);
        rocks.push({ x: a.rand(W - w), y: -h, w, h, vy: 170 + time * 9 });
      }
      for (const r of rocks) {
        r.y += r.vy * dt;
        if (r.x < player.x + PS && r.x + r.w > player.x && r.y < player.y + PS && r.y + r.h > player.y) {
          state = 'over'; best = Math.max(best, time); return;
        }
      }
      rocks = rocks.filter(r => r.y < H);
    }
    function draw() {
      ctx.fillStyle = '#0e2a22'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#9aa5b1';
      for (const r of rocks) ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.font = '30px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('🐱', player.x + PS / 2, player.y + PS / 2 + 2);
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      hud.textContent = 'Time ' + time.toFixed(1) + 's · Best ' + best.toFixed(1) + 's';
      if (state === 'ready') a.card(ctx, W, H, 'Dodge', 'Drag to dodge · tap to start');
      if (state === 'over') a.card(ctx, W, H, 'Ouch!', 'Tap to play again');
    }
    a.key(e => {
      keys[e.key] = true;
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); action() }
    });
    a.on(window, 'keyup', e => { keys[e.key] = false }, true);
    a.on(cv, 'pointermove', e => { player.x = a.pos(cv, e).x - PS / 2 });
    a.on(cv, 'pointerdown', e => { player.x = a.pos(cv, e).x - PS / 2; action() });
    reset();
    a.loop(dt => { update(dt); draw() });
  } });
})();
