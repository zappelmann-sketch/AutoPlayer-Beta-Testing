/* Handbook prototype - the Vumikio Pets live on the page and build what you jump to.

   Jumping means: a click in the table of contents, the "↑ Inhalt" button of a chapter, a link in
   the text, or an address with #chapter. Then
     1. the pets fly along in formation while the page scrolls there (a chip counts the distance),
     2. they build what is on screen at the destination:
        - a chapter from top to bottom: Melo types the headings, Benny lets the text appear line by
          line, Octo pulls up the picture frames and scans the screenshots in, Chip sets the list
          points, Foxy turns tables and boxes into glass;
        - the table of contents from the jump mark outwards, all five pets taking turns.
   Wheel, touch, a key or a click finish a flight or a jump build at once.
   Scrolling builds as well (Kay 08.11.2026): whatever comes into view - title and introduction when
   the page loads, then the table of contents and chapter after chapter, down and up again - is built
   by the same pets with the same steps. The steps come from the page itself - no chapter needs a
   hand-made choreography.

   Two switches in the handbook's own bar at the bottom: "Pets: an/aus" and "Animation: an/aus".
   Animation off = the classic handbook (instant jumps, the original smooth scroll back to the
   contents). The choice is kept in the address (?pets=aus, ?bau=aus) - no cookie, no storage.

   Talks to js/pets/stage.js (shared with the landing page) through the same small interface as the
   landing page engine: APEngine.onFrame(cb) and APEngine.work(). */
