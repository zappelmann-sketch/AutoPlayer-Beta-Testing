/* Vumikio Pets on the web - Octo, ported line by line from the app's OctopusRenderer.kt.
   Left out: everything that only draws inside "Surf the Beat" (surf == null on the web) and the
   camouflage colour (tarnfarbe == null). Every other line draws what the app draws. */
(function () {
  'use strict';
  const { Color, Stroke, StrokeCap, StrokeJoin, Brush, Path, C, O, S } = window.VPCompose;
  const A = window.VPAnim;
  const { Easing, PET_SIDES } = A;
  const PI = Math.PI;
  const { sin, cos, abs, min, max } = Math;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  // Neon color palette matching Glass-Dark-Neon theme
  const NEON_CYAN = C(0xFF00E5FF);
  const NEON_MAGENTA = C(0xFFFF00FF);
  const NEON_GOLD = C(0xFFFFD700);
  const NEON_PURPLE = C(0xFF8B5CF6);
  const BODY_COLOR = C(0xFF0A2540);
  const BODY_HIGHLIGHT = C(0xFF1A4570);
  const EYE_WHITE = C(0xFFE8F4FD);
  const EYE_PUPIL = C(0xFF0D1117);

  // Default tentacle colors (rainbow spectrum)
  const DEFAULT_TENTACLE_COLORS = [
    C(0xFFFF0044), C(0xFFFF6600), C(0xFFFFCC00), C(0xFF00FF66),
    C(0xFF00E5FF), C(0xFF0088FF), C(0xFF8B5CF6), C(0xFFFF00FF),
  ];
  const RAINBOW_COLORS = [
    C(0xFFFF0044), C(0xFFFF6600), C(0xFFFFCC00),
    C(0xFF00FF66), C(0xFF00E5FF), C(0xFF8B5CF6), C(0xFFFF00FF),
  ];

  const TRICKS = ['OCTO_SPIN', 'OCTO_INK_SPLASH', 'OCTO_TENTACLE_WAVE', 'OCTO_COLOR_SHIFT', 'OCTO_BUBBLE_RING',
    'OCTO_JET_PROPULSION', 'OCTO_GOLDEN_GLOW', 'OCTO_TENTACLE_KNOT', 'OCTO_HALO_RING', 'OCTO_COSMIC_SWIRL'];

  function create() { return { trickRotation: 0 }; }

  /**
   * p: { frequencyBands, amplitude, mood, beatDetected, energy, wantsToSpeak, speakIndicatorColor,
   *      accentColor, genre, isBirthday, nightDimFactor, trickActive, trickType, gazeX, gazeY,
   *      forcedYawn, tempoScale, blubbert, onGaehnen }
   */
  function draw(ds, mem, p, now, dt) {
    const mood = p.mood;
    const energy = p.energy;
    const tempoScale = p.tempoScale == null ? 1 : p.tempoScale;
    const nightDimFactor = p.nightDimFactor == null ? 1 : p.nightDimFactor;
    const gazeX = p.gazeX || 0;
    const gazeY = p.gazeY || 0;
    const trickActive = !!p.trickActive;
    const trickType = p.trickType || 'OCTO_SPIN';
    const accentColor = p.accentColor || NEON_CYAN;
    const speakIndicatorColor = p.speakIndicatorColor || NEON_CYAN;

    // The wave through the tentacles follows the mood (rememberLoopPhase).
    const idlePhase = A.loopPhase(mem, 'idle', (
      mood === 'DANCING' || mood === 'EXCITED' ? 1500
        : mood === 'SLEEPING' ? 7000
          : mood === 'TIRED' || mood === 'HUNGRY' ? 5500 : 4000) * tempoScale, dt);

    const breathe = A.inf(now, 0.95, 1.05, 2000, Easing.FastOutSlowIn, true);
    const blinkPhase = A.inf(now, 0, 100, 5000, Easing.Linear, false);
    // Tired eyes blink longer and later - the window widens as the energy drains.
    const isBlinking = blinkPhase > 95 - (1 - clamp(energy, 0, 100) / 100) * 2.5;

    // Beat pulse
    const beatScale = A.pulse(mem, 'beat', p.beatDetected, 1.15, 1, 150, now);
    const animatedBeatScale = A.springTo(mem, 'beat', beatScale, dt, 0.4, 300);

    // Speak indicator pulse
    const speakPulse = A.inf(now, 0.3, 1, 800, Easing.FastOutSlowIn, true);

    // A trick plays once from 0 to 1 and always from the beginning.
    const animatedTrickProgress = A.trickProgress(mem, trickActive, trickType, now);

    // Spin rotation for OCTO_SPIN - keeps turning the same way.
    A.onChange(mem, 'spin', trickActive + '|' + trickType, () => {
      if (trickActive && trickType === 'OCTO_SPIN') mem.trickRotation += 360;
    });
    const animatedRotation = A.tweenTo(mem, 'rot', mem.trickRotation, A.TRICK_SPIN_MS, Easing.FastOutSlowIn, now);

    const colorShiftPhase = A.inf(now, 0, 1, 1500, Easing.Linear, false);

    // Yawn animation (opens mouth when idle for too long)
    const yawnPhase = A.inf(now, 0, 100, 12000, Easing.Linear, false);
    const isYawning = !!p.forcedYawn ||
      ((mood === 'TIRED' || mood === 'HUNGRY') && yawnPhase >= 85 && yawnPhase <= 95);
    A.onChange(mem, 'yawn', isYawning, (y) => { if (y && p.onGaehnen) p.onGaehnen(); });

    // Birthday crown bob
    const crownBob = A.inf(now, -2, 2, 1500, Easing.FastOutSlowIn, true);

    const tentacleColors = DEFAULT_TENTACLE_COLORS;

    // Combined dimming: energy + night mode (same floor as the other four)
    const energyFactor = clamp(energy / 100, 0.55, 1);
    const totalDim = max(energyFactor * nightDimFactor, 0.55);

    // Active color-shift tint
    let activeTentacleColors = tentacleColors;
    if (trickType === 'OCTO_COLOR_SHIFT' && trickActive) {
      const idx = clamp(Math.floor(colorShiftPhase * RAINBOW_COLORS.length), 0, RAINBOW_COLORS.length - 1);
      activeTentacleColors = new Array(8).fill(RAINBOW_COLORS[idx]);
    }

    const size = ds.size;
    const cx = size.width / 2;
    const cy = size.height * 0.35;
    const headRadius = size.minDimension * 0.18 * breathe * animatedBeatScale;

    // Ground shadow
    ds.drawOval(C(0x33000000), O(cx - headRadius * 1.5, cy + headRadius * 2.8), S(headRadius * 3, headRadius * 0.5));

    const tp = animatedTrickProgress;

    // --- JET PROPULSION: lateral dash ---
    const jetOffsetX = trickType === 'OCTO_JET_PROPULSION' && tp > 0 ? -headRadius * 1.5 * sin(tp * PI) : 0;

    // --- SPIRIT/TRANSPARENT effect ---
    const bodyAlpha = trickType === 'OCTO_HALO_RING' && tp > 0.5 ? clamp(1 - (tp - 0.5) * 0.6, 0.5, 1) : 1;

    // --- Looking at something: eyes first, head a little ---
    const faceShiftX = headRadius * 0.10 * gazeX;
    const faceShiftY = headRadius * 0.07 * gazeY;
    const headTilt = clamp(gazeX, -1, 1) * 6;

    const mundFarbe = NEON_CYAN;
    const mundDeckkraft = 1;

    const drawPetBody = () => {
      drawTentacles(ds, cx + jetOffsetX, cy + headRadius * 0.6, headRadius, p.frequencyBands,
        idlePhase, totalDim * bodyAlpha, mood, activeTentacleColors);
      const drawHead = () => {
        drawOctopusBody(ds, cx + jetOffsetX, cy, headRadius, p.amplitude, totalDim * bodyAlpha, mood);
        drawOctopusEyes(ds, cx + jetOffsetX + faceShiftX, cy + faceShiftY, headRadius,
          isBlinking, mood, totalDim * bodyAlpha, isYawning, gazeX, gazeY, 1);
        drawMouth(ds, cx + jetOffsetX + faceShiftX * 0.7, cy + faceShiftY * 0.7, headRadius,
          mood, totalDim * bodyAlpha, isYawning, idlePhase, mundFarbe, mundDeckkraft, !!p.blubbert);
        if (p.isBirthday) {
          drawCrown(ds, cx + jetOffsetX + faceShiftX * 0.5, cy - headRadius * 1.1 + crownBob, headRadius * 0.5, totalDim);
        }
      };
      if (headTilt !== 0) ds.rotate(headTilt, O(cx + jetOffsetX, cy + headRadius), drawHead);
      else drawHead();
    };

    if (trickType === 'OCTO_SPIN' && animatedRotation !== 0) {
      ds.rotate(animatedRotation, O(cx, cy + headRadius * 0.3), drawPetBody);
    } else {
      drawPetBody();
    }

    // === TRICK OVERLAY EFFECTS ===
    if (tp > 0) drawTrick(ds, trickType, tp, cx, cy, headRadius, totalDim, jetOffsetX, colorShiftPhase);

    // "Wants to speak" indicator
    if (p.wantsToSpeak) {
      ds.drawCircle({
        brush: Brush.radialGradient([speakIndicatorColor.copy(speakPulse * 0.6),
          speakIndicatorColor.copy(speakPulse * 0.2), Color.Transparent], O(cx, cy), headRadius * 1.8),
        radius: headRadius * 1.8, center: O(cx, cy),
      });
      ds.drawCircle({
        color: speakIndicatorColor.copy(speakPulse * 0.8), radius: headRadius * 1.15, center: O(cx, cy),
        style: Stroke(3),
      });
    }

    // Glow halo - outer body aura in the user's accent colour
    if (energy > 20) {
      ds.drawCircle({
        brush: Brush.radialGradient([accentColor.copy(p.amplitude * 0.3 * totalDim), Color.Transparent], O(cx, cy), headRadius * 2.5),
        radius: headRadius * 2.5, center: O(cx, cy),
      });
    }

    // Sleeping: Zzz particles
    if (mood === 'SLEEPING') {
      const zzzPhase = idlePhase * 0.5;
      for (let i = 0; i <= 2; i++) {
        const zOffset = i * 0.8;
        const zx = cx + headRadius * (0.6 + i * 0.3) + sin(zzzPhase + zOffset) * 5;
        const zy = cy - headRadius * (0.5 + i * 0.4) - ((zzzPhase * 3) % (headRadius * 1.5));
        const alpha = (0.6 - i * 0.15) * totalDim;
        ds.drawText('z', zx, zy, { color: new Color(0, 229, 255, alpha), size: 14 + i * 4, bold: true });
      }
    }
  }

  function drawTrick(ds, trickType, tp, cx, cy, headRadius, totalDim, jetOffsetX, colorShiftPhase) {
    const pulse = sin(tp * PI);
    switch (trickType) {
      case 'OCTO_INK_SPLASH': {
        // Massive ink cloud explosion with spreading blobs and dripping trails
        const numParticles = 24;
        for (let i = 0; i < numParticles; i++) {
          const angle = i * (2 * PI / numParticles) + (i % 3) * 0.2;
          const speed = 1 + (i % 4) * 0.4;
          const dist = headRadius * speed * 2.8 * tp;
          const wobble = sin(tp * 8 + i * 1.5) * headRadius * 0.15;
          const px = cx + cos(angle) * dist + wobble;
          const py = cy + sin(angle) * dist + wobble * 0.5 + tp * tp * headRadius * 0.8;
          const fade = (1 - tp * 0.7) * totalDim;
          const blobSize = headRadius * (0.06 + (i % 5) * 0.025) * (1.2 - tp * 0.4);
          const col = DEFAULT_TENTACLE_COLORS[i % DEFAULT_TENTACLE_COLORS.length];
          ds.drawCircle(col.copy(fade * 0.3), blobSize * 2.5, O(px, py));
          ds.drawCircle(col.copy(fade * 0.85), blobSize, O(px, py));
          ds.drawCircle(Color.White.copy(fade * 0.5), blobSize * 0.35, O(px, py));
          const midX = (cx + px) / 2 + sin(i) * headRadius * 0.3;
          const midY = (cy + py) / 2 + cos(i) * headRadius * 0.2;
          const trailPath = new Path().moveTo(cx, cy).quadraticTo(midX, midY, px, py);
          ds.drawPath(trailPath, col.copy(fade * 0.2), { style: Stroke(2 + (i % 3), StrokeCap.Round) });
        }
        // Central dark cloud expanding
        ds.drawCircle({
          brush: Brush.radialGradient([C(0xFF1A0030).copy(pulse * 0.6 * totalDim),
            NEON_PURPLE.copy(pulse * 0.2 * totalDim), Color.Transparent], O(cx, cy), headRadius * 2 * tp),
          radius: headRadius * 2 * tp, center: O(cx, cy),
        });
        break;
      }
      case 'OCTO_TENTACLE_WAVE': {
        // Mexican wave: each tentacle rises, glows neon, and drops sequentially
        for (let i = 0; i <= 7; i++) {
          const waveT = clamp((tp * 12 - i * 1.2) % 3, 0, 1);
          const lift = sin(waveT * PI);
          const angle = -PI * 0.85 + (i / 7) * PI * 0.7;
          const baseX = cx + cos(angle + PI / 2) * headRadius * 0.7;
          const baseY = cy + headRadius * 0.5;
          const tipX = baseX + cos(angle * 0.5) * headRadius * 2.2;
          const tipY = baseY + headRadius * 2.2 - lift * headRadius * 1.8;
          const midX = (baseX + tipX) / 2 + cos(angle) * headRadius * 0.5;
          const midY = (baseY + tipY) / 2 - lift * headRadius * 0.6;
          const tentPath = new Path().moveTo(baseX, baseY - lift * headRadius * 0.3).quadraticTo(midX, midY, tipX, tipY);
          const col = DEFAULT_TENTACLE_COLORS[i];
          ds.drawPath(tentPath, col.copy(lift * 0.3 * totalDim), { style: Stroke(8, StrokeCap.Round) });
          ds.drawPath(tentPath, col.copy(lift * 0.85 * totalDim), { style: Stroke(3.5, StrokeCap.Round) });
          if (lift > 0.3) {
            ds.drawCircle(Color.White.copy(lift * 0.7 * totalDim), headRadius * 0.06, O(tipX, tipY));
            ds.drawCircle(col.copy(lift * 0.4 * totalDim), headRadius * 0.12, O(tipX, tipY));
          }
        }
        break;
      }
      case 'OCTO_COLOR_SHIFT': {
        // Full rainbow morphing: body pulses through spectrum with prismatic rings
        const numRings = 5;
        for (let ring = 0; ring < numRings; ring++) {
          const ringP = clamp(tp - ring * 0.12, 0, 1);
          const ringR = headRadius * (1.2 + ringP * 2.5 + ring * 0.4);
          const colorIdx = Math.floor(colorShiftPhase * RAINBOW_COLORS.length + ring * 1.5) % RAINBOW_COLORS.length;
          const col = RAINBOW_COLORS[colorIdx];
          const alpha = (1 - ringP * 0.6) * sin(ringP * PI) * totalDim * 0.7;
          ds.drawCircle(col.copy(alpha), ringR, O(cx, cy), { style: Stroke(3 - ring * 0.4) });
          ds.drawCircle(col.copy(alpha * 0.15), ringR, O(cx, cy));
        }
        // Prismatic sparkles orbiting
        for (let i = 0; i <= 11; i++) {
          const orbitAngle = i * (2 * PI / 12) + tp * 6 + colorShiftPhase * 4;
          const orbitR = headRadius * (1.4 + sin(tp * 3 + i) * 0.3);
          const sx = cx + cos(orbitAngle) * orbitR;
          const sy = cy + sin(orbitAngle) * orbitR;
          const col = RAINBOW_COLORS[i % RAINBOW_COLORS.length];
          ds.drawCircle(col.copy(pulse * 0.8 * totalDim), headRadius * 0.04, O(sx, sy));
          ds.drawCircle(Color.White.copy(pulse * 0.5 * totalDim), headRadius * 0.02, O(sx, sy));
        }
        break;
      }
      case 'OCTO_BUBBLE_RING': {
        // Cascading bubble rings rising with shimmer and wobble
        const numBubbles = 16;
        for (let wave = 0; wave <= 2; wave++) {
          const waveP = clamp(tp - wave * 0.2, 0, 1);
          for (let i = 0; i < numBubbles; i++) {
            const angle = (i / numBubbles) * 2 * PI + wave * 0.5;
            const ringR = headRadius * (1.2 + wave * 0.5);
            const rise = waveP * headRadius * (2.5 + wave * 1);
            const wobble = sin(waveP * 6 + i * 0.8) * headRadius * 0.12;
            const bx = cx + cos(angle + waveP * 0.5) * ringR + wobble;
            const by = cy - rise + sin(i * 0.7) * headRadius * 0.1;
            const alpha = (1 - waveP * 0.7) * totalDim * (0.5 + wave * 0.15);
            const bubbleR = headRadius * (0.05 + (i % 3) * 0.02) * (1.3 - waveP * 0.5);
            ds.drawCircle(NEON_CYAN.copy(alpha * 0.6), bubbleR, O(bx, by), { style: Stroke(1.5) });
            ds.drawCircle(NEON_CYAN.copy(alpha * 0.15), bubbleR, O(bx, by));
            ds.drawCircle(Color.White.copy(alpha * 0.6), bubbleR * 0.3, O(bx - bubbleR * 0.3, by - bubbleR * 0.3));
          }
        }
        break;
      }
      case 'OCTO_JET_PROPULSION': {
        // Explosive jet dash with fire trail, speed lines, and shockwave
        const dashDir = -1;
        const shockR = headRadius * tp * 3;
        ds.drawCircle(NEON_CYAN.copy((1 - tp) * 0.4 * totalDim), shockR, O(cx - jetOffsetX, cy), { style: Stroke(3) });
        for (let i = 0; i <= 14; i++) {
          const spread = (i - 7) * headRadius * 0.08;
          const trailX = cx + jetOffsetX + dashDir * headRadius * (0.4 + i * 0.22) * tp;
          const trailY = cy + spread + sin(tp * 10 + i) * headRadius * 0.05;
          const trailAlpha = max(1 - tp * 0.5 - i * 0.04, 0) * totalDim;
          const trailR = headRadius * max(0.12 - i * 0.006, 0.02);
          const col = i < 5 ? NEON_CYAN : i < 10 ? C(0xFF00AAFF) : C(0xFF0066CC);
          ds.drawCircle(col.copy(trailAlpha * 0.7), trailR, O(trailX, trailY));
        }
        for (let i = -4; i <= 4; i++) {
          const ly = cy + i * headRadius * 0.25;
          const lineLen = headRadius * (2 + (i % 2)) * tp;
          const alpha = pulse * totalDim * 0.4;
          ds.drawLine(Color.White.copy(alpha), O(cx + jetOffsetX + headRadius, ly),
            O(cx + jetOffsetX + headRadius + lineLen, ly), { strokeWidth: 1.5 - abs(i) * 0.15 });
        }
        for (let g = 1; g <= 3; g++) {
          const ghostAlpha = (0.15 - g * 0.04) * totalDim;
          const ghostX = cx + jetOffsetX * (1 - g * 0.3);
          ds.drawCircle(BODY_COLOR.copy(ghostAlpha), headRadius, O(ghostX, cy));
        }
        break;
      }
      case 'OCTO_GOLDEN_GLOW': {
        for (let layer = 0; layer <= 3; layer++) {
          const layerR = headRadius * (1.5 + layer * 0.8 + tp * 1.5);
          const layerAlpha = pulse * (0.4 - layer * 0.08) * totalDim;
          ds.drawCircle({
            brush: Brush.radialGradient([NEON_GOLD.copy(layerAlpha), Color.Transparent], O(cx, cy), layerR),
            radius: layerR, center: O(cx, cy),
          });
        }
        for (let i = 0; i <= 11; i++) {
          const orbitAngle = i * (2 * PI / 12) + tp * 4;
          const orbitR = headRadius * (1.5 + sin(tp * 3 + i * 0.7) * 0.4);
          const mx = cx + cos(orbitAngle) * orbitR;
          const my = cy + sin(orbitAngle) * orbitR;
          const mAlpha = pulse * 0.9 * totalDim;
          ds.drawCircle(NEON_GOLD.copy(mAlpha), headRadius * 0.045, O(mx, my));
          ds.drawCircle(Color.White.copy(mAlpha * 0.7), headRadius * 0.02, O(mx, my));
        }
        for (let i = 0; i <= 19; i++) {
          const rainX = cx + (i - 9.5) * headRadius * 0.28;
          const rainPhase = (tp * 2 + i * 0.15) % 1;
          const rainY = cy - headRadius * 3 + rainPhase * headRadius * 6;
          const rainAlpha = sin(rainPhase * PI) * totalDim * 0.8;
          ds.drawCircle(NEON_GOLD.copy(rainAlpha), headRadius * 0.035, O(rainX, rainY));
          ds.drawLine(NEON_GOLD.copy(rainAlpha * 0.4), O(rainX, rainY), O(rainX, rainY - headRadius * 0.15), { strokeWidth: 1.5 });
        }
        break;
      }
      case 'OCTO_TENTACLE_KNOT': {
        const rotAngle = tp * 2 * PI;
        const starPoints = 8;
        const outerR = headRadius * (1.6 + pulse * 0.4);
        const innerR = headRadius * 0.6;
        const starPath = new Path();
        for (let i = 0; i < starPoints * 2; i++) {
          const a = rotAngle + i * PI / starPoints;
          const r = i % 2 === 0 ? outerR : innerR;
          const x = cx + cos(a) * r; const y = cy + sin(a) * r;
          if (i === 0) starPath.moveTo(x, y); else starPath.lineTo(x, y);
        }
        starPath.close();
        ds.drawPath(starPath, NEON_MAGENTA.copy(tp * 0.25 * totalDim));
        ds.drawPath(starPath, NEON_MAGENTA.copy(tp * 0.7 * totalDim), { style: Stroke(2.5) });
        const innerStar = new Path();
        for (let i = 0; i < 6; i++) {
          const a = -rotAngle * 1.5 + i * PI / 3;
          const r = i % 2 === 0 ? headRadius * 0.9 : headRadius * 0.35;
          const x = cx + cos(a) * r; const y = cy + sin(a) * r;
          if (i === 0) innerStar.moveTo(x, y); else innerStar.lineTo(x, y);
        }
        innerStar.close();
        ds.drawPath(innerStar, NEON_CYAN.copy(tp * 0.5 * totalDim), { style: Stroke(2) });
        for (let i = 0; i <= 7; i++) {
          const a = rotAngle + i * PI / 4;
          const tipX = cx + cos(a) * outerR;
          const tipY = cy + sin(a) * outerR;
          const tentAngle = -PI * 0.85 + (i / 7) * PI * 0.7;
          const baseX = cx + cos(tentAngle + PI / 2) * headRadius * 0.7;
          const baseY = cy + headRadius * 0.5;
          ds.drawLine(NEON_MAGENTA.copy(tp * 0.3 * totalDim), O(baseX, baseY), O(tipX, tipY), { strokeWidth: 1.5 });
        }
        ds.drawCircle({
          brush: Brush.radialGradient([Color.White.copy(pulse * 0.4 * totalDim), Color.Transparent], O(cx, cy), headRadius * 0.8),
          radius: headRadius * 0.8, center: O(cx, cy),
        });
        break;
      }
      case 'OCTO_HALO_RING': {
        const haloY = cy - headRadius * (1.8 + pulse * 0.3);
        const haloR = headRadius * (0.6 + pulse * 0.15);
        const ha = pulse * totalDim;
        const beamPath = new Path().moveTo(cx - headRadius * 0.5, haloY)
          .lineTo(cx - headRadius * 1.2, cy + headRadius * 2)
          .lineTo(cx + headRadius * 1.2, cy + headRadius * 2)
          .lineTo(cx + headRadius * 0.5, haloY).close();
        ds.drawPath(beamPath, Brush.verticalGradient([NEON_GOLD.copy(ha * 0.25), NEON_GOLD.copy(ha * 0.05), Color.Transparent],
          haloY, cy + headRadius * 2));
        for (let ring = 0; ring <= 2; ring++) {
          const rr = haloR + ring * headRadius * 0.12;
          const ringAlpha = ha * (0.9 - ring * 0.25);
          ds.drawCircle(NEON_GOLD.copy(ringAlpha), rr, O(cx, haloY - ring * 3), { style: Stroke(3 - ring) });
        }
        ds.drawCircle({
          brush: Brush.radialGradient([NEON_GOLD.copy(ha * 0.5), Color.Transparent], O(cx, haloY), haloR * 1.5),
          radius: haloR * 1.5, center: O(cx, haloY),
        });
        for (let i = 0; i <= 9; i++) {
          const sparkPhase = (tp * 1.5 + i * 0.1) % 1;
          const sx = cx + sin(i * 1.3 + tp * 4) * headRadius * 0.8;
          const sy = cy + headRadius - sparkPhase * headRadius * 4;
          const sa = sin(sparkPhase * PI) * totalDim * 0.8;
          ds.drawCircle(NEON_GOLD.copy(sa), headRadius * 0.03, O(sx, sy));
          ds.drawCircle(Color.White.copy(sa * 0.6), headRadius * 0.015, O(sx, sy));
        }
        break;
      }
      case 'OCTO_COSMIC_SWIRL': {
        for (let cloud = 0; cloud <= 5; cloud++) {
          const ca = cloud * 1.1 + tp * 2;
          const cr = headRadius * (1.5 + cloud * 0.3);
          const cloudX = cx + cos(ca) * cr * 0.5;
          const cloudY = cy + sin(ca) * cr * 0.4;
          const cloudR = headRadius * (0.8 + cloud * 0.2);
          const cloudCol = RAINBOW_COLORS[cloud % RAINBOW_COLORS.length];
          ds.drawCircle({
            brush: Brush.radialGradient([cloudCol.copy(tp * 0.12 * totalDim), Color.Transparent], O(cloudX, cloudY), cloudR),
            radius: cloudR, center: O(cloudX, cloudY),
          });
        }
        const spiralArms = 4;
        for (let arm = 0; arm < spiralArms; arm++) {
          const armOffset = arm * (2 * PI / spiralArms);
          for (let j = 0; j <= 39; j++) {
            const t = j / 39;
            const spiralAngle = armOffset + t * 5 * PI + tp * 3 * PI;
            const r = headRadius * (0.2 + t * 2.5);
            const wobble = sin(j * 0.5 + tp * 5) * headRadius * 0.06;
            const px = cx + cos(spiralAngle) * r + wobble;
            const py = cy + sin(spiralAngle) * r * 0.65 + wobble * 0.5;
            const alpha = (0.3 + t * 0.5) * (1 - t * 0.2) * tp * totalDim;
            const starSize = headRadius * (0.02 + (1 - t) * 0.035);
            const starColor = RAINBOW_COLORS[(arm + Math.floor(j / 5)) % RAINBOW_COLORS.length];
            ds.drawCircle(starColor.copy(alpha * 0.5), starSize * 2, O(px, py));
            ds.drawCircle(starColor.copy(alpha), starSize, O(px, py));
            if (j % 8 === 0) ds.drawCircle(Color.White.copy(alpha * 0.7), starSize * 0.4, O(px, py));
          }
        }
        ds.drawCircle({
          brush: Brush.radialGradient([Color.White.copy(tp * 0.6 * totalDim), NEON_PURPLE.copy(tp * 0.4 * totalDim),
            NEON_MAGENTA.copy(tp * 0.15 * totalDim), Color.Transparent], O(cx, cy), headRadius * 1.5),
          radius: headRadius * 1.5, center: O(cx, cy),
        });
        ds.drawCircle(Color.White.copy(pulse * 0.5 * totalDim), headRadius * 0.5, O(cx, cy), { style: Stroke(2) });
        break;
      }
      default: break; // OCTO_SPIN handled via rotation
    }
  }

  // === BODY ===
  function koerperFarbe(mood) {
    switch (mood) {
      case 'EXCITED': return C(0xFF1A3050);
      case 'DANCING': return C(0xFF102050);
      case 'HUNGRY': return C(0xFF2A1A30);
      case 'TIRED': return C(0xFF1A1A25);
      case 'SLEEPING': return C(0xFF151520);
      case 'EATING': return C(0xFF0A3040);
      case 'RELAXED': return C(0xFF0A2535);
      default: return BODY_COLOR; // HAPPY
    }
  }

  function drawOctopusBody(ds, cx, cy, headRadius, amplitude, energyFactor, mood) {
    const bodyColor = koerperFarbe(mood);
    const hellerPol = BODY_HIGHLIGHT;
    const konturFarbe = NEON_CYAN;
    const bodyPath = new Path()
      .moveTo(cx - headRadius, cy + headRadius * 0.3)
      .cubicTo(cx - headRadius, cy - headRadius * 0.5, cx - headRadius * 0.4, cy - headRadius * 1.1, cx, cy - headRadius)
      .cubicTo(cx + headRadius * 0.4, cy - headRadius * 1.1, cx + headRadius, cy - headRadius * 0.5, cx + headRadius, cy + headRadius * 0.3)
      .cubicTo(cx + headRadius * 0.7, cy + headRadius * 0.7, cx - headRadius * 0.7, cy + headRadius * 0.7, cx - headRadius, cy + headRadius * 0.3)
      .close();
    ds.drawPath(bodyPath, C(0x33000000));
    ds.drawPath(bodyPath, Brush.radialGradient([hellerPol.copy(energyFactor), bodyColor.copy(energyFactor)],
      O(cx - headRadius * 0.3, cy - headRadius * 0.3), headRadius * 2));
    ds.drawOval(C(0x22FFFFFF).copy(energyFactor * 0.35), O(cx - headRadius * 0.4, cy - headRadius * 0.9),
      S(headRadius * 0.8, headRadius * 0.35));
    const konturDeckkraft = 0.4 * energyFactor + amplitude * 0.3;
    ds.drawPath(bodyPath, konturFarbe.copy(konturDeckkraft), { style: Stroke(2, StrokeCap.Round, StrokeJoin.Round) });
  }

  // === EYES ===
  function drawOctopusEyes(ds, cx, cy, headRadius, isBlinking, mood, energyFactor, isYawning, gazeX, gazeY, wide) {
    const eyeSpacing = headRadius * 0.45;
    const eyeRadius = headRadius * 0.18;
    const eyeY = cy - headRadius * 0.15;
    if (mood === 'SLEEPING' || isBlinking) {
      PET_SIDES.forEach((side) => {
        ds.drawLine(EYE_WHITE.copy(energyFactor), O(cx + side * eyeSpacing - eyeRadius, eyeY),
          O(cx + side * eyeSpacing + eyeRadius, eyeY), { strokeWidth: 2.5, cap: StrokeCap.Round });
      });
      return;
    }
    const eyeScaleY = wide * (isYawning ? 0.5 : mood === 'HUNGRY' ? 0.6 : mood === 'TIRED' ? 0.7 : mood === 'EXCITED' ? 1.2 : 1);
    PET_SIDES.forEach((side) => {
      const eyeX = cx + side * eyeSpacing;
      ds.drawOval(EYE_WHITE.copy(energyFactor), O(eyeX - eyeRadius, eyeY - eyeRadius * eyeScaleY),
        S(eyeRadius * 2, eyeRadius * 2 * eyeScaleY));
      const pupilRadius = eyeRadius * 0.55;
      const pupilX = eyeX + (eyeRadius - pupilRadius) * 0.85 * gazeX;
      const pupilY = eyeY + (eyeRadius * eyeScaleY - pupilRadius) * 0.85 * gazeY;
      ds.drawCircle(EYE_PUPIL, pupilRadius, O(pupilX, pupilY));
      ds.drawCircle(Color.White.copy(0.8), pupilRadius * 0.3, O(pupilX + pupilRadius * 0.3, pupilY - pupilRadius * 0.3));
    });
  }

  // === MOUTH ===
  function drawMouth(ds, cx, cy, headRadius, mood, energyFactor, isYawning, phase, strichFarbe, deckkraftFaktor, blubbert) {
    if (mood === 'SLEEPING') return;
    const mouthY = cy + headRadius * 0.15;
    const dk = (a) => min(a * deckkraftFaktor, 1) * energyFactor;
    const sw = (w) => w * min(deckkraftFaktor, 1.6);
    if (blubbert) {
      const puls = 0.85 + 0.15 * sin(phase * 9);
      const w = headRadius * 0.13 * puls;
      const h = headRadius * 0.16 * puls;
      ds.drawOval(C(0xFF1A0A2A).copy(energyFactor), O(cx - w * 0.5, mouthY - h * 0.5), S(w, h));
      ds.drawOval(strichFarbe.copy(dk(0.7)), O(cx - w * 0.5, mouthY - h * 0.5), S(w, h), { style: Stroke(sw(1.6)) });
      return;
    }
    if (isYawning) {
      const yawnSize = headRadius * 0.25;
      ds.drawOval(C(0xFF1A0A2A).copy(energyFactor), O(cx - yawnSize * 0.6, mouthY - yawnSize * 0.3), S(yawnSize * 1.2, yawnSize * 0.8));
      ds.drawOval(strichFarbe.copy(dk(0.3)), O(cx - yawnSize * 0.6, mouthY - yawnSize * 0.3), S(yawnSize * 1.2, yawnSize * 0.8),
        { style: Stroke(1.5) });
      return;
    }
    if (mood === 'HUNGRY' || mood === 'TIRED') {
      const path = new Path().moveTo(cx - headRadius * 0.15, mouthY + headRadius * 0.08)
        .quadraticBezierTo(cx, mouthY - headRadius * 0.05, cx + headRadius * 0.15, mouthY + headRadius * 0.08);
      ds.drawPath(path, strichFarbe.copy(dk(0.4)), { style: Stroke(sw(1.5), StrokeCap.Round) });
    } else if (mood === 'EATING') {
      const nomPhase = sin(phase * 3) * 0.5 + 0.5;
      const mouthOpen = headRadius * 0.08 * nomPhase;
      ds.drawOval(C(0xFF1A0A2A).copy(energyFactor), O(cx - headRadius * 0.1, mouthY - mouthOpen),
        S(headRadius * 0.2, mouthOpen * 2 + headRadius * 0.04));
    } else if (mood === 'HAPPY' || mood === 'DANCING' || mood === 'EXCITED') {
      const path = new Path().moveTo(cx - headRadius * 0.2, mouthY)
        .quadraticBezierTo(cx, mouthY + headRadius * 0.2, cx + headRadius * 0.2, mouthY);
      ds.drawPath(path, strichFarbe.copy(dk(0.6)), { style: Stroke(sw(2), StrokeCap.Round) });
    } else {
      // RELAXED: a smaller, calmer version of the happy smile
      const path = new Path().moveTo(cx - headRadius * 0.15, mouthY)
        .quadraticBezierTo(cx, mouthY + headRadius * 0.11, cx + headRadius * 0.15, mouthY);
      ds.drawPath(path, strichFarbe.copy(dk(0.45)), { style: Stroke(sw(1.6), StrokeCap.Round) });
    }
  }

  // === CROWN (Birthday) ===
  function drawCrown(ds, cx, cy, size, dimFactor) {
    const crownColor = C(0xFFFFD700).copy(0.9 * dimFactor);
    const path = new Path().moveTo(cx - size, cy + size * 0.4).lineTo(cx - size, cy)
      .lineTo(cx - size * 0.5, cy + size * 0.2).lineTo(cx, cy - size * 0.3)
      .lineTo(cx + size * 0.5, cy + size * 0.2).lineTo(cx + size, cy)
      .lineTo(cx + size, cy + size * 0.4).close();
    ds.drawPath(path, crownColor);
    ds.drawPath(path, C(0xFFFFEE00).copy(0.5 * dimFactor), { style: Stroke(1.5) });
    ds.drawCircle(C(0xFFFF0044).copy(dimFactor), size * 0.08, O(cx, cy - size * 0.15));
    ds.drawCircle(C(0xFF00E5FF).copy(dimFactor), size * 0.06, O(cx - size * 0.5, cy + size * 0.05));
    ds.drawCircle(C(0xFF00FF66).copy(dimFactor), size * 0.06, O(cx + size * 0.5, cy + size * 0.05));
  }

  // === TENTACLES ===
  function drawTentacles(ds, cx, cy, headRadius, frequencyBands, idlePhase, energyFactor, mood, colors) {
    const tentacleCount = 8;
    const tentacleLength = headRadius * 2.5;
    const bands = frequencyBands && frequencyBands.length >= 8 ? frequencyBands : new Float32Array(8);
    const isSleeping = mood === 'SLEEPING' || mood === 'TIRED';
    for (let i = 0; i < tentacleCount; i++) {
      const angle = -PI * 0.85 + (i / (tentacleCount - 1)) * PI * 0.7;
      const baseX = cx + cos(angle + PI / 2) * headRadius * 0.7;
      const baseY = cy + headRadius * 0.5;
      const bandAmplitude = bands[i] * energyFactor;
      const idleWave = isSleeping ? sin(idlePhase + i * 0.5) * 0.05 : sin(idlePhase + i * 0.8) * 0.15;
      const displacement = idleWave + bandAmplitude * 0.8;
      const endAngle = angle * 0.7;
      const tipX = baseX + cos(endAngle) * tentacleLength * (0.6 + displacement * 0.4);
      const tipY = baseY + tentacleLength * (0.8 + (isSleeping ? 0.2 : displacement * 0.3));
      const midX = baseX + cos(endAngle) * tentacleLength * 0.4 + sin(idlePhase * 1.3 + i * 1.2) * headRadius * (0.3 + bandAmplitude * 0.5);
      const midY = baseY + tentacleLength * 0.45 + cos(idlePhase * 0.8 + i * 0.9) * headRadius * 0.1;
      const mid2X = tipX - cos(endAngle) * tentacleLength * 0.2 + sin(idlePhase * 0.7 + i * 1.5) * headRadius * (0.2 + bandAmplitude * 0.3);
      const mid2Y = tipY - tentacleLength * 0.25;
      const path = new Path().moveTo(baseX, baseY).cubicTo(midX, midY, mid2X, mid2Y, tipX, tipY);
      const baseColor = colors[i % colors.length];
      const glow = (0.3 + bandAmplitude * 0.7) * energyFactor;
      ds.drawPath(path, baseColor.copy(glow * 0.3), { style: Stroke(8 + bandAmplitude * 6, StrokeCap.Round, StrokeJoin.Round) });
      ds.drawPath(path, baseColor.copy(glow), { style: Stroke(3 + bandAmplitude * 2, StrokeCap.Round, StrokeJoin.Round) });
      ds.drawPath(path, Color.White.copy(bandAmplitude * 0.4 * energyFactor), { style: Stroke(1.5, StrokeCap.Round, StrokeJoin.Round) });
      if (energyFactor > 0.3) {
        for (let c = 1; c <= 4; c++) {
          const t = c / 5;
          const px = bezierPoint(baseX, midX, mid2X, tipX, t);
          const py = bezierPoint(baseY, midY, mid2Y, tipY, t);
          ds.drawCircle(baseColor.copy(0.4 * energyFactor), (2 + bandAmplitude * 2) * (1 - t * 0.5), O(px, py));
        }
      }
    }
  }

  function bezierPoint(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
  }

  window.VPPets = window.VPPets || { renderers: {} };
  window.VPPets.renderers.octo = { name: 'Octo', tricks: TRICKS, create, draw };
})();
