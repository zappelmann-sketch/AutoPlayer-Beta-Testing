/* AutoPlayer landing prototype - hero "spectrum ring".
   A tilted ring of equalizer bars around the phone. Back half and front half are drawn on two
   canvases (behind / in front of the phone), so the ring wraps around it.
   Everything is a pure function of time t (seconds) -> frames are reproducible for video export. */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const COLORS = [[98, 232, 200], [155, 140, 255], [255, 95, 168], [98, 232, 200]];

  function colorAt(u) {               // u in [0,1) around the ring
    const s = u * (COLORS.length - 1);
    const i = Math.floor(s);
    const f = s - i;
    const a = COLORS[i];
    const b = COLORS[i + 1];
    return [0, 1, 2].map((k) => Math.round(a[k] + (b[k] - a[k]) * f));
  }

  // Fake but musical spectrum: a few slow waves plus a kick on every beat (120 BPM).
  function level(i, n, t) {
    const beat = t * 2;
    const kick = Math.exp(-6 * (beat - Math.floor(beat)));
    const band = i / n;
    const low = Math.max(0, 1 - band * 3.2);
    const wave = 0.5 + 0.5 * Math.sin(t * 2.3 + i * 0.55) * Math.sin(t * 1.1 + i * 0.17);
    return 0.18 + 0.5 * wave + 0.45 * kick * (0.35 + low);
  }

  function Ring(back, front) {
    this.back = back;
    this.front = front;
    this.params = { grow: 0, bars: 32, orbits: 0, alpha: 1 };
    this.resize();
  }

  Ring.prototype.resize = function () {
    const stage = this.back.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // span sets the ring size; the canvas itself never gets wider than the page, otherwise
    // phone browsers widen the whole page and fixed elements at the right edge slide out of view
    const span = Math.min(stage.clientWidth + 200, 1500);
    const w = Math.min(span, document.documentElement.clientWidth);
    const h = stage.clientHeight;
    [this.back, this.front].forEach((c) => {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      c.style.width = w + 'px';
      c.style.height = h + 'px';
      c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    this.w = w;
    this.span = span;
    this.h = h;
    // full radius: as before, but small enough that the outermost orbit (1.38 R) stays on screen
    this.rMax = Math.min(span < 700 ? span * 0.42 : 360, (w / 2 - 8) / 1.38);
    // height of the ring: 62 % of the stage; in the stacked phone layout the phone is part of
    // the flow (between the cards), there the ring follows the phone instead
    this.cy = h * 0.62;
    let anchorTop = '62%';
    const phone = stage.querySelector('.phone-hero');
    if (phone && getComputedStyle(phone).position !== 'absolute') {
      this.cy = phone.offsetTop + phone.offsetHeight * 0.66;
      anchorTop = Math.round(this.cy) + 'px';
    }
    const anchor = document.getElementById('ringAnchor');
    if (anchor) anchor.style.top = anchorTop;
  };

  Ring.prototype.draw = function (t) {
    const p = this.params;
    const bctx = this.back.getContext('2d');
    const fctx = this.front.getContext('2d');
    bctx.clearRect(0, 0, this.w, this.h);
    fctx.clearRect(0, 0, this.w, this.h);
    if (p.grow <= 0.001) return;

    const g = p.grow;
    const narrow = this.span < 700;
    const cx = this.w / 2;
    const cy = this.cy;
    const R = this.rMax * (0.25 + 0.75 * g);
    const tilt = 0.27;
    const rot = t * 0.22;

    // floor glow
    const glow = bctx.createRadialGradient(cx, cy, 10, cx, cy, R * 1.25);
    glow.addColorStop(0, 'rgba(98,232,200,' + 0.32 * g + ')');
    glow.addColorStop(1, 'rgba(98,232,200,0)');
    bctx.fillStyle = glow;
    bctx.beginPath();
    bctx.ellipse(cx, cy, R * 1.25, R * 1.25 * tilt * 1.6, 0, 0, TAU);
    bctx.fill();

    this.drawOrbits(bctx, fctx, cx, cy, R, tilt, t, g);

    const n = Math.round(p.bars);
    const barW = Math.max(2.2, (TAU * R) / n * 0.42);
    const maxH = (narrow ? 70 : 120) * g;
    [bctx, fctx].forEach((c) => { c.lineCap = 'round'; c.globalCompositeOperation = 'lighter'; });
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + rot;
      const depth = Math.sin(a);                 // > 0 = front half
      const x = cx + R * Math.cos(a);
      const y = cy + R * tilt * depth;
      const persp = 0.72 + 0.28 * (depth + 1) / 2;
      const hgt = maxH * level(i, n, t) * persp;
      const col = colorAt(((i / n) + t * 0.03) % 1);
      const ctx = depth > 0 ? fctx : bctx;
      // in front of the phone the bars fade out, so the screenshot stays readable
      const off = Math.abs(x - cx) / (narrow ? 90 : 150);
      const keep = depth > 0 ? 0.18 + 0.82 * Math.min(1, Math.max(0, off - 0.55) / 0.6) : 1;
      const alpha = (0.45 + 0.55 * (depth + 1) / 2) * p.alpha * keep;
      ctx.strokeStyle = 'rgba(' + col.join(',') + ',' + alpha + ')';
      ctx.shadowColor = 'rgba(' + col.join(',') + ',0.9)';
      ctx.shadowBlur = 14;
      ctx.lineWidth = barW * persp;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - hgt);
      ctx.stroke();
    }
    [bctx, fctx].forEach((c) => { c.shadowBlur = 0; c.globalCompositeOperation = 'source-over'; });
  };

  // Thin glass orbits; each is split into a back arc and a front arc.
  Ring.prototype.drawOrbits = function (bctx, fctx, cx, cy, R, tilt, t, g) {
    const count = this.params.orbits;
    for (let k = 0; k < 3; k++) {
      const vis = Math.max(0, Math.min(1, count - k));
      if (vis <= 0) continue;
      const rr = R * (1.12 + k * 0.13);
      const tl = tilt * (1 + k * 0.35);
      const ang = (k - 1) * 0.16 + Math.sin(t * 0.3 + k) * 0.03;
      const sweep = (t * (0.6 + k * 0.2)) % TAU;
      [[bctx, Math.PI, TAU], [fctx, 0, Math.PI]].forEach(([ctx, from, to]) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ang);
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = 'rgba(210,240,255,' + (0.16 + 0.1 * (ctx === fctx ? 1 : 0)) * vis * g + ')';
        ctx.beginPath();
        ctx.ellipse(0, 0, rr, rr * tl, 0, from, to);
        ctx.stroke();
        // travelling highlight
        const hl = sweep;
        if (hl >= from && hl <= to) {
          ctx.strokeStyle = 'rgba(98,232,200,' + 0.85 * vis * g + ')';
          ctx.shadowColor = 'rgba(98,232,200,1)';
          ctx.shadowBlur = 16;
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.ellipse(0, 0, rr, rr * tl, 0, hl, Math.min(to, hl + 0.5));
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
        ctx.restore();
      });
    }
  };

  window.APRing = Ring;
})();
