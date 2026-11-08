/* Vumikio Pets on the web - Melo (cat), ported line by line from the app's CatRenderer.kt.
   Left out: everything that only draws inside "Surf the Beat" (surf == null on the web, so only
   the null branches remain). The trick overlay effects live in melo_tricks.js. */
(function () {
  'use strict';
  const { Color, Stroke, StrokeCap, Brush, Path, C, O, S } = window.VPCompose;
  const A = window.VPAnim;
  const { Easing, PET_SIDES } = A;
  const PI = Math.PI;
  const { sin, cos } = Math;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  // Cat colors - chibi style, clearly visible
  const FUR_MAIN = C(0xFF5A5A80);
  const FUR_LIGHT = C(0xFF7878A8);
  const FUR_DARK = C(0xFF3E3E5E);
  const FUR_BELLY_LIGHT = C(0xFF9090B8);
  const SHADOW_COLOR = C(0x44000000);
  const HIGHLIGHT_COLOR = C(0x33FFFFFF);
  const NEON_GREEN_EYES = C(0xFF39FF14);
  const NEON_CYAN = C(0xFF00E5FF);
  const NEON_MAGENTA = C(0xFFFF00FF);
  const PAW_PAD = C(0xFFFF69B4);
  const NOSE_PINK = C(0xFFFF8FAB);
  const MOUTH_COLOR = C(0xFFFF69B4);
  const WHISKER_COLOR = C(0xFFAADDFF);
  const EAR_INNER = C(0xFFFFB3C6);
  const CHEEK_BLUSH = C(0x44FF69B4);

  const TRICKS = ['CAT_SPIN', 'CAT_PAW_SWIPE', 'CAT_BACK_FLIP', 'CAT_PURR_SHOCKWAVE', 'CAT_LASER_EYES',
    'CAT_SHADOW_CLONE', 'CAT_GOLDEN_PAWS', 'CAT_NINE_TAILS', 'CAT_ANGELIC_WINGS', 'CAT_CONSTELLATION'];

  // PetGenreColors.PALETTE (local copy: only the aura tint needs it)
  const GENRE_PALETTE = {
    rock: C(0xFFFF3300), metal: C(0xFFCC0000), punk: C(0xFFFF2200), pop: C(0xFFFF69B4),
    electronic: C(0xFF00FFFF), electro: C(0xFF00FFFF), techno: C(0xFF00EEFF), trance: C(0xFF00DDFF),
    house: C(0xFF00FFAA), edm: C(0xFF00FFFF), dance: C(0xFF00FFCC), jazz: C(0xFFFFD700),
    swing: C(0xFFEEBB00), blues: C(0xFF0066FF), classical: C(0xFF9370DB), klassik: C(0xFF9370DB),
    opera: C(0xFF8A2BE2), hiphop: C(0xFF00FF44), 'hip-hop': C(0xFF00FF44), rap: C(0xFF00EE3B),
    country: C(0xFFCD853F), folk: C(0xFFBB8855), reggae: C(0xFF00DD00), ska: C(0xFFDDDD00),
    soul: C(0xFFFF8C00), funk: C(0xFFFF9933), 'r&b': C(0xFFFF7F50), rnb: C(0xFFFF7F50),
    disco: C(0xFFFF00FF), ambient: C(0xFF66DDCC), chill: C(0xFF88CCEE), lounge: C(0xFFAA99DD),
    schlager: C(0xFFFF55AA), metalcore: C(0xFFBB0000), indie: C(0xFF77CCAA), alternative: C(0xFF88AACC),
    soundtrack: C(0xFFCCAA66), latin: C(0xFFFF6644),
  };
  /** The colour for a genre, or null when empty or unknown; the longest contained key wins. */
  function genreColorFor(genre) {
    const needle = String(genre || '').toLowerCase().trim();
    if (!needle) return null;
    let best = null;
    for (const k of Object.keys(GENRE_PALETTE)) {
      if (needle.indexOf(k) >= 0 && (best === null || k.length > best.length)) best = k;
    }
    return best === null ? null : GENRE_PALETTE[best];
  }

  function create() { return { trickRotation: 0 }; }

  function draw(ds, mem, p, now, dt) {
    const mood = p.mood;
    const energy = p.energy;
    const amplitude = p.amplitude || 0;
    const tempoScale = p.tempoScale == null ? 1 : p.tempoScale;
    const nightDimFactor = p.nightDimFactor == null ? 1 : p.nightDimFactor;
    const gazeX = p.gazeX || 0;
    const gazeY = p.gazeY || 0;
    const trickActive = !!p.trickActive;
    const trickType = p.trickType || 'CAT_SPIN';
    const accentColor = p.accentColor || NEON_CYAN;
    const speakIndicatorColor = p.speakIndicatorColor || NEON_CYAN;
    const isHunting = false; // Kotlin default (isHunting is not part of the web interface)

    const breathe = A.inf(now, 0.97, 1.03, 2500, Easing.FastOutSlowIn, true);
    // Faster while dancing (rememberLoopPhase)
    const tailPhase = A.loopPhase(mem, 'tail',
      Math.trunc((mood === 'EXCITED' || mood === 'DANCING' ? 1200 : 3000) * tempoScale), dt);
    const earTwitch = A.inf(now, 0, 100, 4000, Easing.Linear, false);
    const blinkPhase = A.inf(now, 0, 100, 6000, Easing.Linear, false);
    const pawPhase = A.inf(now, 0, 2 * PI, 1000, Easing.Linear, false);
    const speakPulse = A.inf(now, 0.3, 1, 800, Easing.FastOutSlowIn, true);
    const yawnPhase = A.inf(now, 0, 100, 10000, Easing.Linear, false);
    const crownBob = A.inf(now, -2, 2, 1500, Easing.FastOutSlowIn, true);

    // Tired eyes blink longer
    const isBlinking = blinkPhase > 96 - (1 - clamp(energy, 0, 100) / 100) * 2.5;
    const isYawning = !!p.forcedYawn ||
      ((mood === 'TIRED' || mood === 'HUNGRY') && yawnPhase >= 88 && yawnPhase <= 95);

    const beatScale = A.pulse(mem, 'beat', p.beatDetected, 1.1, 1, 150, now);
    const animBeat = A.springTo(mem, 'beat', beatScale, dt, 0.4, 300);

    // Spin keeps turning the same way; eases out without overshooting
    A.onChange(mem, 'spin', trickActive + '|' + trickType, () => {
      if (trickActive && trickType === 'CAT_SPIN') mem.trickRotation += 360;
    });
    const animRot = A.tweenTo(mem, 'rot', mem.trickRotation, A.TRICK_SPIN_MS, Easing.FastOutSlowIn, now);
    const animTrickP = A.trickProgress(mem, trickActive, trickType, now);

    const bands = p.frequencyBands && p.frequencyBands.length >= 8 ? p.frequencyBands : new Float32Array(8);
    const dim = Math.max(clamp(energy / 100, 0.5, 1) * nightDimFactor, 0.55);
    const bassAmp = (bands[0] + bands[1]) / 2;
    const midAmp = (bands[3] + bands[4]) / 2;
    const highAmp = (bands[6] + bands[7]) / 2;
    const genreGlow = genreColorFor(p.genre);
    const auraColor = genreGlow && (mood === 'DANCING' || mood === 'EXCITED')
      ? Color.lerp(accentColor, genreGlow, 0.5) : accentColor;

    const size = ds.size;
    const cx = size.width / 2;
    const s = size.minDimension * 0.19 * breathe * animBeat;

    // Chibi proportions: BIG head, small body
    const bodyY = size.height * 0.58;
    const bodyW = s * 0.85;
    const bodyH = s * 0.6;
    const headY = size.height * 0.35;
    const headR = s * 0.55;

    const drawCat = () => {
      // === GROUND SHADOW ===
      ds.drawOval(SHADOW_COLOR, O(cx - bodyW * 1.1, bodyY + bodyH * 0.5), S(bodyW * 2.2, bodyH * 0.35));

      drawTail(ds, cx, bodyY, s, tailPhase, bassAmp, dim, mood, isHunting);

      // === BODY ===
      // Outer aura halo in the accent colour
      ds.drawOval(
        Brush.radialGradient([auraColor.copy((0.15 + amplitude * 0.3) * dim), Color.Transparent], O(cx, bodyY), bodyW * 1.6),
        O(cx - bodyW * 1.4, bodyY - bodyH * 0.9), S(bodyW * 2.8, bodyH * 2.2));
      // Body shadow layer (depth)
      ds.drawOval(FUR_DARK.copy(dim), O(cx - bodyW + 3, bodyY - bodyH * 0.5 + 3), S(bodyW * 2, bodyH * 1.2));
      // Body main
      ds.drawOval(
        Brush.radialGradient([FUR_LIGHT.copy(dim), FUR_MAIN.copy(dim)], O(cx - bodyW * 0.2, bodyY - bodyH * 0.3), bodyW * 1.3),
        O(cx - bodyW, bodyY - bodyH * 0.5), S(bodyW * 2, bodyH * 1.2));
      // Belly highlight
      ds.drawOval(FUR_BELLY_LIGHT.copy(dim * 0.35), O(cx - bodyW * 0.5, bodyY - bodyH * 0.1), S(bodyW, bodyH * 0.7));
      // Body top highlight
      ds.drawOval(HIGHLIGHT_COLOR.copy(dim * 0.3), O(cx - bodyW * 0.6, bodyY - bodyH * 0.55), S(bodyW * 1.2, bodyH * 0.4));
      // Neon outline
      ds.drawOval(accentColor.copy((0.25 + amplitude * 0.2) * dim), O(cx - bodyW, bodyY - bodyH * 0.5), S(bodyW * 2, bodyH * 1.2),
        { style: Stroke(1.8) });

      // === PAWS ===
      for (const side of PET_SIDES) {
        const pawX = cx + side * bodyW * 0.35;
        const pawY = bodyY + bodyH * 0.45;
        const tapOff = mood === 'DANCING'
          ? Math.max(sin(pawPhase + (side > 0 ? PI : 0)) * midAmp * 5, 0) : 0;
        ds.drawCircle(SHADOW_COLOR, s * 0.09, O(pawX + 1, pawY + 1 - tapOff));
        ds.drawCircle(FUR_MAIN.copy(dim), s * 0.09, O(pawX, pawY - tapOff));
        ds.drawCircle(PAW_PAD.copy(0.7 * dim), s * 0.04, O(pawX, pawY + s * 0.02 - tapOff));
        if (tapOff < 0.5) ds.drawCircle(NEON_CYAN.copy(0.15 * dim), s * 0.06, O(pawX, pawY - tapOff));
      }

      // The head leans toward whatever the pet watches
      const headTilt = clamp(gazeX, -1, 1) * 5;
      ds.rotate(headTilt, O(cx, headY + headR * 0.9), () => {
        // === HEAD ===
        ds.drawCircle(FUR_DARK.copy(dim * 0.6), headR, O(cx + 2, headY + 2));
        ds.drawCircle(
          Brush.radialGradient([FUR_LIGHT.copy(dim), FUR_MAIN.copy(dim)], O(cx - headR * 0.25, headY - headR * 0.2), headR * 1.4),
          headR, O(cx, headY));
        ds.drawOval(HIGHLIGHT_COLOR.copy(dim * 0.35), O(cx - headR * 0.5, headY - headR * 0.85), S(headR, headR * 0.5));
        ds.drawCircle(NEON_CYAN.copy((0.25 + amplitude * 0.15) * dim), headR, O(cx, headY), { style: Stroke(1.8) });

        // === CHEEK BLUSH ===
        ds.drawCircle(CHEEK_BLUSH.copy(dim), headR * 0.15, O(cx - headR * 0.55, headY + headR * 0.2));
        ds.drawCircle(CHEEK_BLUSH.copy(dim), headR * 0.15, O(cx + headR * 0.55, headY + headR * 0.2));

        // === EARS ===
        const leftTw = earTwitch >= 70 && earTwitch <= 76 ? -10 : 0;
        const rightTw = earTwitch >= 85 && earTwitch <= 91 ? 10 : 0;
        for (const side of PET_SIDES) {
          const tw = side < 0 ? leftTw : rightTw;
          const earX = cx + side * headR * 0.55;
          const earTipY = headY - headR * 1.05;
          const earBW = headR * 0.32;
          const earBY = headY - headR * 0.45;
          const earShadow = new Path().moveTo(earX - earBW + 1, earBY + 1).lineTo(earX + tw * 0.4 + 1, earTipY + 1)
            .lineTo(earX + earBW + 1, earBY + 1).close();
          ds.drawPath(earShadow, FUR_DARK.copy(dim * 0.4));
          const ear = new Path().moveTo(earX - earBW, earBY).lineTo(earX + tw * 0.4, earTipY)
            .lineTo(earX + earBW, earBY).close();
          ds.drawPath(ear, FUR_MAIN.copy(dim));
          ds.drawPath(ear, NEON_MAGENTA.copy((0.3 + highAmp * 0.4) * dim), { style: Stroke(1.8) });
          const inner = new Path().moveTo(earX - earBW * 0.5, earBY + headR * 0.05)
            .lineTo(earX + tw * 0.2, earTipY + headR * 0.18)
            .lineTo(earX + earBW * 0.5, earBY + headR * 0.05).close();
          ds.drawPath(inner, EAR_INNER.copy(0.55 * dim));
        }

        // === EYES ===
        const eyeY = headY + headR * 0.0;
        const eyeSpacing = headR * 0.32;
        const eyeR = headR * 0.22;

        if (mood === 'SLEEPING' || isBlinking) {
          for (const side of PET_SIDES) {
            const arc = new Path().moveTo(cx + side * eyeSpacing - eyeR, eyeY)
              .quadraticBezierTo(cx + side * eyeSpacing, eyeY - eyeR * 0.6, cx + side * eyeSpacing + eyeR, eyeY);
            ds.drawPath(arc, Color.White.copy(0.85 * dim), { style: Stroke(2.5, StrokeCap.Round) });
          }
        } else {
          const pupilW = mood === 'EXCITED' ? 0.5 : mood === 'DANCING' ? 0.32 : 0.18;
          // How far the iris travels inside the white
          const gx = eyeR * 0.30 * gazeX;
          const gy = eyeR * 0.30 * gazeY;
          // Night: the pupil opens wide and shines (tapetum lucidum)
          const nachtSchein = clamp((0.85 - nightDimFactor) / 0.45, 0, 1);
          const scheinFarbe = C(0xFFB6FF5A);
          const nachtPupille = pupilW + (0.46 - pupilW) * nachtSchein * 1;
          for (const side of PET_SIDES) {
            const ex = cx + side * eyeSpacing;
            if (nachtSchein > 0.02) {
              ds.drawCircle(
                Brush.radialGradient([[0, scheinFarbe.copy(0.7 * nachtSchein)], [0.42, scheinFarbe.copy(0.5 * nachtSchein)],
                  [0.72, scheinFarbe.copy(0.16 * nachtSchein)], [1, Color.Transparent]], O(ex, eyeY), eyeR * 2.6),
                eyeR * 2.6, O(ex, eyeY));
            }
            // Eye shadow (depth)
            ds.drawOval(C(0x22000000), O(ex - eyeR + 1, eyeY - eyeR * 0.9 + 1), S(eyeR * 2, eyeR * 2));
            // White - catches the green at night, not dimmed
            ds.drawOval(
              Color.lerp(Color.White, C(0xFFE2FFB8), nachtSchein).copy(0.97 * (dim + (1 - dim) * nachtSchein)),
              O(ex - eyeR, eyeY - eyeR * 0.9), S(eyeR * 2, eyeR * 2));
            // Iris
            const irisR = eyeR * 0.72;
            ds.drawCircle(
              Brush.radialGradient([C(0xFF55FF33), NEON_GREEN_EYES], O(ex + gx, eyeY + gy), irisR),
              irisR, O(ex + gx, eyeY + gy));
            // Pupil: a slit by day, a disc at night
            const pupilH = eyeR * (1.2 - 0.3 * nachtSchein);
            ds.drawOval(
              Color.lerp(C(0xFF030303), scheinFarbe, 0.9 * nachtSchein),
              O(ex + gx - eyeR * nachtPupille, eyeY + gy - pupilH * 0.5), S(eyeR * nachtPupille * 2, pupilH));
            if (nachtSchein > 0.02) {
              ds.drawCircle(C(0xFFF4FFD8).copy(0.85 * nachtSchein), eyeR * nachtPupille * 0.55, O(ex + gx, eyeY + gy));
            }
            // Big highlight (anime style)
            ds.drawCircle(Color.White.copy(0.9), eyeR * 0.25, O(ex + gx + eyeR * 0.2, eyeY + gy - eyeR * 0.35));
            // Small highlight
            ds.drawCircle(Color.White.copy(0.6), eyeR * 0.1, O(ex + gx - eyeR * 0.15, eyeY + gy + eyeR * 0.15));
          }
        }

        // === NOSE ===
        const noseY = headY + headR * 0.33;
        const noseW = headR * 0.1;
        const nosePath = new Path().moveTo(cx, noseY - noseW * 0.6)
          .lineTo(cx - noseW, noseY + noseW * 0.4).lineTo(cx + noseW, noseY + noseW * 0.4).close();
        ds.drawPath(nosePath, NOSE_PINK.copy(0.95 * dim));

        // === MOUTH (W-shape) ===
        const mouthTop = noseY + noseW * 0.5;
        const mouthBot = mouthTop + headR * 0.1;
        const mouthW = headR * 0.22;

        if (isYawning) {
          ds.drawOval(C(0xFF2A1028).copy(0.95 * dim), O(cx - headR * 0.15, mouthTop), S(headR * 0.3, headR * 0.25));
          ds.drawOval(C(0xFFFF6688).copy(0.6 * dim), O(cx - headR * 0.06, mouthTop + headR * 0.1), S(headR * 0.12, headR * 0.08));
        } else if (mood === 'EATING') {
          const nom = sin(tailPhase * 4) * 0.5 + 0.5;
          ds.drawOval(C(0xFF2A1028).copy(0.9 * dim), O(cx - headR * 0.08, mouthTop), S(headR * 0.16, headR * 0.13 * nom));
        } else if (mood === 'HUNGRY') {
          ds.drawOval(C(0xFF2A1028).copy(0.85 * dim), O(cx - headR * 0.1, mouthTop), S(headR * 0.2, headR * 0.14));
        } else {
          ds.drawLine(MOUTH_COLOR.copy(0.9 * dim), O(cx, mouthTop), O(cx, mouthBot), { strokeWidth: 2.2, cap: StrokeCap.Round });
          const lm = new Path().moveTo(cx, mouthBot)
            .quadraticBezierTo(cx - mouthW * 0.45, mouthBot + headR * 0.09, cx - mouthW, mouthBot - headR * 0.01);
          ds.drawPath(lm, MOUTH_COLOR.copy(0.9 * dim), { style: Stroke(2.2, StrokeCap.Round) });
          const rm = new Path().moveTo(cx, mouthBot)
            .quadraticBezierTo(cx + mouthW * 0.45, mouthBot + headR * 0.09, cx + mouthW, mouthBot - headR * 0.01);
          ds.drawPath(rm, MOUTH_COLOR.copy(0.9 * dim), { style: Stroke(2.2, StrokeCap.Round) });
        }

        // === WHISKERS ===
        const whiskerY = noseY + noseW * 0.3;
        for (const side of PET_SIDES) {
          for (let i = 0; i <= 2; i++) {
            const sx = cx + side * headR * 0.18;
            const sy = whiskerY + (i - 1) * headR * 0.07;
            const angle = (i - 1) * 12 + sin(tailPhase * 0.5 + i) * 2;
            const ex2 = sx + side * headR * 0.85;
            const ey = sy + sin(angle * PI / 180) * headR * 0.1;
            ds.drawLine(WHISKER_COLOR.copy((0.55 + amplitude * 0.2) * dim), O(sx, sy), O(ex2, ey),
              { strokeWidth: 1.2, cap: StrokeCap.Round });
          }
        }

        // Crown
        if (p.isBirthday) drawCrown(ds, cx, headY - headR * 1.1 + crownBob, headR * 0.4, dim);
      }); // end head tilt
    };

    if (trickType === 'CAT_SPIN' && animRot !== 0) ds.rotate(animRot, O(cx, size.height * 0.45), drawCat);
    else drawCat();

    // === TRICK OVERLAY EFFECTS ===
    if (animTrickP > 0) {
      const fx = window.VPPets.trickFx && window.VPPets.trickFx.melo;
      if (fx) fx(ds, trickType, animTrickP, { cx, headY, headR, bodyY, s, dim, width: size.width });
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
      ds.drawCircle(Brush.radialGradient([NEON_CYAN.copy(amplitude * 0.15 * dim), Color.Transparent], O(cx, bodyY), s * 2.5),
        s * 2.5, O(cx, bodyY));
    }

    // Zzz
    if (mood === 'SLEEPING') {
      for (let i = 0; i <= 2; i++) {
        const zx = cx + s * (0.5 + i * 0.2) + sin(tailPhase * 0.5 + i) * 3;
        const zy = headY - headR * (0.4 + i * 0.3);
        const a = Math.trunc((0.55 - i * 0.12) * dim * 255) / 255;
        ds.drawText('z', zx, zy, { color: new Color(0, 229, 255, a), size: 12 + i * 3, bold: true });
      }
    }

    // Purring
    if (mood === 'HAPPY' && amplitude > 0.05) {
      for (let i = -1; i <= 1; i++) {
        ds.drawArc(NEON_CYAN.copy(0.1 * dim), 0, 180, false, O(cx - s * 0.4 + i * 4, bodyY - s * 0.15), S(s * 0.8, s * 0.2),
          { style: Stroke(1) });
      }
    }
  }

  // === TAIL ===
  function drawTail(ds, cx, bodyY, s, phase, bassAmp, dim, mood, isHunting) {
    const baseX = cx + s * 0.7, baseY = bodyY;
    if (mood === 'SLEEPING') {
      const curl = new Path().moveTo(baseX, baseY)
        .cubicTo(cx + s, bodyY + s * 0.4, cx + s * 0.15, bodyY + s * 0.55, cx - s * 0.25, bodyY + s * 0.3);
      ds.drawPath(curl, C(0x22000000), { style: Stroke(6, StrokeCap.Round) });
      ds.drawPath(curl, FUR_MAIN.copy(dim), { style: Stroke(4.5, StrokeCap.Round) });
      ds.drawPath(curl, NEON_CYAN.copy(0.15 * dim), { style: Stroke(6, StrokeCap.Round) });
    } else {
      const sw = sin(phase) * (isHunting ? 0.6 : 0.3 + bassAmp * 0.3) * s;
      const sw2 = sin(phase * 1.3 + 1) * 0.2 * s;
      const len = s * 1.3;
      const tail = new Path().moveTo(baseX, baseY)
        .cubicTo(baseX + sw * 0.5, baseY - len * 0.3, baseX + sw, baseY - len * 0.6 + sw2,
          baseX + sw * 0.6 + sw2, baseY - len * 0.85);
      ds.drawPath(tail, C(0x22000000), { style: Stroke(6.5, StrokeCap.Round) });
      ds.drawPath(tail, FUR_MAIN.copy(dim), { style: Stroke(4.5, StrokeCap.Round) });
      ds.drawPath(tail, NEON_CYAN.copy((0.2 + bassAmp * 0.3) * dim), { style: Stroke(6, StrokeCap.Round) });
      const tipX = baseX + sw * 0.6 + sw2, tipY = baseY - len * 0.85;
      ds.drawCircle(NEON_MAGENTA.copy((0.4 + bassAmp * 0.4) * dim), 3 + bassAmp * 3, O(tipX, tipY));
    }
  }

  function drawCrown(ds, cx, cy, size, dim) {
    const p = new Path().moveTo(cx - size, cy + size * 0.4).lineTo(cx - size, cy)
      .lineTo(cx - size * 0.5, cy + size * 0.2).lineTo(cx, cy - size * 0.3)
      .lineTo(cx + size * 0.5, cy + size * 0.2).lineTo(cx + size, cy)
      .lineTo(cx + size, cy + size * 0.4).close();
    ds.drawPath(p, C(0xFFFFD700).copy(0.9 * dim));
    ds.drawPath(p, C(0xFFFFEE00).copy(0.5 * dim), { style: Stroke(1.5) });
    ds.drawCircle(C(0xFFFF0044).copy(dim), size * 0.08, O(cx, cy - size * 0.15));
  }

  window.VPPets = window.VPPets || { renderers: {} };
  window.VPPets.renderers.melo = { name: 'Melo', tricks: TRICKS, create, draw };
})();
