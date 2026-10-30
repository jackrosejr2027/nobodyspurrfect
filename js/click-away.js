// Click outside an open menu, or press Escape, to close it.
// Covers the hub settings panel (⚙), hover game previews, the full demo
// view, and the "Choose your games" chooser. Clicks that close a menu are
// swallowed so they do not also open whatever is underneath.
(() => {
  let swallowUntil = 0;
  const $ = s => document.querySelector(s);

  function settingsOpen() {
    const panel = $('#hub-settings');
    return panel && !panel.hidden ? panel : null;
  }

  function closeSettings() {
    const gear = $('.hub-gear');
    if (gear && settingsOpen()) gear.click();
  }

  function closeChooser() {
    const dialog = $('dialog.game-selection');
    if (!dialog || !dialog.open) return false;
    const cancel = [...dialog.querySelectorAll('button')].find(b => b.textContent.trim() === 'Cancel');
    if (!cancel) return false;
    cancel.click();
    return true;
  }

  addEventListener('pointerdown', e => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    let closed = false;

    if (settingsOpen() && !t.closest('#hub-settings, .hub-gear')) {
      closeSettings();
      closed = true;
    }

    const preview = $('.hover-demo');
    if (preview && !t.closest('.hover-demo, [data-preview]')) {
      const close = preview.querySelector('[aria-label="Close preview"]');
      if (close) { close.click(); closed = true; }
    }

    const full = $('.expanded-demo');
    if (full && t === full) {
      const close = full.querySelector('[data-a="demoClose"]');
      if (close) { close.click(); closed = true; }
    }

    const dialog = $('dialog.game-selection');
    if (dialog && dialog.open && t === dialog && closeChooser()) closed = true;

    if (closed) swallowUntil = performance.now() + 600;
  }, true);

  addEventListener('click', e => {
    if (performance.now() < swallowUntil) {
      swallowUntil = 0;
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  addEventListener('keydown', e => {
    if (e.key !== 'Escape' || e.defaultPrevented) return;
    if (closeChooser()) return;
    if (settingsOpen()) { e.preventDefault(); closeSettings(); }
  });
})();