(function () {
  'use strict';
  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PETS = ['octo', 'melo', 'benny', 'foxy', 'chip'];
  const COLOR = { octo: '#4fe3ff', melo: '#c4a8ff', benny: '#ff9ccf', foxy: '#ff9a52', chip: '#ffd666' };
  const MAX_TOTAL = 4.2;     // a chapter screen is built in at most this many seconds
  const MAX_TOC = 2.6;       // the table of contents around the jump mark
  const LINGER = 0.6;        // frames and chips stay a moment after their step
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

  // ---------- settings (address only) ----------
  const query = new URLSearchParams(location.search);
  let petsOn = query.get('pets') !== 'aus';
  const BAU_DEFAULT = !REDUCE;
  let bauOn = query.has('bau') ? query.get('bau') !== 'aus' : BAU_DEFAULT;
  let lang = /[?&]lang=en(&|$)/.test(location.search) || location.hash.indexOf('#en-') === 0 ? 'en' : 'de';

  const TEXT = {
    de: {
      pets: 'Pets', bau: 'Animation', on: 'an', off: 'aus',
      petHint: 'Vumikio Pets ein- oder ausblenden. Antippen = reden · doppelt = Trick · ziehen = mitnehmen',
      bauHint: 'Die Pets bauen auf, was ins Bild kommt – beim Scrollen und nach jedem Sprung, zu dem sie mitfliegen. Aus = klassisch.',
      read: 'Vorlesen · ',
    },
    en: {
      pets: 'Pets', bau: 'Animation', on: 'on', off: 'off',
      petHint: 'Show or hide the Vumikio Pets. Tap = talk · double-tap = trick · drag = take along',
      bauHint: 'The pets build whatever comes into view – while you scroll and after every jump they fly along to. Off = classic.',
      read: 'audio · ',
    },
  };
  const T = (k) => TEXT[lang][k];

  // ---------- the pets' sentences in the language of the page ----------
  const loadedPools = {};
  function loadPool(l) {
    if (loadedPools[l]) { if (window.VPPets && loadedPools[l].texts) window.VPPets.texts = loadedPools[l].texts; return; }
    const s = document.createElement('script');
    s.src = '../js/pets/texts_' + l + '.js';
    s.onload = () => { loadedPools[l] = { texts: window.VPPets && window.VPPets.texts }; };
    loadedPools[l] = {};
    document.head.appendChild(s);
  }
  loadPool(lang);

  // ---------- clock for the pets ----------
  const hooks = [];
  const t0 = performance.now();
  const clock = () => (performance.now() - t0) / 1000;
  const layer = document.getElementById('swarm');
  let jobs = [];
  let flight = null;
  let buildId = 0;
  let lastBuildAt = -1e9;
  let armedAt = 0;

  window.APEngine = {
    onFrame(cb) { hooks.push(cb); },
    work() { return work(clock()); },
  };

  // ---------- what a chapter is made of ----------
  const KIND = {
    type: { pet: 'melo', dur: (el) => Math.min(0.75, 0.22 + el.textContent.trim().length * 0.012) },
    bar: { pet: 'chip', dur: () => 0.35 },
    lines: { pet: 'benny', dur: (el) => Math.min(0.8, 0.3 + el.textContent.length * 0.0012) },
    item: { pet: 'chip', dur: () => 0.3 },
    figure: { pet: 'octo', dur: () => 1.1 },
    table: { pet: 'foxy', dur: () => 0.8 },
    glass: { pet: 'foxy', dur: () => 0.45 },
  };

  function blocksOf(root, out) {
    for (const el of root.children) {
      if (el.matches('script, style')) continue;
      if (el.matches('h2, h3, h4, h5')) out.push([el, 'type']);
      else if (el.matches('.vorlese-leiste')) out.push([el, 'bar']);
      else if (el.matches('figure')) out.push([el, 'figure']);
      else if (el.matches('.bildreihe')) blocksOf(el, out);
      else if (el.matches('ol, ul')) { for (const li of el.children) out.push([li, 'item']); }
      else if (el.matches('.tab-huelle, table')) out.push([el, 'table']);
      else if (el.matches('.hinweis, .achtung')) { out.push([el, 'glass']); blocksOf(el, out); }
      else out.push([el, 'lines']);
    }
    return out;
  }

  // the table of contents: its heading, every area name and every chapter entry
  function tocBlocks(nav) {
    const out = [];
    const h = nav.querySelector(':scope > h2');
    if (h) out.push([h, 'type']);
    nav.querySelectorAll(':scope > ol > li').forEach((area) => {
      const a = area.querySelector(':scope > a');
      if (a) out.push([a, 'type']);
      area.querySelectorAll(':scope > ol > li').forEach((li) => out.push([li, 'item']));
    });
    return out;
  }

  function nextArticle(el) {
    let n = el.nextElementSibling;
    while (n && !n.matches('article, h2')) n = n.nextElementSibling;
    return n && n.matches('article') ? n : null;
  }

  // on screen when the page stands at scroll position `at` (the destination of a flight)
  const onScreen = (el, at) => {
    const r = el.getBoundingClientRect();
    const top = r.top + window.scrollY - at;
    return r.height > 0 && top < window.innerHeight * 1.02 && top + r.height > 0;
  };
  const centre = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };

  // ---------- one build ----------
  // Planned when the jump starts: what will be on screen at the destination is hidden at once (it
  // is not on screen yet), its screenshots load during the flight - so on arrival nothing flashes.
  function plan(target, at) {
    if (!bauOn || !target || target.closest('main[hidden]')) return null;
    finishAll();
    lastBuildAt = performance.now();
    const nav = target.closest('nav.inhalt');
    const p = nav ? planToc(nav, target, at) : planChapter(target, at);
    if (!p || !p.length) return null;
    p.forEach(prepare);
    jobs = p.slice();   // a copy: the scroll build adds its parts to `jobs`, never to this plan
    p.forEach((j) => { const img = j.kind === 'figure' && j.el.querySelector('img'); if (img) img.loading = 'eager'; });
    return p;
  }

  // the build starts once its screenshots are there (at most 0.8 s more)
  function start(p) {
    if (!p) return;
    const my = buildId;
    const imgs = p.filter((j) => j.kind === 'figure').map((j) => j.el.querySelector('img')).filter(Boolean);
    Promise.race([Promise.all(imgs.map((img) => img.decode().catch(() => {}))), sleep(800)]).then(() => {
      if (my !== buildId || !jobs.includes(p[0])) return;
      const t = clock() + 0.08;
      p.forEach((j) => { j.start = t + j.at; });
      armedAt = performance.now();
    });
  }

  const build = (target) => start(plan(target, window.scrollY));

  function planChapter(target, dest) {
    let list = [];
    let root = target.closest('article');
    if (target.matches('h2.kategorie')) { list.push([target, 'type']); root = nextArticle(target); }
    if (root) blocksOf(root, list);
    list = list.filter(([el]) => onScreen(el, dest));
    // one block after the other, each starting when the one before is half done
    let at = 0;
    const plan = list.map(([el, kind]) => {
      const job = { el, kind, pet: KIND[kind].pet, at, dur: KIND[kind].dur(el), start: null, parts: {} };
      at += job.dur * 0.5;
      return job;
    });
    return squeeze(plan, MAX_TOTAL);
  }

  // around the jump mark: nearest entries first, outwards; the pets take turns
  function planToc(nav, target, dest) {
    const mark = target === nav ? null : target;
    const c = mark ? centre(mark) : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const list = tocBlocks(nav).filter(([el]) => onScreen(el, dest));
    const dist = (el) => { const p = centre(el); return Math.hypot((p.x - c.x) * 0.6, p.y - c.y) - (el === mark || el.contains(mark) ? 1e6 : 0); };
    list.sort((a, b) => dist(a[0]) - dist(b[0]));
    const plan = list.map(([el, kind], i) => {
      const dur = kind === 'type' ? Math.min(0.5, KIND.type.dur(el)) : 0.26;
      return { el, kind, pet: PETS[(i + 4) % 5], at: i * 0.075, dur, start: null, parts: {} };
    });
    return squeeze(plan, MAX_TOC);
  }

  function squeeze(plan, max) {
    if (!plan.length) return plan;
    const total = Math.max(...plan.map((j) => j.at + j.dur));
    if (total > max) {
      const k = max / total;
      plan.forEach((j) => { j.at *= k; j.dur *= Math.max(k, 0.6); });
    }
    return plan;
  }

  // hidden state before a block's turn: until its step starts it is simply invisible (kb-wait); its
  // effect class (mask, clip, fade, blur of a screenshot) comes with the step - effects cost the browser
  // work on every frame even when nothing of them can be seen
  function prepare(j) {
    j.el.classList.add('kb', 'kb-wait');
    const s = j.el.style;
    if (j.kind === 'type') s.setProperty('--kb-r', '100%');
    else if (j.kind === 'figure') { s.setProperty('--f', '0'); s.setProperty('--r', '0'); s.setProperty('--c', '0'); }
    else s.setProperty('--p', '0');
  }

  function cleanup(j) {
    j.el.classList.remove('kb', 'kb-wait', 'kb-' + j.kind);
    ['--p', '--kb-r', '--f', '--r', '--c'].forEach((v) => j.el.style.removeProperty(v));
    Object.values(j.parts).forEach((n) => n.remove());
    j.done = true;
  }

  function finishAll() {
    buildId++;
    jobs.forEach((j) => { if (!j.done) cleanup(j); });
    jobs = [];
    units.forEach((u) => { u.jobs = []; u.state = 'idle'; });
  }

  // only the jump build (wheel, touch, a key or a click end it); the scroll build keeps going -
  // scrolling is exactly what drives it
  function finishJump() {
    buildId++;
    jobs.forEach((j) => { if (!j.done && !j.src) cleanup(j); });
    jobs = jobs.filter((j) => !j.done);
  }

  // ---------- building while you scroll (Kay 07./08.11.2026) ----------
  // The page is cut into parts: every heading, paragraph, list point, picture, table, box frame and
  // contents entry on its own; the title as a whole. A part that is out of view but at most one screen
  // away is hidden in advance (nobody sees
  // that); when it scrolls in, the pets build it. Built parts that leave the view are hidden again, so
  // scrolling back builds them once more - down and up, from the title to the footer. Parts that come
  // into view at the same moment build one after the other, top to bottom.
  // A part that shows up without having been hidden first (a jump of the browser: End key, the
  // scrollbar, find in page) simply stays as it is - better than a flash. While the pets fly to a
  // jump target, scrolling builds nothing; what the jump build covers belongs to the jump build.
  const MAX_BOX = 3.0;         // the title with logo and the line below it
  const MAX_BATCH = 5.0;       // all parts that come into view at the same moment
  const MAX_WAIT = 0.9;        // a part never waits longer for the parts before it
  let units = [];
  let nearList = [];
  let tocTurn = 0;
  let frame = 0;
  // where the parts are on the page (page coordinates), measured once and again only when the page
  // changes its size - an IntersectionObserver for 4,000 parts cost more per frame than all the rest
  let geoKey = '';
  let geoAt = -1e9;

  const unit = (el, blocks, toc, parent) => ({ el, blocks, toc: !!toc, parent: parent || null, i: 0, top: 0, bottom: 0, seen: 0, state: 'idle', jobs: [], gap: 0, next: 0 });

  // the title as one part: logo, heading, the line below it
  function titleBlocks(el) {
    const list = [];
    const logo = el.querySelector('.app-logo');
    const h1 = el.querySelector('h1');
    const unter = el.querySelector('.unter');
    if (logo) list.push([logo, 'item']);
    if (h1) list.push([h1, 'type']);
    if (unter) list.push([unter, 'lines']);
    return list;
  }

  // A box (hint, warning) is a part of its own - frame and glass - and so is everything inside it; on a
  // phone a box can be taller than the screen, so what is inside builds when it comes into view, never
  // before its box.
  function chapterUnits(root, out, parent) {
    for (const el of root.children) {
      if (el.matches('script, style')) continue;
      if (el.matches('.bildreihe')) chapterUnits(el, out, parent);
      else if (el.matches('ol, ul')) { for (const li of el.children) out.push(unit(li, [[li, 'item']], false, parent)); }
      else if (el.matches('.hinweis, .achtung')) {
        const box = unit(el, [[el, 'glass']], false, parent);
        out.push(box);
        chapterUnits(el, out, box);
      } else out.push(unit(el, blocksOf({ children: [el] }, []), false, parent));
    }
    return out;
  }

  // all parts of the language version on screen, in page order
  function pageUnits() {
    const main = document.querySelector('main.sprache:not([hidden])');
    const out = [];
    if (!main) return out;
    for (const el of main.children) {
      if (el.matches('script, style')) continue;
      if (el.matches('header.titel')) out.push(unit(el, titleBlocks(el)));
      else if (el.matches('nav.inhalt')) tocBlocks(el).forEach((b) => out.push(unit(b[0], [b], true)));
      else if (el.matches('article')) chapterUnits(el, out);
      else chapterUnits({ children: [el] }, out);
    }
    const list = out.filter((u) => u.blocks.length);
    list.forEach((u, i) => { u.i = i; });
    return list;
  }

  // a part's steps relative to its own start, and how long the next part waits for it
  function unitJobs(u) {
    if (u.toc) {   // contents entries: short steps, the pets take turns
      const [el, kind] = u.blocks[0];
      u.gap = 0.075;
      const dur = kind === 'type' ? Math.min(0.5, KIND.type.dur(el)) : 0.26;
      return [{ el, kind, pet: PETS[tocTurn++ % 5], at: 0, dur, start: null, parts: {}, src: 'scroll' }];
    }
    let at = 0;
    const p = u.blocks.map(([el, kind]) => {
      const job = { el, kind, pet: KIND[kind].pet, at, dur: KIND[kind].dur(el), start: null, parts: {}, src: 'scroll' };
      at += job.dur * 0.5;
      return job;
    });
    squeeze(p, MAX_BOX);
    const span = Math.max(...p.map((j) => j.at + j.dur));
    u.gap = span * (p.length > 1 ? 0.6 : 0.5);
    return p;
  }

  // hidden, waiting to come into view
  function ready(u) {
    u.jobs = unitJobs(u);
    u.jobs.forEach(prepare);
    jobs.push(...u.jobs);
    u.state = 'ready';
  }

  // back to the finished page
  function release(u) {
    u.jobs.forEach((j) => { if (!j.done) cleanup(j); });
    u.jobs = [];
    u.state = 'idle';
  }

  // the jump build has it (its blocks are hidden or building, but not by this unit)
  const owned = (u) => u.blocks.some(([el]) => el.classList.contains('kb'));

  // page positions of all parts, again when the page has changed its size (pictures, fonts, window)
  function measure(force) {
    const key = document.documentElement.scrollHeight + 'x' + window.innerWidth;
    if (!force && (key === geoKey || performance.now() - geoAt < 200)) return;
    geoKey = key;
    geoAt = performance.now();
    const y = window.scrollY;
    for (const u of units) {
      const r = u.el.getBoundingClientRect();
      u.top = r.top + y;
      u.bottom = r.height > 0 ? r.bottom + y : -1e9;   // nothing to see (hidden): never near
    }
  }

  // the parts at most one screen above or below the view; returns the ones that dropped out (they go
  // back to the finished page)
  function nearNow() {
    measure(false);
    frame++;
    const vh = window.innerHeight;
    const from = window.scrollY - vh;
    const to = window.scrollY + vh * 2;
    const list = [];
    for (const u of units) if (u.bottom > from && u.top < to) { u.seen = frame; list.push(u); }
    const drop = nearList.filter((u) => u.seen !== frame && u.state !== 'idle');
    nearList = list;
    return drop;
  }

  // Load and language switch: all parts of the language version on screen. buildVisible: what is on
  // screen now builds as well (on load js/frueh.js kept it hidden; after a language switch this runs
  // before the next picture).
  function setupUnits(buildVisible) {
    units.forEach((u) => { if (u.state !== 'idle') release(u); });
    units = pageUnits();
    nearList = [];
    measure(true);
    if (!bauOn) return;
    nearNow();
    const vh = window.innerHeight;
    nearList.forEach((u) => {
      const top = u.top - window.scrollY;
      if (buildVisible || u.bottom - window.scrollY <= 0 || top >= vh) ready(u);
    });
  }

  // the bar of the handbook lies over the bottom of the screen; a part starts building above it
  function usableBottom(vh) {
    if (!bar) return vh;
    const r = bar.getBoundingClientRect();
    return r.height > 0 && r.top < vh && r.top > vh * 0.5 ? r.top : vh;
  }

  function watchScroll() {
    if (!bauOn || flight) return;
    // positions from the table (no layout reads per frame); classes change only after all reads
    const drop = nearNow();
    const vh = window.innerHeight;
    const bottom = usableBottom(vh);
    const y = window.scrollY;
    drop.forEach(release);
    const now = clock();
    let chain = 0;
    const batch = [];
    for (const u of nearList) {
      if (u.state === 'idle' && owned(u)) continue;
      // built - or (safety net) its waiting steps were taken away: back to the page
      if ((u.state === 'run' && u.jobs.every((j) => j.done)) || (u.state === 'ready' && u.jobs.some((j) => j.done))) {
        release(u);
      }
      const top = u.top - y;
      const bot = u.bottom - y;
      if (bot <= 0 || top >= vh) {
        // out of view: hidden in advance, built when it comes in (again)
        if (u.state === 'run') release(u);
        if (u.state === 'idle') ready(u);
        continue;
      }
      if (u.state === 'run') { chain = Math.max(chain, u.next); continue; }
      if (u.state !== 'ready') continue;
      if (u.parent && u.parent.state === 'ready') continue;   // its box comes first
      const seen = Math.min(bot, bottom) - Math.max(top, 0);
      if (seen >= Math.min(0.3 * Math.min(bot - top, bottom), 90)) batch.push(u);
    }
    if (batch.length) schedule(batch, now, chain);
  }

  // the parts of one moment one after the other (page order); they wait for the parts still building,
  // at most MAX_WAIT
  function schedule(batch, now, chain) {
    const base = clamp(chain, now + 0.05, now + MAX_WAIT);
    const offs = [];
    const flat = [];
    let off = 0;
    for (const u of batch) {
      offs.push(off);
      u.jobs.forEach((j) => { j.at += off; flat.push(j); });
      off += u.gap;
    }
    const total = Math.max(...flat.map((j) => j.at + j.dur));
    const k = total > MAX_BATCH ? MAX_BATCH / total : 1;
    flat.forEach((j) => {
      j.at *= k;
      if (k < 1) j.dur *= Math.max(k, 0.6);
      j.start = base + j.at;
    });
    batch.forEach((u, n) => { u.state = 'run'; u.next = base + (offs[n] + u.gap) * k; });
  }

  // ---------- the flight to a jump target ----------
  function fly(to, label, done) {
    const from = window.scrollY;
    const dist = Math.abs(to - from);
    if (dist < 40) { window.scrollTo(0, to); done(); return; }
    const dur = clamp(0.5 + 0.28 * Math.log2(1 + dist / 800), 0.6, 1.7);
    flight = { from, to, start: clock(), dur, dir: Math.sign(to - from), label, done, parts: {} };
    armedAt = performance.now();
  }

  function stepFlight(t) {
    if (!flight) return;
    const p = clamp((t - flight.start) / flight.dur, 0, 1);
    window.scrollTo(0, flight.from + (flight.to - flight.from) * ease(p));
    // the chip counts down the distance that is left
    const left = Math.round(Math.abs(flight.to - window.scrollY));
    const c = part(flight, 'chip', 'chip');
    c.style.background = COLOR.octo;
    const txt = 'scrollTo(' + flight.label + ') · ' + left.toLocaleString(lang === 'en' ? 'en-US' : 'de-DE') + ' px';
    if (c.textContent !== txt) c.textContent = txt;
    c.style.opacity = '1';
    const y = window.scrollY + (flight.dir < 0 ? window.innerHeight * 0.13 : window.innerHeight * 0.83);
    place(c, window.scrollX + window.innerWidth / 2 - c.offsetWidth / 2, y);
    if (p >= 1) endFlight();
  }

  function endFlight() {
    if (!flight) return;
    const f = flight;
    flight = null;
    window.scrollTo(0, f.to);
    Object.values(f.parts).forEach((n) => n.remove());
    f.done();
  }

  // formation while flying: in a row at the leading edge, wobbling a little
  function formation(t) {
    const out = {};
    const y = window.scrollY + (flight.dir < 0 ? window.innerHeight * 0.24 : window.innerHeight * 0.7);
    PETS.forEach((pet, i) => {
      out[pet] = {
        pt: { x: window.scrollX + window.innerWidth * (0.5 + (i - 2) * 0.12), y: y + Math.sin(t * 9 + i * 1.3) * 12 },
        since: flight.start, busy: true,
      };
    });
    return out;
  }

  // ---------- drawing, every frame ----------
  function part(owner, name, cls) {
    if (!owner.parts[name]) {
      const n = document.createElement('div');
      n.className = cls;
      if (cls === 'bx') { for (let i = 0; i < 4; i++) n.appendChild(document.createElement('i')); n.style.borderColor = COLOR[owner.pet]; }
      if ((cls === 'chip' || cls === 'kb-caret') && owner.pet) n.style.background = COLOR[owner.pet];
      layer.appendChild(n);
      owner.parts[name] = n;
    }
    return owner.parts[name];
  }
  const hide = (j, name) => { if (j.parts[name]) j.parts[name].style.display = 'none'; };
  const place = (n, x, y) => { n.style.display = 'block'; n.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)'; };

  function textRect(el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getBoundingClientRect();
  }

  function chip(j, text, x, y, alpha) {
    const c = part(j, 'chip', 'chip');
    if (c.textContent !== text) c.textContent = text;
    c.style.opacity = alpha.toFixed(3);
    const w = c.offsetWidth;
    place(c, clamp(x, 4 + window.scrollX, window.scrollX + document.documentElement.clientWidth - w - 4), y);
  }

  function box(j, r, q, alpha) {
    const b = part(j, 'box', 'bx');
    b.style.opacity = alpha.toFixed(3);
    b.style.width = Math.max(2, r.width * q) + 'px';
    b.style.height = Math.max(2, r.height * q) + 'px';
    place(b, r.left + window.scrollX, r.top + window.scrollY);
  }

  function paint(t) {
    for (const j of jobs) {
      // not its turn yet: stays hidden as prepare() left it - no caret, frame or chip so far
      if (j.done || j.start == null || t < j.start) continue;
      if (!j.live) { j.live = true; j.el.classList.remove('kb-wait'); j.el.classList.add('kb-' + j.kind); }
      const p = clamp((t - j.start) / j.dur, 0, 1);
      const after = t - (j.start + j.dur);
      if (after > LINGER) { cleanup(j); continue; }
      const fade = after > 0 ? 1 - after / LINGER : clamp((t - j.start) / 0.12, 0, 1);
      const s = j.el.style;
      const r = j.el.getBoundingClientRect();
      const x0 = r.left + window.scrollX;
      const y0 = r.top + window.scrollY;
      const inToc = !!j.el.closest('nav.inhalt');
      switch (j.kind) {
        case 'type': {
          const tr = textRect(j.el);
          s.setProperty('--kb-r', Math.max(0, r.right - (tr.left + tr.width * p)) + 'px');
          const c = part(j, 'caret', 'kb-caret');
          c.style.height = Math.round(tr.height * 0.8) + 'px';
          c.style.opacity = after > 0 ? '0' : '1';
          place(c, tr.left + window.scrollX + tr.width * p, tr.top + window.scrollY + tr.height * 0.1);
          if (!inToc || j.el.tagName === 'H2') {
            const fs = parseFloat(getComputedStyle(j.el).fontSize);
            chip(j, j.el.tagName.toLowerCase() + ' · ' + Math.round(fs) + 'px', tr.left + window.scrollX, y0 - 24, fade);
          }
          break;
        }
        case 'lines': case 'item': case 'bar':
          s.setProperty('--p', p.toFixed(3));
          if (j.kind === 'bar') {
            const d = j.el.querySelector('.vorlese-dauer');
            chip(j, T('read') + (d ? d.textContent.trim() : ''), x0, y0 - 24, fade);
          }
          break;
        case 'table': case 'glass': {
          const q = clamp(p / 0.35, 0, 1);
          box(j, r, q, after > 0 ? fade : 1);
          s.setProperty('--p', clamp((p - 0.2) / 0.8, 0, 1).toFixed(3));
          if (j.kind === 'table') {
            const tb = j.el.querySelector('table') || j.el;
            const rows = tb.rows ? tb.rows.length : 0;
            const cols = rows ? tb.rows[0].cells.length : 0;
            chip(j, 'table · ' + rows + ' × ' + cols, x0, y0 - 24, fade);
          } else {
            chip(j, 'backdrop-filter: blur(' + Math.round(16 * clamp((p - 0.2) / 0.8, 0, 1)) + 'px)', x0, y0 - 24, fade);
          }
          break;
        }
        case 'figure': {
          const img = j.el.querySelector('img');
          const q = clamp(p / 0.3, 0, 1);
          const rv = clamp((p - 0.3) / 0.55, 0, 1);
          box(j, r, q, p < 0.3 ? 1 : clamp(1 - (p - 0.3) / 0.25, 0, 1));
          s.setProperty('--f', p < 0.3 ? '0' : '1');
          s.setProperty('--r', rv.toFixed(3));
          s.setProperty('--c', clamp((p - 0.85) / 0.15, 0, 1).toFixed(3));
          if (img && rv > 0 && rv < 1) {
            const ir = img.getBoundingClientRect();
            const sc = part(j, 'scan', 'kb-scan');
            sc.style.width = ir.width + 'px';
            place(sc, ir.left + window.scrollX, ir.top + window.scrollY + ir.height * rv);
          } else hide(j, 'scan');
          if (img) {
            const file = (img.getAttribute('src') || '').split('/').pop();
            chip(j, p < 0.3 ? img.naturalWidth + ' × ' + img.naturalHeight : file, x0, y0 - 24, fade);
          }
          break;
        }
        default: break;
      }
    }
    if (jobs.some((j) => j.done)) jobs = jobs.filter((j) => !j.done);
  }

  // where each pet has to be (page coordinates) - same rules as the landing page engine
  function point(j, p) {
    const r = j.el.getBoundingClientRect();
    const x0 = r.left + window.scrollX;
    const y0 = r.top + window.scrollY;
    p = clamp(p, 0, 1);
    switch (j.kind) {
      case 'type': { const tr = textRect(j.el); return { x: tr.left + window.scrollX + tr.width * p, y: tr.top + window.scrollY + tr.height * 0.55 }; }
      case 'lines': return { x: x0 + Math.min(r.width, 640) * 0.9, y: y0 + r.height * p };
      case 'item': return { x: x0 + Math.min(r.width, 520) * 0.85, y: y0 + r.height * 0.5 };
      case 'bar': return { x: x0 + r.width * 0.35, y: y0 + r.height * 0.5 };
      case 'figure':
        if (p < 0.3) { const q = p / 0.3; return { x: x0 + r.width * q, y: y0 + r.height * q }; }
        return { x: x0 + r.width - 6, y: y0 + r.height * clamp((p - 0.3) / 0.55, 0, 1) };
      default: { const q = clamp(p / 0.35, 0, 1); return { x: x0 + r.width * q, y: y0 + r.height * q }; }
    }
  }

  function work(t) {
    if (flight) return formation(t);
    const out = {};
    PETS.forEach((pet) => {
      let run = null;
      let next = null;
      let prev = null;
      for (const j of jobs) {
        if (j.pet !== pet || j.start == null || j.done) continue;
        if (j.start <= t) {
          if (t <= j.start + j.dur) { if (!run || j.start > run.start) run = j; }
          else if (!prev || j.start > prev.start) prev = j;
        } else if (!next || j.start < next.start) next = j;
      }
      if (run) out[pet] = { pt: point(run, (t - run.start) / run.dur), since: run.start, busy: true };
      else if (next) out[pet] = { pt: point(next, 0), since: prev ? prev.start : -1, busy: false };
      else if (prev && t < prev.start + prev.dur + 0.6) out[pet] = { pt: point(prev, 1), since: prev.start, busy: false };
    });
    return out;
  }

  // ---------- frame loop ----------
  function loop() {
    const t = clock();
    stepFlight(t);
    watchScroll();
    // js/frueh.js hid the top of the page until now (no flash before the first build); the parts on
    // screen are prepared by now, the others are out of view anyway
    if (root.classList.contains('kb-frueh')) root.classList.remove('kb-frueh');
    if (petsOn) hooks.forEach((h) => h(t));
    paint(t);
    requestAnimationFrame(loop);
  }
  const root = document.documentElement;
  setupUnits(root.classList.contains('kb-frueh'));
  requestAnimationFrame(loop);

  // ---------- what starts a flight and a build ----------
  function targetOf(id) {
    const el = id ? document.getElementById(id) : null;
    if (!el || el.closest('main[hidden]')) return null;
    if (el.matches('article, h2.kategorie') || el.closest('nav.inhalt')) return el;
    return el.closest('article') ? el : null;
  }
  const hashId = (h) => (h && h.length > 1 ? decodeURIComponent(h.slice(1)) : '');

  // Capture phase: before the handbook's own scripts. A chapter link is taken over completely;
  // for "↑ Inhalt" the handbook's own handler still runs (highlight, pause of the read-along) -
  // its smooth scroll is simply overtaken by the flight.
  document.addEventListener('click', (e) => {
    if (!bauOn || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
    const id = hashId(url.hash);
    const el = targetOf(id);
    if (!el) return;
    const back = a.classList.contains('inhalt-knopf');
    if (!back) e.preventDefault();
    const r = el.getBoundingClientRect();
    const inToc = !!el.closest('nav.inhalt');
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const to = clamp(window.scrollY + (inToc ? r.top + r.height / 2 - window.innerHeight / 2 : r.top), 0, max);
    const p = plan(el, to);
    fly(to, '#' + id, () => {
      if (!back && location.hash !== '#' + id) { try { history.pushState(null, '', '#' + id); } catch (err) { /* file:// quirks */ } }
      lastBuildAt = performance.now();
      start(p);
    });
  }, true);

  // back / forward, and links the click above did not take over
  window.addEventListener('hashchange', () => {
    const el = targetOf(hashId(location.hash));
    if (el && !flight && performance.now() - lastBuildAt > 400) requestAnimationFrame(() => build(el));
  });
  window.addEventListener('load', () => {
    const el = targetOf(hashId(location.hash));
    if (el) setTimeout(() => build(el), 150);
  });

  // the reader takes over: wheel, touch, a key or a click finish a flight or a build at once
  const takeOver = (e) => {
    const jumpBuild = jobs.some((j) => !j.done && !j.src);
    if ((!jumpBuild && !flight) || performance.now() - armedAt < 250) return;
    if (e.type === 'keydown' && ['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
    if (e.type === 'pointerdown' && e.target.closest && e.target.closest('.pet, #tonleiste')) return;
    if (flight) endFlight();
    finishJump();
  };
  ['wheel', 'touchmove', 'keydown'].forEach((ev) => window.addEventListener(ev, takeOver, { passive: true }));
  window.addEventListener('pointerdown', takeOver, true);

  // ---------- two switches in the handbook's own bar at the bottom ----------
  // Same look and wording as its "Mitlesen: an" / "Kette: aus" (class "ein" = switched on).
  const bar = document.getElementById('tonleiste');
  const switches = ['pets', 'bau'].map((opt) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.id = 'tl-kb-' + opt;
    b.dataset.opt = opt;
    b.className = 'kb-schalter' + (opt === 'pets' ? ' kb-erster' : '');
    if (bar) bar.appendChild(b);
    return b;
  });

  function label() {
    switches.forEach((b) => {
      const on = b.dataset.opt === 'pets' ? petsOn : bauOn;
      b.textContent = T(b.dataset.opt) + ': ' + (on ? T('on') : T('off'));
      b.classList.toggle('ein', on);
      b.setAttribute('aria-pressed', String(on));
      b.title = T(b.dataset.opt === 'pets' ? 'petHint' : 'bauHint');
    });
  }

  // the choice lives in the address, so a reload or a bookmark keeps it
  function keepInAddress() {
    const p = new URLSearchParams(location.search);
    if (petsOn) p.delete('pets'); else p.set('pets', 'aus');
    if (bauOn === BAU_DEFAULT) p.delete('bau'); else p.set('bau', bauOn ? 'an' : 'aus');
    const q = p.toString();
    try { history.replaceState(history.state, '', location.pathname + (q ? '?' + q : '') + location.hash); } catch (err) { /* file:// */ }
  }

  function applyPets() {
    if (window.VPStage) window.VPStage.hide(!petsOn);
  }

  switches.forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.opt === 'pets') { petsOn = !petsOn; applyPets(); }
    else { bauOn = !bauOn; if (!bauOn) { if (flight) endFlight(); finishAll(); } }
    label();
    keepInAddress();
  }));

  // the handbook switches German/English without reloading
  document.addEventListener('handbuch-sprache', (e) => {
    lang = e.detail === 'en' ? 'en' : 'de';
    finishAll();
    loadPool(lang);
    label();
    setTimeout(keepInAddress, 0);   // the handbook rewrites the address right after this event
    // right after this event the other language version is visible and scrolled into place; a
    // microtask still comes before the next picture - its parts are hidden in time and what is on
    // screen builds
    queueMicrotask(() => setupUnits(bauOn));
  });

  label();
  // stage.js is loaded after this file
  window.addEventListener('DOMContentLoaded', applyPets);
  if (document.readyState !== 'loading') setTimeout(applyPets, 0);
})();
