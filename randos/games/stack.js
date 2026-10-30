// Tower Stack: tap to drop the swinging block. Keep the overlap; miss and it falls.
(() => {
  const W = 360, H = 480, BH = 24, BW0 = 180;
  const COL = ['#f6c26b', '#6fd39a', '#6aa8f0', '#e8604c', '#c9a6f0'];
  window.Randos.register({ id: 'stack', title: 'Tower Stack', emoji: '🏗️', mount(root, a) {
    const cv = a.canvas(root, W, H), ctx = cv.getContext('2d'), hud = a.hud(root);
    let tower, cur, speed, state;
    function reset() { tower = [{ x: (W - BW0) / 2, w: BW0 }]; cur = { x: 0, w: BW0, dir: 1 }; speed = 150; state = 'ready' }
    function drop() {
      if (state === 'over') return reset();
      if (state === 'ready') { state = 'play'; return }
      const top = tower[tower.length - 1];
      const l = Math.max(cur.x, top.x), r = Math.min(cur.x + cur.w, top.x + top.w);
      if (r - l <= 0) { state = 'over'; return }
      tower.push({ x: l, w: r - l });
      speed += 8;
      cur = { x: 0, w: r - l, dir: 1 };
    }
    a.on(cv, 'pointerdown', drop);
    a.key(e => { if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') { e.preventDefault(); drop() } });
    reset();
    a.loop(dt => {
      if (state === 'play') {
        cur.x += cur.dir * speed * dt;
        if (cur.x < 0) { cur.x = 0; cur.dir = 1 }
        if (cur.x + cur.w > W) { cur.x = W - cur.w; cur.dir = -1 }
      }
      const shift = Math.max(0, (tower.length + 1) * BH - (H - 90));
      const row = i => H - 30 - i * BH + shift;
      ctx.fillStyle = '#0e2a22'; ctx.fillRect(0, 0, W, H);
      tower.forEach((b, i) => { ctx.fillStyle = COL[i % COL.length]; ctx.fillRect(b.x, row(i), b.w, BH - 3) });
      if (state !== 'over') { ctx.fillStyle = '#fffdf6'; ctx.fillRect(cur.x, row(tower.length), cur.w, BH - 3) }
      hud.textContent = 'Height ' + (tower.length - 1);
      if (state === 'ready') a.card(ctx, W, H, 'Tower Stack', 'Tap to start, then tap to drop');
      if (state === 'over') a.card(ctx, W, H, 'Tower fell!', 'Height ' + (tower.length - 1) + ' · Tap to try again');
    });
  } });
})();
