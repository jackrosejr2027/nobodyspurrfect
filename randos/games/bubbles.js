// Bubble Pop: tap the bubbles before they float away. Three escapes and it's over.
(() => {
  const W = 360, H = 480, COLS = ['#f6c26b', '#6fd39a', '#6aa8f0', '#e8604c', '#c9a6f0'];
  window.Randos.register({ id: 'bubbles', title: 'Bubble Pop', emoji: '🫧', mount(root, a) {
    const cv = a.canvas(root, W, H), ctx = cv.getContext('2d'), hud = a.hud(root);
    let state, bubbles, score, lives, nextAt;
    function reset() { state = 'ready'; bubbles = []; score = 0; lives = 3; nextAt = 0 }
    function spawn() {
      const r = 18 + a.rand(16);
      bubbles.push({ x: r + Math.random() * (W - 2 * r), y: H + r, r, v: 50 + Math.random() * 60 + score * 3, c: COLS[a.rand(COLS.length)] });
    }
    function tap(e) {
      if (state !== 'play') { if (state === 'over') reset(); state = 'play'; return }
      const p = a.pos(cv, e);
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        if (Math.hypot(p.x - b.x, p.y - b.y) <= b.r) { bubbles.splice(i, 1); score++; return }
      }
    }
    a.on(cv, 'pointerdown', tap);
    reset();
    a.loop(dt => {
      if (state === 'play') {
        nextAt -= dt;
        if (nextAt <= 0) { spawn(); nextAt = Math.max(0.35, 1.1 - score * 0.02) }
        bubbles.forEach(b => { b.y -= b.v * dt });
        const escaped = bubbles.filter(b => b.y + b.r < 0).length;
        lives -= escaped;
        bubbles = bubbles.filter(b => b.y + b.r >= 0);
        if (lives <= 0) state = 'over';
      }
      ctx.fillStyle = '#0e2a22'; ctx.fillRect(0, 0, W, H);
      bubbles.forEach(b => {
        ctx.globalAlpha = 0.85; ctx.fillStyle = b.c;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = 'rgba(255,255,255,.5)';
        ctx.beginPath(); ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.22, 0, Math.PI * 2); ctx.fill();
      });
      hud.textContent = 'Popped ' + score + ' · Lives ' + '♥'.repeat(Math.max(0, lives));
      if (state === 'ready') a.card(ctx, W, H, 'Bubble Pop', 'Tap to start');
      if (state === 'over') a.card(ctx, W, H, 'Popped ' + score, 'Tap to play again');
    });
  } });
})();
