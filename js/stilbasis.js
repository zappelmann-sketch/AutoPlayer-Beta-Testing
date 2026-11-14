/* AutoPlayer weekday pages - what the six building styles share (Wochentags-Konzept Datei 04/05/14).
   A style (js/styles/<name>.js) only says HOW something appears; the step kinds of engine.js stay.
   Shared here:
   - fx: one fixed canvas over the page for the pets' tools (tape, waves, pixels, paper, bricks, light);
     drawn only while a pet is at work, cleared once when the work ends
   - letters: per-letter movement for the typing steps (only while a letter settles)
   - stage effects: a canvas behind the pictures of a section; drawn only while it is on screen
   - rng: seeded random numbers (Datei 04: every style its own seed, the same picture every time)
   Performance (Datei 14): transforms and opacity only, every write only when the value changes,
   canvases at most 2x device pixels, nothing is drawn that cannot be seen. */
(function () {
  'use strict';
  const E = window.APEngine;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const DPR = () => Math.min(window.devicePixelRatio || 1, 2);

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // a fixed random number per (seed, index) - frames stay reproducible whatever order they are drawn in
  function hash(seed, i) { const r = rng((seed * 9973 + i * 7919) >>> 0); r(); return r(); }

  // ---------- fx canvas (viewport) ----------
  const fx = { cv: null, ctx: null, w: 0, h: 0, dirty: false };
  function fxInit() {
    fx.cv = document.getElementById('stilfx');
    if (!fx.cv) return;
    fx.ctx = fx.cv.getContext('2d');
    const size = () => {
      fx.w = window.innerWidth; fx.h = window.innerHeight;
      const d = DPR();
      fx.cv.width = Math.round(fx.w * d); fx.cv.height = Math.round(fx.h * d);
      fx.cv.style.width = fx.w + 'px'; fx.cv.style.height = fx.h + 'px';
      fx.ctx.setTransform(d, 0, 0, d, 0, 0);
      fx.dirty = true;
    };
    size();
    window.addEventListener('resize', size);
  }
  /** Start of a frame: clear only if something was drawn last time. Returns the context. */
  function fxBegin() {
    if (!fx.ctx) return null;
    if (fx.dirty) { fx.ctx.clearRect(0, 0, fx.w, fx.h); fx.dirty = false; }
    return fx.ctx;
  }
  const fxUsed = () => { fx.dirty = true; return fx.ctx; };
  // page -> viewport
  const vx = (x) => x - window.scrollX;
  const vy = (y) => y - window.scrollY;

  // ---------- letters ----------
  /**
   * Moves the letters of a typing step while they settle. `fn(local, i, n)` gives the transform of
   * letter i (local = seconds since it appeared) or '' once it stands. Written only when it changes.
   */
  function letters(s, p, t, settle, fn) {
    if (!s.chars) return;
    const n = s.chars.length;
    if (!s.lt) s.lt = new Array(n).fill('');
    const st = E.api().start(s);
    for (let i = 0; i < n; i++) {
      const at = st + s.dur * (i / n);
      const local = t - at;
      const v = p <= 0 || local < 0 ? '' : local >= settle ? '' : fn(local, i, n);
      if (v !== s.lt[i]) { s.lt[i] = v; s.chars[i].style.transform = v; }
    }
  }

  // ---------- stage effects (canvas behind the pictures of a section) ----------
  const buehnen = [];
  /** fn-step options for a stage effect: draw(ctx, w, h, p, t, r) - p = build progress 0..1. */
  function buehne(draw, chip) {
    const b = { el: null, cv: null, ctx: null, p: 0, w: 0, h: 0, top: 0, bottom: 0, draw };
    function size() {
      const r = b.el.getBoundingClientRect();
      const d = DPR();
      b.w = Math.max(1, r.width); b.h = Math.max(1, r.height);
      b.top = r.top + window.scrollY; b.bottom = b.top + b.h;
      b.cv.width = Math.round(b.w * d); b.cv.height = Math.round(b.h * d);
      b.ctx.setTransform(d, 0, 0, d, 0, 0);
    }
    return {
      noChip: !chip,
      init: (s) => {
        b.el = s.el;
        b.cv = document.createElement('canvas');
        b.el.appendChild(b.cv);
        b.ctx = b.cv.getContext('2d');
        size();
        window.addEventListener('resize', size);
        buehnen.push(b);
      },
      apply: (p) => { b.p = p; },
      chip: chip ? (p) => chip(p) : undefined,
    };
  }
  let lastScroll = -1;
  function buehnenFrame(t) {
    const y0 = window.scrollY;
    const y1 = y0 + window.innerHeight;
    buehnen.forEach((b) => {
      const sichtbar = b.bottom > y0 - 50 && b.top < y1 + 50;
      if (!sichtbar || b.p <= 0) { if (b.drawn) { b.ctx.clearRect(0, 0, b.w, b.h); b.drawn = false; } return; }
      b.ctx.clearRect(0, 0, b.w, b.h);
      b.draw(b.ctx, b.w, b.h, clamp(b.p, 0, 1), t, b);
      b.drawn = true;
    });
    lastScroll = y0;
  }

  // ---------- pets at work: their tools on the fx canvas ----------
  /** Calls tool(ctx, x, y, color, since, t, key) for every pet that is busy right now (viewport px). */
  function werkzeuge(t, tool) {
    const ctx = fxBegin();
    if (!ctx) return;
    const work = E.work();
    const agents = E.agentList();
    let any = false;
    agents.forEach((a) => {
      const w = work[a.id];
      if (!w || !w.busy) return;
      any = true;
      tool(ctx, vx(w.pt.x), vy(w.pt.y), a.color, w.since, t, a.id);
    });
    if (any) fxUsed();
  }

  /**
   * Builds a style. spec: { name, seed, charBlocks, kinds, tool(ctx,x,y,color,since,t,key),
   *   hero(TAG, lang) -> fn opts, effekt(a, n, TAG, lang) -> fn opts, css: extra classes }
   */
  function stil(spec) {
    const st = Object.assign({ charBlocks: true }, spec);
    st.init = (api) => {
      fxInit();
      E.onFrame((t) => {
        if (st.tool) werkzeuge(t, st.tool); else fxBegin();
        if (st.frame) st.frame(t, fx.ctx);
        buehnenFrame(t);
      });
      if (spec.init) spec.init(api);
    };
    (window.APStile = window.APStile || {})[st.name] = st;
    return st;
  }

  /** While a box step builds: the element is shown moving (class), the progress as --bp (0..1). */
  function boxZeigen(s, p, cls) {
    const on = p > 0 && p < 1;
    if (on !== s.zeigt) { s.zeigt = on; s.el.classList.toggle(cls, on); }
    E.setVar(s.el, '--bp', clamp(p, 0, 1).toFixed(3));
  }

  // the monospace font of the page, read once (reading styles in every frame forces a recalculation)
  let monoFont = null;
  const mono = () => monoFont || (monoFont = getComputedStyle(document.documentElement).getPropertyValue('--mono').trim() || 'monospace');

  window.APStil = { rng, hash, clamp, DPR, stil, buehne, letters, fxUsed, fxBegin, vx, vy, boxZeigen, mono,
    get fx() { return fx; } };
})();
