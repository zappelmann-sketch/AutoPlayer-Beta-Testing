/* Style "Holo-Projektion" (Sonntag, Surf the Beat) - Wochentags-Konzept Datei 05, Stil 6.
   Elements flicker in like a hologram and become steady: a box appears behind a scan line running
   down, letters glitch before they are sharp, pictures are projected through scan lines, the pets
   project light cones. Chips: scan frequency and brightness. */
(function () {
  'use strict';
  const B = window.APStil;
  const E = window.APEngine;
  const clamp = B.clamp;
  const TAU = Math.PI * 2;
  const CYAN = '#7ff0ff';
  const hell = (p) => Math.round(40 + 60 * clamp(p, 0, 1));

  // the tunnel of Surf the Beat: rings come towards the viewer
  function tunnel(ctx, w, h, p, t) {
    const cx = w / 2;
    const cy = h * 0.46;
    const maxR = Math.max(w, h) * 0.62;
    for (let k = 0; k < 9; k++) {
      const q = ((t * 0.32 + k / 9) % 1);
      const r = maxR * q * q * (0.3 + 0.7 * p);
      ctx.strokeStyle = k % 3 === 0 ? '#c4a8ff' : CYAN;
      ctx.globalAlpha = q * 0.5 * p;
      ctx.lineWidth = 1 + q * 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.78, 0, 0, TAU);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.18 * p;
    ctx.strokeStyle = CYAN;
    for (let k = 0; k < 12; k++) {
      const a = k / 12 * TAU + t * 0.1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR * 0.78);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  // tiles fly past through the tunnel
  function flug(ctx, w, h, p, t) {
    tunnel(ctx, w, h, p * 0.6, t);
    const cx = w / 2;
    const cy = h * 0.46;
    for (let k = 0; k < 5; k++) {
      const q = ((t * 0.25 + k / 5) % 1);
      const a = k * 1.3 + 0.4;
      const d = q * q * Math.max(w, h) * 0.55;
      const s = 10 + q * 46;
      ctx.globalAlpha = Math.min(1, q * 2) * 0.55 * p;
      ctx.fillStyle = ['#4fe3ff', '#c4a8ff', '#ff9ccf', '#ff9a52', '#ffd666'][k];
      ctx.fillRect(cx + Math.cos(a) * d - s / 2, cy + Math.sin(a) * d * 0.78 - s / 2, s, s * 0.7);
    }
    ctx.globalAlpha = 1;
  }
  function visualizer(ctx, w, h, p, t) {
    const n = 40;
    const bw = w / n;
    for (let i = 0; i < n; i++) {
      const v = 0.3 + 0.7 * Math.abs(Math.sin(t * 2.3 + i * 0.45) * Math.cos(t * 0.7 + i * 0.13));
      const hoch = v * h * 0.35 * p;
      const g = ctx.createLinearGradient(0, h, 0, h - hoch);
      g.addColorStop(0, 'rgba(127,240,255,0.05)');
      g.addColorStop(1, i % 2 ? 'rgba(196,168,255,0.5)' : 'rgba(127,240,255,0.5)');
      ctx.fillStyle = g;
      ctx.fillRect(i * bw + 1, h - hoch, bw - 2, hoch);
    }
  }
  // light lines connect the functions (automatic and together)
  function netz(ctx, w, h, p, t) {
    const pts = [[0.15, 0.2], [0.85, 0.25], [0.5, 0.55], [0.2, 0.85], [0.8, 0.82]];
    ctx.lineWidth = 1.4;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const u = clamp(p * 3 - (i + j) * 0.2, 0, 1);
        if (u <= 0) continue;
        const [x0, y0] = pts[i];
        const [x1, y1] = pts[j];
        ctx.strokeStyle = CYAN;
        ctx.globalAlpha = 0.22 * u;
        ctx.beginPath();
        ctx.moveTo(x0 * w, y0 * h);
        ctx.lineTo((x0 + (x1 - x0) * u) * w, (y0 + (y1 - y0) * u) * h);
        ctx.stroke();
        const q = (t * 0.5 + i * 0.2 + j * 0.1) % 1;
        ctx.globalAlpha = 0.8 * u;
        ctx.fillStyle = '#fff';
        ctx.fillRect((x0 + (x1 - x0) * q) * w - 1.5, (y0 + (y1 - y0) * q) * h - 1.5, 3, 3);
      }
    }
    ctx.globalAlpha = 1;
  }
  // the catch ring: a heart locks in and fills the life bar
  function fang(ctx, w, h, p, t) {
    const cx = w * 0.5;
    const cy = h * 0.42;
    const r = Math.min(w, h) * 0.26;
    const ph = (t * 0.8) % 1;
    ctx.strokeStyle = CYAN;
    ctx.globalAlpha = 0.6 * p;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(p * 1.2, 0, 1));
    ctx.stroke();
    ctx.globalAlpha = (1 - ph) * 0.5 * p;
    ctx.beginPath();
    ctx.arc(cx, cy, r * (1 + ph * 0.5), 0, TAU);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  const EFFEKTE = { tunnel, flug, visualizer, netz, fang };

  B.stil({
    name: 'holo',
    seed: 7,
    kinds: {
      box: {
        apply(s, p, t) {
          B.boxZeigen(s, p, 'zeigt');
          // flicker while the projection steadies
          const f = p > 0 && p < 1 ? (0.55 + 0.45 * B.hash(7, Math.floor(t * 30))) * (0.5 + 0.5 * p) + 0.5 * p : 1;
          E.setVar(s.el, '--flimmer', Math.min(1, f).toFixed(2));
        },
        // the scan line runs down; above it the projection, below it nothing yet
        overlay(s, a, p, r) {
          if (a <= 0 || !r || p >= 1) return;
          const ctx = B.fxUsed();
          const y = B.vy(r.y) + r.h * clamp(p, 0, 1);
          const g = ctx.createLinearGradient(0, y - 18, 0, y + 2);
          g.addColorStop(0, 'rgba(127,240,255,0)');
          g.addColorStop(1, 'rgba(127,240,255,0.55)');
          ctx.globalAlpha = a;
          ctx.fillStyle = g;
          ctx.fillRect(B.vx(r.x), y - 18, r.w, 20);
          ctx.fillStyle = CYAN;
          ctx.fillRect(B.vx(r.x) - 6, y, r.w + 12, 2);
          ctx.globalAlpha = 1;
        },
        chip: (s, p) => 'scan ' + (60 * clamp(p, 0, 1)).toFixed(0) + ' Hz · ' + hell(p) + ' %',
      },
      type: {
        // letters glitch sideways and flicker before they are sharp
        apply(s, p, t) {
          B.letters(s, p, t, 0.3, (l, i) => {
            const j = B.hash(i + 3, Math.floor(l * 40));
            const dx = (j - 0.5) * 12 * (1 - l / 0.3);
            const sk = (B.hash(i + 9, Math.floor(l * 40)) - 0.5) * 18 * (1 - l / 0.3);
            return 'translateX(' + dx.toFixed(1) + 'px) skewX(' + sk.toFixed(0) + 'deg)';
          });
        },
        chip: (s, p) => s.spec + ' · glitch ' + Math.round((1 - clamp(p, 0, 1)) * 100) + ' %',
      },
      img: { chip: (s, p) => 'projection ' + hell(p) + ' % · ' + s.file },
      glass: { chip: (s, p) => 'interference ' + Math.round(clamp(p, 0, 1) * 100) + ' %' },
    },
    // the pets project a cone of light onto the spot they build
    tool(ctx, x, y, color, since, t) {
      const flack = 0.75 + 0.25 * Math.sin((t - since) * 40);
      const g = ctx.createLinearGradient(x, y - 90, x, y);
      g.addColorStop(0, 'rgba(127,240,255,0)');
      g.addColorStop(1, 'rgba(127,240,255,' + (0.28 * flack) + ')');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x - 4, y - 90);
      ctx.lineTo(x + 4, y - 90);
      ctx.lineTo(x + 34, y);
      ctx.lineTo(x - 34, y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.6 * flack;
      ctx.beginPath();
      ctx.ellipse(x, y, 34, 6, 0, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 1;
    },
    hero: () => B.buehne(tunnel, (p) => 'tunnel · scan ' + Math.round(60 * clamp(p, 0, 1)) + ' Hz'),
    effekt: (a) => B.buehne(EFFEKTE[a.effekt] || tunnel, (p) => (a.effekt || 'holo') + ' · ' + hell(p) + ' %'),
  });
})();
