/* Style "Wellenform" (Dienstag, Herzschlag-Sync) - Wochentags-Konzept Datei 05, Stil 4.
   Elements form out of sound waves, in the beat: a frame is a wave that pulls itself straight,
   letters vibrate and settle, pictures appear behind a wave front, the pets send out wave rings.
   Chips speak in frequency and level (BPM, dB). Behind the pictures: pulse line, waves, music curve,
   heartbeat, zone bars. */
(function () {
  'use strict';
  const B = window.APStil;
  const E = window.APEngine;
  const clamp = B.clamp;
  const TAU = Math.PI * 2;
  const MINT = '#62E8C8';
  const ROT = '#ff5f7e';
  const BEAT = 102 / 60;   // the live pulse of the page (Hz)

  // a wavy edge from (x0, y0) to (x1, y1), displaced across it
  function kante(ctx, x0, y0, x1, y1, amp, phase, erste) {
    const len = Math.hypot(x1 - x0, y1 - y0);
    const n = Math.max(2, Math.round(len / 6));
    const nx = -(y1 - y0) / (len || 1);
    const ny = (x1 - x0) / (len || 1);
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const d = amp * Math.sin(u * len / 22 + phase) * Math.sin(u * Math.PI);
      const x = x0 + (x1 - x0) * u + nx * d;
      const y = y0 + (y1 - y0) * u + ny * d;
      if (i === 0 && erste) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
  }

  // ECG-like pulse: flat, small P, sharp QRS, T
  function puls(u) {
    const f = u % 1;
    if (f < 0.1) return 0.08 * Math.sin(f / 0.1 * Math.PI);
    if (f < 0.16) return 0;
    if (f < 0.19) return -0.18 * ((f - 0.16) / 0.03);
    if (f < 0.22) return -0.18 + 1.18 * ((f - 0.19) / 0.03);
    if (f < 0.26) return 1 - 1.35 * ((f - 0.22) / 0.04);
    if (f < 0.29) return -0.35 + 0.35 * ((f - 0.26) / 0.03);
    if (f < 0.42) return 0;
    if (f < 0.56) return 0.22 * Math.sin((f - 0.42) / 0.14 * Math.PI);
    return 0;
  }

  function ekg(ctx, w, h, p, t) {
    const y0 = h * 0.62;
    const amp = h * 0.16;
    const sichtbar = w * p;
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, 'rgba(98,232,200,0)');
    g.addColorStop(0.2, 'rgba(98,232,200,0.75)');
    g.addColorStop(0.8, 'rgba(98,232,200,0.75)');
    g.addColorStop(1, 'rgba(98,232,200,0)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 2.2;
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(98,232,200,0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    const step = 3;
    for (let x = 0; x <= sichtbar; x += step) {
      const u = x / 190 - t * BEAT * 0.55;
      const y = y0 - puls(((u % 1) + 1) % 1) * amp;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function wellen(ctx, w, h, p, t) {
    const farben = ['#4fe3ff', '#c4a8ff', '#ff9ccf', '#ff9a52', '#ffd666'];
    for (let k = 0; k < 5; k++) {
      const yb = h * (0.2 + k * 0.15);
      ctx.strokeStyle = farben[k];
      ctx.globalAlpha = 0.45 * clamp(p * 1.6 - k * 0.12, 0, 1);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y = yb + Math.sin(x / (38 + k * 9) + t * (1.4 + k * 0.3) + k) * 14 * (0.5 + 0.5 * p);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // the music curve: from 85 down to 65 BPM (the Relax curve of the manual), drawn like a spectrum
  function kurve(ctx, w, h, p, t) {
    const n = 46;
    const bw = w / n;
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      if (u > p) break;
      const bpm = 85 - 20 * Math.min(1, u * 1.15);
      const hoch = (bpm - 50) / 45 * h * 0.6 * (0.85 + 0.15 * Math.sin(t * 3 + i * 0.7));
      const x = i * bw;
      const g = ctx.createLinearGradient(0, h, 0, h - hoch);
      g.addColorStop(0, 'rgba(98,232,200,0.05)');
      g.addColorStop(1, 'rgba(155,140,255,0.55)');
      ctx.fillStyle = g;
      ctx.fillRect(x + bw * 0.18, h - hoch, bw * 0.64, hoch);
    }
  }

  // the heart beats in time, the light pulses with it (the phone vibrates along)
  function herz(ctx, w, h, p, t) {
    const ph = (t * BEAT) % 1;
    const schlag = Math.exp(-ph * 7) + 0.6 * Math.exp(-Math.max(0, ph - 0.18) * 9) * (ph > 0.18 ? 1 : 0);
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * (0.32 + 0.06 * schlag) * (0.4 + 0.6 * p);
    const g = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
    g.addColorStop(0, 'rgba(255,95,126,' + (0.42 * p) + ')');
    g.addColorStop(1, 'rgba(255,95,126,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    for (let k = 0; k < 3; k++) {
      const q = (ph + k / 3) % 1;
      ctx.strokeStyle = ROT;
      ctx.globalAlpha = (1 - q) * 0.4 * p;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r * (0.5 + q * 0.9), 0, TAU);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // zone bars growing out of a wave (light 34 min, moderate 17 min - the session in the manual)
  function balken(ctx, w, h, p, t) {
    const zonen = [[0.3, '#7fd8ff'], [1, MINT], [0.5, '#ffd666'], [0.12, '#ff9a52'], [0.04, ROT]];
    const bw = w / 9;
    zonen.forEach(([v, c], i) => {
      const x = w * 0.14 + i * bw * 1.45;
      const ziel = v * h * 0.62;
      const hoch = ziel * clamp(p * 1.4 - i * 0.08, 0, 1);
      ctx.fillStyle = c;
      ctx.globalAlpha = 0.35;
      ctx.fillRect(x, h * 0.86 - hoch, bw, hoch);
      ctx.globalAlpha = 0.8;
      ctx.fillRect(x, h * 0.86 - hoch, bw, 2);
    });
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = MINT;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let x = 0; x <= w * p; x += 4) {
      const y = h * 0.9 + Math.sin(x / 24 + t * 2) * 6;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  const EFFEKTE = { ekg, wellen, kurve, herz, balken };
  const dB = (p) => Math.round(-24 + 18 * clamp(p, 0, 1));

  B.stil({
    name: 'wellenform',
    seed: 2,
    kinds: {
      box: {
        overlay(s, a, p, r, t) {
          if (a <= 0 || !r) return;
          const ctx = B.fxUsed();
          const e = E.EASE.out(clamp(p, 0, 1));
          const w = Math.max(2, r.w * e);
          const h = Math.max(2, r.h * e);
          const x = B.vx(r.x);
          const y = B.vy(r.y);
          const amp = (1 - e) * 11 + 0.8;
          const ph = t * TAU * BEAT;
          ctx.save();
          ctx.globalAlpha = a;
          ctx.strokeStyle = s.agent.color;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          kante(ctx, x, y, x + w, y, amp, ph, true);
          kante(ctx, x + w, y, x + w, y + h, amp, ph + 1, false);
          kante(ctx, x + w, y + h, x, y + h, amp, ph + 2, false);
          kante(ctx, x, y + h, x, y, amp, ph + 3, false);
          ctx.stroke();
          ctx.restore();
        },
        chip: (s, p) => Math.round(60 + 65 * E.EASE.out(clamp(p, 0, 1))) + ' BPM · ' + dB(p) + ' dB',
      },
      type: {
        // the letters vibrate in the heartbeat and settle
        apply(s, p, t) {
          B.letters(s, p, t, 0.5, (l, i) => {
            const k = 1 - l / 0.5;
            return 'translateY(' + (k * k * 8 * Math.sin(l * 26 + i * 0.9)).toFixed(1) + 'px)';
          });
        },
      },
      img: { chip: (s, p) => '8 bands · ' + dB(p) + ' dB · ' + s.file },
      glass: { chip: (s, p) => 'smooth ' + Math.round(clamp(p, 0, 1) * 100) + ' % · ' + dB(p) + ' dB' },
    },
    // the pets let waves grow where they work
    tool(ctx, x, y, color, since, t) {
      const age = t - since;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      for (let k = 0; k < 3; k++) {
        const ph = (age * 1.4 + k / 3) % 1;
        ctx.globalAlpha = (1 - ph) * 0.55;
        ctx.beginPath();
        ctx.arc(x, y, 6 + ph * 38, 0, TAU);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },
    hero: () => B.buehne(ekg, (p) => 'pulse · ' + Math.round(102 * clamp(p, 0, 1)) + ' BPM'),
    effekt: (a) => B.buehne(EFFEKTE[a.effekt] || wellen, (p) => (a.effekt || 'wave') + ' · ' + dB(p) + ' dB'),
  });
})();
