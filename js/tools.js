/* AutoPlayer landing page - the small round tools button at the right edge (demos, pets on/off).
   Was inline in index.html; as a file it fits a strict Content-Security-Policy later. */
(function () {
  'use strict';
  const t = window.APLang ? window.APLang.t : (k) => k;
  const fab = document.getElementById('toolsFab');
  const panel = document.getElementById('toolsPanel');
  function show(on) {
    panel.hidden = !on;
    fab.setAttribute('aria-expanded', String(on));
    fab.classList.toggle('open', on);
  }
  fab.addEventListener('click', (e) => { e.stopPropagation(); show(panel.hidden); });
  document.addEventListener('click', (e) => { if (!panel.hidden && !panel.contains(e.target)) show(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') show(false); });

  const toggle = document.getElementById('petsToggle');
  let off = false;
  toggle.textContent = t('petsOff');
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    off = !off;
    if (window.VPStage) window.VPStage.hide(off);
    toggle.textContent = off ? t('petsOn') : t('petsOff');
  });
})();
