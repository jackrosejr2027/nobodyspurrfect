// Flappy Cat: tap to flap through the gaps.
(() => {
  const W = 360, H = 540, GRAV = 1100, FLAP = -360, GAP = 150, PW = 56, SPEED = 130, EVERY = 1.6, BIRD = 90;
  window.Randos.register({ id: 'flappy', title: 'Flappy Cat', emoji: '🐤', mount(root, a) {
    const cv = a.canvas(root, W, H), ctx = cv.getContext('2d'), hud = a.hud(root);
    let bird, pipes, score, best = 0, state, t, pipeT;
    function reset() { bird = { y: H / 2, vy: 0 }; pipes = []; score = 0; t = 0; pipeT = 0; state = 'ready' }
    function flap() { bird.vy = FLAP }
    function action() {
      if (state === 'ready') { state = 'play'; flap() }
      else if (state === 'play') flap();
      else if (state === 'over') reset();
    }
    function update(dt) {
      t += dt;
      if (state === 'ready') { bird.y = H / 2 + Math.sin(t * 4) * 8; return }
      if (state !== 'play') return;
      bird.vy += GRAV * dt; bird.y += bird.vy * dt;
      pipeT += dt;
      if (pipeT >= EVERY) { pipeT = 0; pipes.push({ x: W + 10, gapY: 60 + a.rand(H - 200 - GAP), passed: false }) }
      for (const p of pipes) {
        p.x -= SPEED * dt;
        if (!p.passed && p.x + PW < BIRD) { p.passed = true; score++ }
        if (BIRD + 12 > p.x && BIRD - 12 < p.x + PW && (bird.y - 12 < p.gapY || bird.y + 12 > p.gapY + GAP)) die();
      }
      pipes = pipes.filter(p => p.x > -PW);
      if (bird.y + 14 > H - 40 || bird.y - 14 < 0) die();
    }
    function die() { state = 'over'; best = Math.max(best, score) }
    function draw() {
      const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#7fd3e8'); sky.addColorStop(1, '#d9f3e2');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#4fae6a';
      for (const p of pipes) {
        ctx.fillRect(p.x, 0, PW, p.gapY); ctx.fillRect(p.x, p.gapY + GAP, PW, H - p.gapY - GAP);
      }
      ctx.fillStyle = '#c9a15a'; ctx.fillRect(0, H - 40, W, 40);
      ctx.font = '34px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('🐱', BIRD, bird.y);
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      hud.textContent = 'Score ' + score + ' · Best ' + best;
      if (state === 'ready') a.card(ctx, W, H, 'Flappy Cat', 'Tap to flap');
      if (state === 'over') a.card(ctx, W, H, 'Game over', 'Tap to play again');
    }
    a.key(e => { if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'Enter') { e.preventDefault(); action() } });
    a.on(cv, 'pointerdown', action);
    reset();
    a.loop(dt => { update(dt); draw() });
  } });
})();
