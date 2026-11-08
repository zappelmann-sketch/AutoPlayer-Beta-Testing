/* Vumikio Pets on the web - Foxy, ported line by line from the app's FoxRenderer.kt.
   Left out: everything that only draws inside "Surf the Beat" (surf == null on the web).
   The trick overlay effects live in foxy_tricks.js (loaded first). */
(function () {
  'use strict';
  const { Color, Stroke, StrokeCap, Brush, Path, C, O, S } = window.VPCompose;
  const A = window.VPAnim;
  const { Easing, PET_SIDES } = A;
  const { sin, trunc, max } = Math;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  const FUR_ORANGE = C(0xFFE87530);
  const FUR_LIGHT = C(0xFFF4A050);
  const FUR_DARK = C(0xFFB85520);
  const FUR_BELLY_WHITE = C(0xFFFFF5E0);
  const FUR_PAWS_DARK = C(0xFF3D2B20);
  const TAIL_TIP_WHITE = C(0xFFFFF8F0);
  const EAR_INNER = C(0xFFFFCCAA);
  const NOSE_BLACK = C(0xFF1A1A1A);
  const EYE_AMBER = C(0xFFFFAA00);
  const EYE_DARK = C(0xFF663300);
  const NEON_ORANGE = C(0xFFFF8C00);
  const NEON_GOLD = C(0xFFFFD700);
  const SHADOW_COLOR = C(0x44000000);
  const HIGHLIGHT = C(0x33FFFFFF);
  const WHISKER_COLOR = C(0xFFFFDDBB);

  const TRICKS = ['FOX_SPIN', 'FOX_TAIL_WHIP', 'FOX_MOONWALK', 'FOX_FIRE_TAIL', 'FOX_SPARKLE_TRAIL',
    'FOX_PHANTOM_DASH', 'FOX_AURORA_BOREALIS', 'FOX_FOX_FIRE', 'FOX_SPIRIT_FORM', 'FOX_STELLAR_FOX'];

  // Local helper: PetGenreColors.PALETTE / colorFor (the longest matching key wins).
  const GENRE_PALETTE = {
    rock: 0xFFFF3300, metal: 0xFFCC0000, punk: 0xFFFF2200, pop: 0xFFFF69B4, electronic: 0xFF00FFFF,
    electro: 0xFF00FFFF, techno: 0xFF00EEFF, trance: 0xFF00DDFF, house: 0xFF00FFAA, edm: 0xFF00FFFF,
    dance: 0xFF00FFCC, jazz: 0xFFFFD700, swing: 0xFFEEBB00, blues: 0xFF0066FF, classical: 0xFF9370DB,
    klassik: 0xFF9370DB, opera: 0xFF8A2BE2, hiphop: 0xFF00FF44, 'hip-hop': 0xFF00FF44, rap: 0xFF00EE3B,
    country: 0xFFCD853F, folk: 0xFFBB8855, reggae: 0xFF00DD00, ska: 0xFFDDDD00, soul: 0xFFFF8C00,
    funk: 0xFFFF9933, 'r&b': 0xFFFF7F50, rnb: 0xFFFF7F50, disco: 0xFFFF00FF, ambient: 0xFF66DDCC,
    chill: 0xFF88CCEE, lounge: 0xFFAA99DD, schlager: 0xFFFF55AA, metalcore: 0xFFBB0000, indie: 0xFF77CCAA,
    alternative: 0xFF88AACC, soundtrack: 0xFFCCAA66, latin: 0xFFFF6644,
  };
  function genreColor(genre) {
    const needle = String(genre || '').toLowerCase().trim();
    if (!needle) return null;
    let best = null;
    for (const k of Object.keys(GENRE_PALETTE)) {
      if (needle.indexOf(k) >= 0 && (best === null || k.length > best.length)) best = k;
    }
    return best === null ? null : C(GENRE_PALETTE[best]);
  }

  function create() { return { trickRot: 0 }; }

  function draw(ds, mem, p, now, dt) {
    const mood = p.mood;
    const energy = p.energy == null ? 0 : p.energy;
    const amplitude = p.amplitude || 0;
    const tempoScale = p.tempoScale == null ? 1 : p.tempoScale;
    const nightDimFactor = p.nightDimFactor == null ? 1 : p.nightDimFactor;
    const gazeX = p.gazeX || 0;
    const gazeY = p.gazeY || 0;
    const trickActive = !!p.trickActive;
    const trickType = p.trickType || 'FOX_SPIN';
    const accentColor = p.accentColor || NEON_ORANGE;
    const speakIndicatorColor = p.speakIndicatorColor || NEON_ORANGE;

    const breathe = A.inf(now, 0.97, 1.03, 2300, Easing.FastOutSlowIn, true);
    const tailPhase = A.loopPhase(mem, 'tail', trunc((mood === 'DANCING' ? 1500 : 3500) * tempoScale), dt);
    const earPhase = A.inf(now, 0, 100, 5000, Easing.Linear, false);
    const blinkPhase = A.inf(now, 0, 100, 5000, Easing.Linear, false);
    const speakPulse = A.inf(now, 0.3, 1, 800, Easing.FastOutSlowIn, true);
    const crownBob = A.inf(now, -2, 2, 1500, Easing.FastOutSlowIn, true);
    const yawnPhase = A.inf(now, 0, 100, 11000, Easing.Linear, false);

    const isBlinking = blinkPhase > 96 - (1 - clamp(energy, 0, 100) / 100) * 2.5;
    const isYawning = !!p.forcedYawn || (mood === 'TIRED' && yawnPhase >= 89 && yawnPhase <= 95);

    const beatScale = A.pulse(mem, 'beat', p.beatDetected, 1.08, 1, 150, now);
    const animBeat = A.springTo(mem, 'beat', beatScale, dt, 0.4, 300);

    // A trick plays once from 0 to 1; the spin keeps turning the same way.
    A.onChange(mem, 'spin', trickActive + '|' + trickType, () => {
      if (trickActive && trickType === 'FOX_SPIN') mem.trickRot += 360;
    });
    const animRot = A.tweenTo(mem, 'rot', mem.trickRot, A.TRICK_SPIN_MS, Easing.FastOutSlowIn, now);
    const tp = A.trickProgress(mem, trickActive, trickType, now);

    const bands = p.frequencyBands && p.frequencyBands.length >= 8 ? p.frequencyBands : new Float32Array(8);
    const dim = max(clamp(energy / 100, 0.5, 1) * nightDimFactor, 0.55);
    const bassAmp = (bands[0] + bands[1]) / 2;
    const midAmp = (bands[3] + bands[4]) / 2;
    const highAmp = (bands[6] + bands[7]) / 2;
    const genreGlow = genreColor(p.genre);
    const auraColor = genreGlow && (mood === 'DANCING' || mood === 'EXCITED')
      ? Color.lerp(accentColor, genreGlow, 0.5) : accentColor;

    const size = ds.size;
    const cx = size.width / 2;
    const s = size.minDimension * 0.19 * breathe * animBeat;
    const bodyY = size.height * 0.58;
    const headY = size.height * 0.36;
    const headR = s * 0.5;
    const bodyW = s * 0.75;
    const bodyH = s * 0.55;

    const drawFox = () => {
      // === GROUND SHADOW ===
      ds.drawOval(SHADOW_COLOR, O(cx - bodyW * 1.2, bodyY + bodyH * 0.5), S(bodyW * 2.4, bodyH * 0.3));

      // === TAIL (behind body) ===
      drawFoxTail(ds, cx, bodyY, s, tailPhase, bassAmp, dim, mood);

      // === BODY ===
      ds.drawOval(Brush.radialGradient([auraColor.copy((0.15 + amplitude * 0.3) * dim), Color.Transparent],
        O(cx, bodyY), bodyW * 1.6),
      O(cx - bodyW * 1.4, bodyY - bodyH * 0.9), S(bodyW * 2.8, bodyH * 2.2));
      ds.drawOval(FUR_DARK.copy(dim * 0.5), O(cx - bodyW + 2, bodyY - bodyH * 0.4 + 2), S(bodyW * 2, bodyH * 1.1));
      ds.drawOval(Brush.radialGradient([FUR_LIGHT.copy(dim), FUR_ORANGE.copy(dim)],
        O(cx - bodyW * 0.15, bodyY - bodyH * 0.2), bodyW * 1.3),
      O(cx - bodyW, bodyY - bodyH * 0.4), S(bodyW * 2, bodyH * 1.1));
      ds.drawOval(FUR_BELLY_WHITE.copy(dim * 0.6), O(cx - bodyW * 0.4, bodyY - bodyH * 0.15), S(bodyW * 0.8, bodyH * 0.7));
      ds.drawOval(HIGHLIGHT.copy(dim * 0.25), O(cx - bodyW * 0.5, bodyY - bodyH * 0.45), S(bodyW, bodyH * 0.3));
      ds.drawOval(accentColor.copy((0.2 + amplitude * 0.15) * dim), O(cx - bodyW, bodyY - bodyH * 0.4),
        S(bodyW * 2, bodyH * 1.1), { style: Stroke(1.5) });

      // === PAWS (dark tips) ===
      for (const side of PET_SIDES) {
        const pawX = cx + side * bodyW * 0.35;
        const pawY = bodyY + bodyH * 0.45;
        ds.drawOval(FUR_PAWS_DARK.copy(dim), O(pawX - s * 0.06, pawY - s * 0.03), S(s * 0.12, s * 0.08));
        ds.drawCircle(NEON_ORANGE.copy(0.12 * dim), s * 0.05, O(pawX, pawY));
      }

      // The head leans toward whatever the pet watches (PetMath.headTiltDeg).
      const headTilt = clamp(gazeX, -1, 1) * 5;
      ds.rotate(headTilt, O(cx, headY + headR * 0.9), () => {
        // === HEAD ===
        ds.drawCircle(FUR_DARK.copy(dim * 0.4), headR, O(cx + 2, headY + 2));
        const headPath = new Path().moveTo(cx - headR, headY + headR * 0.1)
          .cubicTo(cx - headR * 1.1, headY - headR * 0.4, cx - headR * 0.5, headY - headR * 0.95, cx, headY - headR * 0.9)
          .cubicTo(cx + headR * 0.5, headY - headR * 0.95, cx + headR * 1.1, headY - headR * 0.4, cx + headR, headY + headR * 0.1)
          .cubicTo(cx + headR * 0.6, headY + headR * 0.6, cx - headR * 0.6, headY + headR * 0.6, cx - headR, headY + headR * 0.1)
          .close();
        ds.drawPath(headPath, Brush.radialGradient([FUR_LIGHT.copy(dim), FUR_ORANGE.copy(dim)],
          O(cx - headR * 0.2, headY - headR * 0.2), headR * 1.4));
        // White face mask
        const maskPath = new Path().moveTo(cx - headR * 0.35, headY + headR * 0.05)
          .cubicTo(cx - headR * 0.3, headY + headR * 0.2, cx - headR * 0.15, headY + headR * 0.5, cx, headY + headR * 0.45)
          .cubicTo(cx + headR * 0.15, headY + headR * 0.5, cx + headR * 0.3, headY + headR * 0.2, cx + headR * 0.35, headY + headR * 0.05)
          .quadraticBezierTo(cx, headY + headR * 0.15, cx - headR * 0.35, headY + headR * 0.05)
          .close();
        ds.drawPath(maskPath, FUR_BELLY_WHITE.copy(dim * 0.7));
        ds.drawOval(HIGHLIGHT.copy(dim * 0.3), O(cx - headR * 0.4, headY - headR * 0.8), S(headR * 0.8, headR * 0.35));
        ds.drawPath(headPath, NEON_ORANGE.copy((0.2 + amplitude * 0.12) * dim), { style: Stroke(1.5) });

        // === EARS ===
        for (const side of PET_SIDES) {
          const earX = cx + side * headR * 0.5;
          const earTipY = headY - headR * 1.15;
          const earBW = headR * 0.28;
          const earBY = headY - headR * 0.5;
          const inTwitch = side < 0 ? (earPhase >= 65 && earPhase <= 72) : (earPhase >= 82 && earPhase <= 89);
          const twitch = inTwitch ? side * 5 : 0;
          const tipShift = twitch * 0.3 + side * midAmp * headR * 0.25;

          const ear = new Path().moveTo(earX - earBW, earBY).lineTo(earX + tipShift, earTipY)
            .lineTo(earX + earBW, earBY).close();
          ds.drawPath(ear, FUR_ORANGE.copy(dim));
          const tipH = headR * 0.2;
          const tipPath = new Path().moveTo(earX - earBW * 0.4, earTipY + tipH).lineTo(earX + tipShift, earTipY)
            .lineTo(earX + earBW * 0.4, earTipY + tipH).close();
          ds.drawPath(tipPath, FUR_PAWS_DARK.copy(dim * 0.8));
          ds.drawPath(ear, NEON_GOLD.copy((0.25 + highAmp * 0.35) * dim), { style: Stroke(1.5) });
          const inner = new Path().moveTo(earX - earBW * 0.45, earBY + headR * 0.05)
            .lineTo(earX + tipShift * 0.5, earTipY + headR * 0.2)
            .lineTo(earX + earBW * 0.45, earBY + headR * 0.05).close();
          ds.drawPath(inner, EAR_INNER.copy(0.5 * dim));
        }

        // === EYES ===
        const eyeY = headY;
        const eyeSpacing = headR * 0.32;
        const eyeR = headR * 0.18;
        if (mood === 'SLEEPING' || isBlinking) {
          for (const side of PET_SIDES) {
            const arc = new Path().moveTo(cx + side * eyeSpacing - eyeR, eyeY)
              .quadraticBezierTo(cx + side * eyeSpacing, eyeY - eyeR * 0.5, cx + side * eyeSpacing + eyeR, eyeY);
            ds.drawPath(arc, Color.White.copy(0.8 * dim), { style: Stroke(2.5, StrokeCap.Round) });
          }
        } else {
          const pupilSize = 0.4; // isHunting is false on the web
          const gx = eyeR * 0.30 * gazeX;
          const gy = eyeR * 0.28 * gazeY;
          for (const side of PET_SIDES) {
            const ex = cx + side * eyeSpacing;
            const eyePath = new Path().moveTo(ex - eyeR * 1.1, eyeY + eyeR * 0.1)
              .quadraticBezierTo(ex, eyeY - eyeR * 1.1, ex + eyeR * 1.1, eyeY - eyeR * 0.1)
              .quadraticBezierTo(ex, eyeY + eyeR * 0.8, ex - eyeR * 1.1, eyeY + eyeR * 0.1)
              .close();
            ds.drawPath(eyePath, Color.White.copy(0.95 * dim));
            ds.drawCircle(Brush.radialGradient([EYE_AMBER, EYE_DARK], O(ex + gx, eyeY + gy), eyeR * 0.7),
              eyeR * 0.65, O(ex + gx, eyeY + gy));
            ds.drawCircle(C(0xFF050505), eyeR * pupilSize, O(ex + gx, eyeY + gy));
            ds.drawCircle(Color.White.copy(0.9), eyeR * 0.2, O(ex + gx + eyeR * 0.15, eyeY + gy - eyeR * 0.3));
            ds.drawCircle(Color.White.copy(0.5), eyeR * 0.08, O(ex + gx - eyeR * 0.1, eyeY + gy + eyeR * 0.1));
          }
        }

        // === NOSE ===
        const noseY = headY + headR * 0.35;
        ds.drawCircle(NOSE_BLACK.copy(0.95 * dim), headR * 0.08, O(cx, noseY));
        ds.drawCircle(Color.White.copy(0.3 * dim), headR * 0.03, O(cx + headR * 0.02, noseY - headR * 0.02));

        // === MOUTH ===
        const mouthTop = noseY + headR * 0.08;
        if (isYawning) {
          ds.drawOval(C(0xFF2A1010).copy(0.9 * dim), O(cx - headR * 0.14, mouthTop), S(headR * 0.28, headR * 0.22));
        } else if (mood === 'EATING') {
          const nom = sin(tailPhase * 4) * 0.5 + 0.5;
          ds.drawOval(C(0xFF2A1010).copy(0.9 * dim), O(cx - headR * 0.07, mouthTop), S(headR * 0.14, headR * 0.1 * nom));
        } else {
          const smile = new Path().moveTo(cx - headR * 0.15, mouthTop)
            .quadraticBezierTo(cx, mouthTop + headR * 0.1, cx + headR * 0.15, mouthTop);
          ds.drawPath(smile, C(0xFF663322).copy(0.7 * dim), { style: Stroke(1.8, StrokeCap.Round) });
        }

        // === WHISKERS ===
        for (const side of PET_SIDES) {
          for (let i = 0; i <= 1; i++) {
            const sx = cx + side * headR * 0.2;
            const sy = noseY + i * headR * 0.05;
            const ex2 = sx + side * headR * 0.7;
            const ey = sy + (i - 0.5) * headR * 0.06;
            ds.drawLine(WHISKER_COLOR.copy((0.4 + amplitude * 0.15) * dim), O(sx, sy), O(ex2, ey),
              { strokeWidth: 1, cap: StrokeCap.Round });
          }
        }

        if (p.isBirthday) drawCrown(ds, cx, headY - headR * 1.2 + crownBob, headR * 0.38, dim);
      });
    };

    if (trickType === 'FOX_SPIN' && animRot !== 0) ds.rotate(animRot, O(cx, size.height * 0.48), drawFox);
    else drawFox();

    // === TRICK OVERLAY EFFECTS (FOX) ===
    if (tp > 0) {
      const fx = window.VPPets.trickFx && window.VPPets.trickFx.foxy;
      if (fx) fx(ds, trickType, tp, { cx, s, headY, headR, bodyY, dim, tailPhase });
    }

    // Speak indicator
    if (p.wantsToSpeak) {
      ds.drawCircle(Brush.radialGradient([speakIndicatorColor.copy(speakPulse * 0.5),
        speakIndicatorColor.copy(speakPulse * 0.15), Color.Transparent], O(cx, headY), headR * 2.2),
      headR * 2.2, O(cx, headY));
      ds.drawCircle(speakIndicatorColor.copy(speakPulse * 0.7), headR * 1.3, O(cx, headY), { style: Stroke(2.5) });
    }

    // Glow
    if (energy > 20) {
      ds.drawCircle(Brush.radialGradient([NEON_ORANGE.copy(amplitude * 0.12 * dim), Color.Transparent],
        O(cx, bodyY), s * 2.5), s * 2.5, O(cx, bodyY));
    }

    // Zzz
    if (mood === 'SLEEPING') {
      for (let i = 0; i <= 2; i++) {
        const zx = cx + s * (0.5 + i * 0.2) + sin(tailPhase * 0.5 + i) * 3;
        const zy = headY - headR * (0.5 + i * 0.3);
        const a = trunc((0.5 - i * 0.1) * dim * 255);
        ds.drawText('z', zx, zy, { color: new Color(255, 140, 0, a / 255), size: 12 + i * 3, bold: true });
      }
    }
  }

  // === BUSHY FOX TAIL ===
  function drawFoxTail(ds, cx, bodyY, s, phase, bassAmp, dim, mood) {
    const baseX = cx + s * 0.6;
    const baseY = bodyY - s * 0.05;

    if (mood === 'SLEEPING') {
      const curl = new Path().moveTo(baseX, baseY)
        .cubicTo(cx + s * 1.1, bodyY + s * 0.3, cx + s * 0.2, bodyY + s * 0.6, cx - s * 0.35, bodyY + s * 0.25);
      ds.drawPath(curl, FUR_ORANGE.copy(dim), { style: Stroke(8, StrokeCap.Round) });
      ds.drawPath(curl, NEON_ORANGE.copy(0.15 * dim), { style: Stroke(10, StrokeCap.Round) });
      ds.drawCircle(TAIL_TIP_WHITE.copy(dim), s * 0.06, O(cx - s * 0.35, bodyY + s * 0.25));
    } else {
      const sway = sin(phase) * (0.35 + bassAmp * 0.35) * s;
      const sway2 = sin(phase * 1.4 + 0.8) * 0.2 * s;
      const tailLen = s * 1.4;

      const tailCenter = new Path().moveTo(baseX, baseY)
        .cubicTo(baseX + sway * 0.4, baseY - tailLen * 0.25,
          baseX + sway * 0.8, baseY - tailLen * 0.55 + sway2,
          baseX + sway * 0.6 + sway2, baseY - tailLen * 0.8);
      ds.drawPath(tailCenter, SHADOW_COLOR, { style: Stroke(12, StrokeCap.Round) });
      ds.drawPath(tailCenter, FUR_DARK.copy(dim * 0.6), { style: Stroke(10, StrokeCap.Round) });
      ds.drawPath(tailCenter, FUR_ORANGE.copy(dim), { style: Stroke(7, StrokeCap.Round) });
      ds.drawPath(tailCenter, FUR_LIGHT.copy(dim * 0.5), { style: Stroke(4, StrokeCap.Round) });
      ds.drawPath(tailCenter, NEON_ORANGE.copy((0.15 + bassAmp * 0.3) * dim), { style: Stroke(11, StrokeCap.Round) });

      const tipX = baseX + sway * 0.6 + sway2;
      const tipY = baseY - tailLen * 0.8;
      ds.drawCircle(TAIL_TIP_WHITE.copy(dim), s * 0.07 + bassAmp * 2, O(tipX, tipY));
      ds.drawCircle(NEON_GOLD.copy((0.3 + bassAmp * 0.5) * dim), s * 0.1 + bassAmp * 4, O(tipX, tipY));

      if (bassAmp > 0.1) {
        for (let i = 0; i <= 3; i++) {
          const sparkleT = (i + 1) / 5;
          const sx = baseX + sway * sparkleT * 0.6;
          const sy = baseY - tailLen * sparkleT * 0.8 + sin(phase * 2 + i) * 4;
          ds.drawCircle(NEON_GOLD.copy(bassAmp * 0.4 * dim * (1 - sparkleT)), 1.5 + bassAmp * 2, O(sx, sy));
        }
      }
    }
  }

  function drawCrown(ds, cx, cy, size, dim) {
    const pth = new Path().moveTo(cx - size, cy + size * 0.4).lineTo(cx - size, cy)
      .lineTo(cx - size * 0.5, cy + size * 0.2).lineTo(cx, cy - size * 0.3)
      .lineTo(cx + size * 0.5, cy + size * 0.2).lineTo(cx + size, cy)
      .lineTo(cx + size, cy + size * 0.4).close();
    ds.drawPath(pth, C(0xFFFFD700).copy(0.9 * dim));
    ds.drawPath(pth, C(0xFFFFEE00).copy(0.5 * dim), { style: Stroke(1.5) });
  }

  window.VPPets = window.VPPets || { renderers: {} };
  window.VPPets.renderers.foxy = { name: 'Foxy', tricks: TRICKS, create, draw };
})();
