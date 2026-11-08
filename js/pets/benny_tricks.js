/* Vumikio Pets on the web - Benny's trick overlay effects, ported line by line from the
   "TRICK OVERLAY EFFECTS (BUNNY)" block of the app's BunnyRenderer.kt. BUNNY_SPIN is a rotation
   of the body itself (done in benny.js) and draws no overlay. */
(function () {
  'use strict';
  const { Color, Stroke, StrokeCap, Brush, Path, C, O } = window.VPCompose;
  const PI = Math.PI;
  const { sin, cos, abs, max } = Math;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  const NEON_CYAN = C(0xFF00E5FF);
  const NEON_PINK = C(0xFFFF69B4);

  /** g = { cx, headY, headR, bodyY, s, dim } - the body as it is actually drawn this frame. */
  function drawTrick(ds, trickType, tp, g) {
    const { cx, dim } = g;
    const headY2 = g.headY;
    const s2 = g.s;
    const headR2 = g.headR;
    const bodyY2 = g.bodyY;
    const neonCarrot = C(0xFFFF8C00);
    const neonGold = C(0xFFFFD700);
    const pulse = sin(tp * PI);
    switch (trickType) {
      case 'BUNNY_BINKY_JUMP': {
        const jumpH = s2 * 2 * pulse;
        const arcColors = [C(0xFFFF69B4), C(0xFFFF8C00), C(0xFFFFD700), C(0xFF00FF88), NEON_CYAN, C(0xFF8B5CF6)];
        for (let arcI = 0; arcI < arcColors.length; arcI++) {
          const arcP = clamp(tp * 1.5 - arcI * 0.06, 0, 1);
          const arcH = s2 * 2 * sin(arcP * PI);
          const arcX = cx + (arcI - 2.5) * s2 * 0.15;
          const arcY = headY2 - arcH;
          ds.drawCircle(arcColors[arcI].copy(arcP * dim * 0.4), headR2 * (0.3 + arcP * 0.3), O(arcX, arcY));
        }
        if (pulse > 0.5) {
          const ringR = headR2 * (pulse - 0.5) * 6;
          ds.drawCircle(NEON_PINK.copy((1 - pulse) * dim * 0.4), ringR, O(cx, headY2 - jumpH), { style: Stroke(2) });
        }
        for (let h = 0; h <= 7; h++) {
          const hAngle = h * 45 * PI / 180 + tp * 4;
          const hDist = headR2 * (1.5 + pulse * 0.5);
          const hx = cx + cos(hAngle) * hDist;
          const hy = (headY2 - jumpH) + sin(hAngle) * hDist * 0.6;
          const hAlpha = pulse * dim * 0.7;
          ds.drawCircle(C(0xFFFF69B4).copy(hAlpha), s2 * 0.035, O(hx, hy));
          ds.drawCircle(Color.White.copy(hAlpha * 0.5), s2 * 0.015, O(hx, hy));
        }
        for (let i = 0; i <= 9; i++) {
          const ex = cx + (i - 4.5) * s2 * 0.2;
          const ey = headY2 - jumpH - headR2 * (1.5 + i * 0.15) * tp;
          const eAlpha = max(sin(tp * PI + i * 0.4), 0) * dim * 0.8;
          ds.drawCircle(C(0xFFFF69B4).copy(eAlpha), s2 * 0.03, O(ex, ey));
        }
        break;
      }
      case 'BUNNY_EAR_HELICOPTER': {
        const earBaseY = headY2 - headR2 * 0.6;
        ds.drawCircle({
          brush: Brush.radialGradient([NEON_CYAN.copy(tp * 0.2 * dim), Color.Transparent], O(cx, bodyY2), headR2 * 2),
          radius: headR2 * 2, center: O(cx, bodyY2),
        });
        [-1, 1].forEach((side) => {
          const earX = cx + side * headR2 * 0.45;
          for (let blade = 0; blade <= 5; blade++) {
            const rotAngle = tp * 10 * PI * side + blade * PI / 3;
            const tipX = earX + cos(rotAngle) * headR2 * (0.9 + blade * 0.02);
            const tipY = earBaseY + sin(rotAngle) * headR2 * 0.5;
            const bladeAlpha = tp * dim * (0.6 - blade * 0.08);
            ds.drawLine(NEON_CYAN.copy(bladeAlpha), O(earX, earBaseY), O(tipX, tipY),
              { strokeWidth: 3 - blade * 0.3, cap: StrokeCap.Round });
          }
          ds.drawCircle(NEON_CYAN.copy(tp * dim * 0.15), headR2 * 0.9, O(earX, earBaseY));
          ds.drawCircle(NEON_CYAN.copy(tp * dim * 0.4), headR2 * 0.9, O(earX, earBaseY), { style: Stroke(2) });
        });
        for (let i = 0; i <= 7; i++) {
          const uPhase = (tp * 2 + i * 0.12) % 1;
          const ux = cx + (i - 3.5) * headR2 * 0.5;
          const uy = bodyY2 - uPhase * headR2 * 3;
          ds.drawCircle(NEON_CYAN.copy((1 - uPhase) * dim * 0.4), headR2 * 0.03, O(ux, uy));
        }
        break;
      }
      case 'BUNNY_TUNNEL_DIG': {
        for (let c = 0; c <= 5; c++) {
          const crackX = cx + (c - 2.5) * s2 * 0.3;
          const crackLen = s2 * 0.3 * tp;
          const crackAlpha = tp * dim * 0.4;
          ds.drawLine(C(0xFF664400).copy(crackAlpha), O(crackX, bodyY2 + s2 * 0.25),
            O(crackX + sin(c) * s2 * 0.1, bodyY2 + s2 * 0.25 + crackLen), { strokeWidth: 2 });
        }
        const dirtColors = [C(0xFF8B6914), C(0xFFAA8833), C(0xFF6B4E0A), C(0xFFCC9944)];
        for (let i = 0; i <= 19; i++) {
          const angle = (i * 18 - 90) * PI / 180 + sin(i * 0.5) * 0.3;
          const speed = 0.5 + (i % 4) * 0.2;
          const dist = s2 * speed * tp;
          const dirtX = cx + cos(angle) * dist * 0.6;
          const dirtY = bodyY2 + s2 * 0.2 - abs(sin(angle)) * dist;
          const fade = (1 - tp * 0.6) * dim;
          const dc = dirtColors[i % dirtColors.length];
          const sz = s2 * (0.03 + (i % 3) * 0.015) * (1.2 - tp * 0.4);
          ds.drawCircle(dc.copy(fade * 0.8), sz, O(dirtX, dirtY));
        }
        ds.drawCircle({
          brush: Brush.radialGradient([C(0xFF8B6914).copy(tp * 0.25 * dim), Color.Transparent], O(cx, bodyY2 + s2 * 0.2), s2 * 0.8),
          radius: s2 * 0.8, center: O(cx, bodyY2 + s2 * 0.2),
        });
        break;
      }
      case 'BUNNY_CARROT_RAIN': {
        for (let i = 0; i <= 13; i++) {
          const cx2 = cx + (i - 6.5) * s2 * 0.22 + sin(i * 0.7) * s2 * 0.08;
          const rainPhase = (tp * 1.5 + i * 0.07) % 1;
          const cy2 = headY2 - headR2 * 3 + rainPhase * s2 * 4;
          const alpha = sin(rainPhase * PI) * dim * 0.85;
          const carrotLen = s2 * 0.1;
          const carrotPath = new Path().moveTo(cx2, cy2 + carrotLen).lineTo(cx2 - s2 * 0.03, cy2)
            .lineTo(cx2 + s2 * 0.03, cy2).close();
          ds.drawPath(carrotPath, neonCarrot.copy(alpha * 0.85));
          for (let leaf = -1; leaf <= 1; leaf++) {
            const leafAngle = leaf * 30 * PI / 180;
            ds.drawLine(C(0xFF00BB00).copy(alpha * 0.7), O(cx2, cy2),
              O(cx2 + cos(leafAngle) * s2 * 0.06, cy2 - sin(abs(leafAngle) + 0.5) * s2 * 0.1), { strokeWidth: 1.5 });
          }
        }
        ds.drawCircle({
          brush: Brush.radialGradient([neonGold.copy(pulse * 0.2 * dim), Color.Transparent], O(cx, bodyY2), s2 * 1.5),
          radius: s2 * 1.5, center: O(cx, bodyY2),
        });
        break;
      }
      case 'BUNNY_BLUR_SPEED': {
        const sonicR = headR2 * pulse * 3.5;
        ds.drawCircle(NEON_CYAN.copy((1 - pulse) * dim * 0.3), sonicR, O(cx, headY2), { style: Stroke(2.5) });
        ds.drawCircle(NEON_PINK.copy((1 - pulse) * dim * 0.15), sonicR * 1.2, O(cx, headY2), { style: Stroke(1.5) });
        for (let i = 0; i <= 6; i++) {
          const blurPhase = sin(tp * 3 * PI + i * 0.6);
          const blurX = cx + blurPhase * headR2 * (1 + i * 0.5);
          const alpha = (0.4 - i * 0.05) * tp * dim;
          ds.drawCircle(C(0xFFDDEEFF).copy(alpha), headR2 * (0.8 - i * 0.06), O(blurX, headY2));
          ds.drawCircle(NEON_CYAN.copy(alpha * 0.5), headR2 * (0.8 - i * 0.06), O(blurX, headY2), { style: Stroke(1.5) });
        }
        for (let i = -5; i <= 5; i++) {
          const ly = headY2 + i * headR2 * 0.2;
          const lineLen = headR2 * (2.5 - abs(i) * 0.2) * tp;
          ds.drawLine(NEON_CYAN.copy(pulse * dim * 0.35), O(cx - lineLen, ly), O(cx + lineLen, ly),
            { strokeWidth: 1.5 - abs(i) * 0.1 });
        }
        break;
      }
      case 'BUNNY_GOLDEN_EARS': {
        const earBaseY = headY2 - headR2 * 0.6;
        const haloY = headY2 - headR2 * 2.5;
        const ga = pulse * dim;
        const beamPath = new Path().moveTo(cx - headR2 * 0.4, haloY)
          .lineTo(cx - headR2 * 1, bodyY2 + s2 * 0.3).lineTo(cx + headR2 * 1, bodyY2 + s2 * 0.3)
          .lineTo(cx + headR2 * 0.4, haloY).close();
        ds.drawPath(beamPath, Brush.verticalGradient(
          [neonGold.copy(ga * 0.2), neonGold.copy(ga * 0.05), Color.Transparent], haloY, bodyY2 + s2 * 0.3));
        for (let ring = 0; ring <= 2; ring++) {
          const rr = headR2 * (0.6 + ring * 0.15);
          ds.drawCircle(neonGold.copy(ga * (0.8 - ring * 0.2)), rr, O(cx, haloY - ring * 3), { style: Stroke(3 - ring) });
        }
        ds.drawCircle({
          brush: Brush.radialGradient([neonGold.copy(ga * 0.4), Color.Transparent], O(cx, haloY), headR2),
          radius: headR2, center: O(cx, haloY),
        });
        [-1, 1].forEach((side) => {
          const earX = cx + side * headR2 * 0.45;
          ds.drawCircle({
            brush: Brush.radialGradient([neonGold.copy(ga * 0.6), Color.Transparent], O(earX, earBaseY - headR2), headR2 * 0.8),
            radius: headR2 * 0.8, center: O(earX, earBaseY - headR2),
          });
        });
        for (let i = 0; i <= 9; i++) {
          const sPhase = (tp * 1.5 + i * 0.1) % 1;
          const sx = cx + sin(i * 1.1 + tp * 3) * headR2 * 0.8;
          const sy = bodyY2 - sPhase * headR2 * 5;
          const sa = sin(sPhase * PI) * dim * 0.7;
          ds.drawCircle(neonGold.copy(sa), s2 * 0.025, O(sx, sy));
        }
        break;
      }
      case 'BUNNY_CLONE_ARMY': {
        const ghostColors = [NEON_CYAN, NEON_PINK, C(0xFF8B5CF6), neonGold, C(0xFF00FF88)];
        for (let ghost = 0; ghost <= 4; ghost++) {
          const ghostAngle = (ghost * 72 + tp * 300) * PI / 180;
          const ghostDist = headR2 * (2 + sin(tp * 3 + ghost) * 0.3);
          const gx = cx + cos(ghostAngle) * ghostDist;
          const gy = headY2 + sin(ghostAngle) * ghostDist * 0.5;
          const alpha = (0.4 - ghost * 0.04) * tp * dim;
          const gc = ghostColors[ghost];
          ds.drawCircle(gc.copy(alpha * 0.2), headR2 * 0.65, O(gx, gy));
          ds.drawCircle(gc.copy(alpha * 0.7), headR2 * 0.65, O(gx, gy), { style: Stroke(2) });
          [-0.2, 0.2].forEach((ear) => {
            ds.drawLine(gc.copy(alpha * 0.5), O(gx + ear * headR2, gy - headR2 * 0.5),
              O(gx + ear * headR2 * 1.3, gy - headR2 * 1.2), { strokeWidth: 2, cap: StrokeCap.Round });
          });
          ds.drawLine(gc.copy(alpha * 0.2), O(cx, headY2), O(gx, gy), { strokeWidth: 1.5 });
        }
        ds.drawCircle({
          brush: Brush.radialGradient([Color.White.copy(pulse * 0.3 * dim), Color.Transparent], O(cx, headY2), headR2),
          radius: headR2, center: O(cx, headY2),
        });
        break;
      }
      case 'BUNNY_FLOATING_MEADOW': {
        for (let gI = 0; gI <= 11; gI++) {
          const gx = cx + (gI - 5.5) * s2 * 0.22;
          const gy = bodyY2 + s2 * 0.2;
          const bladeH = s2 * 0.2 * tp * (0.7 + (gI % 3) * 0.15);
          const sway = sin(tp * 3 + gI * 0.5) * s2 * 0.03;
          ds.drawLine(C(0xFF228B22).copy(tp * dim * 0.7), O(gx, gy), O(gx + sway, gy - bladeH),
            { strokeWidth: 2, cap: StrokeCap.Round });
        }
        const flowerColors = [C(0xFFFF69B4), C(0xFFFF4488), C(0xFFFF8C00), C(0xFFFF6699), C(0xFFCC66FF),
          C(0xFFFFAA33), C(0xFF66DDFF), C(0xFFFF5577)];
        for (let i = 0; i <= 7; i++) {
          const fx = cx + (i - 3.5) * s2 * 0.3;
          const fy = bodyY2 + s2 * 0.2;
          const growP = clamp(tp * 1.5 - i * 0.08, 0, 1);
          const growH = growP * s2 * 0.45;
          const fa = growP * dim;
          const stemPath = new Path().moveTo(fx, fy).quadraticTo(fx + sin(i) * s2 * 0.05, fy - growH * 0.5, fx, fy - growH);
          ds.drawPath(stemPath, C(0xFF228B22).copy(fa * 0.8), { style: Stroke(2, StrokeCap.Round) });
          if (growP > 0.3) {
            const leafSide = i % 2 === 0 ? -1 : 1;
            ds.drawLine(C(0xFF00AA00).copy(fa * 0.6), O(fx, fy - growH * 0.4),
              O(fx + leafSide * s2 * 0.06, fy - growH * 0.5), { strokeWidth: 1.5 });
          }
          if (growP > 0.5) {
            const fc = flowerColors[i % flowerColors.length];
            const petalP = (growP - 0.5) * 2;
            for (let p = 0; p <= 4; p++) {
              const pAngle = p * 72 * PI / 180;
              const petalR = s2 * 0.04 * petalP;
              ds.drawCircle(fc.copy(fa * 0.75), petalR,
                O(fx + cos(pAngle) * s2 * 0.04, fy - growH + sin(pAngle) * s2 * 0.04));
            }
            ds.drawCircle(C(0xFFFFFF00).copy(fa * 0.8), s2 * 0.025 * petalP, O(fx, fy - growH));
          }
        }
        for (let p = 0; p <= 9; p++) {
          const pPhase = (tp * 1.3 + p * 0.1) % 1;
          const px = cx + sin(p * 1.3 + tp * 2) * s2 * 0.8;
          const py = bodyY2 - pPhase * s2 * 2;
          const pa = sin(pPhase * PI) * dim * 0.5;
          ds.drawCircle(neonGold.copy(pa), s2 * 0.015, O(px, py));
        }
        break;
      }
      case 'BUNNY_MOON_RABBIT': {
        const moonY = headY2 - headR2 * 3.5;
        const ma = pulse * dim;
        for (let ray = 0; ray <= 7; ray++) {
          const rayAngle = ray * 45 * PI / 180;
          const rayLen = headR2 * (2.5 + sin(tp * 3 + ray) * 0.5);
          const endX = cx + cos(rayAngle) * rayLen;
          const endY = moonY + sin(rayAngle) * rayLen;
          ds.drawLine(neonGold.copy(ma * 0.15), O(cx, moonY), O(endX, endY), { strokeWidth: 3 });
          ds.drawLine(Color.White.copy(ma * 0.08), O(cx, moonY), O(endX, endY), { strokeWidth: 6 });
        }
        ds.drawCircle({
          brush: Brush.radialGradient([neonGold.copy(ma * 0.4), C(0xFFFFEECC).copy(ma * 0.15), Color.Transparent],
            O(cx, moonY), headR2 * 2.5),
          radius: headR2 * 2.5, center: O(cx, moonY),
        });
        ds.drawCircle(neonGold.copy(ma * 0.5), headR2 * 2, O(cx, moonY));
        ds.drawCircle(C(0xFF08080E).copy(ma * 0.9), headR2 * 1.7, O(cx + headR2 * 0.5, moonY - headR2 * 0.1));
        ds.drawCircle(neonGold.copy(ma * 0.7), headR2 * 2, O(cx, moonY), { style: Stroke(2.5) });
        for (let i = 0; i <= 14; i++) {
          const sa = i * 24 * PI / 180 + tp * 0.5;
          const sr = headR2 * (2.5 + (i % 3) * 0.5);
          const sx = cx + cos(sa) * sr;
          const sy = moonY + sin(sa) * sr * 0.7;
          const twinkle = max(sin(tp * 6 + i * 1.1), 0) * ma * 0.8;
          ds.drawCircle(Color.White.copy(twinkle), s2 * 0.02, O(sx, sy));
          if (i % 4 === 0 && twinkle > 0.3) {
            const fl = s2 * 0.06;
            ds.drawLine(Color.White.copy(twinkle * 0.4), O(sx - fl, sy), O(sx + fl, sy), { strokeWidth: 1 });
            ds.drawLine(Color.White.copy(twinkle * 0.4), O(sx, sy - fl), O(sx, sy + fl), { strokeWidth: 1 });
          }
        }
        break;
      }
      default: break; // BUNNY_SPIN is the body turning, no overlay
    }
  }

  window.VPPets = window.VPPets || { renderers: {} };
  window.VPPets.trickFx = window.VPPets.trickFx || {};
  window.VPPets.trickFx.benny = drawTrick;
})();
