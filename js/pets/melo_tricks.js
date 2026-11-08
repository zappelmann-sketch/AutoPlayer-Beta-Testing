/* Vumikio Pets on the web - Melo's trick overlay effects, ported line by line from the trick
   section of the app's CatRenderer.kt. Loaded before melo.js. CAT_SPIN has no overlay (it only
   turns the whole cat), exactly as in the app. */
(function () {
  'use strict';
  const { Color, Stroke, StrokeCap, Brush, Path, C, O } = window.VPCompose;
  const { PET_SIDES } = window.VPAnim;
  const PI = Math.PI;
  const { sin, cos, abs } = Math;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  const FUR_DARK = C(0xFF3E3E5E);
  const NEON_CYAN = C(0xFF00E5FF);
  const NEON_MAGENTA = C(0xFFFF00FF);
  const PAW_PAD = C(0xFFFF69B4);
  const NEON_GOLD = C(0xFFFFD700);
  const LASER = C(0xFFFF0000);

  /** g: { cx, headY, headR, bodyY, s, dim, width } - the body as it is actually drawn. */
  function drawTrick(ds, trickType, tp, g) {
    const { cx, dim } = g;
    const headY2 = g.headY, s2 = g.s, headR2 = g.headR, bodyY2 = g.bodyY;
    const pulse = sin(tp * PI);
    switch (trickType) {
      case 'CAT_PAW_SWIPE': {
        // Fierce dual paw swipe with claw scratch marks and afterglow trails
        const swipeP = sin(tp * PI);
        for (const side of PET_SIDES) {
          const swipeX = cx + side * headR2 * (1.5 + swipeP * 2);
          const swipeY = headY2 + headR2 * 0.2;
          for (let c = 0; c <= 2; c++) {
            const scratchY = swipeY + (c - 1) * headR2 * 0.2;
            const startX = cx + side * headR2 * 0.5;
            const endX = swipeX + side * headR2 * 0.3;
            const scratchAlpha = swipeP * dim * (0.8 - c * 0.15);
            ds.drawLine(C(0xFFFF4444).copy(scratchAlpha * 0.6), O(startX, scratchY), O(endX, scratchY), { strokeWidth: 4, cap: StrokeCap.Round });
            ds.drawLine(Color.White.copy(scratchAlpha * 0.3), O(startX, scratchY), O(endX, scratchY), { strokeWidth: 1.5, cap: StrokeCap.Round });
          }
          ds.drawCircle(PAW_PAD.copy(swipeP * dim * 0.4), headR2 * 0.3, O(swipeX, swipeY));
          ds.drawCircle(PAW_PAD.copy(swipeP * dim * 0.9), headR2 * 0.12, O(swipeX, swipeY));
          const arcPath = new Path()
            .moveTo(cx + side * headR2 * 0.3, swipeY + headR2 * 0.4)
            .cubicTo(cx + side * headR2, swipeY - headR2 * 0.6, cx + side * headR2 * 1.5, swipeY - headR2 * 0.3, swipeX, swipeY);
          ds.drawPath(arcPath, NEON_CYAN.copy(swipeP * dim * 0.4), { style: Stroke(3, StrokeCap.Round) });
          for (let sp = 0; sp <= 4; sp++) {
            const sparkAngle = sp * 72 * PI / 180 + tp * 5 * side;
            const sparkDist = headR2 * 0.4 * swipeP;
            ds.drawCircle(Color.White.copy(swipeP * dim * 0.6), headR2 * 0.03,
              O(swipeX + cos(sparkAngle) * sparkDist, swipeY + sin(sparkAngle) * sparkDist));
          }
        }
        break;
      }
      case 'CAT_BACK_FLIP': {
        // Dramatic backflip with motion arc, afterimages, and landing burst
        const flipAngle = tp * 2 * PI;
        for (let gi = 0; gi <= 7; gi++) {
          const gt = gi / 7 * tp;
          const gAngle = gt * 2 * PI;
          const gx = cx + sin(gAngle) * headR2 * 0.3;
          const gy = headY2 - sin(gt * PI) * headR2 * 1.5;
          const gAlpha = (0.3 - gi * 0.035) * dim;
          ds.drawCircle(NEON_CYAN.copy(gAlpha), headR2 * (0.6 - gi * 0.05), O(gx, gy));
        }
        for (let ring = 0; ring <= 2; ring++) {
          const rDelay = ring * 0.15;
          const rP = clamp(tp - rDelay, 0, 1);
          const rR = headR2 * (0.5 + rP * 3);
          const rA = (1 - rP) * dim * 0.5;
          const rCol = [NEON_CYAN, NEON_MAGENTA, NEON_GOLD][ring];
          ds.drawCircle(rCol.copy(rA), rR, O(cx, headY2), { style: Stroke(3 - ring) });
        }
        for (let i = 0; i <= 7; i++) {
          const starAngle = i * 45 * PI / 180 + flipAngle;
          const sr = headR2 * (1.5 + pulse * 0.5);
          const sx = cx + cos(starAngle) * sr;
          const sy = headY2 + sin(starAngle) * sr;
          ds.drawCircle(NEON_GOLD.copy(pulse * dim * 0.8), headR2 * 0.05, O(sx, sy));
          ds.drawLine(NEON_GOLD.copy(pulse * dim * 0.3), O(cx, headY2), O(sx, sy), { strokeWidth: 1 });
        }
        if (tp > 0.7) {
          const landP = (tp - 0.7) / 0.3;
          for (let i = 0; i <= 11; i++) {
            const angle = i * 30 * PI / 180;
            const dist = headR2 * landP * 2;
            ds.drawCircle(Color.White.copy((1 - landP) * dim * 0.7), headR2 * 0.04,
              O(cx + cos(angle) * dist, headY2 + headR2 + Math.max(sin(angle), 0) * dist * 0.5));
          }
        }
        break;
      }
      case 'CAT_PURR_SHOCKWAVE': {
        // Powerful purr shockwave: concentric sound rings with vibration particles
        for (let ring = 0; ring <= 5; ring++) {
          const ringP = clamp(tp - ring * 0.1, 0, 1);
          const rR = headR2 * (0.6 + ringP * 4);
          const alpha = (1 - ringP * 0.8) * dim * (0.6 - ring * 0.06);
          const col = ring % 2 === 0 ? NEON_CYAN : C(0xFF00AAFF);
          ds.drawCircle(col.copy(alpha), rR, O(cx, bodyY2), { style: Stroke(3 - ring * 0.4) });
        }
        for (let i = 0; i <= 15; i++) {
          const vAngle = i * (2 * PI / 16) + tp * 3;
          const vDist = headR2 * (1 + tp * 3) + sin(i * 1.3) * headR2 * 0.3;
          const vx = cx + cos(vAngle) * vDist;
          const vy = bodyY2 + sin(vAngle) * vDist * 0.6;
          const vAlpha = (1 - tp * 0.6) * dim * 0.6;
          ds.drawCircle(NEON_CYAN.copy(vAlpha), headR2 * 0.04, O(vx, vy));
        }
        ds.drawCircle({
          brush: Brush.radialGradient([NEON_CYAN.copy(pulse * 0.3 * dim), Color.Transparent], O(cx, bodyY2), headR2 * 2),
          radius: headR2 * 2, center: O(cx, bodyY2),
        });
        break;
      }
      case 'CAT_LASER_EYES': {
        // Intense dual laser beams with volumetric glow, scatter particles, and burn marks
        const eyeSpacing2 = headR2 * 0.32;
        const eyeY2 = headY2;
        const laserLen = g.width * 0.45 * tp;
        const la = tp * dim;
        for (const side of PET_SIDES) {
          const ex = cx + side * eyeSpacing2;
          const endX = ex + side * laserLen;
          const endY = eyeY2 + headR2 * 0.4;
          ds.drawLine(C(0xFFFF3300).copy(la * 0.2), O(ex, eyeY2), O(endX, endY), { strokeWidth: 14, cap: StrokeCap.Round });
          ds.drawLine(C(0xFFFF6600).copy(la * 0.5), O(ex, eyeY2), O(endX, endY), { strokeWidth: 6, cap: StrokeCap.Round });
          ds.drawLine(LASER.copy(la * 0.95), O(ex, eyeY2), O(endX, endY), { strokeWidth: 2.5, cap: StrokeCap.Round });
          ds.drawLine(Color.White.copy(la * 0.6), O(ex, eyeY2), O(endX, endY), { strokeWidth: 1, cap: StrokeCap.Round });
          const impactR = headR2 * 0.3 * pulse;
          ds.drawCircle(LASER.copy(la * 0.6), impactR, O(endX, endY));
          ds.drawCircle(C(0xFFFFAA00).copy(la * 0.3), impactR * 1.5, O(endX, endY));
          for (let sp = 0; sp <= 5; sp++) {
            const spAngle = sp * 60 * PI / 180 + tp * 8;
            const spDist = headR2 * 0.4 * pulse;
            ds.drawCircle(C(0xFFFFCC00).copy(la * 0.7), headR2 * 0.025,
              O(endX + cos(spAngle) * spDist, endY + sin(spAngle) * spDist));
          }
          ds.drawCircle(LASER.copy(la * 0.8), headR2 * 0.12, O(ex, eyeY2));
        }
        break;
      }
      case 'CAT_SHADOW_CLONE': {
        // Multiple shadow clones fanning out with ghostly trails
        const numClones = 5;
        for (let c = 0; c < numClones; c++) {
          const cloneAngle = (c - 2) * 35 * PI / 180;
          const cloneDist = headR2 * (1.5 + c * 0.3) * pulse;
          const cloneX = cx + sin(cloneAngle) * cloneDist;
          const cloneY = headY2 + cos(cloneAngle) * cloneDist * 0.3;
          const cloneAlpha = (0.4 - c * 0.06) * tp * dim;
          ds.drawCircle(FUR_DARK.copy(cloneAlpha), headR2 * 0.9, O(cloneX, cloneY));
          ds.drawCircle(NEON_CYAN.copy(cloneAlpha * 0.7), headR2 * 0.9, O(cloneX, cloneY), { style: Stroke(2) });
          for (const side of [-0.25, 0.25]) {
            ds.drawCircle(NEON_CYAN.copy(cloneAlpha * 0.9), headR2 * 0.06, O(cloneX + side * headR2, cloneY));
          }
          ds.drawLine(NEON_CYAN.copy(cloneAlpha * 0.2), O(cx, headY2), O(cloneX, cloneY), { strokeWidth: 1.5 });
        }
        break;
      }
      case 'CAT_GOLDEN_PAWS': {
        // Magnificent golden paw prints with radiating sparkle halos
        const bodyW2 = s2 * 0.85;
        const bodyH2 = s2 * 0.6;
        for (const side of PET_SIDES) {
          const pawX = cx + side * bodyW2 * 0.35;
          const pawY = bodyY2 + bodyH2 * 0.45;
          const pa = pulse * dim;
          ds.drawCircle({
            brush: Brush.radialGradient([NEON_GOLD.copy(pa * 0.4), Color.Transparent], O(pawX, pawY), s2 * 0.5),
            radius: s2 * 0.5, center: O(pawX, pawY),
          });
          ds.drawCircle(NEON_GOLD.copy(pa * 0.85), s2 * 0.1, O(pawX, pawY));
          for (let toe = 0; toe <= 3; toe++) {
            const toeAngle = (toe - 1.5) * 25 * PI / 180 - PI / 2;
            const toeX = pawX + cos(toeAngle) * s2 * 0.15;
            const toeY = pawY + sin(toeAngle) * s2 * 0.15;
            ds.drawCircle(NEON_GOLD.copy(pa * 0.8), s2 * 0.04, O(toeX, toeY));
          }
          for (let j = 0; j <= 7; j++) {
            const sparkAngle = j * 45 * PI / 180 + tp * 6;
            const sparkDist = s2 * (0.2 + pulse * 0.15);
            const sx = pawX + cos(sparkAngle) * sparkDist;
            const sy = pawY + sin(sparkAngle) * sparkDist;
            ds.drawCircle(NEON_GOLD.copy(pa * 0.7), s2 * 0.02, O(sx, sy));
            ds.drawCircle(Color.White.copy(pa * 0.5), s2 * 0.01, O(sx, sy));
          }
        }
        const pathAlpha = pulse * dim * 0.3;
        for (let i = 0; i <= 5; i++) {
          const pathX = cx + (i - 2.5) * bodyW2 * 0.14;
          const pathY = bodyY2 + bodyH2 * 0.5 + sin(i + tp * 4) * s2 * 0.05;
          ds.drawCircle(NEON_GOLD.copy(pathAlpha), s2 * 0.015, O(pathX, pathY));
        }
        break;
      }
      case 'CAT_NINE_TAILS': {
        // 9 majestic ghostly tails: each with gradient colors, flowing curves, and fire tips
        const tailBaseX = cx + s2 * 0.6;
        const tailBaseY = bodyY2;
        const cols = [NEON_CYAN, C(0xFF00AAFF), NEON_MAGENTA, C(0xFF8B5CF6), NEON_GOLD, C(0xFFFF6600), C(0xFF00FF88), C(0xFFFF0088), C(0xFF00EEFF)];
        for (let i = 0; i <= 8; i++) {
          const spread = (i - 4) * 22 * PI / 180;
          const len = s2 * (1.5 + (4 - abs(i - 4)) * 0.15) * tp;
          const endX = tailBaseX + cos(-PI / 2.5 + spread) * len;
          const endY = tailBaseY - abs(sin(-PI / 2.5 + spread)) * len;
          const midX = (tailBaseX + endX) / 2 + sin(tp * 6 + i * 0.7) * s2 * 0.2;
          const midY = (tailBaseY + endY) / 2 - s2 * 0.3 * tp;
          const tailPath = new Path().moveTo(tailBaseX, tailBaseY)
            .cubicTo(tailBaseX + s2 * 0.1, tailBaseY - s2 * 0.4 * tp, midX, midY, endX, endY);
          const alpha = (0.5 + (1 - abs(i - 4) / 4) * 0.4) * tp * dim;
          const col = cols[i];
          ds.drawPath(tailPath, col.copy(alpha * 0.3), { style: Stroke(5, StrokeCap.Round) });
          ds.drawPath(tailPath, col.copy(alpha * 0.85), { style: Stroke(2.5, StrokeCap.Round) });
          ds.drawCircle(col.copy(alpha * 0.9), s2 * 0.04, O(endX, endY));
          ds.drawCircle(Color.White.copy(alpha * 0.5), s2 * 0.02, O(endX, endY));
        }
        break;
      }
      case 'CAT_ANGELIC_WINGS': {
        // Grand feathered wings with individual feathers, light rays, and halo
        const wingSpan = s2 * 2.5 * tp;
        const haloY = headY2 - headR2 * 1.5;
        const haloAlpha = pulse * dim;
        ds.drawCircle(NEON_GOLD.copy(haloAlpha * 0.5), headR2 * 0.5, O(cx, haloY), { style: Stroke(2.5) });
        ds.drawCircle({
          brush: Brush.radialGradient([NEON_GOLD.copy(haloAlpha * 0.3), Color.Transparent], O(cx, haloY), headR2),
          radius: headR2, center: O(cx, haloY),
        });
        for (const side of PET_SIDES) {
          const wingPath = new Path().moveTo(cx, bodyY2)
            .cubicTo(cx + side * wingSpan * 0.3, bodyY2 - wingSpan * 0.9,
              cx + side * wingSpan * 0.7, bodyY2 - wingSpan * 0.6,
              cx + side * wingSpan, bodyY2 + wingSpan * 0.05)
            .cubicTo(cx + side * wingSpan * 0.6, bodyY2 + wingSpan * 0.2,
              cx + side * wingSpan * 0.2, bodyY2 + wingSpan * 0.15, cx, bodyY2);
          const wAlpha = pulse * dim;
          ds.drawPath(wingPath, Color.White.copy(wAlpha * 0.3));
          ds.drawPath(wingPath, Color.White.copy(wAlpha * 0.6), { style: Stroke(2) });
          for (let f = 0; f <= 5; f++) {
            const ft = f / 5;
            const fx = cx + side * wingSpan * (0.2 + ft * 0.7);
            const fy = bodyY2 - wingSpan * (0.3 + ft * 0.3) * sin(ft * PI);
            const fEndY = fy + wingSpan * 0.35;
            ds.drawLine(Color.White.copy(wAlpha * (0.5 - ft * 0.06)), O(fx, fy), O(fx + side * wingSpan * 0.08, fEndY), { strokeWidth: 1.5 });
          }
          for (let r = 0; r <= 2; r++) {
            const rayAngle = side * (30 + r * 15) * PI / 180;
            const rayLen = wingSpan * 0.4 * pulse;
            const rayX = cx + side * wingSpan + cos(rayAngle) * rayLen;
            const rayY = bodyY2 + sin(rayAngle) * rayLen;
            ds.drawLine(NEON_GOLD.copy(wAlpha * 0.3), O(cx + side * wingSpan, bodyY2), O(rayX, rayY), { strokeWidth: 1 });
          }
        }
        break;
      }
      case 'CAT_CONSTELLATION': {
        // Grand cat constellation with twinkling stars, nebula glow, and connecting beams
        const scale = 1.3;
        const stars = [
          O(cx - headR2 * 0.5 * scale, headY2 - headR2 * 2.2 * scale),
          O(cx + headR2 * 0.5 * scale, headY2 - headR2 * 2.2 * scale),
          O(cx - headR2 * 0.9 * scale, headY2 - headR2 * 1.2 * scale),
          O(cx + headR2 * 0.9 * scale, headY2 - headR2 * 1.2 * scale),
          O(cx - headR2 * 0.3 * scale, headY2),
          O(cx + headR2 * 0.3 * scale, headY2),
          O(cx, headY2 + headR2 * 0.4 * scale),
          O(cx, headY2 + headR2 * 1.2 * scale),
          O(cx - headR2 * 0.7 * scale, headY2 + headR2 * 2 * scale),
          O(cx + headR2 * 0.7 * scale, headY2 + headR2 * 2 * scale),
          O(cx - headR2 * 1.2 * scale, headY2 + headR2 * 0.8 * scale),
          O(cx + headR2 * 1.2 * scale, headY2 + headR2 * 0.8 * scale),
        ];
        const connections = [[0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [4, 6], [5, 6], [6, 7], [7, 8], [7, 9], [2, 10], [3, 11], [0, 1]];
        const cAlpha = pulse * dim;
        ds.drawCircle({
          brush: Brush.radialGradient([C(0xFF1A0040).copy(cAlpha * 0.3), C(0xFF8B5CF6).copy(cAlpha * 0.1), Color.Transparent],
            O(cx, headY2), headR2 * 3 * scale),
          radius: headR2 * 3 * scale, center: O(cx, headY2),
        });
        connections.forEach(([from, to], idx) => {
          const lineP = clamp(tp * (connections.length + 2) - idx, 0, 1);
          if (lineP > 0) {
            const startP = stars[from], endP = stars[to];
            const curX = startP.x + (endP.x - startP.x) * lineP;
            const curY = startP.y + (endP.y - startP.y) * lineP;
            ds.drawLine(NEON_GOLD.copy(cAlpha * 0.5), startP, O(curX, curY), { strokeWidth: 2 });
            ds.drawLine(Color.White.copy(cAlpha * 0.2), startP, O(curX, curY), { strokeWidth: 4 });
          }
        });
        stars.forEach((star, idx) => {
          const starP = clamp(tp * (stars.length + 3) - idx * 0.8, 0, 1);
          if (starP > 0) {
            const twinkle = sin(tp * 8 + idx * 1.3) * 0.3 + 0.7;
            const starR = headR2 * 0.07 * twinkle * scale;
            ds.drawCircle(NEON_GOLD.copy(cAlpha * 0.9 * starP), starR, star);
            ds.drawCircle(Color.White.copy(cAlpha * 0.7 * starP), starR * 0.4, star);
            const flareLen = starR * 3;
            ds.drawLine(NEON_GOLD.copy(cAlpha * 0.4 * starP), O(star.x - flareLen, star.y), O(star.x + flareLen, star.y), { strokeWidth: 1 });
            ds.drawLine(NEON_GOLD.copy(cAlpha * 0.4 * starP), O(star.x, star.y - flareLen), O(star.x, star.y + flareLen), { strokeWidth: 1 });
          }
        });
        break;
      }
      default: break; // CAT_SPIN: handled by the rotation in melo.js
    }
  }

  window.VPPets = window.VPPets || { renderers: {} };
  window.VPPets.trickFx = window.VPPets.trickFx || {};
  window.VPPets.trickFx.melo = drawTrick;
})();
