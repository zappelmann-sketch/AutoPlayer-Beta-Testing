/* Style "Kassetten-Band" (Mittwoch, Android Auto) - Wochentags-Konzept Datei 05, Stil 2.
   Every element runs like a tape: a frame unrolls from a tape strip with its reel, the element plays
   in from left to right, letters appear as if read by the tape head, pictures are uncovered by a
   head moving across, the pets string tape between the parts they build. Chips: tape counter. */
(function () {
  'use strict';
  const B = window.APStil;
  const E = window.APEngine;
  const clamp = B.clamp;
  const TAU = Math.PI * 2;
  const BAND = '#3a2414';
  const GLANZ = '#ffcf7a';
  const zaehler = (n) => String(Math.max(0, Math.round(n)) % 10000).padStart(4, '0');

  function spule(ctx, x, y, r, rot, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = '#2b1a0f';
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(255,207,122,0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
    ctx.fillStyle = '#d9d2c3';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.36, 0, TAU); ctx.fill();
    ctx.fillStyle = '#2b1a0f';
    for (let k = 0; k < 6; k++) {
      const a = k / 6 * TAU;
      ctx.fillRect(Math.cos(a) * r * 0.2 - 2, Math.sin(a) * r * 0.2 - 2, 4, 4);
    }
    ctx.restore();
  }

  function spulen(ctx, w, h, p, t, b, tempo) {
    const r = Math.min(w, h) * 0.17;
    const y = h * 0.5;
    const x1 = w * 0.12;
    const x2 = w * 0.88;
    const v = tempo ? tempo(t) : 1;
    const rot = t * 2.2 * v;
    ctx.strokeStyle = BAND;
    ctx.lineWidth = 9;
    ctx.globalAlpha = 0.8 * p;
    ctx.beginPath(); ctx.moveTo(x1, y + r); ctx.lineTo(x2, y + r); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,207,122,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x1, y + r - 3); ctx.lineTo(x2, y + r - 3); ctx.stroke();
    ctx.globalAlpha = 1;
    spule(ctx, x1, y, r * (0.8 + 0.2 * p), rot, p);
    spule(ctx, x2, y, r * (1 - 0.15 * p), rot, p);
  }

  // the tape runs fast (motorway), brakes in the middle (traffic jam) and speeds up again (city)
  function stau(ctx, w, h, p, t) {
    const tempo = (tt) => 0.35 + 0.65 * (0.5 + 0.5 * Math.cos(tt * 0.9));
    spulen(ctx, w, h * 0.7, p, t, null, tempo);
    const y = h * 0.82;
    const v = tempo(t);
    ctx.globalAlpha = 0.7 * p;
    ctx.fillStyle = GLANZ;
    const off = (t * 120 * v) % 40;
    for (let x = -40 + off; x < w * p; x += 40) ctx.fillRect(x, y, 18, 3);
    ctx.globalAlpha = 1;
  }

  // a voice wave leaves the tape head
  function sprechblase(ctx, w, h, p, t) {
    const cx = w * 0.5;
    const cy = h * 0.5;
    for (let k = 0; k < 4; k++) {
      const q = (t * 0.7 + k / 4) % 1;
      ctx.strokeStyle = GLANZ;
      ctx.globalAlpha = (1 - q) * 0.5 * p;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * (0.18 + q * 0.4), -0.7, 0.7);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * (0.18 + q * 0.4), Math.PI - 0.7, Math.PI + 0.7);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // the queue fills like a tape counter
  function warteschlange(ctx, w, h, p, t) {
    const n = Math.round(6 * p);
    for (let i = 0; i < 6; i++) {
      const y = h * 0.16 + i * h * 0.12;
      ctx.fillStyle = i < n ? 'rgba(255,154,82,0.28)' : 'rgba(255,255,255,0.05)';
      ctx.fillRect(w * 0.06, y, w * 0.24, h * 0.08);
    }
    ctx.font = '600 22px ' + B.mono();
    ctx.fillStyle = 'rgba(255,207,122,0.8)';
    ctx.fillText(zaehler(123 * p + t * 3), w * 0.72, h * 0.18);
  }

  // a tape strip runs forth and back (favourites at hand)
  function band(ctx, w, h, p, t) {
    const y = h * 0.86;
    const x = (0.5 + 0.35 * Math.sin(t * 1.3)) * w;
    ctx.fillStyle = BAND;
    ctx.globalAlpha = 0.9 * p;
    ctx.fillRect(0, y, w * p, 12);
    ctx.fillStyle = GLANZ;
    ctx.fillRect(x - 3, y - 6, 6, 24);
    ctx.globalAlpha = 1;
  }

  function zaehlwerk(ctx, w, h, p, t) {
    ctx.font = '700 34px ' + B.mono();
    ctx.fillStyle = 'rgba(255,207,122,' + (0.65 * p) + ')';
    ctx.textAlign = 'center';
    ctx.fillText(zaehler(16 * p) + ' / 0119', w * 0.5, h * 0.12);
    ctx.textAlign = 'left';
    spulen(ctx, w, h * 1.4, p * 0.6, t);
  }

  const EFFEKTE = { spulen: (c, w, h, p, t, b) => spulen(c, w, h, p, t, b), stau, sprechblase, warteschlange, band, zaehler: zaehlwerk };

  B.stil({
    name: 'kassette',
    seed: 3,
    charBlocks: false,
    kinds: {
      box: {
        apply: (s, p) => B.boxZeigen(s, p, 'zeigt'),
        // the tape strip with its reel unrolls along the top edge
        overlay(s, a, p, r) {
          if (!s.bandEin) { s.bandEin = true; s.bx.className = 'bx band'; }
          if (a <= 0 || !r) { if (s.bx.style.display !== 'none') s.bx.style.display = 'none'; return; }
          const e = E.EASE.out(clamp(p, 0, 1));
          s.bx.style.display = 'block';
          s.bx.style.opacity = a.toFixed(3);
          s.bx.style.transform = 'translate(' + r.x + 'px,' + (r.y - 20) + 'px)';
          s.bx.style.width = Math.max(14, r.w * e) + 'px';
        },
        chip: (s, p) => 'tape ' + zaehler(p * 123 + (s.at * 37)) + ' · ' + (p < 1 ? 'PLAY' : 'STOP'),
      },
      type: { chip: (s, p) => 'tape ' + zaehler(p * (s.chars ? s.chars.length : 0) * 3 + 40) + ' · head' },
      img: { chip: (s, p) => 'tape ' + zaehler(p * 240 + 200) + ' · ' + s.file },
      count: { chip: (s, p) => 'tape ' + zaehler(p * 99) },
    },
    // the pets string tape between the parts they are building
    frame(t, ctx) {
      if (!ctx) return;
      const work = E.work();
      const pts = E.agentList().map((a) => work[a.id]).filter((w) => w && w.busy)
        .map((w) => [B.vx(w.pt.x), B.vy(w.pt.y)]).sort((x, y) => x[0] - y[0]);
      if (pts.length < 1) return;
      B.fxUsed();
      ctx.lineCap = 'round';
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i];
        const [x1, y1] = pts[i + 1];
        const mx = (x0 + x1) / 2;
        const my = Math.max(y0, y1) + 30 + 10 * Math.sin(t * 2 + i);
        ctx.strokeStyle = BAND;
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(mx, my, x1, y1); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,207,122,0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x0, y0 - 2); ctx.quadraticCurveTo(mx, my - 2, x1, y1 - 2); ctx.stroke();
      }
      pts.forEach(([x, y], i) => spule(ctx, x, y, 7, t * 6 + i, 0.9));
    },
    hero: () => B.buehne(EFFEKTE.spulen, (p) => 'tape ' + zaehler(p * 300) + ' · 4,76 cm/s'),
    effekt: (a) => B.buehne(EFFEKTE[a.effekt] || EFFEKTE.spulen, (p) => 'tape ' + zaehler(p * 180 + 60) + ' · ' + (a.effekt || 'reel')),
  });
})();
