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
  const DEMO = QUERY.get('demo') || (REDUCE ? null : '30');

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

  const S = { sections: [], elems: new Map(), agents: [], steps: [], hooks: [], waits: [], mode: 'live', t: 0 };
  const swarm = document.getElementById('swarm');

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
        s.chars = Array.from(text).map((c) => { const sp = mk('span', 'ch', s.el); sp.textContent = c; return sp; });
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
      anchor(s) { const r = docRect(s.chars[0]); return { x: r.x - 10, y: r.y + r.h / 2, top: r.y, side: 'left' }; },
      point(s, p) {
        const ref = s.caret.parentNode ? s.caret : s.chars[Math.max(0, s.shown - 1)];
        const r = docRect(ref);
        return { x: r.x + r.w + 2, y: r.y + r.h * 0.85 };
      },
    },
    fill: {
      reveal: 'start',
      apply(s, p) { s.el.style.setProperty('--fill', EASE.out(clamp(p, 0, 1)).toFixed(3)); },
      chip(s) { return 'background: ' + (s.opts.label || '#62E8C8'); },
    },
    glass: {
      reveal: 'start',
      init(s) { s.blur = +s.el.dataset.blur || 18; s.sat = +s.el.dataset.sat || 1.5; s.now = [0, 1]; },
      apply(s, p) {
        const e = EASE.inOut(clamp(p, 0, 1));
        s.now = [s.blur * e, 1 + (s.sat - 1) * e];
        s.el.style.setProperty('--blur', s.now[0].toFixed(1) + 'px');
        s.el.style.setProperty('--sat', s.now[1].toFixed(2));
      },
      chip(s) { return 'backdrop-filter: blur(' + Math.round(s.now[0]) + 'px) saturate(' + s.now[1].toFixed(1) + ')'; },
    },
    img: {
      reveal: 'start',
      init(s) { s.img = s.el.querySelector('img, video'); s.file = s.img.getAttribute('src').split('/').pop(); },
      apply(s, p) { s.el.style.setProperty('--reveal', EASE.inOut(clamp(p, 0, 1)).toFixed(3)); },
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
      point(s) { const r = docRect(s.num); return { x: r.x + r.w + 4, y: r.y + r.h * 0.7 }; },
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
      if (!s.opts.noChip && (s.kind !== 'fn' || s.opts.chip)) {
        s.chipEl = mk('div', 'chip');
        s.chipEl.style.background = s.agent.color;
        s.chipEl.style.display = 'none';
      }
    });
    S.elems.forEach((steps, el) => {
      const has = (k) => steps.some((s) => s.kind === k);
      el.style.setProperty('--fill', has('fill') ? '0' : '1');
      el.style.setProperty('--reveal', has('img') ? '0' : '1');
      if (has('glass')) { el.style.setProperty('--blur', '0px'); el.style.setProperty('--sat', '1'); }
      else if (el.dataset.blur) el.style.setProperty('--blur', el.dataset.blur + 'px');
    });
    document.querySelectorAll('[data-b]').forEach((el) => {
      if (!S.elems.has(el)) el.style.setProperty('--vis', '1');
    });
    S.agents.forEach((a) => a.steps.sort((x, y) => x.at - y.at));
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
    const r = rects.get(s.el) || docRect(s.el);
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

  function render(t) {
    S.t = t;
    if (S.mode === 'live') {
      S.sections.forEach((sec) => {
        if (sec.trig != null) return;
        const r = sec.el.getBoundingClientRect();
        if (visibleShare(r.top, r.height, window.innerHeight) >= TRIGGER_FRAC) sec.trig = t;
      });
    } else {
      S.sections.forEach((sec) => { sec.trig = sec.demoTrig != null && sec.demoTrig <= t ? sec.demoTrig : null; });
    }
    // 1) writes: element state
    S.elems.forEach((steps, el) => {
      let vis = 0;
      steps.forEach((s) => {
        const p = prog(s, t);
        const k = KINDS[s.kind];
        if (k.apply) k.apply(s, p, t);
        if ((k.reveal === 'end' && p >= 1) || (k.reveal === 'start' && p > 0)) vis = 1;
      });
      el.style.setProperty('--vis', String(vis));
    });
    // 2) reads: rects of everything that is on stage
    const rects = new Map();
    S.elems.forEach((steps, el) => { if (steps[0].sec.trig != null) rects.set(el, docRect(el)); });
    S.work = {};
    S.agents.forEach((a) => { const w = workOf(a, t, rects); if (w) S.work[a.id] = w; });
    S.hooks.forEach((fn) => fn(t));
    // 3) writes: overlay
    const stack = new Map();
    S.steps.forEach((s) => {
      const a = life(s, t);
      const r = rects.get(s.el);
      if (s.bx) {
        if (a > 0 && r) {
          const [w, h] = KINDS.box.size(s, prog(s, t), r);
          s.bx.style.display = 'block';
          s.bx.style.opacity = a.toFixed(3);
          s.bx.style.transform = 'translate(' + r.x + 'px,' + r.y + 'px)';
          s.bx.style.width = w + 'px';
          s.bx.style.height = h + 'px';
        } else s.bx.style.display = 'none';
      }
      if (!s.chipEl) return;
      if (a <= 0 || !r) { s.chipEl.style.display = 'none'; return; }
      const k = KINDS[s.kind];
      const anc = k.anchor ? k.anchor(s, r) : r;
      const n = stack.get(s.el) || 0;
      stack.set(s.el, n + 1);
      const txt = k.chip(s, prog(s, t), r);
      if (s.chipEl.textContent !== txt) s.chipEl.textContent = txt;
      s.chipEl.style.display = 'block';
      s.chipEl.style.opacity = a.toFixed(3);
      let x = anc.x;
      let y = anc.y - 23 - n * 22;
      if (anc.side === 'left') {
        const w = s.chipEl.offsetWidth;
        if (anc.x - w > 8) { x = anc.x - w; y = anc.y - 10 + n * 22; }
        else { x = anc.x + 10; y = anc.top - 23 - n * 22; }
      }
      // keep the whole chip on screen (narrow phones), measured instead of a fixed 260 px
      x = Math.max(4, Math.min(x, document.documentElement.clientWidth - s.chipEl.offsetWidth - 4));
      s.chipEl.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
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
      const t0 = performance.now();
      const loop = (now) => { render((now - t0) / 1000); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
      api.ready = true;
    });
  }

  window.APEngine = {
    agents, section, start: boot, EASE,
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
