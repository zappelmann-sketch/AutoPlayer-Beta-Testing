/* AutoPlayer landing prototype - build engine.
   Sections "build themselves" while they scroll into view: a swarm of labelled cursors drags
   boxes open, types headlines, fills colours, raises glass blur and counts numbers up, each with a
   live spec chip. State is a pure function of time t, so demo mode and video export are exact.
   Modes: live (visitor scrolls), demo (?demo=15|30, scripted scroll), frozen (renderAt(t) for export).
   The start page runs the 30 s demo by itself (Kay 08.11.2026); ?demo=aus = the visitor scrolls. */
(function () {
  'use strict';

  // Which demo runs: the address decides, the start page without one gets the 30 s demo with its song
  // (page.js). Not when the system asks for reduced motion - then everything stands there at once.
  const QUERY = new URLSearchParams(location.search);
  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ?stelle=<id>: back from the manual (Datei 13) - the page stands there built, no demo
  const STELLE = /^[A-Za-z0-9-]+$/.test(QUERY.get('stelle') || '') ? QUERY.get('stelle') : null;
  const DEMO = QUERY.get('demo') || (REDUCE || STELLE ? null : '30');

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const EASE = {
    out: (p) => 1 - Math.pow(1 - p, 3),
    inOut: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    sine: (p) => -(Math.cos(Math.PI * p) - 1) / 2,
    back: (p) => 1 + 2.4 * Math.pow(p - 1, 3) + 1.4 * Math.pow(p - 1, 2),
  };
  const NUM = new Intl.NumberFormat(window.APLang && window.APLang.lang === 'en' ? 'en-US' : 'de-DE');
  const FADE = 0.15;     // chip fade-in (s)
  const LINGER = 0.75;   // chip / box stays after its step (s)
  // A section starts building once at least half of it is on screen (of its height, or of the
  // screen when it is taller). The old rule - its top passes 84 % of the viewport - let the next
  // section build out of sight while the previous one was still being looked at.
  const TRIGGER_FRAC = 0.5;
  function visibleShare(top, height, vh) {
    const seen = Math.min(top + height, vh) - Math.max(top, 0);
    return seen / Math.max(1, Math.min(height, vh));
  }

  const S = { sections: [], elems: new Map(), agents: [], steps: [], hooks: [], waits: [], mode: 'live', t: 0,
    style: null, frame: 0, doneAt: null };
  const swarm = document.getElementById('swarm');

  // ---------- performance (Datei 14 des Wochentags-Konzepts, Kay 14.11.2026) ----------
  // Style writes only when the value really changes: a write with the same value still marks the
  // element for a style recalculation in every frame.
  const VARS = new WeakMap();
  function setVar(el, name, v) {
    let m = VARS.get(el);
    if (!m) { m = {}; VARS.set(el, m); }
    if (m[name] === v) return;
    m[name] = v;
    el.style.setProperty(name, v);
  }
  // Page positions are measured only for elements that are being built right now (they may move);
  // the others come from a cache that is refreshed every half second and on resize.
  const RECT = new Map();
  window.addEventListener('resize', () => RECT.clear());
  function cachedRect(el, fresh) {
    let c = RECT.get(el);
    if (!c || fresh || S.frame - c.f > 30 || S.mode === 'frozen') {
      c = { r: docRect(el), f: S.frame };   // the frozen export always measures (exact frames)
      RECT.set(el, c);
    }
    return c.r;
  }
  // chip width from the font instead of offsetWidth (reading offsetWidth forced a layout every frame)
  const MEASURE = document.createElement('canvas').getContext('2d');
  let chipFont = null;
  function chipWidth(chipEl, txt) {
    if (!chipFont) {
      const cs = getComputedStyle(chipEl);
      chipFont = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      MEASURE.font = chipFont;
      S.chipPad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    }
    return Math.ceil(MEASURE.measureText(txt).width + S.chipPad);
  }
  /** The style of a weekday page (js/styles/*.js) - hooks per step kind. The start page has none. */
  const hook = (s, name) => (S.style && S.style.kinds && S.style.kinds[s.kind] && S.style.kinds[s.kind][name]) || null;

  function mk(tag, cls, parent) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    (parent || swarm).appendChild(e);
    return e;
  }
  function docRect(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
  }
  const start = (s) => (s.sec.trig == null ? Infinity : s.sec.trig + s.at);
  const end = (s) => start(s) + s.dur;
  const prog = (s, t) => (s.sec.trig == null ? -1 : (t - start(s)) / s.dur);

  // ---------- step kinds ----------
  const KINDS = {
    box: {
      reveal: 'end',
      init(s) {
        s.bx = mk('div', 'bx');
        s.bx.innerHTML = '<i></i><i></i><i></i><i></i>';
        s.bx.style.borderColor = s.agent.color;
        Array.from(s.bx.children).forEach((i) => { i.style.borderColor = s.agent.color; });
      },
      size(s, p, r) { const e = EASE.out(clamp(p, 0, 1)); return [Math.max(2, r.w * e), Math.max(2, r.h * e)]; },
      chip(s, p, r) { const [w, h] = KINDS.box.size(s, p, r); return Math.round(w) + ' × ' + Math.round(h); },
      point(s, p, r) { const [w, h] = KINDS.box.size(s, p, r); return { x: r.x + w, y: r.y + h }; },
    },
    type: {
      reveal: 'start',
      init(s) {
        const text = s.el.textContent;
        s.el.setAttribute('aria-label', text);
        s.el.textContent = '';
        if (S.style && S.style.charBlocks) {
          // weekday styles move single letters (transform needs inline-block); words stay unbroken
          s.chars = [];
          text.split(/( )/).forEach((part) => {
            if (!part) return;
            const w = mk('span', part === ' ' ? 'chw sp' : 'chw', s.el);
            Array.from(part).forEach((c) => { const sp = mk('span', 'ch', w); sp.textContent = c; s.chars.push(sp); });
          });
        } else {
          s.chars = Array.from(text).map((c) => { const sp = mk('span', 'ch', s.el); sp.textContent = c; return sp; });
        }
        s.caret = document.createElement('span');
        s.caret.className = 'caret';
        s.caret.style.color = s.agent.color;
        s.shown = 0;
        const cs = getComputedStyle(s.el);
        const size = parseFloat(cs.fontSize);
        const lh = cs.lineHeight === 'normal' ? 'normal' : (parseFloat(cs.lineHeight) / size).toFixed(2);
        const ls = cs.letterSpacing === 'normal' ? '0' : (parseFloat(cs.letterSpacing) / size).toFixed(3);
        s.spec = cs.fontWeight + ' · ' + Math.round(size) + 'px / ' + lh + ' · ' + ls + 'em';
      },
      apply(s, p, t) {
        const n = p <= 0 ? 0 : Math.min(s.chars.length, Math.ceil(s.chars.length * Math.min(p, 1)));
        if (n !== s.shown) {
          s.chars.forEach((c, i) => c.classList.toggle('on', i < n));
          s.shown = n;
        }
        const on = p > 0 && (p < 1 || t - end(s) < 0.45);
        if (on) {
          const after = n > 0 ? s.chars[n - 1] : null;
          if (after ? after.nextSibling !== s.caret : s.el.firstChild !== s.caret) {
            if (after) after.after(s.caret); else s.el.prepend(s.caret);
          }
        } else if (s.caret.parentNode) {
          s.caret.remove();
        }
      },
      chip(s) { return s.spec; },
      // beside the line, left of its first letter - above it the chip covered the line before
      // positions of the letters from the cache: they do not move while the line is typed (hidden letters
      // keep their place); measuring the caret in every frame forced a layout each time (Datei 14)
      anchor(s) { const r = cachedRect(s.chars[0]); return { x: r.x - 10, y: r.y + r.h / 2, top: r.y, side: 'left' }; },
      point(s, p) {
        const r = cachedRect(s.chars[Math.max(0, s.shown - 1)]);
        return { x: r.x + r.w + 2, y: r.y + r.h * 0.85 };
      },
    },
    fill: {
      reveal: 'start',
      apply(s, p) { setVar(s.el, '--fill', EASE.out(clamp(p, 0, 1)).toFixed(3)); },
      chip(s) { return 'background: ' + (s.opts.label || '#62E8C8'); },
    },
    glass: {
      reveal: 'start',
      init(s) { s.blur = +s.el.dataset.blur || 18; s.sat = +s.el.dataset.sat || 1.5; s.now = [0, 1]; },
      apply(s, p) {
        const e = EASE.inOut(clamp(p, 0, 1));
        s.now = [s.blur * e, 1 + (s.sat - 1) * e];
        setVar(s.el, '--blur', s.now[0].toFixed(1) + 'px');
        setVar(s.el, '--sat', s.now[1].toFixed(2));
      },
      chip(s) { return 'backdrop-filter: blur(' + Math.round(s.now[0]) + 'px) saturate(' + s.now[1].toFixed(1) + ')'; },
    },
    img: {
      reveal: 'start',
      init(s) { s.img = s.el.querySelector('img, video'); s.file = s.img.getAttribute('src').split('/').pop(); },
      apply(s, p) {
        setVar(s.el, '--reveal', EASE.inOut(clamp(p, 0, 1)).toFixed(3));
        // revealed: blur and clip of the reveal off (same picture, no filter layer while scrolling)
        const done = p >= 1;
        if (done !== s.done) { s.done = done; s.el.classList.toggle('fertig', done); }
      },
      chip(s) {
        const w = s.img.naturalWidth || s.img.videoWidth || 0;
        const h = s.img.naturalHeight || s.img.videoHeight || 0;
        return w + ' × ' + h + ' · ' + s.file;
      },
      point(s, p, r) { return { x: r.x + r.w * 0.8, y: r.y + r.h * clamp(EASE.inOut(clamp(p, 0, 1)), 0.06, 0.94) }; },
    },
    count: {
      reveal: 'start',
      init(s) {
        s.num = s.el.querySelector('.num');
        s.to = +s.num.dataset.to;
        s.from = s.opts.from || 0;
        s.prefix = s.num.dataset.prefix || '';
        s.val = null;
      },
      apply(s, p) {
        const v = Math.round(lerp(s.from, s.to, EASE.out(clamp(p, 0, 1))));
        if (v !== s.val) { s.num.textContent = s.prefix + NUM.format(v); s.val = v; }
      },
      chip(s) { return 'count ' + NUM.format(s.val || 0) + ' / ' + NUM.format(s.to); },
      point(s) { const r = cachedRect(s.num); return { x: r.x + r.w + 4, y: r.y + r.h * 0.7 }; },
    },
    fn: {
      reveal: 'none',
      init(s) { if (s.opts.init) s.opts.init(s); },
      apply(s, p, t) { if (s.opts.apply) s.opts.apply(clamp(p, 0, 1), t, s); },
      chip(s, p) { return s.opts.chip ? s.opts.chip(clamp(p, 0, 1)) : ''; },
    },
  };

  // ---------- registration ----------
  /** The builders. No cursors are drawn: the pets (js/pets/stage.js) fly to work() targets. */
  function agents(list) {
    list.forEach((a, i) => {
      S.agents.push(Object.assign({ steps: [], phase: i * 1.7, roles: [] }, a));
    });
  }

  function section(selector, steps) {
    const sec = { el: document.querySelector(selector), trig: null, demoTrig: null, steps: [] };
    if (!sec.el) throw new Error('section missing: ' + selector);
    steps.forEach((d) => {
      const el = typeof d.el === 'string' ? document.querySelector(d.el) : d.el;
      const agent = S.agents.find((a) => a.id === d.agent || a.roles.includes(d.agent));
      if (!el || !agent || !KINDS[d.kind]) throw new Error('bad step: ' + JSON.stringify(d));
      const s = { sec, el, agent, kind: d.kind, at: d.at, dur: d.dur, opts: d, chipEl: null };
      sec.steps.push(s);
      S.steps.push(s);
      agent.steps.push(s);
      if (!S.elems.has(el)) S.elems.set(el, []);
      S.elems.get(el).push(s);
    });
    S.sections.push(sec);
  }

  function initSteps() {
    S.steps.forEach((s) => {
      if (KINDS[s.kind].init) KINDS[s.kind].init(s);
      const h = hook(s, 'init');
      if (h) h(s);
      if (!s.opts.noChip && (s.kind !== 'fn' || s.opts.chip)) {
        s.chipEl = mk('div', 'chip');
        s.chipEl.style.background = s.agent.color;
        s.chipEl.style.display = 'none';
      }
    });
    S.elems.forEach((steps, el) => {
      const has = (k) => steps.some((s) => s.kind === k);
      setVar(el, '--fill', has('fill') ? '0' : '1');
      setVar(el, '--reveal', has('img') ? '0' : '1');
      if (has('glass')) { setVar(el, '--blur', '0px'); setVar(el, '--sat', '1'); }
      else if (el.dataset.blur) setVar(el, '--blur', el.dataset.blur + 'px');
    });
    document.querySelectorAll('[data-b]').forEach((el) => {
      if (!S.elems.has(el)) setVar(el, '--vis', '1');
    });
    S.agents.forEach((a) => a.steps.sort((x, y) => x.at - y.at));
    if (S.style && S.style.init) S.style.init(api());
  }

  // ---------- per-frame ----------
  function life(s, t) {
    const st = start(s);
    if (t < st) return 0;
    if (t <= st + s.dur) return clamp((t - st) / FADE, 0, 1);
    return clamp(1 - (t - st - s.dur) / LINGER, 0, 1);
  }

  function stepPoint(s, p, t, rects) {
    const k = KINDS[s.kind];
    const r = rects.get(s.el) || cachedRect(s.el);
    if (k.point) return k.point(s, p, r, t);
    const ax = s.opts.ax != null ? s.opts.ax : 0.72;
    const ay = s.opts.ay != null ? s.opts.ay : 0.6;
    return { x: r.x + r.w * ax + (s.opts.dx || 0), y: r.y + r.h * ay + (s.opts.dy || 0) };
  }

  /**
   * Where a builder has to be right now, in page coordinates - or null when it has nothing to
   * do (then the pet floats freely). While a step runs: its working point (the growing box
   * corner, the caret, the scan line ...); between steps: the spot of the next job, so the pet
   * is already there when it starts; shortly after the last job: still at that spot.
   * `since` changes with every new job (the pet gives a little hop).
   */
  function workOf(a, t, rects) {
    let prev = null;
    let next = null;
    a.steps.forEach((s) => {
      const st = start(s);
      if (st === Infinity) return;
      if (st <= t) { if (!prev || st >= start(prev)) prev = s; }
      else if (!next || st < start(next)) next = s;
    });
    if (prev && t <= end(prev)) {
      return { pt: stepPoint(prev, (t - start(prev)) / prev.dur, t, rects), since: start(prev), busy: true };
    }
    if (next) return { pt: stepPoint(next, 0, t, rects), since: prev ? start(prev) : -1, busy: false };
    if (prev && t < end(prev) + 0.6) return { pt: stepPoint(prev, 1, t, rects), since: start(prev), busy: false };
    return null;
  }

  // Everything built and every chip gone: the steps need no more work (frozen export excepted -
  // it may jump back in time). The hooks (ring, pets) keep running.
  function allDone(t) {
    if (S.mode === 'frozen') return false;
    if (S.doneAt == null) {
      if (S.sections.some((sec) => sec.trig == null)) return false;
      S.doneAt = Math.max(...S.steps.map((s) => end(s))) + LINGER + 0.7;
    }
    // one full frame past the end still runs (it writes the final state and hides the chips)
    return t > S.doneAt && S.lastFull != null && S.lastFull > S.doneAt;
  }

  let viewW = document.documentElement.clientWidth;
  window.addEventListener('resize', () => { viewW = document.documentElement.clientWidth; });

  function render(t) {
    S.t = t;
    S.frame++;
    if (S.mode === 'live') {
      // the trigger is checked every 6th frame (~0.1 s): a getBoundingClientRect per waiting section
      // in every frame forced a layout each time
      if (S.frame % 6 === 1 || S.frame < 3) {
        S.sections.forEach((sec) => {
          if (sec.trig != null) return;
          const r = sec.el.getBoundingClientRect();
          if (visibleShare(r.top, r.height, window.innerHeight) >= TRIGGER_FRAC) sec.trig = t;
        });
      }
    } else {
      S.doneAt = null;
      S.sections.forEach((sec) => { sec.trig = sec.demoTrig != null && sec.demoTrig <= t ? sec.demoTrig : null; });
    }
    if (allDone(t)) {
      S.work = {};
      S.hooks.forEach((fn) => fn(t));
      return;
    }
    // 1) writes: element state
    S.elems.forEach((steps, el) => {
      let vis = 0;
      steps.forEach((s) => {
        const p = prog(s, t);
        const k = KINDS[s.kind];
        if (k.apply) k.apply(s, p, t);
        const h = hook(s, 'apply');
        if (h) h(s, p, t);
        if ((k.reveal === 'end' && p >= 1) || (k.reveal === 'start' && p > 0)) vis = 1;
      });
      setVar(el, '--vis', String(vis));
    });
    // 2) reads: rects of everything that is on stage (fresh only while it is being built)
    const rects = new Map();
    S.elems.forEach((steps, el) => {
      if (steps[0].sec.trig == null) return;
      // elements being built are measured every second frame (they may move); the others come from the cache
      const busy = S.frame % 2 === 0 && steps.some((s) => t >= start(s) - 0.3 && t <= end(s) + LINGER + 0.2);
      rects.set(el, cachedRect(el, busy));
    });
    S.rects = rects;
    S.work = {};
    S.agents.forEach((a) => { const w = workOf(a, t, rects); if (w) S.work[a.id] = w; });
    S.hooks.forEach((fn) => fn(t));
    // 3) writes: overlay
    const stack = new Map();
    S.steps.forEach((s) => {
      const a = life(s, t);
      const r = rects.get(s.el);
      if (s.bx) {
        const own = hook(s, 'overlay');
        if (own) {
          if (!s.bxOwn) { s.bxOwn = true; s.bx.style.display = 'none'; }   // the style draws its own frame
          own(s, a, prog(s, t), r, t);
        }
        else if (a > 0 && r) {
          const [w, h] = KINDS.box.size(s, prog(s, t), r);
          s.bx.style.display = 'block';
          s.bx.style.opacity = a.toFixed(3);
          s.bx.style.transform = 'translate(' + r.x + 'px,' + r.y + 'px)';
          s.bx.style.width = w + 'px';
          s.bx.style.height = h + 'px';
        } else if (s.bx.style.display !== 'none') s.bx.style.display = 'none';
      }
      if (!s.chipEl) return;
      if (a <= 0 || !r) { if (s.chipEl.style.display !== 'none') s.chipEl.style.display = 'none'; return; }
      const k = KINDS[s.kind];
      const anc = k.anchor ? k.anchor(s, r) : r;
      const n = stack.get(s.el) || 0;
      stack.set(s.el, n + 1);
      const own = hook(s, 'chip');
      const txt = (own && own(s, prog(s, t), r, t)) || k.chip(s, prog(s, t), r);
      if (s.chipEl.textContent !== txt) { s.chipEl.textContent = txt; s.chipW = null; }
      s.chipEl.style.display = 'block';
      // width: exact (offsetWidth) once per text for chips that stand left of their line - their
      // text does not change; the others only need it for the right edge, from the font
      if (s.chipW == null) s.chipW = anc.side === 'left' ? s.chipEl.offsetWidth : chipWidth(s.chipEl, txt);
      s.chipEl.style.opacity = a.toFixed(3);
      let x = anc.x;
      let y = anc.y - 23 - n * 22;
      if (anc.side === 'left') {
        const w = s.chipW;
        if (anc.x - w > 8) { x = anc.x - w; y = anc.y - 10 + n * 22; }
        else { x = anc.x + 10; y = anc.top - 23 - n * 22; }
      }
      // keep the whole chip on screen (narrow phones)
      x = Math.max(4, Math.min(x, viewW - s.chipW - 4));
      s.chipEl.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    S.lastFull = t;
  }

  /** What a style (js/styles/*.js) may use. */
  function api() {
    return { S, EASE, clamp, lerp, setVar, docRect, cachedRect, start, end, prog, life, mk, swarm };
  }

  // ---------- demo scroll ----------
  function makeScroll(keys) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const k = keys.map(([time, y, ease]) => [time, clamp(typeof y === 'function' ? y() : y, 0, max), ease || 'inOut']);
    return (t) => {
      if (t <= k[0][0]) return k[0][1];
      for (let i = 1; i < k.length; i++) {
        if (t <= k[i][0]) {
          const u = (t - k[i - 1][0]) / (k[i][0] - k[i - 1][0]);
          return lerp(k[i - 1][1], k[i][1], EASE[k[i][2]](u));
        }
      }
      return k[k.length - 1][1];
    };
  }

  function precomputeTriggers(scrollAt, duration) {
    const vh = window.innerHeight;
    S.sections.forEach((sec, i) => {
      if (i === 0) { sec.demoTrig = 0; return; }
      const r = docRect(sec.el);
      sec.demoTrig = null;
      for (let t = 0; t <= duration; t += 1 / 240) {
        if (visibleShare(r.y - scrollAt(t), r.h, vh) >= TRIGGER_FRAC) { sec.demoTrig = t; break; }
      }
    });
  }

  // ---------- boot ----------
  function boot(opts) {
    const q = QUERY;
    const demo = DEMO;
    const frozenAt = q.has('t') ? parseFloat(q.get('t')) : null;
    const reduce = REDUCE && !(demo && opts.demos[demo]);   // a demo asked for in the address still runs
    if (q.has('clean')) document.documentElement.classList.add('clean');   // reference stills for Veo
    // video export: no QR code and no manual hints in the picture (Datei 50 Punkt 22, Datei 13)
    if (q.has('render') || q.has('t')) document.documentElement.classList.add('render');
    const ready = Promise.all([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      ...Array.from(document.images).map((im) => (im.complete ? Promise.resolve() : im.decode().catch(() => {}))),
      ...Array.from(document.querySelectorAll('video')).map((v) => (v.readyState >= 1 ? Promise.resolve()
        : new Promise((r) => { v.addEventListener('loadedmetadata', r, { once: true }); v.addEventListener('error', r, { once: true }); }))),
    ]);
    const api = { ready: false, duration: 0 };
    window.__AP = api;
    return ready.then(() => {
      initSteps();
      if (opts.onReady) opts.onReady();
      if (reduce) {
        S.mode = 'demo';
        S.sections.forEach((sec) => { sec.demoTrig = -100; });
        render(100);
        api.ready = true;
        return;
      }
      if (demo && opts.demos[demo]) {
        document.documentElement.classList.add('demo');
        S.mode = 'demo';
        const cfg = opts.demos[demo];
        const scrollAt = makeScroll(cfg.keys);
        api.duration = cfg.duration;
        if (cfg.speed) S.steps.forEach((st) => { st.at *= cfg.speed; st.dur *= cfg.speed; });
        precomputeTriggers(scrollAt, cfg.duration);
        // for tuning the scroll scripts: when each section builds and how much of it is seen meanwhile
        api.sections = () => S.sections.map((x) => {
          const end = x.demoTrig == null ? null : Math.max(...x.steps.map((st) => x.demoTrig + st.at + st.dur));
          let seen = 1;
          if (end != null) {
            const r = docRect(x.el);
            for (let t = x.demoTrig; t <= end; t += 0.05) seen = Math.min(seen, visibleShare(r.y - scrollAt(t), r.h, window.innerHeight));
          }
          return { id: x.el.id, start: x.demoTrig, end, minSeen: Math.round(seen * 100) };
        });
        api.renderAt = (t) => {
          S.mode = 'frozen';
          window.scrollTo(0, scrollAt(t));
          render(t);
          const waits = S.waits.splice(0);
          return Promise.all(waits).then(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))));
        };
        api.ready = true;
        if (frozenAt != null || q.has('render')) { if (frozenAt != null) api.renderAt(frozenAt); return; }
        // The demo scrolls by itself until it is over - or until the visitor scrolls, clicks or
        // presses a key. Then the page is theirs: no more forced scrolling, sections that are not
        // built yet build when they come into view (live mode). R starts the demo again.
        let t0 = performance.now() + 400;
        let handedOver = false;
        const handOver = (e) => {
          // the sound button of the demo (data-keep-demo) is not taking over
          if (e && e.target && e.target.closest && e.target.closest('[data-keep-demo]')) return;
          if (handedOver) return;
          handedOver = true;
          S.mode = 'live';
          document.documentElement.classList.remove('demo');
        };
        // where the demo stands (s), or null once the visitor took over or it is over
        api.time = () => (handedOver ? null : Math.max(0, (performance.now() - t0) / 1000));
        // the demo once more from the top (sound button after the demo, page.js)
        api.restart = () => {
          t0 = performance.now();
          handedOver = false;
          S.mode = 'demo';
          document.documentElement.classList.add('demo');
        };
        // armed only once the demo runs
        const arm = () => {
          ['wheel', 'touchstart', 'mousedown'].forEach((ev) => window.addEventListener(ev, handOver, { passive: true }));
          window.addEventListener('keydown', (e) => { if (e.key === 'r' || e.key === 'R') location.reload(); else handOver(e); });
        };
        const loop = (now) => {
          let t = Math.max(0, (now - t0) / 1000);
          // with the song (page.js): the picture follows the song's clock - slowly, at most half a
          // frame per frame, so it never visibly jumps back
          const song = !handedOver && opts.clockOf ? opts.clockOf(t) : null;
          if (song != null) {
            t0 -= clamp((song - t) * 1000, -8, 8);
            t = Math.max(0, (now - t0) / 1000);
          }
          if (!handedOver) {
            if (t > cfg.duration + 0.3) handOver();
            else window.scrollTo(0, scrollAt(Math.min(t, cfg.duration)));
          }
          render(t);
          requestAnimationFrame(loop);
        };
        // opts.gate may hold the start back until the song plays; it answers with how far the song
        // already is (s), so picture and music start together
        if (opts.gate) opts.gate(demo).then((skew) => { t0 = performance.now() - (skew || 0) * 1000; arm(); requestAnimationFrame(loop); });
        else { arm(); requestAnimationFrame(loop); }
        return;
      }
      S.mode = 'live';
      if (STELLE) {
        // everything built at once (no second run of the animation), then to the element and a short glow
        S.sections.forEach((sec) => { sec.trig = -100; });
        render(0);
        const el = document.getElementById(STELLE);
        if (el) {
          el.scrollIntoView({ block: 'center' });
          el.classList.add('hb-ziel');
          setTimeout(() => el.classList.remove('hb-ziel'), 2600);
        }
      }
      const t0 = performance.now();
      const loop = (now) => { render((now - t0) / 1000); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
      api.ready = true;
    });
  }

  window.APEngine = {
    agents, section, start: boot, EASE,
    /** A weekday page sets its style (js/styles/*.js) before start(); the start page sets none. */
    useStyle: (st) => { S.style = st; document.documentElement.dataset.stil = st.name; },
    /** Page positions of the elements being built in this frame (styles draw their effects there). */
    rects: () => S.rects || new Map(),
    stepsOf: () => S.steps,
    /** Writes a CSS variable only when it changes (styles and page scripts). */
    setVar,
    /** Helpers for the styles of the weekday pages (js/styles/*.js). */
    api,
    /** All steps of `el` are over (the manual link becomes clickable then, js/handbuch_link.js). */
    isBuilt: (el) => { const st = S.elems.get(el); return !st || st.every((s) => S.t >= end(s)); },
    /** The demo of this page view ('15', '30', null = none) - stage.js times the finale of the pets by it. */
    demoName: DEMO,
    onFrame: (fn) => S.hooks.push(fn),
    /** Current jobs of the builders: { petKey: { pt: {x, y} in page px, since, busy } } */
    work: () => S.work || {},
    agentList: () => S.agents.map((a) => ({ id: a.id, color: a.color })),
    rectOf: docRect,
    /** When the section built from `selector` started (s), or null. */
    sectionStart: (selector) => { const sec = S.sections.find((x) => x.el === document.querySelector(selector)); return sec ? sec.trig : null; },
    /** Exporting frame by frame (renderAt) - media must be seeked, not played. */
    isRender: () => S.mode === 'frozen',
    /** A hook can make the current exported frame wait, e.g. for a video's 'seeked'. */
    waitFor: (promise) => { S.waits.push(promise); },
  };
})();
