/* Vumikio Pets on the web - Chip (squirrel), ported line by line from the app's SquirrelRenderer.kt.
   Left out: everything that only draws inside "Surf the Beat" (surf/fig == null on the web, so only the
   null branches remain) and the camouflage colour. The ten trick overlays live in chip_tricks.js. */
(function () {
  'use strict';
  const { Color, Stroke, StrokeCap, Brush, Path, C, O, S } = window.VPCompose;
  const A = window.VPAnim;
  const { Easing, PET_SIDES } = A;
  const PI = Math.PI;
  const { sin, cos, abs, max, min } = Math;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  // Squirrel colors - warm brown/auburn + neon cyan accents
  const FUR_BROWN = C(0xFF8B6540);
  const FUR_LIGHT = C(0xFFB08860);
  const FUR_DARK = C(0xFF5A3D25);
  const FUR_BELLY = C(0xFFE8D5B8);
  const TAIL_FLUFFY = C(0xFF9A7050);
  const TAIL_LIGHT = C(0xFFBB9070);
  const EAR_TUFT = C(0xFF6B4830);
  const NOSE_DARK = C(0xFF2A1A10);
  const EYE_BLACK = C(0xFF1A1008);
  const NEON_CYAN = C(0xFF00E5FF);
  const NEON_GREEN = C(0xFF00FF88);
  const CHEEK_COLOR = C(0x44FFAA66);
  const SHADOW = C(0x44000000);
  const HIGHLIGHT = C(0x33FFFFFF);
  const WHISKER_COLOR = C(0xFFCCBBAA);
  const PAW_COLOR = C(0xFF6B4830);
  const NUT_BROWN = C(0xFF8B5E3C);
  const NUT_LIGHT = C(0xFFAA7744);

  const TRICKS = ['SQUIRREL_SPIN', 'SQUIRREL_NUT_JUGGLE', 'SQUIRREL_TREE_CLIMB', 'SQUIRREL_TAIL_SHIELD',
    'SQUIRREL_ACORN_EXPLOSION', 'SQUIRREL_LIGHTNING_DASH', 'SQUIRREL_GOLDEN_ACORN', 'SQUIRREL_FOREST_SPIRIT',
    'SQUIRREL_FLYING_SQUIRREL', 'SQUIRREL_NATURE_CROWN'];

  // PetGenreColors.PALETTE (local copy, same rule: the longest key contained in the genre wins)
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
      if (needle.includes(k) && (best === null || k.length > best.length)) best = k;
    }
    return best === null ? null : C(GENRE_PALETTE[best]);
  }

  function create() { return { trickRot: 0 }; }

  function draw(ds, mem, p, now, dt) {
    const mood = p.mood;
    const energy = p.energy == null ? 100 : p.energy;
    const amplitude = p.amplitude || 0;
    const tempoScale = p.tempoScale == null ? 1 : p.tempoScale;
    const nightDimFactor = p.nightDimFactor == null ? 1 : p.nightDimFactor;
    const gazeX = p.gazeX || 0;
    const gazeY = p.gazeY || 0;
    const trickActive = !!p.trickActive;
    const trickType = p.trickType || 'SQUIRREL_SPIN';
    const hasNutInCheeks = !!p.hasNutInCheeks;
    const isDigging = !!p.isDigging;
    const digSide = p.digSide == null ? 1 : p.digSide;
    const accentColor = p.accentColor || NEON_CYAN;
    const speakIndicatorColor = p.speakIndicatorColor || NEON_CYAN;
    const isBirthday = !!p.isBirthday;

    // One scratch of each paw in a quarter of a second - squirrels dig in a flurry.
    const scratchPhase = A.inf(now, 0, 1, 240, Easing.Linear, false);
    const breathe = A.inf(now, 0.97, 1.03, 1800, Easing.FastOutSlowIn, true);
    // Tail - faster while dancing (rememberLoopPhase)
    const tailPhase = A.loopPhase(mem, 'tail', Math.trunc((mood === 'DANCING' ? 1000 : 2500) * tempoScale), dt);
    // Fast fidgeting (squirrels never sit still!)
    const fidgetPhase = A.inf(now, 0, 100, 1500, Easing.Linear, false);
    const blinkPhase = A.inf(now, 0, 100, 4000, Easing.Linear, false);
    const speakPulse = A.inf(now, 0.3, 1, 800, Easing.FastOutSlowIn, true);
    const crownBob = A.inf(now, -2, 2, 1500, Easing.FastOutSlowIn, true);
    const yawnPhase = A.inf(now, 0, 100, 9000, Easing.Linear, false);

    const isBlinking = blinkPhase > 96 - (1 - clamp(energy, 0, 100) / 100) * 2.5;
    const isYawning = !!p.forcedYawn || (mood === 'TIRED' && yawnPhase >= 88 && yawnPhase <= 95);
    // Squirrels fidget constantly
    const fidgetX = sin(fidgetPhase * 0.1) * 2;
    const fidgetY = cos(fidgetPhase * 0.13) * 1.5;

    const beatTarget = A.pulse(mem, 'beat', !!p.beatDetected, 1.12, 1, 120, now);
    const animBeat = A.springTo(mem, 'beat', beatTarget, dt, 0.4, 400);

    // A trick plays once from 0 to 1; the spin keeps turning the same way and eases out.
    A.onChange(mem, 'spin', trickActive + '|' + trickType, () => {
      if (trickActive && trickType === 'SQUIRREL_SPIN') mem.trickRot += 360;
    });
    const animRot = A.tweenTo(mem, 'rot', mem.trickRot, A.TRICK_SPIN_MS, Easing.FastOutSlowIn, now);
    const animTrickP = A.trickProgress(mem, trickActive, trickType, now);

    const bands = p.frequencyBands && p.frequencyBands.length >= 8 ? p.frequencyBands : new Float32Array(8);
    const dim = max(clamp(energy / 100, 0.5, 1) * nightDimFactor, 0.55);
    const bassAmp = (bands[0] + bands[1]) / 2;
    const midAmp = (bands[3] + bands[4]) / 2;
    const highAmp = (bands[6] + bands[7]) / 2;
    const genreGlow = genreColor(p.genre);
    const auraColor = genreGlow && (mood === 'DANCING' || mood === 'EXCITED')
      ? Color.lerp(accentColor, genreGlow, 0.5) : accentColor;

    const size = ds.size;
    const cx = size.width / 2 + fidgetX;
    const s = size.minDimension * 0.18 * breathe * animBeat;

    const bodyY = size.height * 0.58 + fidgetY;
    const headY = size.height * 0.35 + fidgetY;
    const headR = s * 0.48;
    const bodyW = s * 0.6;
    const bodyH = s * 0.55;

    const drawSquirrel = () => {
      // === GROUND SHADOW ===
      ds.drawOval(SHADOW, O(cx - bodyW * 1.1, bodyY + bodyH * 0.5), S(bodyW * 2.2, bodyH * 0.25));

      // === TAIL (BIG, CURLY - behind body, curves over the back!) ===
      drawSquirrelTail(ds, cx, bodyY, headY, s, tailPhase, bassAmp, dim, mood);

      // === BODY (upright sitting pose) ===
      // Outer aura halo
      ds.drawOval(
        Brush.radialGradient([auraColor.copy((0.15 + amplitude * 0.3) * dim), Color.Transparent],
          O(cx, bodyY), bodyW * 1.6),
        O(cx - bodyW * 1.4, bodyY - bodyH * 0.9), S(bodyW * 2.8, bodyH * 2.2));
      ds.drawOval(FUR_DARK.copy(dim * 0.5), O(cx - bodyW + 2, bodyY - bodyH * 0.4 + 2), S(bodyW * 2, bodyH * 1.1));
      ds.drawOval(Brush.radialGradient([FUR_LIGHT.copy(dim), FUR_BROWN.copy(dim)],
        O(cx - bodyW * 0.1, bodyY - bodyH * 0.2), bodyW * 1.3),
      O(cx - bodyW, bodyY - bodyH * 0.4), S(bodyW * 2, bodyH * 1.1));
      // White belly
      ds.drawOval(FUR_BELLY.copy(dim * 0.55), O(cx - bodyW * 0.4, bodyY - bodyH * 0.1), S(bodyW * 0.8, bodyH * 0.65));
      ds.drawOval(HIGHLIGHT.copy(dim * 0.25), O(cx - bodyW * 0.45, bodyY - bodyH * 0.4), S(bodyW * 0.9, bodyH * 0.3));
      // Neon outline
      ds.drawOval(accentColor.copy((0.15 + amplitude * 0.12) * dim), O(cx - bodyW, bodyY - bodyH * 0.4),
        S(bodyW * 2, bodyH * 1.1), { style: Stroke(1.5) });

      // === TINY PAWS (holding nut position) ===
      for (const side of PET_SIDES) {
        let pawX = cx + side * bodyW * 0.2;
        let pawY = bodyY - bodyH * 0.05;
        if (isDigging) {
          // Both paws go down to the ground on the side of the hole and take turns.
          const eigenerTakt = side < 0 ? scratchPhase : (scratchPhase + 0.5) % 1;
          const zug = sin(eigenerTakt * 2 * PI);
          pawX = cx + digSide * bodyW * (0.55 + 0.25 * zug) + side * bodyW * 0.12;
          pawY = bodyY + bodyH * (0.32 + 0.1 * (1 - abs(zug)));
        }
        const pawW = isDigging ? s * 0.14 : s * 0.1;
        const pawH = isDigging ? s * 0.1 : s * 0.08;
        ds.drawOval(PAW_COLOR.copy(dim), O(pawX - pawW * 0.5, pawY - pawH * 0.375), S(pawW, pawH));
      }

      // === NUT IN PAWS (when holding one) ===
      if (hasNutInCheeks || mood === 'EATING') {
        const nutX = cx;
        const nutY = bodyY - bodyH * 0.05;
        ds.drawOval(NUT_BROWN.copy(dim), O(nutX - s * 0.06, nutY - s * 0.05), S(s * 0.12, s * 0.1));
        ds.drawOval(NUT_LIGHT.copy(dim * 0.4), O(nutX - s * 0.03, nutY - s * 0.045), S(s * 0.06, s * 0.04));
      }

      // === HIND FEET ===
      for (const side of PET_SIDES) {
        const footX = cx + side * bodyW * 0.45;
        const footY = bodyY + bodyH * 0.45;
        ds.drawOval(PAW_COLOR.copy(dim), O(footX - s * 0.07, footY - s * 0.025), S(s * 0.14, s * 0.06));
      }

      // The head leans toward whatever the pet watches (PetMath.headTiltDeg(gazeX, 5)).
      const headTilt = clamp(gazeX, -1, 1) * 5;
      ds.rotate(headTilt, O(cx, headY + headR * 0.9), () => {
        // === HEAD ===
        ds.drawCircle(FUR_DARK.copy(dim * 0.4), headR, O(cx + 2, headY + 2));
        ds.drawCircle(Brush.radialGradient([FUR_LIGHT.copy(dim), FUR_BROWN.copy(dim)],
          O(cx - headR * 0.2, headY - headR * 0.15), headR * 1.4), headR, O(cx, headY));
        ds.drawOval(HIGHLIGHT.copy(dim * 0.3), O(cx - headR * 0.4, headY - headR * 0.8), S(headR * 0.8, headR * 0.35));
        ds.drawCircle(NEON_CYAN.copy((0.18 + amplitude * 0.1) * dim), headR, O(cx, headY), { style: Stroke(1.5) });

        // Cheek pouches (bigger when holding nuts!)
        const cheekSize = hasNutInCheeks ? headR * 0.22 : headR * 0.15;
        ds.drawCircle(CHEEK_COLOR.copy(dim), cheekSize, O(cx - headR * 0.5, headY + headR * 0.18));
        ds.drawCircle(CHEEK_COLOR.copy(dim), cheekSize, O(cx + headR * 0.5, headY + headR * 0.18));

        // === EARS (round with tufts - squirrel signature!) ===
        for (const side of PET_SIDES) {
          const earX = cx + side * headR * 0.5;
          // Mids lift the ears - the squirrel perks up at a voice.
          const earY = headY - headR * 0.75 - midAmp * headR * 0.22;
          const earR = headR * 0.18;
          ds.drawCircle(FUR_BROWN.copy(dim), earR, O(earX, earY));
          ds.drawCircle(NEON_CYAN.copy((0.2 + highAmp * 0.3) * dim), earR, O(earX, earY), { style: Stroke(1.2) });
          // Inner ear
          ds.drawCircle(C(0xFFDDBB99).copy(0.5 * dim), earR * 0.55, O(earX, earY));
          // Ear tuft (pointy fur on top!)
          const tuft = new Path()
            .moveTo(earX - earR * 0.3, earY - earR * 0.5)
            .lineTo(earX, earY - earR * 1.5)
            .lineTo(earX + earR * 0.3, earY - earR * 0.5)
            .close();
          ds.drawPath(tuft, EAR_TUFT.copy(dim));
          ds.drawPath(tuft, NEON_CYAN.copy(0.2 * dim), { style: Stroke(1) });
        }

        // === EYES (big, round, black) ===
        const eyeY = headY + headR * 0.02;
        const eyeSpacing = headR * 0.3;
        const eyeR = headR * 0.19;

        if (mood === 'SLEEPING' || isBlinking) {
          for (const side of PET_SIDES) {
            const arc = new Path()
              .moveTo(cx + side * eyeSpacing - eyeR, eyeY)
              .quadraticBezierTo(cx + side * eyeSpacing, eyeY - eyeR * 0.5, cx + side * eyeSpacing + eyeR, eyeY);
            ds.drawPath(arc, Color.White.copy(0.8 * dim), { style: Stroke(2.5, StrokeCap.Round) });
          }
        } else {
          // How far the black eye travels inside the white.
          const gx = eyeR * 0.22 * gazeX;
          const gy = eyeR * 0.22 * gazeY;
          for (const side of PET_SIDES) {
            const ex = cx + side * eyeSpacing;
            ds.drawCircle(Color.White.copy(0.95 * dim), eyeR, O(ex, eyeY));
            ds.drawCircle(EYE_BLACK.copy(dim), eyeR * 0.75, O(ex + gx, eyeY + gy));
            // Big anime highlight
            ds.drawCircle(Color.White.copy(0.92), eyeR * 0.3, O(ex + gx + eyeR * 0.15, eyeY + gy - eyeR * 0.25));
            ds.drawCircle(Color.White.copy(0.5), eyeR * 0.12, O(ex + gx - eyeR * 0.1, eyeY + gy + eyeR * 0.12));
          }
        }

        // === NOSE ===
        const noseY = headY + headR * 0.3;
        ds.drawCircle(NOSE_DARK.copy(0.9 * dim), headR * 0.06, O(cx, noseY));

        // === MOUTH (small smile) ===
        const mouthY = noseY + headR * 0.06;
        if (isYawning) {
          ds.drawOval(C(0xFF1A0A05).copy(0.9 * dim), O(cx - headR * 0.09, mouthY), S(headR * 0.18, headR * 0.16));
        } else if (mood === 'EATING') {
          // Nibbling (fast!)
          const nibble = sin(fidgetPhase * 0.2) * 0.5 + 0.5;
          ds.drawOval(C(0xFF1A0A05).copy(0.85 * dim), O(cx - headR * 0.06, mouthY), S(headR * 0.12, headR * 0.08 * nibble));
          // Buck teeth!
          ds.drawRect(Color.White.copy(0.9 * dim), O(cx - headR * 0.03, mouthY), S(headR * 0.025, headR * 0.04));
          ds.drawRect(Color.White.copy(0.9 * dim), O(cx + headR * 0.005, mouthY), S(headR * 0.025, headR * 0.04));
        } else {
          const smile = new Path()
            .moveTo(cx - headR * 0.1, mouthY)
            .quadraticBezierTo(cx, mouthY + headR * 0.06, cx + headR * 0.1, mouthY);
          ds.drawPath(smile, C(0xFF5A3322).copy(0.7 * dim), { style: Stroke(1.5, StrokeCap.Round) });
        }

        // === WHISKERS ===
        for (const side of PET_SIDES) {
          for (let i = 0; i <= 1; i++) {
            const sx = cx + side * headR * 0.15;
            const sy = noseY + i * headR * 0.04;
            ds.drawLine(WHISKER_COLOR.copy((0.4 + amplitude * 0.1) * dim),
              O(sx, sy), O(sx + side * headR * 0.55, sy + (i - 0.5) * headR * 0.05),
              { strokeWidth: 0.8, cap: StrokeCap.Round });
          }
        }
      }); // end head tilt

      // === STRIPES on back (chipmunk-like, subtle) ===
      for (let i = 0; i <= 2; i++) {
        const stripeY = bodyY - bodyH * (0.2 - i * 0.12);
        ds.drawLine(FUR_DARK.copy(0.2 * dim), O(cx - bodyW * 0.3, stripeY), O(cx + bodyW * 0.3, stripeY),
          { strokeWidth: 1, cap: StrokeCap.Round });
      }

      if (isBirthday) drawCrown(ds, cx, headY - headR - headR * 0.3 + crownBob, headR * 0.35, dim);
    };

    if (trickType === 'SQUIRREL_SPIN' && animRot !== 0) ds.rotate(animRot, O(cx, size.height * 0.48), drawSquirrel);
    else drawSquirrel();

    // === TRICK OVERLAY EFFECTS (SQUIRREL) === (see chip_tricks.js)
    if (animTrickP > 0) {
      const fx = window.VPPets.trickFx && window.VPPets.trickFx.chip;
      if (fx) fx(ds, trickType, animTrickP, cx, headY, headR, bodyY, s, dim);
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
      ds.drawCircle(Brush.radialGradient([NEON_GREEN.copy(amplitude * 0.1 * dim), Color.Transparent],
        O(cx, bodyY), s * 2.5), s * 2.5, O(cx, bodyY));
    }

    // Zzz
    if (mood === 'SLEEPING') {
      for (let i = 0; i <= 2; i++) {
        // Drifts and rises like the others' letters do.
        ds.drawText('z', cx + s * (0.4 + i * 0.15) + sin(tailPhase * 0.5 + i) * 3,
          headY - headR * (0.3 + i * 0.25) - (sin(tailPhase * 0.25 + i) * 0.5 + 0.5) * 4,
          { color: new Color(0, 229, 255, Math.trunc((0.5 - i * 0.1) * dim * 255) / 255), size: 11 + i * 2.5, bold: true });
      }
    }
  }

  // === BIG CURLY TAIL - curls OVER the back! ===
  function drawSquirrelTail(ds, cx, bodyY, headY, s, phase, bassAmp, dim, mood) {
    const baseX = cx + s * 0.45;
    const baseY = bodyY + s * 0.1;

    if (mood === 'SLEEPING') {
      const curl = new Path()
        .moveTo(baseX, baseY)
        .cubicTo(cx + s * 0.9, bodyY - s * 0.2, cx + s * 0.6, headY + s * 0.3, cx + s * 0.1, headY + s * 0.1);
      ds.drawPath(curl, TAIL_FLUFFY.copy(dim), { style: Stroke(10, StrokeCap.Round) });
      ds.drawPath(curl, NEON_CYAN.copy(0.1 * dim), { style: Stroke(12, StrokeCap.Round) });
    } else {
      const sway = sin(phase) * (0.2 + bassAmp * 0.25) * s;
      // Big S-curve that goes UP and OVER (squirrel signature!)
      const tail = new Path()
        .moveTo(baseX, baseY)
        .cubicTo(baseX + s * 0.5 + sway * 0.3, bodyY - s * 0.3,
          baseX + s * 0.3 + sway, headY + s * 0.5,
          baseX - s * 0.1 + sway * 0.5, headY + s * 0.1)
        // Curl tip
        .cubicTo(baseX - s * 0.3 + sway * 0.3, headY - s * 0.1,
          baseX - s * 0.5, headY + s * 0.2,
          baseX - s * 0.2, headY + s * 0.4);
      // Shadow
      ds.drawPath(tail, SHADOW, { style: Stroke(13, StrokeCap.Round) });
      // Fluffy layers
      ds.drawPath(tail, FUR_DARK.copy(dim * 0.5), { style: Stroke(11, StrokeCap.Round) });
      ds.drawPath(tail, TAIL_FLUFFY.copy(dim), { style: Stroke(8, StrokeCap.Round) });
      ds.drawPath(tail, TAIL_LIGHT.copy(dim * 0.5), { style: Stroke(5, StrokeCap.Round) });
      // Neon glow
      ds.drawPath(tail, NEON_CYAN.copy((0.12 + bassAmp * 0.2) * dim), { style: Stroke(12, StrokeCap.Round) });
    }
  }

  function drawCrown(ds, cx, cy, size, dim) {
    const p = new Path()
      .moveTo(cx - size, cy + size * 0.4).lineTo(cx - size, cy)
      .lineTo(cx - size * 0.5, cy + size * 0.2).lineTo(cx, cy - size * 0.3)
      .lineTo(cx + size * 0.5, cy + size * 0.2).lineTo(cx + size, cy)
      .lineTo(cx + size, cy + size * 0.4).close();
    ds.drawPath(p, C(0xFFFFD700).copy(0.9 * dim));
    ds.drawPath(p, C(0xFFFFEE00).copy(0.5 * dim), { style: Stroke(1.5) });
  }

  window.VPPets = window.VPPets || { renderers: {} };
  window.VPPets.renderers.chip = { name: 'Chip', tricks: TRICKS, create, draw };
})();
