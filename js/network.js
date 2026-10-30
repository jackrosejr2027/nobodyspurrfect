// Online mode loads hosted art and a web font. Offline mode uses only the files bundled with the project.
(() => {
  const KEY = 'arcade_network';
  const root = document.documentElement;
  // Offline is the baseline everywhere; online (hosted art) is opt-in per visitor.
  let online = false;
  try { const saved = localStorage.getItem(KEY); if (saved) online = saved === 'online' } catch (e) {}

  function apply() {
    root.dataset.network = online ? 'online' : 'offline';
    for (const b of document.querySelectorAll('[data-network-toggle]')) sync(b);
  }

  function sync(b) {
    b.textContent = online ? '● Online' : '○ Offline';
    b.setAttribute('aria-pressed', String(online));
    b.title = online ? 'Online: richer hosted art. Click for offline mode.' : 'Offline: bundled art only. Click for online art.';
  }

  function set(on) {
    online = on;
    if (!window.DemoSession) try { localStorage.setItem(KEY, on ? 'online' : 'offline') } catch (e) {}
    apply();
    window.CardArcade?.menu?.();
  }

  function attach(heading) {
    if (!heading || heading.querySelector('[data-network-toggle]')) return;
    const b = document.createElement('button');
    b.className = 'alt network-toggle';
    b.dataset.networkToggle = '';
    b.onclick = () => set(!online);
    sync(b);
    heading.appendChild(b);
  }

  // Hosted art: a game with its own painting uses it; the rest share a family scene.
  const ART = new Set(['falk','pyramid','tripeaks','accordion','montecarlo','castle','bakersgame','eightoff','seahaven','fortythieves','josephine','canfield','duchess','scorpion','wasp','simplesimon','acesup','bakersdozen','bisley','littlespider','flowergarden','bristol','gaps','nestor','ginrummy','stack','delver','dragonhunt','soulcrypt','spellforge','shieldwall','vampirecourt','starsalvage','corsair','wildtrail','alchemist','necromancer','ironarena','moonheist','village','chronomancer','bounty','relicvault','caravan','skyspire','oraclequest','alquerque','backgammon','bowling','calculation','checkers','chess','chinesecheckers','classic-battleship','classic-billiards','classic-cube','classic-etch','classic-fifteen','classic-football','classic-gamewatch','classic-hanoi','classic-klotski','classic-lightsout','classic-litebrite','classic-mastermind','classic-merlin','classic-microvision','classic-pegged','classic-pocket15','classic-pyramid','classic-rings','classic-simon','classic-snake','classic-tangram','classic-tetris','classic-triangle','clock','connectfour','dominoes','dotsboxes','foxgeese','freecell','game2048','golf','hanayama','hitori','jewels','kakuro','klondike','longroad','lucie','mahjong','mancala','memory','minesweeper','morris','nonogram','nurikabe','othello','pegsolitaire','pentalpha','quiet','russian','savage','scoundrel','senet','shutbox','spider','sudoku','tchukaruma','tictactoe','ur','yukon']);
  const FAMILY = { board: 'family-board', classic: 'family-classic', rpg: 'longroad' };
  const painting = (key, category) => 'img/online/' + (ART.has(key) ? key : (FAMILY[category] || 'klondike')) + '.webp';
  // Solitaire tiles show the 33 cat portraits; board and classic games keep their paintings.
  const CATS = 33;
  const catFor = key => { let h = 0; for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return 'img/online/cats/cat-' + String(h % CATS + 1).padStart(2, '0') + '.webp' };
  const artUrl = (key, category) => ['board', 'classic', 'duel'].includes(category) ? painting(key, category) : catFor(key);

  // The game board hangs the game's own painting in a picture frame (online only).
  const frameFor = () => {
    const board = document.getElementById('g2b'), panel = document.getElementById('g2');
    if (!board || !panel) return;
    const key = panel.dataset.game, category = window.CardArcade?.games?.[key]?.category;
    if (key && category) { board.style.setProperty('--frame', 'url("' + painting(key, category) + '")'); board.toggleAttribute('data-frame', true) }
    else board.removeAttribute('data-frame');
  };
  const watchFrames = () => {
    const panel = document.getElementById('g2');
    if (!panel) return;
    new MutationObserver(frameFor).observe(panel, { attributes: true, attributeFilter: ['data-game'] });
    frameFor();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watchFrames); else watchFrames();

  window.NetworkMode = { get online() { return online }, set, attach, artUrl };
  apply();
})();
