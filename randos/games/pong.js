// Pong: you against the computer, first to five.
(() => {
  const W = 480, H = 320, PW = 8, PH = 64, BR = 6, MAX = 5;
  window.Randos.register({ id: 'pong', title: 'Pong', emoji: '🏓', mount(root, a) {
    const cv = a.canvas(root, W, H), ctx = cv.getContext('2d'), hud = a.hud(root);
    let me, cpu, ball, pts, state, serveDir, keys = {};
    function reset() { me = H / 2 - PH / 2; cpu = H / 2 - PH / 2; pts = [0, 0]; serveDir = a.rand(2) ? 1 : -1; state = 'ready'; center() }
    function center() { ball = { x: W / 2, y: H / 2, vx: 0, vy: 0 } }
    function serve() {
      ball.vx = serveDir * 240; ball.vy = (a.rand(200) - 100);
      state = 'play';
    }
    function action() {
      if (state === 'ready') serve();
      else if (state === 'over') reset();
    }
    function point(winner) {
      pts[winner]++;
      serveDir = winner === 0 ? 1 : -1;
      if (pts[winner] >= MAX) state = 'over'; else { state = 'ready'; center() }
    }
    function update(dt) {
      if (keys.ArrowUp || keys.w) me -= 380 * dt;
      if (keys.ArrowDown || keys.s) me += 380 * dt;
      me = Math.max(0, Math.min(H - PH, me));
      const target = ball.y - PH / 2;
      cpu += Math.max(-200 * dt, Math.min(200 * dt, target - cpu));
      cpu = Math.max(0, Math.min(H - PH, cpu));
      if (state === 'ready') { ball.y = H / 2; ball.x = W / 2; return }
      if (state !== 'play') return;
      ball.x += ball.vx * dt; ball.y += ball.vy * dt;
      if (ball.y < BR) { ball.y = BR; ball.vy = Math.abs(ball.vy) }
      if (ball.y > H - BR) { ball.y = H - BR; ball.vy = -Math.abs(ball.vy) }
      // Left paddle (you) and right paddle (computer).
      if (ball.vx < 0 && ball.x - BR <= 12 + PW && ball.x > 12 && ball.y >= me - BR && ball.y <= me + PH + BR) {
        ball.vx = Math.min(560, -ball.vx * 1.05); ball.vy += (ball.y - (me + PH / 2)) * 5; ball.x = 12 + PW + BR;
      }
      if (ball.vx > 0 && ball.x + BR >= W - 12 - PW && ball.x < W - 12 && ball.y >= cpu - BR && ball.y <= cpu + PH + BR) {
        ball.vx = Math.max(-560, -ball.vx * 1.05); ball.vy += (ball.y - (cpu + PH / 2)) * 5; ball.x = W - 12 - PW - BR;
      }
      if (ball.x < -BR) point(1);
      else if (ball.x > W + BR) point(0);
    }
    function draw() {
      ctx.fillStyle = '#0e2a22'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,253,246,.25)'; for (let y = 0; y < H; y += 24) ctx.fillRect(W / 2 - 2, y, 4, 12);
      ctx.fillStyle = '#fffdf6';
      ctx.fillRect(12, me, PW, PH); ctx.fillRect(W - 12 - PW, cpu, PW, PH);
      ctx.beginPath(); ctx.arc(ball.x, ball.y, BR, 0, Math.PI * 2); ctx.fill();
      ctx.font = '700 36px system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(pts[0], W / 2 - 60, 46); ctx.fillText(pts[1], W / 2 + 60, 46); ctx.textAlign = 'left';
      hud.textContent = state === 'over' ? (pts[0] > pts[1] ? 'You win!' : 'Computer wins') : 'First to ' + MAX;
      if (state === 'ready') a.card(ctx, W, H, 'Pong', 'Tap to serve · drag to move');
      if (state === 'over') a.card(ctx, W, H, pts[0] > pts[1] ? 'You win!' : 'Computer wins', 'Tap to play again');
    }
    a.key(e => {
      keys[e.key] = true;
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault();
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); action() }
    });
    a.on(window, 'keyup', e => { keys[e.key] = false }, true);
    a.on(cv, 'pointermove', e => { me = a.pos(cv, e).y - PH / 2 });
    a.on(cv, 'pointerdown', e => { me = a.pos(cv, e).y - PH / 2; action() });
    reset();
    a.loop(dt => { update(dt); draw() });
  } });
})();
