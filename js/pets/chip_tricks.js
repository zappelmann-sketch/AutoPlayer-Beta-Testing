/* Vumikio Pets on the web - Chip's trick overlay effects, ported line by line from the
   "TRICK OVERLAY EFFECTS (SQUIRREL)" block of the app's SquirrelRenderer.kt.
   Loaded before chip.js; chip.js calls window.VPPets.trickFx.chip(...) while a trick plays. */
(function () {
  'use strict';
  const { Color, Stroke, StrokeCap, Brush, Path, C, O, S } = window.VPCompose;
  const PI = Math.PI;
  const { sin, cos, abs } = Math;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const SIDES = [-1, 1];

  const FUR_BROWN = C(0xFF8B6540);
  const FUR_LIGHT = C(0xFFB08860);
  const NEON_CYAN = C(0xFF00E5FF);

  /** ds, trick name, progress tp (>0), centre x, head y/radius, body y, scale s, dim, lazily: nothing else. */
  function drawChipTrick(ds, trickType, tp, cx, headY2, headR2, bodyY2, s2, dim) {
    const neonGold = C(0xFFFFD700);
    const neonBrown = C(0xFFCC8833);
    const neonGreen = C(0xFF00FF66);
    const pulse = sin(tp * PI);
    switch (trickType) {
      case 'SQUIRREL_NUT_JUGGLE': {
        // Spectacular 5-nut juggling with arc trails and catching sparkles
        for (let i = 0; i <= 4; i++) {
          const nutAngle = (i * 72 + tp * 900) * PI / 180;
          const orbitR = headR2 * (1.3 + (i % 2) * 0.3);
          const nx = cx + cos(nutAngle) * orbitR;
          const ny = headY2 + sin(nutAngle) * orbitR * 0.7 - abs(sin(nutAngle)) * headR2 * 0.4;
          const alpha = tp * dim;
          // Arc trail
          for (let trail = 1; trail <= 3; trail++) {
            const trailAngle = nutAngle - trail * 0.15;
            const tx = cx + cos(trailAngle) * orbitR;
            const ty = headY2 + sin(trailAngle) * orbitR * 0.7;
            ds.drawCircle(neonBrown.copy(alpha * (0.3 - trail * 0.08)), s2 * 0.04, O(tx, ty));
          }
          // Nut glow
          ds.drawCircle(neonGold.copy(alpha * 0.2), s2 * 0.14, O(nx, ny));
          // Nut body
          ds.drawCircle(C(0xFFA0621A).copy(alpha * 0.9), s2 * 0.065, O(nx, ny));
          // Highlight
          ds.drawCircle(C(0xFFD4842E).copy(alpha * 0.6), s2 * 0.04, O(nx - s2 * 0.015, ny - s2 * 0.015));
          // Cap detail
          ds.drawCircle(C(0xFF6B4423).copy(alpha * 0.8), s2 * 0.035, O(nx, ny - s2 * 0.04));
          // Catch sparkle at top of arc
          if (sin(nutAngle) < -0.7) {
            ds.drawCircle(Color.White.copy(alpha * 0.7), s2 * 0.025, O(nx, ny));
          }
        }
        break;
      }
      case 'SQUIRREL_TREE_CLIMB': {
        // Dynamic tree climb with bark particles, claw marks, and rising energy
        const riseY = headR2 * 2.5 * pulse;
        const alpha = tp * dim;
        // Tree bark texture lines (background)
        for (let bark = 0; bark <= 5; bark++) {
          const bx = cx + headR2 * 1.2 + (bark % 2) * headR2 * 0.15;
          const by1 = bodyY2 + headR2 - bark * headR2 * 0.5;
          const by2 = by1 - headR2 * 0.35;
          ds.drawLine(C(0xFF5C3A1E).copy(alpha * 0.4), O(bx, by1), O(bx, by2), { strokeWidth: 4, cap: StrokeCap.Round });
        }
        // Claw scratch marks (3 per position, multiple positions)
        for (let pos = 0; pos <= 3; pos++) {
          const scratchX = cx + headR2 * 1.3;
          const scratchBaseY = bodyY2 - riseY + pos * headR2 * 0.5;
          for (let c = 0; c <= 2; c++) {
            const cy2 = scratchBaseY + c * headR2 * 0.1;
            ds.drawLine(C(0xFFAA7744).copy(alpha * 0.7),
              O(scratchX - headR2 * 0.05, cy2), O(scratchX + headR2 * 0.3, cy2 + headR2 * 0.15),
              { strokeWidth: 2, cap: StrokeCap.Round });
          }
        }
        // Bark chip particles flying off
        for (let chip = 0; chip <= 7; chip++) {
          const chipAngle = chip * 45 * PI / 180 + tp * 4;
          const chipDist = headR2 * 0.5 * tp;
          const chipX = cx + headR2 * 1.3 + cos(chipAngle) * chipDist;
          const chipY = bodyY2 - riseY * 0.5 + sin(chipAngle) * chipDist;
          ds.drawCircle(C(0xFF8B6914).copy(alpha * 0.5), s2 * 0.02, O(chipX, chipY));
        }
        // Rising energy rings
        for (let ring = 0; ring <= 2; ring++) {
          const ringP = clamp(tp - ring * 0.15, 0, 1);
          const ry = bodyY2 - ringP * headR2 * 4;
          ds.drawCircle(neonGreen.copy((1 - ringP) * alpha * 0.3), headR2 * (0.8 + ringP), O(cx, ry), { style: Stroke(2) });
        }
        break;
      }
      case 'SQUIRREL_TAIL_SHIELD': {
        // Grand tail shield with energy barrier, rune patterns, and deflection sparks
        const shieldScale = tp;
        // Energy barrier glow behind shield
        ds.drawCircle({
          brush: Brush.radialGradient([NEON_CYAN.copy(pulse * 0.2 * dim), Color.Transparent],
            O(cx, headY2), headR2 * 2.5 * shieldScale),
          radius: headR2 * 2.5 * shieldScale, center: O(cx, headY2),
        });
        // Shield shape (larger, more defined)
        const shieldPath = new Path()
          .moveTo(cx - headR2 * 1.8 * shieldScale, headY2)
          .cubicTo(cx - headR2 * 2.2 * shieldScale, headY2 - headR2 * 2 * shieldScale,
            cx, headY2 - headR2 * 2.5 * shieldScale,
            cx + headR2 * 2.2 * shieldScale, headY2 - headR2 * 2 * shieldScale)
          .cubicTo(cx + headR2 * 2.8 * shieldScale, headY2,
            cx + headR2 * 1.8 * shieldScale, headY2 + headR2 * 1.2 * shieldScale,
            cx, headY2 + headR2 * 1.5 * shieldScale)
          .cubicTo(cx - headR2 * 1.8 * shieldScale, headY2 + headR2 * 1.2 * shieldScale,
            cx - headR2 * 2.8 * shieldScale, headY2,
            cx - headR2 * 1.8 * shieldScale, headY2);
        const sa = pulse * dim;
        ds.drawPath(shieldPath, FUR_BROWN.copy(sa * 0.35));
        ds.drawPath(shieldPath, NEON_CYAN.copy(sa * 0.6), { style: Stroke(2.5, StrokeCap.Round) });
        // Inner hexagonal rune pattern
        for (let hex = 0; hex <= 5; hex++) {
          const hexAngle = hex * 60 * PI / 180 + tp * 2;
          const hexR = headR2 * 0.8 * shieldScale;
          const hx = cx + cos(hexAngle) * hexR;
          const hy = headY2 + sin(hexAngle) * hexR * 0.7;
          const nextAngle = (hex + 1) * 60 * PI / 180 + tp * 2;
          const nhx = cx + cos(nextAngle) * hexR;
          const nhy = headY2 + sin(nextAngle) * hexR * 0.7;
          ds.drawLine(neonGold.copy(sa * 0.4), O(hx, hy), O(nhx, nhy), { strokeWidth: 1.5 });
        }
        // Deflection sparks
        for (let sp = 0; sp <= 5; sp++) {
          const sparkAngle = sp * 60 * PI / 180 + tp * 5;
          const sparkR = headR2 * (2 + (sp % 2) * 0.3) * shieldScale;
          ds.drawCircle(NEON_CYAN.copy(sa * 0.5), s2 * 0.025,
            O(cx + cos(sparkAngle) * sparkR, headY2 + sin(sparkAngle) * sparkR * 0.7));
        }
        break;
      }
      case 'SQUIRREL_ACORN_EXPLOSION': {
        // Massive acorn fireworks with radial burst, gold flash, and sparkle rain
        // Central gold flash (intense)
        const flashR = headR2 * (0.5 + tp * 2.5);
        ds.drawCircle({
          brush: Brush.radialGradient([Color.White.copy((1 - tp) * dim * 0.7), neonGold.copy((1 - tp) * dim * 0.3),
            Color.Transparent], O(cx, headY2), flashR),
          radius: flashR, center: O(cx, headY2),
        });
        // Shockwave ring
        ds.drawCircle(neonGold.copy((1 - tp) * dim * 0.5), headR2 * tp * 3, O(cx, headY2), { style: Stroke(3) });
        // Exploding acorns (14 in radial pattern)
        for (let i = 0; i <= 13; i++) {
          const angle = i * (360 / 14) * PI / 180 + (i % 3) * 0.1;
          const speed = 1 + (i % 3) * 0.3;
          const dist = headR2 * 3 * tp * speed;
          const ax = cx + cos(angle) * dist;
          const ay = headY2 + sin(angle) * dist + tp * tp * headR2 * 0.5;
          const fade = (1 - tp * 0.65) * dim;
          // Acorn trail
          ds.drawLine(neonBrown.copy(fade * 0.3), O(cx, headY2), O(ax, ay), { strokeWidth: 1.5 });
          // Acorn body
          ds.drawCircle(C(0xFFA0621A).copy(fade * 0.9), s2 * 0.05, O(ax, ay));
          ds.drawCircle(C(0xFF6B4423).copy(fade * 0.7), s2 * 0.03, O(ax, ay - s2 * 0.03));
        }
        // Sparkle rain settling
        for (let sp = 0; sp <= 11; sp++) {
          const spPhase = (tp * 1.5 + sp * 0.08) % 1;
          const spx = cx + (sp - 5.5) * headR2 * 0.4;
          const spy = headY2 - headR2 * 2 + spPhase * headR2 * 5;
          ds.drawCircle(neonGold.copy(sin(spPhase * PI) * dim * 0.5), s2 * 0.02, O(spx, spy));
        }
        break;
      }
      case 'SQUIRREL_LIGHTNING_DASH': {
        // Epic zigzag lightning with branching, thunder flash, and electric arcs
        const zigzags = 7;
        const totalWidth = headR2 * 5 * tp;
        // Thunder flash background
        ds.drawCircle({
          brush: Brush.radialGradient([Color.White.copy((1 - tp) * dim * 0.15), Color.Transparent],
            O(cx, headY2), headR2 * 3),
          radius: headR2 * 3, center: O(cx, headY2),
        });
        // Main lightning bolt
        const mainPath = new Path().moveTo(cx - totalWidth / 2, headY2);
        for (let z = 0; z < zigzags; z++) {
          const zx = cx - totalWidth / 2 + totalWidth * (z + 0.5) / zigzags;
          const zy = headY2 + (z % 2 === 0 ? -1 : 1) * headR2 * (0.4 + (z % 3) * 0.1);
          mainPath.lineTo(zx, zy);
        }
        mainPath.lineTo(cx + totalWidth / 2, headY2);
        ds.drawPath(mainPath, neonGold.copy(tp * dim * 0.3), { style: Stroke(8, StrokeCap.Round) });
        ds.drawPath(mainPath, C(0xFFFFFFAA).copy(tp * dim * 0.9), { style: Stroke(2.5, StrokeCap.Round) });
        ds.drawPath(mainPath, Color.White.copy(tp * dim * 0.6), { style: Stroke(1, StrokeCap.Round) });
        // Branching sub-bolts
        for (let b = 0; b <= 3; b++) {
          const bStart = cx - totalWidth / 2 + totalWidth * (b + 1) / 5;
          const bAngle = (b % 2 === 0 ? -40 : 40) * PI / 180;
          const bLen = headR2 * 0.8 * tp;
          const bEnd = O(bStart + cos(bAngle) * bLen, headY2 + sin(bAngle) * bLen);
          ds.drawLine(neonGold.copy(tp * dim * 0.5), O(bStart, headY2), bEnd, { strokeWidth: 2, cap: StrokeCap.Round });
          ds.drawLine(Color.White.copy(tp * dim * 0.3), O(bStart, headY2), bEnd, { strokeWidth: 1 });
        }
        // Electric arc sparks at endpoints
        for (const end of [cx - totalWidth / 2, cx + totalWidth / 2]) {
          ds.drawCircle(Color.White.copy(pulse * dim * 0.7), headR2 * 0.3 * pulse, O(end, headY2));
          ds.drawCircle(neonGold.copy(pulse * dim * 0.4), headR2 * 0.5 * pulse, O(end, headY2));
        }
        break;
      }
      case 'SQUIRREL_GOLDEN_ACORN': {
        // Legendary golden acorn: floating with radiant aura, orbiting sparkles, light column
        const floatY = headY2 - headR2 * (2.5 + pulse * 0.5);
        const ga = pulse * dim;
        // Light column below acorn
        const beamPath = new Path()
          .moveTo(cx - headR2 * 0.3, floatY + s2 * 0.1)
          .lineTo(cx - headR2 * 0.8, bodyY2)
          .lineTo(cx + headR2 * 0.8, bodyY2)
          .lineTo(cx + headR2 * 0.3, floatY + s2 * 0.1)
          .close();
        ds.drawPath(beamPath, Brush.verticalGradient(
          [neonGold.copy(ga * 0.2), neonGold.copy(ga * 0.05), Color.Transparent], floatY, bodyY2));
        // Multi-layer radiant aura
        for (let layer = 0; layer <= 2; layer++) {
          const auraR = headR2 * (1 + layer * 0.5);
          ds.drawCircle({
            brush: Brush.radialGradient([neonGold.copy(ga * (0.4 - layer * 0.1)), Color.Transparent], O(cx, floatY), auraR),
            radius: auraR, center: O(cx, floatY),
          });
        }
        // Radiant rays
        for (let i = 0; i <= 11; i++) {
          const rayAngle = i * 30 * PI / 180 + tp * 2;
          const rayLen = headR2 * (1.5 + sin(tp * 3 + i) * 0.3);
          ds.drawLine(neonGold.copy(ga * 0.4), O(cx, floatY),
            O(cx + cos(rayAngle) * rayLen, floatY + sin(rayAngle) * rayLen), { strokeWidth: 2 });
        }
        // Golden acorn (larger, more detailed)
        ds.drawCircle(neonGold.copy(ga * 0.95), s2 * 0.12, O(cx, floatY));
        ds.drawCircle(C(0xFFFFF0AA).copy(ga * 0.7), s2 * 0.08, O(cx - s2 * 0.02, floatY - s2 * 0.02));
        ds.drawCircle(C(0xFF8B6914).copy(ga * 0.85), s2 * 0.065, O(cx, floatY - s2 * 0.06));
        // White core highlight
        ds.drawCircle(Color.White.copy(ga * 0.5), s2 * 0.03, O(cx - s2 * 0.03, floatY - s2 * 0.03));
        // Orbiting sparkle motes
        for (let mote = 0; mote <= 7; mote++) {
          const mAngle = mote * 45 * PI / 180 + tp * 5;
          const mR = headR2 * (0.8 + sin(tp * 2 + mote) * 0.2);
          ds.drawCircle(neonGold.copy(ga * 0.7), s2 * 0.02,
            O(cx + cos(mAngle) * mR, floatY + sin(mAngle) * mR * 0.6));
        }
        break;
      }
      case 'SQUIRREL_FOREST_SPIRIT': {
        // Enchanted forest spirit: dense spiral leaves, vine tendrils, and nature glow
        // Nature aura background
        ds.drawCircle({
          brush: Brush.radialGradient([neonGreen.copy(tp * 0.15 * dim), Color.Transparent], O(cx, headY2), headR2 * 3),
          radius: headR2 * 3, center: O(cx, headY2),
        });
        // Spiral vine tendrils
        for (let vine = 0; vine <= 2; vine++) {
          const vinePath = new Path().moveTo(cx, bodyY2);
          for (let seg = 0; seg <= 12; seg++) {
            const t = seg / 12;
            const vAngle = vine * (2 * PI / 3) + t * 3 * PI + tp * 2;
            const vR = headR2 * (0.3 + t * 1.8);
            vinePath.lineTo(cx + cos(vAngle) * vR, bodyY2 - t * headR2 * 4);
          }
          const vineAlpha = tp * dim * (0.5 - vine * 0.1);
          ds.drawPath(vinePath, C(0xFF228B22).copy(vineAlpha), { style: Stroke(2.5 - vine * 0.5, StrokeCap.Round) });
        }
        // Dense spiraling leaves (25+)
        const leafColors = [C(0xFF00CC00), neonGreen, C(0xFF44DD44), C(0xFF88FF88), C(0xFF00AA44)];
        for (let i = 0; i <= 24; i++) {
          const leafAngle = i * 14.4 * PI / 180 + tp * 3 * PI;
          const r = headR2 * (0.4 + i * 0.08);
          const lx = cx + cos(leafAngle) * r;
          const ly = headY2 + sin(leafAngle) * r * 0.65;
          const lc = leafColors[i % leafColors.length];
          const leafP = Math.max(sin(tp * PI + i * 0.25), 0);
          const alpha = leafP * dim * 0.75;
          const leafSize = s2 * (0.025 + leafP * 0.02);
          // Leaf glow
          ds.drawCircle(lc.copy(alpha * 0.3), leafSize * 2, O(lx, ly));
          // Leaf
          ds.drawOval(lc.copy(alpha * 0.85), O(lx - leafSize, ly - leafSize * 0.6), S(leafSize * 2, leafSize * 1.2));
        }
        break;
      }
      case 'SQUIRREL_FLYING_SQUIRREL': {
        // Grand gliding flight: wide patagium membranes, wind particles, and soaring aura
        const bodyY2b = bodyY2;
        const membraneAlpha = pulse * dim;
        const wingSpan = headR2 * 3 * tp;
        // Wind current particles
        for (let w = 0; w <= 11; w++) {
          const wPhase = (tp * 2 + w * 0.08) % 1;
          const wx = cx + (w - 5.5) * headR2 * 0.4 - wPhase * headR2 * 2;
          const wy = headY2 + sin(w * 0.8) * headR2 * 0.5;
          ds.drawLine(Color.White.copy((1 - wPhase) * membraneAlpha * 0.3),
            O(wx + headR2 * 0.3, wy), O(wx, wy), { strokeWidth: 1.5 });
        }
        for (const side of SIDES) {
          // Membrane with gradient texture
          const membranePath = new Path()
            .moveTo(cx + side * headR2 * 0.35, headY2 + headR2 * 0.4)
            .cubicTo(cx + side * wingSpan * 0.4, headY2 - wingSpan * 0.15,
              cx + side * wingSpan * 0.75, (headY2 + bodyY2b) / 2 - headR2 * 0.3,
              cx + side * wingSpan, bodyY2b - headR2 * 0.2)
            .lineTo(cx + side * headR2 * 0.25, bodyY2b + headR2 * 0.1)
            .close();
          ds.drawPath(membranePath, FUR_BROWN.copy(membraneAlpha * 0.45));
          ds.drawPath(membranePath, neonBrown.copy(membraneAlpha * 0.55), { style: Stroke(2, StrokeCap.Round) });
          // Membrane vein lines
          for (let vein = 0; vein <= 3; vein++) {
            const vt = (vein + 1) / 4;
            const vx1 = cx + side * headR2 * 0.35;
            const vy1 = headY2 + headR2 * 0.4 + (bodyY2b - headY2) * vt * 0.7;
            const vx2 = cx + side * wingSpan * vt * 0.9;
            const vy2 = headY2 + (bodyY2b - headY2) * vt;
            ds.drawLine(FUR_LIGHT.copy(membraneAlpha * 0.3), O(vx1, vy1), O(vx2, vy2), { strokeWidth: 1 });
          }
          // Wing tip sparkle
          ds.drawCircle(NEON_CYAN.copy(membraneAlpha * 0.5), headR2 * 0.08, O(cx + side * wingSpan, bodyY2b - headR2 * 0.2));
        }
        // Soaring aura under body
        ds.drawCircle({
          brush: Brush.radialGradient([NEON_CYAN.copy(membraneAlpha * 0.15), Color.Transparent], O(cx, bodyY2b), wingSpan),
          radius: wingSpan, center: O(cx, bodyY2b),
        });
        break;
      }
      case 'SQUIRREL_NATURE_CROWN': {
        // Majestic nature crown: ornate leaf wreath, glowing jewel, and blessing particles
        const crownY = headY2 - headR2 * 1.4;
        const ca = pulse * dim;
        // Blessing particles ascending
        for (let b = 0; b <= 9; b++) {
          const bPhase = (tp * 1.5 + b * 0.1) % 1;
          const bx = cx + sin(b * 1.2 + tp * 2) * headR2 * 1;
          const by = crownY - bPhase * headR2 * 3;
          ds.drawCircle(neonGold.copy(sin(bPhase * PI) * dim * 0.5), s2 * 0.015, O(bx, by));
        }
        // Leaf wreath (larger, 10 leaves with detail)
        const leafColors = [neonGreen, C(0xFF228B22), C(0xFF44AA44), C(0xFF00CC44), C(0xFF66DD66)];
        for (let i = 0; i <= 9; i++) {
          const leafAngle = (i * 36 - 90) * PI / 180;
          const lr = headR2 * (0.85 + (i % 2) * 0.15);
          const lx = cx + cos(leafAngle) * lr * tp;
          const ly = crownY + abs(sin(leafAngle)) * lr * tp * 0.4;
          const leafP = clamp(tp * 1.5 - i * 0.05, 0, 1);
          const leafSize = headR2 * (0.15 + (i % 3) * 0.05) * leafP;
          const lc = leafColors[i % leafColors.length];
          // Leaf glow
          ds.drawCircle(lc.copy(ca * 0.2), leafSize * 1.5, O(lx, ly));
          // Leaf shape
          ds.drawCircle(lc.copy(ca * 0.85), leafSize, O(lx, ly));
          // Leaf vein
          ds.drawLine(C(0xFF006600).copy(ca * 0.4), O(lx - leafSize * 0.5, ly), O(lx + leafSize * 0.5, ly), { strokeWidth: 1 });
        }
        // Crown connecting ring
        ds.drawCircle(neonGold.copy(ca * 0.4), headR2 * 0.8 * tp, O(cx, crownY), { style: Stroke(1.5) });
        // Central jewel (appears after leaves)
        if (tp > 0.4) {
          const jewelP = clamp((tp - 0.4) / 0.6, 0, 1);
          const ja = jewelP * dim;
          // Jewel glow
          ds.drawCircle({
            brush: Brush.radialGradient([neonGold.copy(ja * 0.5), Color.Transparent], O(cx, crownY), headR2 * 0.5),
            radius: headR2 * 0.5, center: O(cx, crownY),
          });
          // Jewel body
          ds.drawCircle(neonGold.copy(ja * 0.95), headR2 * 0.15, O(cx, crownY));
          ds.drawCircle(Color.White.copy(ja * 0.7), headR2 * 0.06, O(cx - headR2 * 0.04, crownY - headR2 * 0.04));
          // Cross sparkle on jewel
          const fl = headR2 * 0.3 * jewelP;
          ds.drawLine(neonGold.copy(ja * 0.4), O(cx - fl, crownY), O(cx + fl, crownY), { strokeWidth: 1 });
          ds.drawLine(neonGold.copy(ja * 0.4), O(cx, crownY - fl), O(cx, crownY + fl), { strokeWidth: 1 });
        }
        break;
      }
      default:
        break; // SQUIRREL_SPIN has no overlay (the body itself turns)
    }
  }

  window.VPPets = window.VPPets || { renderers: {} };
  window.VPPets.trickFx = window.VPPets.trickFx || {};
  window.VPPets.trickFx.chip = drawChipTrick;
})();
