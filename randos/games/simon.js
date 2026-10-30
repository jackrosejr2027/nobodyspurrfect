// Simon Says: watch the colours, then tap them back in order.
(() => {
  const COLORS = ['#e8604c', '#f6c26b', '#6fd39a', '#6aa8f0'];
  const DIM = ['#7a2f25', '#7d6331', '#37684d', '#35547a'];
  window.Randos.register({ id: 'simon', title: 'Simon Says', emoji: '🎵', mount(root, a) {
    const hud = a.hud(root), board = a.board(root, 2), start = a.button('Start', begin);
    const pads = COLORS.map((c, i) => { const n = a.cell('', () => press(i)); n.style.background = DIM[i]; board.appendChild(n); return n });
    let seq = [], input = 0, busy = false;
    root.appendChild(start);
    function flash(i, ms = 380) {
      pads[i].style.background = COLORS[i];
      a.after(ms, () => { pads[i].style.background = DIM[i] });
    }
    function playSeq() {
      busy = true; hud.textContent = 'Watch… ' + seq.length;
      seq.forEach((p, k) => a.after(k * 600 + 300, () => flash(p)));
      a.after(seq.length * 600 + 300, () => { busy = false; input = 0; hud.textContent = 'Your turn' });
    }
    function next() { seq.push(a.rand(4)); playSeq() }
    function begin() { seq = []; start.style.display = 'none'; next() }
    function press(i) {
      if (busy || !seq.length) return;
      flash(i, 180);
      if (i !== seq[input]) {
        hud.textContent = 'Wrong! Length ' + (seq.length - 1);
        seq = []; start.textContent = 'Play again'; start.style.display = '';
        return;
      }
      input++;
      if (input === seq.length) { busy = true; hud.textContent = 'Nice! ' + seq.length; a.after(700, next) }
    }
    a.key(e => { const i = '1234'.indexOf(e.key); if (i >= 0) press(i) });
    hud.textContent = 'Tap Start';
  } });
})();
