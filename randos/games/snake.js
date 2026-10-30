// Snake: eat the fish, don't hit the wall or yourself.
(() => {
  const N = 20, C = 24, TICK = 0.11;
  window.Randos.register({ id: 'snake', title: 'Snake', emoji: '🐍', mount(root, a) {
    const cv = a.canvas(root, N * C, N * C), ctx = cv.getContext('2d'), hud = a.hud(root);
    let snake, dir, queued, food, score, best = 0, state, acc;
    const spawn = () => { let p; do p = { x: a.rand(N), y: a.rand(N) }; while (snake.some(s => s.x === p.x && s.y === p.y)); return p };
    function reset() { snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]; dir = { x: 1, y: 0 }; queued = dir; food = spawn(); score = 0; acc = 0; state = 'ready' }
    function turn(x, y) {
      if (state === 'over') return;
      if (state === 'ready') state = 'play';
      if (x === -dir.x && y === -dir.y) return;
      queued = { x, y };
    }
    function step() {
      dir = queued;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N || snake.some(s => s.x === head.x && s.y === head.y)) { state = 'over'; best = Math.max(best, score); return }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) { score++; food = spawn() } else snake.pop();
    }
    function draw() {
      ctx.fillStyle = '#0e2a22'; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = '#f2b84b'; ctx.beginPath(); ctx.arc(food.x * C + C / 2, food.y * C + C / 2, C * 0.38, 0, Math.PI * 2); ctx.fill();
      snake.forEach((s, i) => { ctx.fillStyle = i ? '#6fd39a' : '#bff5d0'; ctx.fillRect(s.x * C + 2, s.y * C + 2, C - 4, C - 4) });
      hud.textContent = 'Score ' + score + ' · Best ' + best;
      if (state === 'ready') a.card(ctx, cv.width, cv.height, 'Snake', 'Swipe to steer · tap to start');
      if (state === 'over') a.card(ctx, cv.width, cv.height, 'Game over', 'Tap to play again');
    }
    const moves = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] };
    a.key(e => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (moves[k]) { e.preventDefault(); turn(...moves[k]) }
      else if ((k === ' ' || k === 'Enter') && state === 'over') { e.preventDefault(); reset() }
    });
    a.swipe(cv, (x, y) => turn(x, y), () => { if (state === 'over') reset(); else if (state === 'ready') state = 'play' });
    reset();
    a.loop(dt => {
      if (state === 'play') { acc += dt; while (acc >= TICK && state === 'play') { acc -= TICK; step() } }
      draw();
    });
  } });
})();
