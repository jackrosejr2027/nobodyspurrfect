// Catch the Fish: slide the basket under the falling fish. Three misses and it's over.
(() => {
  const W = 360, H = 540, SPEED = 420;
  window.Randos.register({ id: 'fish', title: 'Catch the Fish', emoji: '🧺', mount(root, a) {
    const cv = a.canvas(root, W, H), ctx = cv.getContext('2d'), hud = a.hud(root);
    let basket, items, score, lives, state, spawnT, keys = {};
    const FISH = ['🐟', '🐠', '🐡'];
    function reset() { basket = { x: W / 2 - 40, y: H - 60, w: 80, h: 24 }; items = []; score = 0; lives = 3; spawnT = 0; state = 'ready' }
    function action() { if (state === 'ready') state = 'play'; else if (state === 'over') reset() }
    function update(dt) {
      if (keys.ArrowLeft || keys.a) basket.x -= SPEED * dt;
      if (keys.ArrowRight || keys.d) basket.x += SPEED * dt;
      basket.x = Math.max(0, Math.min(W - basket.w, basket.x));
      if (state !== 'play') return;
      spawnT += dt;
      const interval = Math.max(0.4, 1 - score * 0.02);
      if (spawnT >= interval) { spawnT = 0; items.push({ x: 20 + a.rand(W - 40), y: -20, emoji: FISH[a.rand(FISH.length)], vy: 130 + score * 6 + a.rand(60) }) }
      for (const it of items) {
        it.y += it.vy * dt;
        const inBasket = Math.abs(it.x - (basket.x + basket.w / 2)) < basket.w / 2 + 6 && it.y >= basket.y && it.y <= basket.y + basket.h;
        if (inBasket) { it.caught = true; score++ }
      }
      items = items.filter(it => {
        if (it.caught) return false;
        if (it.y > H) { lives--; if (lives <= 0) state = 'over'; return false }
        return true;
      });
    }
    function draw() {
      ctx.fillStyle = '#0e2a22'; ctx.fillRect(0, 0, W, H);
      ctx.font = '30px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (const it of items) ctx.fillText(it.emoji, it.x, it.y);
      ctx.font = '44px serif'; ctx.fillText('🧺', basket.x + basket.w / 2, basket.y + basket.h / 2 + 4);
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      hud.textContent = 'Caught ' + score + ' · ' + '❤️'.repeat(Math.max(0, lives));
      if (state === 'ready') a.card(ctx, W, H, 'Catch the Fish', 'Drag the basket · tap to start');
      if (state === 'over') a.card(ctx, W, H, 'Game over', 'Tap to play again');
    }
    a.key(e => {
      keys[e.key] = true;
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); action() }
    });
    a.on(window, 'keyup', e => { keys[e.key] = false }, true);
    a.on(cv, 'pointermove', e => { basket.x = a.pos(cv, e).x - basket.w / 2 });
    a.on(cv, 'pointerdown', e => { basket.x = a.pos(cv, e).x - basket.w / 2; action() });
    reset();
    a.loop(dt => { update(dt); draw() });
  } });
})();
