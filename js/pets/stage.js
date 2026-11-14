/* Vumikio Pets on the web - the stage: all five pets float over the page like over the app.
   Behaviour follows the app: PetMovementController.kt (floating, new course every ~4 s, bouncing
   off the edges, pace by mood), PetOverlay.kt (drag with lean, tap -> speech bubble, double tap ->
   trick), TouchGaze + PetMath.gazeToward/easeGaze (eyes follow the pointer), PetSpeechBubble.kt.
   Independent of the landing page: needs only a #pets layer and window.VPPets.renderers.
   Time comes from the page (APEngine.onFrame) so demo videos stay reproducible. */
(function () {
  'use strict';
  const { DrawScope, C } = window.VPCompose;
  const A = window.VPAnim;
  const R = window.VPPets.renderers;
  const S = window.VPSpeech;

  const DENSITY = 3;                       // the app draws in device pixels; xxhdpi
  const ORDER = ['octo', 'melo', 'benny', 'foxy', 'chip'];
  const MOODS = ['HAPPY', 'DANCING', 'EXCITED', 'RELAXED', 'DANCING'];
  const HEAD_Y = { octo: 0.35, melo: 0.42, foxy: 0.42, benny: 0.40, chip: 0.42 };     // PetOverlay headAnchorY
  const SPEED = { SLEEPING: 0, TIRED: 0.2, HUNGRY: 0.4, RELAXED: 0.5, HAPPY: 0.8, EATING: 0.3, EXCITED: 1.5, DANCING: 1.2 };
  const TRICK_ACTIVE_MS = 2500;
  const BPM = 120;
  const ACCENT = C(0xFF62E8C8);
  const INDICATOR = [C(0xFF00E5FF), C(0xFFFF00FF), C(0xFFFFD700), C(0xFF00FF66)];

  // #vpPets where the page already uses id="pets" (the handbook has a chapter with that id)
  const layer = document.getElementById('vpPets') || document.getElementById('pets');
  if (!layer || !R) return;
  // demo running (the page drops the class when the visitor takes over)
  const isDemo = () => document.documentElement.classList.contains('demo');
  const WORK_SCALE = 0.82;   // a little smaller while building, so the work stays visible
  let rnd = A.rng(7);
  // pet box in CSS px: the app's sizes (Klein 80 / Mittel 110 / Gross 140 dp) by screen width;
  // a phone held sideways is wide but low, so its height counts too (twice the height)
  const boxFor = () => {
    const s = Math.min(window.innerWidth, window.innerHeight * 2);
    return s < 700 ? 80 : s < 1200 ? 110 : 150;
  };
  let boxCss = boxFor();
  const pets = [];
  let pointer = { x: 0, y: 0, at: -1e9, down: false };
  let dragged = null;
  let lastT = null;
  let bubble = null;

  function bands(t, out) {
    const beat = t * 2;
    const kick = Math.exp(-6 * (beat - Math.floor(beat)));
    // like real music: strong lows, quiet highs (loud fake treble made Benny's ears cross)
    for (let i = 0; i < 8; i++) {
      const w = 0.5 + 0.5 * Math.sin(t * 2.3 + i * 0.55) * Math.sin(t * 1.1 + i * 0.17);
      out[i] = Math.min(1, (0.08 + 0.38 * w) * (1 - i * 0.09) + 0.42 * kick * Math.max(0, 1 - i / 3));
    }
    return out;
  }

  function build() {
    boxCss = boxFor();
    const w = window.innerWidth;
    const h = window.innerHeight;
    ORDER.filter((k) => R[k]).forEach((key, i) => {
      const el = document.createElement('div');
      el.className = 'pet';
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', R[key].name + ' – antippen zum Reden, doppelt antippen für einen Trick');
      const cv = document.createElement('canvas');
      el.appendChild(cv);
      layer.appendChild(el);
      const ang = rnd() * Math.PI * 2;
      const p = {
        key, r: R[key], el, cv, mem: R[key].create(),
        x: w * (0.12 + i * 0.19) - boxCss / 2, y: h * (0.55 + rnd() * 0.25),
        vx: Math.cos(ang) * 0.8, vy: Math.sin(ang) * 0.8, tx: Math.cos(ang), ty: Math.sin(ang),
        dirTimer: Math.floor(rnd() * 120), floatPhase: rnd() * 6, acc: 0,
        mood: MOODS[i], born: null, trick: null, gx: 0, gy: 0, lean: 0, wants: false,
        indicator: INDICATOR[i % INDICATOR.length], bands: new Float32Array(8), lastBeat: -1,
      };
      bindInput(p);
      pets.push(p);
    });
    sizeCanvases();
  }

  function sizeCanvases() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    pets.forEach((p) => {
      p.el.style.width = boxCss + 'px';
      p.el.style.height = boxCss + 'px';
      p.cv.width = Math.round(boxCss * 3 * dpr);
      p.cv.height = Math.round(boxCss * 3 * dpr);
      p.cv.style.width = boxCss * 3 + 'px';
      p.cv.style.height = boxCss * 3 + 'px';
      p.dpr = dpr;
    });
  }

  // ---------- movement (PetMovementController.update at 30 fps, device px -> CSS px) ----------
  function step(p) {
    const speedMul = SPEED[p.mood] != null ? SPEED[p.mood] : 0.8;
    const amp = 0.45;
    const speed = (0.6 + amp * 1.5) * speedMul / DENSITY * 2.2;   // larger screen than a phone
    p.dirTimer++;
    if (p.dirTimer >= 120) {
      p.dirTimer = 0;
      const a = rnd() * Math.PI * 2;
      p.tx = Math.cos(a); p.ty = Math.sin(a);
    }
    let len = Math.hypot(p.vx, p.vy) || 1;
    let dx = (p.vx / len) * 0.95 + p.tx * 0.05;
    let dy = (p.vy / len) * 0.95 + p.ty * 0.05;
    len = Math.hypot(dx, dy) || 1;
    p.vx = (dx / len) * speed; p.vy = (dy / len) * speed;
    p.floatPhase += 0.05;
    let nx = p.x + p.vx;
    let ny = p.y + p.vy + Math.sin(p.floatPhase) * 0.5 / DENSITY * 2;
    const pad = boxCss * 0.1;
    const maxX = window.innerWidth - boxCss - pad;
    const maxY = window.innerHeight - boxCss - pad;
    if (nx < pad || nx > maxX) { p.vx = -p.vx; p.tx = -p.tx; nx = Math.min(maxX, Math.max(pad, nx)); }
    if (ny < pad + 60 || ny > maxY) { p.vy = -p.vy; p.ty = -p.ty; ny = Math.min(maxY, Math.max(pad + 60, ny)); }
    p.x = nx; p.y = ny;
  }

  // ---------- input ----------
  function bindInput(p) {
    let start = null;
    let lastTap = 0;
    let tapTimer = null;
    p.el.addEventListener('pointerdown', (e) => {
      start = { x: e.clientX, y: e.clientY, px: p.x, py: p.y, moved: false };
      p.el.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    p.el.addEventListener('pointermove', (e) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (!start.moved && Math.hypot(dx, dy) < 6) return;
      start.moved = true;
      dragged = p;
      p.lean = Math.max(-14, Math.min(14, -(e.movementX || 0) * 1.6));
      p.x = Math.min(window.innerWidth - boxCss, Math.max(0, start.px + dx));
      p.y = Math.min(window.innerHeight - boxCss, Math.max(0, start.py + dy));
    });
    const up = () => {
      if (!start) return;
      const wasDrag = start.moved;
      start = null;
      p.lean = 0;
      if (dragged === p) dragged = null;
      if (wasDrag) return;
      const now = performance.now();
      // like detectTapGestures: a single tap waits for the double-tap timeout
      if (now - lastTap < 300) { clearTimeout(tapTimer); lastTap = 0; doubleTap(p); return; }
      lastTap = now;
      tapTimer = setTimeout(() => tap(p), 300);
    };
    p.el.addEventListener('pointerup', up);
    p.el.addEventListener('pointercancel', up);
  }

  window.addEventListener('pointermove', (e) => { pointer = { x: e.clientX, y: e.clientY, at: performance.now(), down: e.buttons > 0 }; });
  window.addEventListener('resize', () => { boxCss = boxFor(); sizeCanvases(); });

  function tap(p) {
    p.wants = false;
    say(p, S.moodLine(p.key, p.mood, BPM, rnd));
  }

  function doubleTap(p) {
    const i = Math.floor(rnd() * p.r.tricks.length);
    p.trick = { type: p.r.tricks[i], until: p.clock + TRICK_ACTIVE_MS };
    say(p, S.trickLine(p.key, p.r.tricks[i], i, rnd));
  }

  // ---------- speech bubble (PetSpeechBubble.kt) ----------
  function say(p, text) {
    if (!text) return;
    if (!bubble) {
      bubble = document.createElement('div');
      bubble.className = 'pet-bubble';
      layer.appendChild(bubble);
    }
    bubble.textContent = text;
    // its size only changes with the text: measured once here, not in every frame (Datei 14)
    bubble.style.scale = '1';
    bubble.bw = bubble.offsetWidth;
    bubble.bh = bubble.offsetHeight;
    bubble.owner = p;
    bubble.start = p.clock;
    bubble.until = p.clock + S.durationMs(text);
  }

  // Driven by the clock, not by CSS transitions, so the video export shows it exactly:
  // fadeIn 200 ms + springy scale-in, fadeOut 300 ms + scale to 0.8 (PetSpeechBubble.kt).
  function placeBubble() {
    if (!bubble || !bubble.owner) return;
    const p = bubble.owner;
    const age = p.clock - bubble.start;
    const gone = p.clock - bubble.until;
    if (gone > 300) { bubble.owner = null; bubble.style.opacity = '0'; return; }
    const inU = Math.min(1, age / 350);
    const springy = 1 + 2.2 * Math.pow(inU - 1, 3) + 1.2 * Math.pow(inU - 1, 2);
    const op = gone > 0 ? 1 - gone / 300 : Math.min(1, age / 200);
    const sc = gone > 0 ? 1 - 0.2 * (gone / 300) : 0.6 + 0.4 * springy;
    bubble.style.opacity = op.toFixed(3);
    bubble.style.scale = sc.toFixed(3);
    const bw = bubble.bw;
    const bh = bubble.bh;
    const pad = 16;
    const x = Math.min(window.innerWidth - bw - pad, Math.max(pad, p.x + boxCss / 2 - bw / 2));
    const above = p.y - bh - 6;
    const y = above >= pad ? above : p.y + boxCss + 6;
    bubble.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  }

  // ---------- frame ----------
  function frame(tSec) {
    const tMs = tSec * 1000;
    if (lastT == null || tMs < lastT) { reset(); lastT = tMs; }
    const dt = Math.min(64, Math.max(0, tMs - lastT));
    lastT = tMs;
    const beatIdx = Math.floor(tSec * BPM / 60);
    const demo = isDemo();
    const fresh = performance.now() - pointer.at < 1200 && !demo;
    const jobs = window.APEngine && window.APEngine.work ? window.APEngine.work() : {};
    pets.forEach((p, i) => {
      if (p.born == null) p.born = tMs;
      p.clock = tMs;
      const job = dragged === p ? null : jobs[p.key];
      let hop = false;
      if (job) {
        // Building: fly to the job - quick, like a swarm - and hover with the head just right of
        // the point being worked on (the growing corner, the caret, the scan line).
        const gx = job.pt.x - window.scrollX + boxCss * 0.2 - boxCss / 2;
        const gy = job.pt.y - window.scrollY - boxCss * HEAD_Y[p.key];
        const cx = Math.min(window.innerWidth - boxCss * 0.6, Math.max(-boxCss * 0.4, gx));
        const cy = Math.min(window.innerHeight - boxCss * 0.6, Math.max(-boxCss * 0.4, gy));
        const k = 1 - Math.exp(-dt / 70);
        const nx = p.x + (cx - p.x) * k;
        const ny = p.y + (cy - p.y) * k;
        p.lean = Math.max(-16, Math.min(16, -(nx - p.x) * 0.9));
        p.vx = (nx - p.x) / Math.max(1, dt / 33.3);
        p.vy = (ny - p.y) / Math.max(1, dt / 33.3);
        p.x = nx; p.y = ny;
        if (job.since !== p.jobSince) { p.jobSince = job.since; hop = true; }
        p.working = true;
      } else {
        if (p.working) {
          // back to floating, carrying on in the direction it was flying
          p.working = false;
          p.lean = 0;
          const v = Math.hypot(p.vx, p.vy) || 1;
          p.vx = p.vx / v; p.vy = p.vy / v; p.tx = p.vx; p.ty = p.vy;
        }
        if (dragged !== p) {
          p.acc += dt;
          while (p.acc >= 1000 / 30) { step(p); p.acc -= 1000 / 30; }
        }
      }
      p.scale = (p.scale || 1) + ((p.working ? WORK_SCALE : 1) - (p.scale || 1)) * Math.min(1, dt / 180);
      // what to look at: the job, else the pointer, else the pet being dragged, else ahead
      const eyesX = p.x + boxCss / 2;
      const eyesY = p.y + boxCss * HEAD_Y[p.key];
      let tx = 0;
      let ty = 0;
      const target = job ? { x: job.pt.x - window.scrollX, y: job.pt.y - window.scrollY }
        : fresh ? pointer : dragged && dragged !== p ? { x: dragged.x + boxCss / 2, y: dragged.y + boxCss / 2 } : null;
      if (target) {
        const dx = target.x - eyesX;
        const dy = target.y - eyesY;
        const d = Math.hypot(dx, dy);
        if (d >= 0.5) { const s = Math.min(1, d / boxCss); tx = dx / d * s; ty = dy / d * s; }
      }
      const k = Math.min(1, 0.12 * (dt / 16.67));
      p.gx += (tx - p.gx) * k;
      p.gy += (ty - p.gy) * k;
      // now and then a pet wants to say something (the dot invites a tap)
      if (!p.wants && !demo && !p.working && rnd() < dt / 40000 / pets.length) p.wants = true;
      if (p.trick && tMs > p.trick.until) p.trick = null;
      const input = {
        frequencyBands: bands(tSec + i * 0.37, p.bands), amplitude: 0.45 + 0.25 * p.bands[0],
        // busy builders are excited and give a little hop with every new job
        mood: p.working ? 'EXCITED' : p.mood, beatDetected: beatIdx !== p.lastBeat || hop, energy: 90, wantsToSpeak: p.wants,
        speakIndicatorColor: p.indicator, accentColor: ACCENT, genre: '', isBirthday: false, nightDimFactor: 1,
        trickActive: !!p.trick, trickType: p.trick ? p.trick.type : p.r.tricks[0],
        gazeX: p.gx, gazeY: p.gy, forcedYawn: false, tempoScale: 1, blubbert: false,
      };
      p.lastBeat = beatIdx;
      draw(p, input, tMs - p.born, dt);
      p.el.style.transform = 'translate(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px) rotate(' +
        p.lean.toFixed(2) + 'deg) scale(' + p.scale.toFixed(3) + ')';
    });
    if (demo) script(tMs);
    placeBubble();
  }

  function draw(p, input, now, dt) {
    const ctx = p.cv.getContext('2d');
    const logical = boxCss * DENSITY;
    const k = (boxCss * p.dpr) / logical;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, p.cv.width, p.cv.height);
    ctx.setTransform(k, 0, 0, k, boxCss * p.dpr, boxCss * p.dpr);
    p.r.draw(new DrawScope(ctx, logical, logical), p.mem, input, now, dt);
  }

  function reset() {
    rnd = A.rng(7);
    pets.forEach((p, i) => {
      p.mem = p.r.create();
      p.born = null; p.trick = null; p.wants = false; p.acc = 0; p.lastBeat = -1;
      p.working = false; p.scale = 1; p.lean = 0; p.jobSince = undefined;
      p.x = window.innerWidth * (0.12 + i * 0.19) - boxCss / 2;
      p.y = window.innerHeight * (0.55 + rnd() * 0.25);
    });
    if (bubble) { bubble.owner = null; bubble.style.opacity = '0'; }
    scriptIdx = 0;
    finaleDone = false;
  }

  // In the demo video the pets show off on their own: a trick here, a line there.
  let scriptIdx = 0;
  // Finale of the 30 s demo: on the last big hit of the song "Neon-Baustelle" (25.0 s) all five
  // pets do a trick at once.
  // (the engine knows which demo runs - the start page runs the 30 s demo without ?demo=30)
  const FINALE_MS = window.APEngine && window.APEngine.demoName === '30'
    ? ((window.APLang && window.APLang.finaleMs) || 25000) : null;   // English song: 25.2 s
  let finaleDone = false;
  function script(tMs) {
    if (FINALE_MS != null && !finaleDone && tMs >= FINALE_MS) {
      finaleDone = true;
      pets.forEach((p) => { if (!p.working) doubleTap(p); });
      return;
    }
    const at = 2600 + scriptIdx * 2300;
    if (tMs < at) return;
    // only a pet that is not building right now; if all are busy, try again a little later
    const free = pets.filter((q) => !q.working);
    if (!free.length) return;
    const p = free[scriptIdx % free.length];
    if (scriptIdx % 2 === 0) doubleTap(p); else tap(p);
    scriptIdx++;
  }

  build();
  if (window.APEngine) window.APEngine.onFrame(frame);
  else { const t0 = performance.now(); const loop = (n) => { frame((n - t0) / 1000); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }

  window.VPStage = {
    hide(on) { layer.style.display = on ? 'none' : ''; },
  };
})();
