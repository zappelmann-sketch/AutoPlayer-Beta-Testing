/* Style "Origami-Falten" (Freitag, Loop-Studio) - Wochentags-Konzept Datei 05, Stil 5.
   Elements unfold out of folded paper: a box swings open around its top edge, a line of text is
   printed on a sheet that unfolds, pictures open like a page, the pets fold paper strips.
   Chips: fold angle in degrees. */
(function () {
  'use strict';
  const B = window.APStil;
  const E = window.APEngine;
  const clamp = B.clamp;
  const PAPIER = '#f3ead8';
  const SPUREN = ['#4fe3ff', '#c4a8ff', '#ff9ccf', '#ffd666'];
  const winkel = (p) => Math.round(90 * (1 - E.EASE.out(clamp(p, 0, 1))));

  // a paper strip with a fold: two quads, the second one turned by `a` (0 = flat)
  function streifen(ctx, x, y, w, h, a, farbe, alpha) {
    const k = Math.cos(a);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = farbe;
    ctx.fillRect(x, y, w / 2, h);
    ctx.fillStyle = farbe;
    ctx.globalAlpha = alpha * (0.55 + 0.45 * k);
    ctx.fillRect(x + w / 2, y, (w / 2) * Math.abs(k), h);
    ctx.globalAlpha = alpha * 0.5;
    ctx.fillStyle = '#000';
    ctx.fillRect(x + w / 2 - 0.5, y, 1, h);
    ctx.globalAlpha = 1;
  }

  // the A-B loop: two creases mark A and B, a paper loop runs between them
  function schleife(ctx, w, h, p, t) {
    const y = h * 0.86;
    const xa = w * 0.22;
    const xb = w * (0.22 + 0.56 * E.EASE.out(p));
    ctx.fillStyle = 'rgba(243,234,216,0.12)';
    ctx.fillRect(xa, y - 10, xb - xa, 20);
    [[xa, 'A'], [xb, 'B']].forEach(([x, l]) => {
      ctx.strokeStyle = PAPIER;
      ctx.globalAlpha = 0.8 * p;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, y - 26); ctx.lineTo(x, y + 26); ctx.stroke();
      ctx.font = '700 14px ' + B.mono();
      ctx.fillStyle = PAPIER;
      ctx.fillText(l, x - 4, y - 32);
    });
    const u = (t * 0.6) % 1;
    ctx.fillStyle = '#62E8C8';
    ctx.globalAlpha = 0.9 * p;
    ctx.fillRect(xa + (xb - xa) * u - 2, y - 12, 4, 24);
    ctx.globalAlpha = 1;
  }
  // a strip is cut and laid down on the timeline
  function schnitt(ctx, w, h, p, t) {
    const y = h * 0.84;
    const lauf = clamp(p * 1.3, 0, 1);
    for (let i = 0; i < 4; i++) {
      const x = w * (0.08 + i * 0.22);
      const a = (1 - clamp(lauf * 4 - i, 0, 1)) * 1.4;
      streifen(ctx, x, y, w * 0.18, 18, a, SPUREN[i], 0.55);
    }
    const sx = w * (0.1 + 0.8 * ((t * 0.3) % 1));
    ctx.strokeStyle = PAPIER;
    ctx.globalAlpha = 0.5 * p;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(sx, y - 18); ctx.lineTo(sx, y + 34); ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }
  // coloured paper tracks one above the other (the mixer's tracks)
  function spuren(ctx, w, h, p, t) {
    SPUREN.forEach((c, i) => {
      const y = h * (0.14 + i * 0.075);
      const aus = clamp(p * 1.4 - i * 0.15, 0, 1);
      const a = (1 - aus) * 1.5;
      streifen(ctx, w * 0.04, y, w * 0.92 * (0.6 + 0.4 * aus), 14, a, c, 0.45);
      const x = w * 0.04 + ((t * 40 + i * 70) % (w * 0.9));
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.5 * aus;
      ctx.fillRect(x, y, 2, 14);
    });
    ctx.globalAlpha = 1;
  }
  // coloured pads fold open one by one, then light up in time
  function pads(ctx, w, h, p, t) {
    const z = Math.min(w, h) * 0.085;
    const x0 = w * 0.06;
    const y0 = h * 0.62;
    for (let i = 0; i < 16; i++) {
      const auf = clamp(p * 18 - i, 0, 1);
      if (auf <= 0) continue;
      const x = x0 + (i % 4) * (z + 6);
      const y = y0 + Math.floor(i / 4) * (z + 6);
      const an = Math.floor(t * 4) % 16 === i;
      ctx.fillStyle = SPUREN[i % 4];
      ctx.globalAlpha = (an ? 0.9 : 0.35) * auf;
      ctx.fillRect(x, y + z * (1 - auf), z, z * auf);
    }
    ctx.globalAlpha = 1;
  }
  // a sheet folds itself into a plane and flies off (sharing)
  function flieger(ctx, w, h, p, t) {
    const u = (t * 0.35) % 1;
    const x = w * (0.1 + 0.8 * u);
    const y = h * (0.75 - 0.5 * u) + Math.sin(t * 3) * 8;
    const s = 26 * (0.6 + 0.4 * p);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.45);
    ctx.globalAlpha = 0.85 * p;
    ctx.fillStyle = PAPIER;
    ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(-s, -s * 0.55); ctx.lineTo(-s * 0.4, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#d8ccb2';
    ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(-s * 0.4, 0); ctx.lineTo(-s, s * 0.4); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = 'rgba(243,234,216,0.25)';
    ctx.setLineDash([3, 6]);
    ctx.beginPath(); ctx.moveTo(w * 0.1, h * 0.75); ctx.quadraticCurveTo(w * 0.4, h * 0.6, x, y); ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }
  function falten(ctx, w, h, p, t) {
    for (let i = 0; i < 7; i++) {
      const x = w * (0.05 + i * 0.13);
      const y = h * (0.12 + 0.7 * B.hash(5, i)) + Math.sin(t + i) * 6;
      const a = (1 - p) * 1.4 + 0.35 * Math.sin(t * 1.4 + i);
      streifen(ctx, x, y, 46, 14, a, i % 2 ? PAPIER : SPUREN[i % 4], 0.35);
    }
  }
  const EFFEKTE = { schleife, schnitt, spuren, pads, flieger, falten };

  B.stil({
    name: 'origami',
    seed: 5,
    charBlocks: false,
    kinds: {
      box: {
        apply: (s, p) => B.boxZeigen(s, p, 'zeigt'),
        // a crease along the top edge while the element swings open
        overlay(s, a, p, r) {
          if (a <= 0 || !r || p >= 1) return;
          const ctx = B.fxUsed();
          ctx.strokeStyle = PAPIER;
          ctx.globalAlpha = a * 0.8;
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.moveTo(B.vx(r.x), B.vy(r.y));
          ctx.lineTo(B.vx(r.x + r.w), B.vy(r.y));
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
        },
        chip: (s, p) => 'fold ' + winkel(p) + '° → 0° · ' + (s.agent.id === 'foxy' ? 'valley' : 'mountain'),
      },
      type: {
        // the line is printed on a sheet that unfolds
        apply(s, p) {
          const v = p > 0 && p < 1 ? 'perspective(900px) rotateX(' + (-70 * (1 - E.EASE.out(p))).toFixed(1) + 'deg)' : '';
          if (v !== s.faltT) { s.faltT = v; s.el.style.transform = v; s.el.style.transformOrigin = v ? '50% 0' : ''; }
        },
        chip: (s, p) => s.spec + ' · fold ' + winkel(p) + '°',
      },
      img: { chip: (s, p) => 'page ' + winkel(p) + '° · ' + s.file },
      glass: { chip: (s, p) => 'paper ' + Math.round(100 - 60 * clamp(p, 0, 1)) + ' % · fold ' + winkel(p) + '°' },
    },
    // the pets fold paper strips where they work
    tool(ctx, x, y, color, since, t) {
      const a = 1.4 * Math.abs(Math.sin((t - since) * 3));
      streifen(ctx, x - 22, y + 8, 44, 12, a, color, 0.75);
    },
    hero: () => B.buehne(falten, (p) => 'fold ' + winkel(p) + '° · 7 sheets'),
    effekt: (a) => B.buehne(EFFEKTE[a.effekt] || falten, (p) => (a.effekt || 'fold') + ' · ' + winkel(p) + '°'),
  });
})();
