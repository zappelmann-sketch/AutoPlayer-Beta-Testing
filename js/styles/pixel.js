/* Style "Pixel-Aufbau" (Donnerstag, Kontext-Regeln) - Wochentags-Konzept Datei 05, Stil 3.
   Everything is made of 8-bit blocks that lock into place: a frame fills from a grid of blocks,
   letters snap in steps, pictures appear as a mosaic, the pets set tiles. Chips: pixels and depth. */
(function () {
  'use strict';
  const B = window.APStil;
  const E = window.APEngine;
  const clamp = B.clamp;
  const ZELLE = 14;
  const SEED = 4;

  // the order in which the blocks of a rectangle appear: fixed per element (same picture every time)
  function reihenfolge(s, n) {
    if (s.ord && s.ord.length === n) return s.ord;
    const r = B.rng(SEED * 131 + (s.at * 1000 | 0) + n);
    const o = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const x = o[i]; o[i] = o[j]; o[j] = x; }
    s.ord = o;
    return o;
  }

  function bloecke(ctx, s, x, y, w, h, anteil, farbe, alpha, zelle) {
    const z = zelle || ZELLE;
    const nx = Math.max(1, Math.ceil(w / z));
    const ny = Math.max(1, Math.ceil(h / z));
    const n = nx * ny;
    const o = reihenfolge(s, n);
    const k = Math.floor(n * clamp(anteil, 0, 1));
    ctx.fillStyle = farbe;
    ctx.globalAlpha = alpha;
    for (let i = 0; i < k; i++) {
      const c = o[i];
      ctx.fillRect(x + (c % nx) * z, y + Math.floor(c / nx) * z, z - 1, z - 1);
    }
    ctx.globalAlpha = 1;
  }

  // ---------- stage effects ----------
  const PAL = ['#4fe3ff', '#c4a8ff', '#ff9ccf', '#ff9a52', '#ffd666', '#62E8C8'];
  function raster(ctx, w, h, p, t) {
    const z = 18;
    const nx = Math.floor(w / z);
    const ny = Math.floor(h / z);
    const r = B.rng(41);
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const v = r();
        if (v > p * 0.9) continue;
        const glanz = 0.5 + 0.5 * Math.sin(t * 2 + i * 0.5 + j * 0.3);
        ctx.fillStyle = PAL[(i + j) % PAL.length];
        ctx.globalAlpha = 0.07 + 0.08 * glanz;
        ctx.fillRect(i * z, j * z, z - 2, z - 2);
      }
    }
    ctx.globalAlpha = 1;
  }
  // 8-bit icons: clock, bluetooth, wifi, place, weather
  const ICONS = [
    ['.XXX.', 'X.X.X', 'X.XX.', 'X...X', '.XXX.'],
    ['..X..', 'X.XX.', '.XX..', 'X.XX.', '..X..'],
    ['XXXXX', '.....', '.XXX.', '.....', '..X..'],
    ['.XXX.', 'X...X', '.X.X.', '..X..', '..X..'],
    ['..XX.', '.XXXX', 'XXXXX', '.X.X.', 'X.X..'],
  ];
  function symbole(ctx, w, h, p, t) {
    const z = Math.max(5, Math.min(w, h) / 34);
    ICONS.forEach((ic, k) => {
      const zeigen = clamp(p * 5.5 - k, 0, 1);
      if (zeigen <= 0) return;
      const cx = w * (0.1 + 0.2 * k);
      const cy = h * 0.1 + Math.sin(t * 1.5 + k) * 4;
      ctx.fillStyle = PAL[k];
      ctx.globalAlpha = 0.75 * zeigen;
      ic.forEach((zeile, j) => zeile.split('').forEach((c, i) => {
        if (c === 'X') ctx.fillRect(cx + i * z - 2.5 * z, cy + j * z, z - 1, z - 1);
      }));
    });
    ctx.globalAlpha = 1;
  }
  function aktionen(ctx, w, h, p, t) {
    const z = 12;
    for (let k = 0; k < 5; k++) {
      const y = h * (0.2 + k * 0.15);
      const u = ((t * 0.45 + k * 0.2) % 1);
      const x = w * 0.05 + u * w * 0.9 * p;
      ctx.fillStyle = PAL[k];
      ctx.globalAlpha = 0.55 * p;
      for (let i = 0; i < 3; i++) ctx.fillRect(x - i * (z + 3), y, z, z);
    }
    ctx.globalAlpha = 1;
  }
  function monitor(ctx, w, h, p, t) {
    const z = 16;
    const n = 12;
    const aktiv = Math.floor(t * 3) % n;
    for (let i = 0; i < n; i++) {
      const x = w * 0.08 + (i % 6) * (z + 10);
      const y = h * 0.86 + Math.floor(i / 6) * (z + 8);
      ctx.fillStyle = i === aktiv ? '#62E8C8' : PAL[i % 5];
      ctx.globalAlpha = (i === aktiv ? 0.95 : 0.25) * p;
      ctx.fillRect(x, y, z, z);
    }
    ctx.globalAlpha = 1;
  }
  const SCHLOSS = ['.XXX.', 'X...X', 'X...X', 'XXXXX', 'XX.XX', 'XX.XX', 'XXXXX'];
  function schloss(ctx, w, h, p, t) {
    const z = Math.min(w, h) / 22;
    const cx = w * 0.82;
    const cy = h * 0.12;
    const n = SCHLOSS.join('').split('X').length - 1;
    let k = 0;
    ctx.fillStyle = '#62E8C8';
    SCHLOSS.forEach((zeile, j) => zeile.split('').forEach((c, i) => {
      if (c !== 'X') return;
      k++;
      if (k > n * p) return;
      ctx.globalAlpha = 0.55 + 0.25 * Math.sin(t * 2 + k);
      ctx.fillRect(cx + i * z, cy + j * z, z - 2, z - 2);
    }));
    ctx.globalAlpha = 1;
  }
  function regen(ctx, w, h, p, t) {
    const r = B.rng(77);
    const z = 6;
    for (let i = 0; i < 60; i++) {
      const x = r() * w;
      const v = 60 + r() * 80;
      const y = ((r() * h + t * v) % h);
      if (r() > p) continue;
      ctx.fillStyle = i % 4 ? 'rgba(79,227,255,0.55)' : 'rgba(98,232,200,0.7)';
      ctx.fillRect(Math.round(x / z) * z, Math.round(y / z) * z, z - 1, z * 2 - 1);
    }
    // a pixel skyline below
    const r2 = B.rng(78);
    ctx.fillStyle = 'rgba(155,140,255,0.16)';
    for (let x = 0; x < w * p; x += 24) {
      const hoch = 30 + Math.floor(r2() * 6) * 14;
      ctx.fillRect(x, h - hoch, 22, hoch);
    }
  }
  const EFFEKTE = { raster, symbole, aktionen, monitor, schloss, regen };

  B.stil({
    name: 'pixel',
    seed: SEED,
    kinds: {
      box: {
        // the frame fills block by block in the builder's colour; then the element stands, the blocks fade
        overlay(s, a, p, r) {
          if (a <= 0 || !r) return;
          const ctx = B.fxUsed();
          bloecke(ctx, s, B.vx(r.x), B.vy(r.y), r.w, r.h, E.EASE.out(clamp(p, 0, 1)), s.agent.color, 0.5 * a);
          ctx.strokeStyle = s.agent.color;
          ctx.globalAlpha = a;
          ctx.lineWidth = 2;
          ctx.strokeRect(Math.round(B.vx(r.x)) + 0.5, Math.round(B.vy(r.y)) + 0.5, Math.round(r.w), Math.round(r.h));
          ctx.globalAlpha = 1;
        },
        chip: (s, p, r) => Math.round(r.w / ZELLE) + '×' + Math.round(r.h / ZELLE) + ' px · 8 bit · '
          + Math.floor(Math.ceil(r.w / ZELLE) * Math.ceil(r.h / ZELLE) * E.EASE.out(clamp(p, 0, 1))) + ' blocks',
      },
      type: {
        // each letter snaps in two steps (big - smaller - in place)
        apply(s, p, t) {
          B.letters(s, p, t, 0.14, (l) => (l < 0.05 ? 'scale(1.7)' : l < 0.1 ? 'scale(1.3)' : 'scale(1.1)'));
        },
        chip: (s) => s.spec + ' · 1 bit',
      },
      img: { chip: (s, p) => Math.round(p * 100) + ' % mosaic · 16 colours · ' + s.file },
      glass: { chip: (s, p) => 'dither ' + Math.round(clamp(p, 0, 1) * 4) + '/4 · 8 bit' },
    },
    frame(t, ctx) {
      if (!ctx) return;
      // pictures appear as a mosaic: covering blocks over the screen vanish one by one
      const rects = E.rects();
      let drawn = false;
      E.stepsOf().forEach((s) => {
        if (s.kind !== 'img') return;
        const st = E.api().start(s);
        if (t < st || t > st + s.dur) return;
        const r = rects.get(s.el);
        if (!r) return;
        const p = (t - st) / s.dur;
        const rand = 8;
        if (!s.pixDecke) s.pixDecke = {};
        bloecke(ctx, s.pixDecke, B.vx(r.x) + rand, B.vy(r.y) + rand, r.w - 2 * rand, r.h - 2 * rand, 1 - E.EASE.inOut(clamp(p, 0, 1)), '#0b111a', 1, 18);
        drawn = true;
      });
      if (drawn) B.fxUsed();
    },
    // the pets set tiles: small blocks pop out where they work
    tool(ctx, x, y, color, since, t, key) {
      const age = t - since;
      for (let i = 0; i < 6; i++) {
        const h = B.hash(key.length * 7 + i, Math.floor(since * 10));
        const q = (age * 1.8 + i / 6) % 1;
        const px = x + Math.cos(h * 6.28) * q * 34;
        const py = y + Math.sin(h * 6.28) * q * 34;
        ctx.fillStyle = color;
        ctx.globalAlpha = (1 - q) * 0.85;
        const z = 4 + Math.round((1 - q) * 3);
        ctx.fillRect(Math.round(px / 2) * 2, Math.round(py / 2) * 2, z, z);
      }
      ctx.globalAlpha = 1;
    },
    hero: () => B.buehne(regen, (p) => 'rain ' + Math.round(60 * p) + ' drops · 6 px'),
    effekt: (a) => B.buehne(EFFEKTE[a.effekt] || raster, (p) => (a.effekt || 'grid') + ' · ' + Math.round(p * 100) + ' %'),
  });
})();
