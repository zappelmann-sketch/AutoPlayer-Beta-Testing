/* Vumikio Pets on the web - Benny (bunny), ported line by line from the app's BunnyRenderer.kt.
   Left out: everything that only draws inside "Surf the Beat" (surf == null on the web, so every
   surf helper returns its neutral value) and the camouflage colour (none in this renderer).
   The trick overlay effects live in benny_tricks.js. */
(function () {
  'use strict';
  const { Color, Stroke, StrokeCap, Brush, Path, C, O, S } = window.VPCompose;
  const A = window.VPAnim;
  const { Easing, PET_SIDES } = A;
  const { sin, max } = Math;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  const FUR_MAIN = C(0xFF8B7B6B);
  const FUR_LIGHT = C(0xFFAA9988);
  const FUR_DARK = C(0xFF6B5B4B);
  const FUR_BELLY = C(0xFFCCBBAA);
  const TAIL_WHITE = C(0xFFEEEEFF);
  const EAR_INNER = C(0xFFFFB3C6);
  const NOSE_PINK = C(0xFFFF8FAB);
  const MOUTH_COLOR = C(0xFFFF8FAB);
  const EYE_BROWN = C(0xFF442200);
  const NEON_CYAN = C(0xFF00E5FF);
  const NEON_MAGENTA = C(0xFFFF00FF);
  const NEON_PINK = C(0xFFFF69B4);
  const CHEEK_BLUSH = C(0x55FF69B4);
  const WHISKER_COLOR = C(0xFFCCDDEE);
  const SHADOW_COLOR = C(0x44000000);
  const HIGHLIGHT = C(0x33FFFFFF);

  const TRICKS = ['BUNNY_SPIN', 'BUNNY_BINKY_JUMP', 'BUNNY_EAR_HELICOPTER', 'BUNNY_TUNNEL_DIG', 'BUNNY_CARROT_RAIN',
    'BUNNY_BLUR_SPEED', 'BUNNY_GOLDEN_EARS', 'BUNNY_CLONE_ARMY', 'BUNNY_FLOATING_MEADOW', 'BUNNY_MOON_RABBIT'];

  // Local helper: PetGenreColors.colorFor (the longest genre word contained in the tag wins).
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
    for (const k in GENRE_PALETTE) if (needle.indexOf(k) >= 0 && (best === null || k.length > best.length)) best = k;
    return best === null ? null : C(GENRE_PALETTE[best]);
  }

  function create() { return {}; }

  function draw(ds, mem, p, now, dt) {
    const mood = p.mood;
    const energy = p.energy == null ? 0 : p.energy;
    const amplitude = p.amplitude || 0;
    const tempoScale = p.tempoScale == null ? 1 : p.tempoScale;
    const nightDimFactor = p.nightDimFactor == null ? 1 : p.nightDimFactor;
    const gazeX = p.gazeX || 0;
    const gazeY = p.gazeY || 0;
    const trickActive = !!p.trickActive;
    const trickType = p.trickType || 'BUNNY_SPIN';
    const accentColor = p.accentColor || NEON_CYAN;
    const speakIndicatorColor = p.speakIndicatorColor || NEON_CYAN;
    const isDigging = !!p.isDigging;

    // Breathing
    const breathe = A.inf(now, 0.97, 1.03, 2200, Easing.FastOutSlowIn, true);
    // Nose twitch
    const noseTwitch = A.inf(now, 0, 100, 800, Easing.Linear, false);
    // Ear wobble
    const earPhase = A.loopPhase(mem, 'ear', Math.trunc(3000 * tempoScale), dt);
    // Blink
    const blinkPhase = A.inf(now, 0, 100, 5500, Easing.Linear, false);
    const isBlinking = blinkPhase > 96 - (1 - clamp(energy, 0, 100) / 100) * 2.5;

    // Hop (beat): -15 for 200 ms while dancing / excited
    const hopTarget = A.pulse(mem, 'hop', !!p.beatDetected && (mood === 'DANCING' || mood === 'EXCITED'), -15, 0, 200, now);
    const animHop = A.springTo(mem, 'hop', hopTarget, dt, 0.5, 400);

    // Beat scale
    const beatTarget = A.pulse(mem, 'beat', !!p.beatDetected, 1.08, 1, 150, now);
    const animBeat = A.springTo(mem, 'beat', beatTarget, dt, 0.4, 300);

    // Speak pulse
    const speakPulse = A.inf(now, 0.3, 1, 800, Easing.FastOutSlowIn, true);

    // Trick rotation (keeps turning the same way) and trick progress
    if (mem.trickRot == null) mem.trickRot = 0;
    const animTrickP = A.trickProgress(mem, trickActive, trickType, now);
    A.onChange(mem, 'spin', trickActive + '|' + trickType, () => {
      if (trickActive && trickType === 'BUNNY_SPIN') mem.trickRot += 360;
    });
    const animRot = A.tweenTo(mem, 'rot', mem.trickRot, A.TRICK_SPIN_MS, Easing.FastOutSlowIn, now);

    // Dig animation, crown bob, yawn
    const digPhase = A.inf(now, 0, 100, 2000, Easing.Linear, false);
    const crownBob = A.inf(now, -2, 2, 1500, Easing.FastOutSlowIn, true);
    const yawnPhase = A.inf(now, 0, 100, 12000, Easing.Linear, false);
    const isYawning = !!p.forcedYawn || (mood === 'TIRED' && yawnPhase >= 90 && yawnPhase <= 96);

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
    const s = size.minDimension * 0.18 * breathe * animBeat;

    // Chibi proportions - the bass pushes the bunny down into its haunches
    const bassSquash = bassAmp * s * 0.12;
    const bodyY = size.height * 0.6 + animHop + bassSquash;
    const headY = size.height * 0.38 + animHop + bassSquash * 0.6;
    const headR = s * 0.52;
    const bodyW = s * 0.7;
    const bodyH = s * 0.55;

    const drawBunny = () => {
      // === GROUND SHADOW ===
      ds.drawOval(SHADOW_COLOR, O(cx - bodyW * 1.2, bodyY + bodyH * 0.5 - animHop * 0.3), S(bodyW * 2.4, bodyH * 0.3));

      // === FLUFFY TAIL ===
      const tailX = cx + bodyW * 0.65;
      const tailY = bodyY + bodyH * 0.05;
      ds.drawCircle(SHADOW_COLOR, s * 0.12, O(tailX + 1, tailY + 1));
      ds.drawCircle(TAIL_WHITE.copy(dim), s * 0.11, O(tailX, tailY));
      ds.drawCircle(Color.White.copy(0.3 * dim), s * 0.07, O(tailX - 1, tailY - 2));
      ds.drawCircle(NEON_PINK.copy(0.15 * dim), s * 0.16, O(tailX, tailY));

      // === BODY ===
      ds.drawOval(
        Brush.radialGradient([auraColor.copy((0.15 + amplitude * 0.3) * dim), Color.Transparent], O(cx, bodyY), bodyW * 1.6),
        O(cx - bodyW * 1.4, bodyY - bodyH * 0.9), S(bodyW * 2.8, bodyH * 2.2));
      ds.drawOval(FUR_DARK.copy(dim * 0.5), O(cx - bodyW + 2, bodyY - bodyH * 0.4 + 2), S(bodyW * 2, bodyH * 1.1));
      ds.drawOval(
        Brush.radialGradient([FUR_LIGHT.copy(dim), FUR_MAIN.copy(dim)], O(cx - bodyW * 0.15, bodyY - bodyH * 0.2), bodyW * 1.3),
        O(cx - bodyW, bodyY - bodyH * 0.4), S(bodyW * 2, bodyH * 1.1));
      ds.drawOval(FUR_BELLY.copy(dim * 0.35), O(cx - bodyW * 0.45, bodyY - bodyH * 0.05), S(bodyW * 0.9, bodyH * 0.6));
      ds.drawOval(HIGHLIGHT.copy(dim * 0.3), O(cx - bodyW * 0.5, bodyY - bodyH * 0.45), S(bodyW, bodyH * 0.35));
      ds.drawOval(accentColor.copy((0.2 + amplitude * 0.15) * dim), O(cx - bodyW, bodyY - bodyH * 0.4),
        S(bodyW * 2, bodyH * 1.1), { style: Stroke(1.5) });

      // === FRONT PAWS ===
      for (const side of PET_SIDES) {
        const pawX = cx + side * bodyW * 0.3;
        const pawY = bodyY + bodyH * 0.45;
        ds.drawOval(FUR_MAIN.copy(dim), O(pawX - s * 0.07, pawY - s * 0.04), S(s * 0.14, s * 0.1));
        ds.drawCircle(NEON_PINK.copy(0.2 * dim), s * 0.04, O(pawX, pawY + s * 0.02));
      }

      // === HIND LEGS ===
      for (const side of PET_SIDES) {
        const legX = cx + side * bodyW * 0.55;
        const legY = bodyY + bodyH * 0.3;
        ds.drawOval(FUR_MAIN.copy(dim), O(legX - s * 0.1, legY - s * 0.08), S(s * 0.2, s * 0.18));
        ds.drawOval(FUR_LIGHT.copy(dim), O(legX - s * 0.06 + side * s * 0.03, legY + s * 0.06), S(s * 0.14, s * 0.06));
        ds.drawCircle(NEON_CYAN.copy(0.1 * dim), s * 0.05, O(legX + side * s * 0.02, legY + s * 0.08));
      }

      // The head leans toward whatever the pet watches (PetMath.headTiltDeg)
      const headTilt = clamp(gazeX, -1, 1) * 5;
      ds.rotate(headTilt, O(cx, headY + headR * 0.9), () => {
        // === HEAD ===
        ds.drawCircle(FUR_DARK.copy(dim * 0.5), headR, O(cx + 2, headY + 2));
        ds.drawCircle(
          Brush.radialGradient([FUR_LIGHT.copy(dim), FUR_MAIN.copy(dim)], O(cx - headR * 0.2, headY - headR * 0.15), headR * 1.4),
          headR, O(cx, headY));
        ds.drawOval(HIGHLIGHT.copy(dim * 0.35), O(cx - headR * 0.45, headY - headR * 0.85), S(headR * 0.9, headR * 0.4));
        ds.drawCircle(NEON_CYAN.copy((0.2 + amplitude * 0.12) * dim), headR, O(cx, headY), { style: Stroke(1.5) });

        // Cheek fluff + blush
        ds.drawCircle(FUR_BELLY.copy(dim * 0.4), headR * 0.2, O(cx - headR * 0.5, headY + headR * 0.15));
        ds.drawCircle(FUR_BELLY.copy(dim * 0.4), headR * 0.2, O(cx + headR * 0.5, headY + headR * 0.15));
        ds.drawCircle(CHEEK_BLUSH.copy(dim), headR * 0.13, O(cx - headR * 0.52, headY + headR * 0.22));
        ds.drawCircle(CHEEK_BLUSH.copy(dim), headR * 0.13, O(cx + headR * 0.52, headY + headR * 0.22));

        // === EARS ===
        const earLen = headR * 1.6;
        const earW = headR * 0.22;
        for (const side of PET_SIDES) {
          const earX = cx + side * headR * 0.3;
          const earBaseY = headY - headR * 0.7;
          const earTipY = earBaseY - earLen;
          // Treble makes the ears flick, mids make them swing further.
          const wobble = sin(earPhase + side * 1.5) * (5 + highAmp * 12 + midAmp * 8);
          const tipX = earX + wobble;

          const earShadow = new Path().moveTo(earX - earW + 1, earBaseY + 1)
            .cubicTo(earX - earW * 1.2 + 1, earBaseY - earLen * 0.3, tipX - earW * 0.6 + 1, earTipY + earLen * 0.1 + 1,
              tipX + 1, earTipY + 1)
            .cubicTo(tipX + earW * 0.6 + 1, earTipY + earLen * 0.1 + 1, earX + earW * 1.2 + 1, earBaseY - earLen * 0.3,
              earX + earW + 1, earBaseY + 1)
            .close();
          ds.drawPath(earShadow, FUR_DARK.copy(dim * 0.3));

          const ear = new Path().moveTo(earX - earW, earBaseY)
            .cubicTo(earX - earW * 1.2, earBaseY - earLen * 0.3, tipX - earW * 0.6, earTipY + earLen * 0.1, tipX, earTipY)
            .cubicTo(tipX + earW * 0.6, earTipY + earLen * 0.1, earX + earW * 1.2, earBaseY - earLen * 0.3,
              earX + earW, earBaseY)
            .close();
          ds.drawPath(ear, FUR_MAIN.copy(dim));
          ds.drawPath(ear, NEON_MAGENTA.copy((0.25 + highAmp * 0.35) * dim), { style: Stroke(1.5) });

          const inner = new Path().moveTo(earX - earW * 0.5, earBaseY + headR * 0.05)
            .cubicTo(earX - earW * 0.6, earBaseY - earLen * 0.25, tipX - earW * 0.3, earTipY + earLen * 0.15,
              tipX, earTipY + earLen * 0.08)
            .cubicTo(tipX + earW * 0.3, earTipY + earLen * 0.15, earX + earW * 0.6, earBaseY - earLen * 0.25,
              earX + earW * 0.5, earBaseY + headR * 0.05)
            .close();
          ds.drawPath(inner, EAR_INNER.copy(0.55 * dim));
        }

        // === EYES ===
        const eyeY = headY + headR * 0.02;
        const eyeSpacing = headR * 0.3;
        const eyeR = headR * 0.2;

        if (mood === 'SLEEPING' || isBlinking) {
          for (const side of PET_SIDES) {
            const arc = new Path().moveTo(cx + side * eyeSpacing - eyeR, eyeY)
              .quadraticBezierTo(cx + side * eyeSpacing, eyeY - eyeR * 0.5, cx + side * eyeSpacing + eyeR, eyeY);
            ds.drawPath(arc, Color.White.copy(0.85 * dim), { style: Stroke(2.5, StrokeCap.Round) });
          }
        } else {
          const gx = eyeR * 0.28 * gazeX;
          const gy = eyeR * 0.28 * gazeY;
          for (const side of PET_SIDES) {
            const ex = cx + side * eyeSpacing;
            ds.drawCircle(Color.White.copy(0.97 * dim), eyeR, O(ex, eyeY));
            ds.drawCircle(Brush.radialGradient([C(0xFF664422), EYE_BROWN], O(ex + gx, eyeY + gy), eyeR * 0.75),
              eyeR * 0.7, O(ex + gx, eyeY + gy));
            ds.drawCircle(C(0xFF111100), eyeR * 0.35, O(ex + gx, eyeY + gy));
            ds.drawCircle(Color.White.copy(0.9), eyeR * 0.25, O(ex + gx + eyeR * 0.15, eyeY + gy - eyeR * 0.25));
            ds.drawCircle(Color.White.copy(0.5), eyeR * 0.1, O(ex + gx - eyeR * 0.12, eyeY + gy + eyeR * 0.12));
          }
        }

        // === NOSE (twitching) ===
        const noseY = headY + headR * 0.32;
        const noseW = headR * 0.09;
        const twitchX = sin(noseTwitch * 0.15) * 1.5;
        ds.drawOval(NOSE_PINK.copy(0.95 * dim), O(cx - noseW + twitchX, noseY - noseW * 0.5), S(noseW * 2, noseW * 1.2));

        // === MOUTH (Y-shape) ===
        const mouthTop = noseY + noseW * 0.7;
        if (isYawning) {
          ds.drawOval(C(0xFF2A1828).copy(0.9 * dim), O(cx - headR * 0.12, mouthTop), S(headR * 0.24, headR * 0.18));
        } else if (mood === 'EATING') {
          const nibble = sin(earPhase * 4) * 0.5 + 0.5;
          ds.drawOval(C(0xFF2A1828).copy(0.85 * dim), O(cx - headR * 0.08, mouthTop), S(headR * 0.16, headR * 0.1 * nibble));
          ds.drawRect(Color.White.copy(0.9 * dim), O(cx - headR * 0.04, mouthTop), S(headR * 0.035, headR * 0.06));
          ds.drawRect(Color.White.copy(0.9 * dim), O(cx + headR * 0.005, mouthTop), S(headR * 0.035, headR * 0.06));
        } else {
          ds.drawLine(MOUTH_COLOR.copy(0.8 * dim), O(cx + twitchX, mouthTop), O(cx + twitchX, mouthTop + headR * 0.08),
            { strokeWidth: 1.8, cap: StrokeCap.Round });
          const lm = new Path().moveTo(cx + twitchX, mouthTop + headR * 0.08)
            .quadraticBezierTo(cx - headR * 0.08, mouthTop + headR * 0.14, cx - headR * 0.15, mouthTop + headR * 0.06);
          ds.drawPath(lm, MOUTH_COLOR.copy(0.8 * dim), { style: Stroke(1.8, StrokeCap.Round) });
          const rm = new Path().moveTo(cx + twitchX, mouthTop + headR * 0.08)
            .quadraticBezierTo(cx + headR * 0.08, mouthTop + headR * 0.14, cx + headR * 0.15, mouthTop + headR * 0.06);
          ds.drawPath(rm, MOUTH_COLOR.copy(0.8 * dim), { style: Stroke(1.8, StrokeCap.Round) });
        }

        // === WHISKERS ===
        for (const side of PET_SIDES) {
          for (let i = 0; i <= 1; i++) {
            const sx = cx + side * headR * 0.15 + twitchX;
            const sy = noseY + i * headR * 0.06;
            const ex2 = sx + side * headR * 0.65;
            const ey = sy + (i - 0.5) * headR * 0.08;
            ds.drawLine(WHISKER_COLOR.copy((0.45 + amplitude * 0.15) * dim), O(sx, sy), O(ex2, ey),
              { strokeWidth: 1, cap: StrokeCap.Round });
          }
        }

        if (p.isBirthday) drawCrown(ds, cx, headY - headR - headR * 1.6 + crownBob, headR * 0.35, dim);
      }); // end head tilt

      // Digging particles
      if (isDigging && digPhase >= 20 && digPhase <= 60) {
        for (let i = 0; i <= 4; i++) {
          const dx = cx + (i - 2) * 8 + sin(digPhase * 0.3 + i) * 5;
          const dy = bodyY + bodyH * 0.5 - (digPhase % 30) * 0.5;
          ds.drawCircle(FUR_DARK.copy(0.4 * dim), 2 + i * 0.5, O(dx, dy));
        }
      }
    };

    if (trickType === 'BUNNY_SPIN' && animRot !== 0) ds.rotate(animRot, O(cx, size.height * 0.5), drawBunny);
    else drawBunny();

    // === TRICK OVERLAY EFFECTS ===
    const tp = animTrickP;
    if (tp > 0) {
      const fx = window.VPPets.trickFx && window.VPPets.trickFx.benny;
      if (fx) fx(ds, trickType, tp, { cx, headY, headR, bodyY, s, dim });
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
      ds.drawCircle(Brush.radialGradient([NEON_PINK.copy(amplitude * 0.12 * dim), Color.Transparent], O(cx, bodyY), s * 2.5),
        s * 2.5, O(cx, bodyY));
    }

    // Zzz
    if (mood === 'SLEEPING') {
      for (let i = 0; i <= 2; i++) {
        const zx = cx + s * (0.5 + i * 0.2) + sin(earPhase * 0.5 + i) * 3;
        const zy = headY - headR * (1.5 + i * 0.3);
        const a = Math.trunc((0.5 - i * 0.1) * dim * 255) / 255;
        ds.drawText('z', zx, zy, { color: new Color(255, 105, 180, a), size: 11 + i * 3, bold: true });
      }
    }
  }

  function drawCrown(ds, cx, cy, size, dim) {
    const path = new Path().moveTo(cx - size, cy + size * 0.4).lineTo(cx - size, cy)
      .lineTo(cx - size * 0.5, cy + size * 0.2).lineTo(cx, cy - size * 0.3)
      .lineTo(cx + size * 0.5, cy + size * 0.2).lineTo(cx + size, cy)
      .lineTo(cx + size, cy + size * 0.4).close();
    ds.drawPath(path, C(0xFFFFD700).copy(0.9 * dim));
    ds.drawPath(path, C(0xFFFFEE00).copy(0.5 * dim), { style: Stroke(1.5) });
  }

  window.VPPets = window.VPPets || { renderers: {} };
  window.VPPets.renderers.benny = { name: 'Benny', tricks: TRICKS, create, draw };
})();
