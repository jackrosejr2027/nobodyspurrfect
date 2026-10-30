// Randos: a grab bag of small offline games. Each game registers itself and gets
// a small API (canvas, timers, keys) whose listeners are removed when you leave it.
(() => {
  const R = window.Randos = { games: [], register(game) { this.games.push(game) }, open: null };
  let host = null, back = null, cleanups = [];

  // While Randos is open, keys stay here: arcade shortcuts underneath do not fire.
  window.addEventListener('keydown', e => { if (host && !host.hidden) e.stopPropagation() }, true);

  const el = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text != null) node.textContent = text; return node };
  const cleanup = () => { cleanups.forEach(fn => fn()); cleanups = [] };

  const api = {
    on(target, type, fn, opts) { target.addEventListener(type, fn, opts); cleanups.push(() => target.removeEventListener(type, fn, opts)) },
    key(fn) { api.on(window, 'keydown', fn, true) },
    loop(fn) {
      let id = 0, last = performance.now();
      const tick = t => { const dt = Math.max(0, Math.min(0.05, (t - last) / 1000)); last = t; if (fn(dt) !== false) id = requestAnimationFrame(tick) };
      id = requestAnimationFrame(tick);
      cleanups.push(() => cancelAnimationFrame(id));
    },
    every(ms, fn) { const id = setInterval(fn, ms); cleanups.push(() => clearInterval(id)) },
    after(ms, fn) { const id = setTimeout(fn, ms); cleanups.push(() => clearTimeout(id)) },
    canvas(root, w, h) { const c = el('canvas', 'randos-canvas'); c.width = w; c.height = h; root.appendChild(c); return c },
    hud(root) { const node = el('div', 'randos-hud'); root.appendChild(node); return node },
    board(root, cols) { const node = el('div', 'randos-board'); node.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)'; root.appendChild(node); return node },
    cell(text, onClick, cls) { const b = el('button', 'randos-cell' + (cls ? ' ' + cls : ''), text); b.onclick = onClick; return b },
    button(text, onClick) { const b = el('button', 'randos-btn', text); b.onclick = onClick; return b },
    pos(c, e) { const r = c.getBoundingClientRect(); return { x: (e.clientX - r.left) * c.width / r.width, y: (e.clientY - r.top) * c.height / r.height } },
    // Calls onSwipe(dx, dy) with a unit direction, or onTap() for a short press.
    swipe(c, onSwipe, onTap) {
      let start = null;
      api.on(c, 'pointerdown', e => { start = { x: e.clientX, y: e.clientY } });
      api.on(c, 'pointercancel', () => { start = null });
      api.on(c, 'pointerup', e => {
        if (!start) return;
        const dx = e.clientX - start.x, dy = e.clientY - start.y; start = null;
        if (Math.hypot(dx, dy) < 18) { if (onTap) onTap(); return }
        if (Math.abs(dx) > Math.abs(dy)) onSwipe(dx > 0 ? 1 : -1, 0); else onSwipe(0, dy > 0 ? 1 : -1);
      });
    },
    rand: n => Math.floor(Math.random() * n),
    card(ctx, w, h, title, sub) {
      ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, h / 2 - 60, w, 120);
      ctx.textAlign = 'center'; ctx.fillStyle = '#fffdf6';
      ctx.font = '700 28px system-ui, sans-serif'; ctx.fillText(title, w / 2, h / 2 - 8);
      ctx.font = '16px system-ui, sans-serif'; ctx.fillText(sub, w / 2, h / 2 + 26);
      ctx.textAlign = 'left';
    }
  };

  function ensure() {
    if (!host) { host = el('div', 'randos'); host.hidden = true; document.body.appendChild(host) }
    return host;
  }

  function hub() {
    cleanup();
    const root = ensure(); root.innerHTML = ''; root.classList.remove('playing');
    const bar = el('div', 'randos-bar');
    bar.appendChild(api.button('Back to Arcade', close));
    const grid = el('div', 'randos-grid');
    R.games.forEach(game => {
      const tile = el('button', 'randos-tile');
      tile.append(el('span', 'randos-emoji', game.emoji), el('span', 'randos-name', game.title));
      tile.onclick = () => play(game);
      grid.appendChild(tile);
    });
    root.append(bar, grid);
  }

  function play(game) {
    cleanup();
    const root = ensure(); root.innerHTML = ''; root.classList.add('playing');
    const bar = el('div', 'randos-bar');
    bar.append(api.button('‹ Games', hub), el('div', 'randos-title', game.title));
    const stage = el('div', 'randos-stage');
    root.append(bar, stage);
    game.mount(stage, api);
  }

  function close() {
    cleanup();
    if (host) { host.hidden = true; host.innerHTML = '' }
    const done = back; back = null;
    if (done) done();
  }

  R.open = fn => { back = fn; ensure().hidden = false; hub() };
})();
