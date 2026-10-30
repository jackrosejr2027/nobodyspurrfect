// Cream is the default look. "Dark cat mode" is the plum room from cat-theme.css.
(() => {
  const KEY = 'arcade_theme';
  const root = document.documentElement;
  const isDark = () => { try { return localStorage.getItem(KEY) !== 'light'; } catch (e) { return true; } };
  const apply = dark => root.classList.toggle('light', !dark);
  apply(isDark());
  window.CatTheme = {
    isDark,
    setDark(on) {
      try { localStorage.setItem(KEY, on ? 'dark' : 'light'); } catch (e) {}
      apply(on);
    }
  };
})();
