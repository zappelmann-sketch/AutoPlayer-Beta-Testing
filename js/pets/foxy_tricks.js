/* Vumikio Pets on the web - Foxy's trick overlay effects, ported line by line from the
   "TRICK OVERLAY EFFECTS (FOX)" block of the app's FoxRenderer.kt.
   Exposed as window.VPPets.trickFx.foxy(ds, trickType, tp, g); loaded before foxy.js. */
(function () {
  'use strict';
  const { Color, Stroke, StrokeCap, Brush, Path, C, O } = window.VPCompose;
  const PI = Math.PI;
  const { sin, cos, abs, trunc } = Math;
  const pos = (v) => (v < 0 ? 0 : v); // Kotlin coerceAtLeast(0f)

  const FUR_ORANGE = C(0xFFE87530);
  const NEON_ORANGE = C(0xFFFF8C00);
  const NEON_CYAN = C(0xFF00E5FF);
  const NEON_GOLD = C(0xFFFFD700);

  /** g: { cx, s, headY, headR, bodyY, dim, tailPhase } - the body as it is actually drawn. */
  function foxTrick(ds, trickType, tp, g) {
    const { cx, dim, tailPhase } = g;
    const headY2 = g.headY, s2 = g.s, headR2 = g.headR, bodyY2 = g.bodyY;
    const pulse = sin(tp * PI);
    switch (trickType) {
      case 'FOX_TAIL_WHIP': {
        const baseX = cx + s2 * 0.7;
        for (let trail = 0; trail <= 7; trail++) {
          const phase = tp + trail * 0.08;
          const swingAmp = s2 * (0.9 + trail * 0.1);
          const swingX = baseX + sin(phase * 5 * PI) * swingAmp;
          const tipY = bodyY2 - s2 * (1.2 + trail * 0.05);
          const alpha = (1 - trail * 0.1) * tp * dim;
          const trailPath = new Path().moveTo(baseX, bodyY2)
            .cubicTo(baseX + (swingX - baseX) * 0.3, bodyY2 - s2 * 0.6, swingX, tipY + s2 * 0.4, swingX, tipY);
          const col = trail < 3 ? NEON_ORANGE : trail < 5 ? NEON_GOLD : C(0xFFFF4400);
          ds.drawPath(trailPath, col.copy(alpha * 0.5), { style: Stroke(4 - trail * 0.4, StrokeCap.Round) });
        }
        const shockR = s2 * pulse * 1.5;
        ds.drawCircle(NEON_ORANGE.copy(pulse * dim * 0.3), shockR, O(baseX, bodyY2 - s2), { style: Stroke(2) });
        for (let sp = 0; sp <= 7; sp++) {
          const a = sp * 45 * PI / 180 + tp * 6;
          const d = s2 * 0.3 * pulse;
          ds.drawCircle(NEON_GOLD.copy(pulse * dim * 0.7), s2 * 0.025,
            O(baseX + cos(a) * d, bodyY2 - s2 * 1.2 + sin(a) * d));
        }
        break;
      }
      case 'FOX_MOONWALK': {
        const slideX = cx - s2 * 2 * sin(tp * PI);
        for (let gi = 0; gi <= 6; gi++) {
          const gt = gi / 6;
          const gx = slideX + (cx - slideX) * gt;
          const alpha = (0.35 - gi * 0.04) * tp * dim;
          ds.drawCircle(FUR_ORANGE.copy(alpha), headR2 * (0.8 - gi * 0.07), O(gx, headY2));
          ds.drawCircle(NEON_ORANGE.copy(alpha * 0.4), headR2 * (0.8 - gi * 0.07), O(gx, headY2), { style: Stroke(1.5) });
        }
        for (let i = 0; i <= 9; i++) {
          const sparkX = slideX + (cx - slideX) * (i / 9);
          const sparkY = bodyY2 + s2 * 0.35;
          const sa = pos(sin(tp * 4 + i)) * dim * 0.6;
          ds.drawCircle(NEON_GOLD.copy(sa), s2 * 0.03, O(sparkX, sparkY));
          ds.drawCircle(NEON_GOLD.copy(sa * 0.3), s2 * 0.06, O(sparkX, sparkY));
        }
        for (let star = 0; star <= 4; star++) {
          const starAngle = star * 72 * PI / 180 + tp * 3;
          const starDist = headR2 * (1.2 + pulse * 0.5);
          const starAlpha = pulse * dim * 0.6;
          const sx = slideX + cos(starAngle) * starDist;
          const sy = headY2 + sin(starAngle) * starDist * 0.6;
          ds.drawCircle(Color.White.copy(starAlpha), s2 * 0.03, O(sx, sy));
          const fl = s2 * 0.08;
          ds.drawLine(NEON_GOLD.copy(starAlpha * 0.5), O(sx - fl, sy), O(sx + fl, sy), { strokeWidth: 1 });
          ds.drawLine(NEON_GOLD.copy(starAlpha * 0.5), O(sx, sy - fl), O(sx, sy + fl), { strokeWidth: 1 });
        }
        break;
      }
      case 'FOX_FIRE_TAIL': {
        const baseX = cx + s2 * 0.7;
        const sw = sin(tailPhase) * s2 * 0.3;
        const tailTipX = baseX + sw * 0.6;
        const tailTipY = bodyY2 - s2 * 1.1;
        ds.drawCircle({
          brush: Brush.radialGradient([C(0xFFFF4400).copy(tp * 0.25 * dim), NEON_GOLD.copy(tp * 0.1 * dim), Color.Transparent],
            O(tailTipX, tailTipY), s2),
          radius: s2, center: O(tailTipX, tailTipY),
        });
        const flameColors = [C(0xFFFFFF00), C(0xFFFF8800), C(0xFFFF4400), C(0xFFFF0000), C(0xFFCC0000)];
        for (let i = 0; i <= 19; i++) {
          const flameAngle = i * 18 * PI / 180 + tp * 5 + sin(i * 0.7) * 0.5;
          const flameDist = s2 * (0.15 + (i / 20) * 0.6) * tp;
          const px = tailTipX + cos(flameAngle) * flameDist;
          const py = tailTipY + sin(flameAngle) * flameDist - s2 * 0.15 * tp * (i / 10);
          const fc = flameColors[trunc(i * 3 / 4) % flameColors.length];
          const alpha = (1 - i / 20) * tp * dim * 0.85;
          const szF = 0.06 - i * 0.002;
          const sz = s2 * (szF < 0.015 ? 0.015 : szF);
          ds.drawCircle(fc.copy(alpha * 0.4), sz * 2.5, O(px, py));
          ds.drawCircle(fc.copy(alpha), sz, O(px, py));
        }
        for (let e = 0; e <= 7; e++) {
          const ex = tailTipX + (e - 3.5) * s2 * 0.1;
          const ey = tailTipY - tp * s2 * (0.5 + e * 0.15);
          const eAlpha = (1 - tp * 0.8) * dim * 0.6;
          ds.drawCircle(NEON_GOLD.copy(eAlpha), s2 * 0.02, O(ex, ey));
        }
        break;
      }
      case 'FOX_SPARKLE_TRAIL': {
        const ribbonCols = [NEON_GOLD, C(0xFFFFAA00), C(0xFFFFDD44)];
        for (let ribbon = 0; ribbon <= 2; ribbon++) {
          const ribbonPath = new Path().moveTo(cx - s2 * 1.5, headY2 + ribbon * s2 * 0.3);
          for (let seg = 0; seg <= 8; seg++) {
            const sx = cx - s2 * 1.5 + seg * s2 * 0.4;
            const sy = headY2 + ribbon * s2 * 0.3 + sin(tp * 4 + seg * 0.8 + ribbon) * s2 * 0.3;
            ribbonPath.lineTo(sx, sy);
          }
          ds.drawPath(ribbonPath, ribbonCols[ribbon].copy(pulse * dim * 0.35), { style: Stroke(3 - ribbon * 0.5, StrokeCap.Round) });
        }
        const sparkColors = [NEON_GOLD, Color.White, C(0xFFFFDD88), NEON_ORANGE];
        for (let i = 0; i <= 29; i++) {
          const sx = cx + (i - 14.5) * s2 * 0.12 + sin(i * 0.6) * s2 * 0.08;
          const sy = headY2 - s2 * 0.5 + sin(i * 0.9 + tp * 5) * s2 * 0.7;
          const sparkPhase = pos(sin(tp * PI + i * 0.35));
          const alpha = sparkPhase * dim * 0.8;
          const sc = sparkColors[i % sparkColors.length];
          ds.drawCircle(sc.copy(alpha), s2 * (0.02 + sparkPhase * 0.015), O(sx, sy));
          if (i % 4 === 0) {
            const fl = s2 * 0.06 * sparkPhase;
            ds.drawLine(sc.copy(alpha * 0.5), O(sx - fl, sy), O(sx + fl, sy), { strokeWidth: 1 });
            ds.drawLine(sc.copy(alpha * 0.5), O(sx, sy - fl), O(sx, sy + fl), { strokeWidth: 1 });
          }
        }
        break;
      }
      case 'FOX_PHANTOM_DASH': {
        const shockR = headR2 * tp * 3;
        ds.drawCircle(NEON_ORANGE.copy((1 - tp) * dim * 0.3), shockR, O(cx, headY2), { style: Stroke(2) });
        for (let ghost = 0; ghost <= 5; ghost++) {
          const gDist = headR2 * (0.6 + ghost * 0.7) * tp;
          const ghostX = cx - gDist;
          const alpha = (0.5 - ghost * 0.07) * tp * dim;
          const ghostR = headR2 * (0.9 - ghost * 0.08);
          ds.drawCircle(FUR_ORANGE.copy(alpha * 0.5), ghostR, O(ghostX, headY2));
          ds.drawCircle(NEON_ORANGE.copy(alpha * 0.7), ghostR, O(ghostX, headY2), { style: Stroke(2) });
          ds.drawCircle(NEON_GOLD.copy(alpha * 0.8), ghostR * 0.08, O(ghostX - ghostR * 0.2, headY2 - ghostR * 0.05));
          ds.drawCircle(NEON_GOLD.copy(alpha * 0.8), ghostR * 0.08, O(ghostX + ghostR * 0.2, headY2 - ghostR * 0.05));
        }
        for (let i = -5; i <= 5; i++) {
          const ly = headY2 + i * headR2 * 0.22;
          const lineLen = headR2 * (3 - abs(i) * 0.3) * tp;
          ds.drawLine(NEON_ORANGE.copy(tp * dim * 0.4), O(cx + headR2, ly), O(cx + headR2 + lineLen, ly),
            { strokeWidth: 1.5 - abs(i) * 0.1 });
        }
        break;
      }
      case 'FOX_AURORA_BOREALIS': {
        const auroraColors = [C(0xFF00FF88), C(0xFF00FFCC), C(0xFF00CCFF), C(0xFF8866FF), C(0xFF00FF44), C(0xFFAAFF00)];
        for (let band = 0; band <= 5; band++) {
          const bandBaseY = headY2 - headR2 * (1.5 + band * 0.5);
          const bandWidth = s2 * (1.8 + band * 0.2);
          const bandPath = new Path().moveTo(cx - bandWidth, bandBaseY);
          for (let seg = 0; seg <= 8; seg++) {
            const segX = cx - bandWidth + seg * bandWidth * 0.25;
            const wave = sin(tp * 3 * PI + band * 0.6 + seg * 0.5) * headR2 * 0.4;
            bandPath.lineTo(segX, bandBaseY + wave);
          }
          const col = auroraColors[band % auroraColors.length];
          const alpha = pulse * dim * (0.35 - band * 0.03);
          ds.drawPath(bandPath, col.copy(alpha), { style: Stroke(8 - band * 0.8, StrokeCap.Round) });
          ds.drawPath(bandPath, col.copy(alpha * 0.15), { style: Stroke(16 - band * 1.5, StrokeCap.Round) });
        }
        for (let i = 0; i <= 11; i++) {
          const px = cx + (i - 5.5) * s2 * 0.3;
          const py = headY2 - headR2 * (1.5 + sin(i + tp * 3) * 1.2);
          const col = auroraColors[i % auroraColors.length];
          ds.drawCircle(col.copy(pulse * dim * 0.5), s2 * 0.025, O(px, py));
        }
        break;
      }
      case 'FOX_FOX_FIRE': {
        const foxFireColors = [C(0xFF0088FF), C(0xFF00DDFF), C(0xFF4488FF), C(0xFF66BBFF)];
        ds.drawCircle({
          brush: Brush.radialGradient([C(0xFF0044AA).copy(tp * 0.2 * dim), Color.Transparent], O(cx, headY2), headR2 * 2.5),
          radius: headR2 * 2.5, center: O(cx, headY2),
        });
        for (let i = 0; i <= 15; i++) {
          const angle = i * (360 / 16) * PI / 180 + tp * 4 * PI;
          const orbitR = headR2 * (1.3 + sin(tp * 3 + i * 0.5) * 0.3);
          const px = cx + cos(angle) * orbitR;
          const py = headY2 + sin(angle) * orbitR * 0.65;
          const fc = foxFireColors[i % foxFireColors.length];
          const alpha = tp * dim * 0.7;
          ds.drawCircle(fc.copy(alpha * 0.3), s2 * 0.12, O(px, py));
          ds.drawCircle(fc.copy(alpha * 0.8), s2 * 0.05, O(px, py));
          ds.drawCircle(Color.White.copy(alpha * 0.4), s2 * 0.02, O(px, py));
          if (i % 3 === 0) {
            ds.drawLine(fc.copy(alpha * 0.25), O(px, py), O(cx, headY2), { strokeWidth: 1.5 });
          }
        }
        ds.drawCircle(C(0xFF0088FF).copy(pulse * dim * 0.4), headR2 * 0.8, O(cx, headY2), { style: Stroke(2) });
        break;
      }
      case 'FOX_SPIRIT_FORM': {
        const layerCols = [C(0xFF00FFCC), NEON_CYAN, C(0xFF88FFFF), Color.White];
        for (let layer = 0; layer <= 3; layer++) {
          const glowR = headR2 * (1.5 + layer * 0.7) * (0.8 + pulse * 0.2);
          ds.drawCircle({
            brush: Brush.radialGradient([layerCols[layer].copy(tp * (0.3 - layer * 0.05) * dim), Color.Transparent],
              O(cx, headY2), glowR),
            radius: glowR, center: O(cx, headY2),
          });
        }
        for (let i = 0; i <= 11; i++) {
          const wPhase = (tp * 1.5 + i * 0.08) % 1;
          const wx = cx + sin(i * 1.1 + tp * 3) * headR2 * 1.2;
          const wy = headY2 + headR2 - wPhase * headR2 * 4;
          const wAlpha = sin(wPhase * PI) * dim * 0.6;
          const wR = headR2 * (0.03 + (1 - wPhase) * 0.04);
          ds.drawCircle(NEON_CYAN.copy(wAlpha), wR, O(wx, wy));
          ds.drawLine(NEON_CYAN.copy(wAlpha * 0.4), O(wx, wy), O(wx, wy + headR2 * 0.15), { strokeWidth: 1 });
        }
        for (let a = 0; a <= 23; a++) {
          const aAngle = a * 15 * PI / 180;
          const aR = headR2 * (1.3 + sin(tp * 5 + a * 0.3) * 0.15);
          const ax = cx + cos(aAngle) * aR;
          const ay = headY2 + sin(aAngle) * aR * 0.75;
          ds.drawCircle(Color.White.copy(pulse * dim * 0.35), headR2 * 0.02, O(ax, ay));
        }
        break;
      }
      case 'FOX_STELLAR_FOX': {
        const nebulaColors = [C(0xFF8B5CF6), C(0xFF4400AA), C(0xFF0044AA), C(0xFFFF0088)];
        for (let nc = 0; nc < nebulaColors.length; nc++) {
          const ncAngle = nc * 1.5 + tp;
          const ncR = headR2 * (1.8 + nc * 0.3);
          const ncX = cx + cos(ncAngle) * headR2 * 0.4;
          const ncY = headY2 + sin(ncAngle) * headR2 * 0.3;
          ds.drawCircle({
            brush: Brush.radialGradient([nebulaColors[nc].copy(tp * 0.15 * dim), Color.Transparent], O(ncX, ncY), ncR),
            radius: ncR, center: O(ncX, ncY),
          });
        }
        const starColors = [Color.White, NEON_GOLD, NEON_CYAN, C(0xFFFF88FF), C(0xFFAADDFF)];
        for (let i = 0; i <= 39; i++) {
          const starAngle = i * 9 * PI / 180 + tp * 2 * PI;
          const r = headR2 * (0.2 + (i % 6) * 0.2 + sin(i * 0.3) * 0.15);
          const sx = cx + cos(starAngle) * r;
          const sy = headY2 + sin(starAngle) * r * 0.75;
          const sc = starColors[i % starColors.length];
          const twinkle = pos(sin(tp * 6 + i * 0.7));
          const alpha = twinkle * tp * dim * 0.85;
          ds.drawCircle(sc.copy(alpha), s2 * (0.015 + twinkle * 0.015), O(sx, sy));
          if (i % 7 === 0 && twinkle > 0.5) {
            const fl = s2 * 0.07 * twinkle;
            ds.drawLine(sc.copy(alpha * 0.4), O(sx - fl, sy), O(sx + fl, sy), { strokeWidth: 1 });
            ds.drawLine(sc.copy(alpha * 0.4), O(sx, sy - fl), O(sx, sy + fl), { strokeWidth: 1 });
          }
        }
        ds.drawCircle({
          brush: Brush.radialGradient([Color.White.copy(pulse * 0.5 * dim), C(0xFF8B5CF6).copy(pulse * 0.3 * dim), Color.Transparent],
            O(cx, headY2), headR2 * 1.2),
          radius: headR2 * 1.2, center: O(cx, headY2),
        });
        break;
      }
      default: break; // FOX_SPIN has no overlay: the whole fox turns
    }
  }

  window.VPPets = window.VPPets || { renderers: {} };
  window.VPPets.trickFx = window.VPPets.trickFx || {};
  window.VPPets.trickFx.foxy = foxTrick;
})();
