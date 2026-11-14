/* AutoPlayer landing pages - the song of the demo and its sound button (all seven pages).
   The demo starts at once. The song starts with it when the browser lets the page play sound; on a
   first visit most browsers wait for a click or tap. Then the demo runs without sound and the sound
   button brings the song in exactly where the demo stands. While the song plays, the same button
   turns it off (sound that starts by itself must be stoppable).
   Moved here from page.js (14.11.2026) so the weekday pages use the same code:
     const M = APMusik.create('audio/....mp3', { only: '30' });
     APEngine.start({ gate: M.gate, clockOf: M.clockOf, ... });   M.audio() = the Audio element */
(function () {
  'use strict';
  const L = window.APLang || { t: (k) => k };

  function create(src, opts) {
    const o = Object.assign({ only: '30' }, opts || {});
    let music = null;

    function gate(demo) {
      const q = new URLSearchParams(location.search);
      if (demo !== o.only || (q.has('demo') && !q.has('musik'))) return Promise.resolve(0);
      music = new Audio(src);
      music.preload = 'auto';
      soundPill(music);
      return new Promise((res) => {
        let started = false;
        const go = (skew) => { if (!started) { started = true; res(skew); } };
        // play() reports "playing" before the song's clock really moves (up to 0.4 s in Edge): the
        // demo starts once it does, at most 1.5 s later
        const moving = () => new Promise((ok) => {
          const until = performance.now() + 1500;
          const look = () => (music.currentTime > 0.02 || performance.now() > until ? ok() : requestAnimationFrame(look));
          look();
        });
        music.play().then(() => moving().then(() => go(music.currentTime)), () => go(0));
        // a slow line: the picture does not wait longer; the song joins where the demo stands
        setTimeout(() => {
          if (started) return;
          go(0);
          music.addEventListener('playing', () => {
            const t = window.__AP && window.__AP.time ? window.__AP.time() : null;
            if (t != null && Math.abs(music.currentTime - t) > 0.15) music.currentTime = t;
          }, { once: true });
        }, 2500);
      });
    }

    // the small sound button at the bottom: "♪ Ton an" / "♪ Ton aus" / "↺ Demo mit Musik"
    function soundPill(m) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sound-pill glass';
      btn.setAttribute('data-keep-demo', '');   // engine.js: pressing it does not end the demo
      document.body.appendChild(btn);
      const api = () => window.__AP || {};
      let shown = '';
      function state() {
        if (!m.paused && !m.ended) return 'off';
        const t = api().time ? api().time() : null;
        return t != null && t < (api().duration || 30) - 0.5 ? 'on' : 'again';
      }
      function show() {
        const s = state();
        if (s === shown) return;
        shown = s;
        const key = { on: 'musicOn', off: 'musicOff', again: 'musicAgain' }[s];
        btn.textContent = L.t(key);
        btn.setAttribute('aria-label', L.t(key + 'Label'));
        btn.classList.toggle('on', s === 'off');
      }
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!m.paused && !m.ended) { m.pause(); show(); return; }
        const t = api().time ? api().time() : null;
        if (t != null && t < (api().duration || 30) - 0.5) m.currentTime = t;   // join the demo in time
        else { if (api().restart) api().restart(); m.currentTime = 0; }       // the demo once more
        m.play().catch(() => {});
        show();
      });
      ['play', 'pause', 'ended'].forEach((ev) => m.addEventListener(ev, show));
      if (window.APEngine) window.APEngine.onFrame(show);
      show();
    }

    // the song's clock for the demo (engine.js), null while it does not play; far off (the line
    // stalled, or it just joined) the song is set to the picture instead
    function clockOf(t) {
      const m = music;
      if (!m || m.paused || m.ended || m.seeking || m.currentTime <= 0.02) return null;
      if (Math.abs(m.currentTime - t) > 0.5) { if (t < (m.duration || 1e9)) m.currentTime = t; return null; }
      return m.currentTime;
    }

    return { gate, clockOf, audio: () => music };
  }

  window.APMusik = { create };
})();
