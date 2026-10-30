// Breakout: bounce the ball off the paddle and clear every brick.
(() => {
  const W = 360, H = 480, COLS = 8, ROWS = 5, BW = 40, BH = 18, GAP = 4, TOP = 56, SPEED = 320;
  const COLORS = ['#f28b82', '#f6c26b', '#8fd3a4', '#7ab8f5', '#c3a1f0'];
  window.Randos.register({ id: 'breakout', title: 'Breakout', emoji: '🧱', mount(root, a) {
    const cv = a.canvas(root, W, H), ctx = cv.getContext('2d'), hud = a.hud(root);
    let paddle, ball, bricks, score, lives, state, keys = {};
    function reset() {
      paddle = { x: W / 2 - 40, y: H - 30, w: 80, h: 12 };
      ball = { x: 0, y: 0, vx: 0, vy: 0, r: 6 };
      bricks = [];
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++)
        bricks.push({ x: 6 + c * (BW + GAP), y: TOP + r * (BH + GAP), w: BW, h: BH, color: COLORS[r], alive: true });
      score = 0; lives = 3; state = 'ready';
    }
    function launch() {
      const angle = (a.rand(60) - 30) * Math.PI / 180;
      ball.vx = Math.sin(angle) * SPEED; ball.vy = -Math.cos(angle) * SPEED;
      state = 'play';
    }
    function action() {
      if (state === 'ready') launch();
      else if (state === 'over' || state === 'won') reset();
    }
    function update(dt) {
      const speed = 420 * dt;
      if (keys.ArrowLeft || keys.a) paddle.x -= speed;
      if (keys.ArrowRight || keys.d) paddle.x += speed;
      paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x));
      if (state === 'ready') { ball.x = paddle.x + paddle.w / 2; ball.y = paddle.y - ball.r - 1; return }
      if (state !== 'play') return;
      ball.x += ball.vx * dt; ball.y += ball.vy * dt;
      if (ball.x < ball.r) { ball.x = ball.r; ball.vx = Math.abs(ball.vx) }
      if (ball.x > W - ball.r) { ball.x = W - ball.r; ball.vx = -Math.abs(ball.vx) }
      if (ball.y < ball.r) { ball.y = ball.r; ball.vy = Math.abs(ball.vy) }
      // Paddle: the hit point sets the bounce angle.
      if (ball.vy > 0 && ball.y + ball.r >= paddle.y && ball.y + ball.r <= paddle.y + paddle.h + 8 && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
        const rel = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
        ball.vx = rel * 260;
        ball.vy = -Math.sqrt(Math.max(SPEED * SPEED - ball.vx * ball.vx, 2500));
        ball.y = paddle.y - ball.r;
      }
      for (const b of bricks) {
        if (!b.alive) continue;
        const cx = Math.max(b.x, Math.min(ball.x, b.x + b.w)), cy = Math.max(b.y, Math.min(ball.y, b.y + b.h));
        if (Math.hypot(ball.x - cx, ball.y - cy) > ball.r) continue;
        b.alive = false; score += 10;
        if (ball.x < b.x || ball.x > b.x + b.w) ball.vx = -ball.vx; else ball.vy = -ball.vy;
        break;
      }
      if (bricks.every(b => !b.alive)) { state = 'won'; return }
      if (ball.y > H + 12) {
        lives--;
        if (lives <= 0) state = 'over'; else state = 'ready';
      }
    }
    function draw() {
      ctx.fillStyle = '#0e2a22'; ctx.fillRect(0, 0, W, H);
      for (const b of bricks) if (b.alive) { ctx.fillStyle = b.color; ctx.fillRect(b.x, b.y, b.w, b.h) }
      ctx.fillStyle = '#fffdf6'; ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();
      hud.textContent = 'Score ' + score + ' · Lives ' + lives;
      if (state === 'ready') a.card(ctx, W, H, 'Breakout', 'Tap to launch · drag to move');
      if (state === 'over') a.card(ctx, W, H, 'Game over', 'Tap to play again');
      if (state === 'won') a.card(ctx, W, H, 'You cleared it!', 'Tap to play again');
    }
    const down = e => { keys[e.key] = true; if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault(); if (e.key === ' ' || e.key === 'Enter') action() };
    a.key(down);
    a.on(window, 'keyup', e => { keys[e.key] = false }, true);
    a.on(cv, 'pointermove', e => { paddle.x = a.pos(cv, e).x - paddle.w / 2 });
    a.on(cv, 'pointerdown', e => { paddle.x = a.pos(cv, e).x - paddle.w / 2; action() });
    reset();
    a.loop(dt => { update(dt); draw() });
  } });
})();
