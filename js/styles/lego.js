/* Style "Lego-Stapel" (Samstag, Party-Modus) - Wochentags-Konzept Datei 05, Stil 7.
   Elements fall from above as bricks and click into place with a small bounce, letters drop into
   the line like little bricks, the pets stack bricks where they work. Chips: studs and brick count. */
(function () {
  'use strict';
  const B = window.APStil;
  const E = window.APEngine;
  const clamp = B.clamp;
  const FARBEN = ['#ff5f5f', '#ffd666', '#4fa3ff', '#62E8C8', '#ff9a52', '#c4a8ff'];
  // falling, landing, a small bounce (the click)
  function fall(p) {
    const u = clamp(p, 0, 1);
    if (u < 0.72) { const k = u / 0.72; return k * k; }
    const k = (u - 0.72) / 0.28;
    return 1 - 0.09 * Math.sin(k * Math.PI) * (1 - k);
  }

  function stein(ctx, x, y, w, h, farbe, alpha) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = farbe;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.fillRect(x, y, w, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(x, y + h - 2, w, 2);
    const n = Math.max(1, Math.round(w / (h * 0.9)));
    for (let i = 0; i < n; i++) {
      const cx = x + (i + 0.5) * (w / n);
      ctx.fillStyle = farbe;
      ctx.fillRect(cx - h * 0.18, y - h * 0.18, h * 0.36, h * 0.2);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(cx - h * 0.18, y - h * 0.18, h * 0.36, 1.5);
    }
    ctx.globalAlpha = 1;
  }

  // ---------- stage effects ----------
  function steine(ctx, w, h, p, t) {
    for (let i = 0; i < 9; i++) {
      const x = w * (0.04 + 0.11 * i);
      const fallZeit = clamp(p * 9 - i * 0.7, 0, 1);
      const y = h * 0.92 - 16 - (1 - fall(fallZeit)) * h * 0.8;
      if (fallZeit <= 0) continue;
      stein(ctx, x, y, w * 0.09, 16, FARBEN[i % FARBEN.length], 0.6);
    }
  }
  // the QR code of the party as bricks
  function qr(ctx, w, h, p, t) {
    const z = Math.min(w, h) / 26;
    const x0 = w * 0.06;
    const y0 = h * 0.08;
    const r = B.rng(170);
    let k = 0;
    for (let j = 0; j < 9; j++) {
      for (let i = 0; i < 9; i++) {
        const finder = (i < 3 && j < 3) || (i > 5 && j < 3) || (i < 3 && j > 5);
        const voll = finder ? !(i % 6 === 1 && j % 6 === 1) : r() > 0.5;
        if (!voll) continue;
        k++;
        const auf = clamp(p * 50 - k * 0.6, 0, 1);
        if (auf <= 0) continue;
        stein(ctx, x0 + i * z, y0 + j * z - (1 - fall(auf)) * 60, z - 2, z - 3, finder ? '#ffd666' : '#eef3f8', 0.55);
      }
    }
  }
  function stapel(ctx, w, h, p, t) {
    const n = Math.round(8 * p);
    for (let i = 0; i < n; i++) {
      const y = h * 0.92 - (i + 1) * 18;
      const x = w * 0.06 + ((i % 2) * 14);
      stein(ctx, x, y, w * 0.2, 14, FARBEN[i % FARBEN.length], 0.55);
    }
  }
  function turm(ctx, w, h, p, t) {
    stapel(ctx, w, h, Math.min(p, 0.75), t);
    const u = (t * 0.5) % 1;
    const ziel = h * 0.92 - 7 * 18;
    const y = -20 + (ziel + 20) * fall(u);
    stein(ctx, w * 0.06, y, w * 0.2, 14, '#ff9a52', 0.85 * p);
  }
  function wackeln(ctx, w, h, p, t) {
    for (let i = 0; i < 5; i++) {
      const y = h * (0.2 + i * 0.14);
      const dx = Math.sin(t * 9 + i * 1.7) * 3 * (Math.sin(t * 1.3 + i) > 0.4 ? 1 : 0);
      stein(ctx, w * 0.06 + dx, y, w * 0.22 * clamp(p * 1.5 - i * 0.1, 0, 1), 16, FARBEN[i], 0.5);
    }
  }
  function mauer(ctx, w, h, p, t) {
    const reihen = 5;
    const bw = w * 0.13;
    let k = 0;
    for (let j = 0; j < reihen; j++) {
      for (let i = 0; i < 7; i++) {
        k++;
        const auf = clamp(p * 40 - k * 0.9, 0, 1);
        if (auf <= 0) continue;
        const x = (j % 2 ? bw / 2 : 0) + i * bw + w * 0.02;
        const y = h * 0.94 - (j + 1) * 18 - (1 - fall(auf)) * 80;
        stein(ctx, x, y, bw - 3, 15, j % 2 ? '#62E8C8' : '#4fa3ff', 0.4);
      }
    }
  }
  const EFFEKTE = { steine, qr, stapel, turm, wackeln, mauer };

  B.stil({
    name: 'lego',
    seed: 6,
    kinds: {
      box: {
        // the element itself falls and clicks in
        apply(s, p) {
          B.boxZeigen(s, p, 'zeigt');
          E.setVar(s.el, '--fall', (p > 0 && p < 1 ? -(1 - fall(p)) * 90 : 0).toFixed(1) + 'px');
        },
        overlay(s, a, p, r) {
          if (a <= 0 || !r || p < 0.7) return;
          // the click: a short flash of studs along the top edge when it lands
          const ctx = B.fxUsed();
          const q = clamp((p - 0.7) / 0.3, 0, 1);
          const n = Math.max(2, Math.round(r.w / 28));
          ctx.fillStyle = s.agent.color;
          ctx.globalAlpha = a * (1 - q) * 0.9;
          for (let i = 0; i < n; i++) {
            const x = B.vx(r.x) + (i + 0.5) * r.w / n;
            ctx.fillRect(x - 5, B.vy(r.y) - 6, 10, 5);
          }
          ctx.globalAlpha = 1;
        },
        chip: (s, p, r) => Math.max(1, Math.round(r.w / 32)) + '×' + Math.max(1, Math.round(r.h / 32)) + ' studs · brick ' + (1 + Math.round(s.at * 10) % 40),
      },
      type: {
        // letters drop into the line like little bricks
        apply(s, p, t) {
          B.letters(s, p, t, 0.24, (l) => 'translateY(' + (-(1 - fall(l / 0.24)) * 26).toFixed(1) + 'px)');
        },
        chip: (s) => s.spec + ' · ' + (s.chars ? s.chars.length : 0) + ' bricks',
      },
      img: { chip: (s, p) => Math.round(p * 32) + '/32 studs · ' + s.file },
      glass: { chip: (s, p) => 'clear brick · tint ' + Math.round(clamp(p, 0, 1) * 100) + ' %' },
    },
    // the pets stack bricks where they work
    tool(ctx, x, y, color, since, t) {
      const u = ((t - since) * 1.6) % 1;
      stein(ctx, x - 14, y - 70 + 62 * fall(u), 28, 10, color, 0.85);
      stein(ctx, x - 14, y + 2, 28, 10, color, 0.5);
    },
    hero: () => B.buehne(steine, (p) => 'bricks ' + Math.round(9 * p) + ' · 2×4'),
    effekt: (a) => B.buehne(EFFEKTE[a.effekt] || steine, (p) => (a.effekt || 'bricks') + ' · ' + Math.round(p * 40) + ' studs'),
  });
})();
