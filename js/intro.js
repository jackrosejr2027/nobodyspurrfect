// Plays the intro video once, the first time this browser opens the cat app. Click, tap or the video's end closes it.
(() => {
  const KEY = 'cat_intro_seen';
  try {
    if (localStorage.getItem(KEY) === '1') return;
    localStorage.setItem(KEY, '1');
  } catch (e) {}

  const wrap = document.createElement('div');
  wrap.className = 'cat-intro';
  wrap.innerHTML = '<video playsinline preload="auto" src="video/cats-playing-cards.mp4"></video>';
  document.body.appendChild(wrap);
  const video = wrap.querySelector('video');

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    video.pause();
    wrap.classList.add('done');
    setTimeout(() => wrap.remove(), 400);
  };
  wrap.addEventListener('click', close);
  video.addEventListener('ended', close);
  video.addEventListener('error', close);

  // Browsers may refuse sound without a gesture; fall back to muted playback.
  const started = video.play();
  if (started && started.catch) started.catch(() => { video.muted = true; video.play().catch(close) });
})();
