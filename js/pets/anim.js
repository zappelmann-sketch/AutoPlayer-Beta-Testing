/* Vumikio Pets on the web - Compose animation pieces as plain functions of time.
   Mirrors androidx.compose.animation.core (infiniteRepeatable + tween, animateFloatAsState with
   tween or spring) and the app's PetAnimation.kt (rememberLoopPhase, rememberTrickProgress).
   Every renderer instance owns a "mem" object; these helpers keep their state in it. */
(function () {
  'use strict';

  /** CSS-style cubic-bezier easing, as Compose's CubicBezierEasing. */
  function cubicBezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (t) => ((ax * t + bx) * t + cx) * t;
    const sy = (t) => ((ay * t + by) * t + cy) * t;
    const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (x) => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) {
        const err = sx(t) - x;
        if (Math.abs(err) < 1e-5) break;
        const d = dx(t);
        if (Math.abs(d) < 1e-6) break;
        t -= err / d;
      }
      if (t < 0 || t > 1) { // bisection fallback
        let lo = 0, hi = 1; t = x;
        for (let i = 0; i < 30; i++) { if (sx(t) < x) lo = t; else hi = t; t = (lo + hi) / 2; }
      }
      return sy(t);
    };
  }

  const Easing = {
    Linear: (x) => x,
    FastOutSlowIn: cubicBezier(0.4, 0, 0.2, 1),
    LinearOutSlowIn: cubicBezier(0, 0, 0.2, 1),
    FastOutLinearIn: cubicBezier(0.4, 0, 1, 1),
    EaseInOut: cubicBezier(0.42, 0, 0.58, 1),
    EaseIn: cubicBezier(0.42, 0, 1, 1),
    EaseOut: cubicBezier(0, 0, 0.58, 1),
    cubicBezier,
  };

  /**
   * infiniteRepeatable(tween(ms, easing), RepeatMode.Restart|Reverse) of initialValue..targetValue,
   * evaluated at time nowMs since the pet appeared. delayMs = tween's delayMillis.
   */
  function inf(nowMs, from, to, ms, easing, reverse, delayMs) {
    const d = delayMs || 0;
    const cycle = ms + d;
    const ease = easing || Easing.FastOutSlowIn;
    let u;
    if (reverse) {
      const k = Math.floor(nowMs / cycle);
      const local = Math.max(0, nowMs - k * cycle - d) / ms;
      // the reverse leg is the forward animation played backwards: ease(1 - u)
      u = k % 2 === 0 ? ease(Math.min(1, local)) : ease(1 - Math.min(1, local));
    } else {
      const local = Math.max(0, (nowMs % cycle) - d) / ms;
      u = ease(Math.min(1, local));
    }
    return from + (to - from) * u;
  }

  /** rememberLoopPhase(periodMs, range): 0..range once per period, follows a new period without a jump. */
  function loopPhase(mem, key, periodMs, dtMs, range) {
    const r = range == null ? Math.PI * 2 : range;
    const k = '_lp_' + key;
    mem[k] = ((mem[k] || 0) + dtMs / Math.max(1, periodMs) * r) % r;
    return mem[k];
  }

  /** rememberTrickProgress: 0..1 once over 1800 ms (FastOutSlowIn) when a trick starts, 0 when it ends. */
  const TRICK_ANIMATION_MS = 1800;
  const TRICK_SPIN_MS = 1000;
  function trickProgress(mem, active, type, nowMs) {
    const sig = active ? String(type) : '';
    if (sig !== mem._tpSig) {
      mem._tpSig = sig;
      mem._tpStart = nowMs;
    }
    if (!active) return 0;
    return Easing.FastOutSlowIn(Math.min(1, (nowMs - mem._tpStart) / TRICK_ANIMATION_MS));
  }

  /** animateFloatAsState(target, tween(ms, easing)): a new target starts a tween from where it is. */
  function tweenTo(mem, key, target, ms, easing, nowMs) {
    const k = '_tw_' + key;
    let s = mem[k];
    if (!s) { s = mem[k] = { from: target, to: target, start: nowMs, value: target }; }
    if (target !== s.to) { s.from = s.value; s.to = target; s.start = nowMs; }
    const u = Math.min(1, (nowMs - s.start) / Math.max(1, ms));
    s.value = s.from + (s.to - s.from) * (easing || Easing.FastOutSlowIn)(u);
    return s.value;
  }

  /** animateFloatAsState(target, spring(dampingRatio, stiffness)): unit mass spring. */
  function springTo(mem, key, target, dtMs, dampingRatio, stiffness) {
    const k = '_sp_' + key;
    let s = mem[k];
    if (!s) { s = mem[k] = { x: target, v: 0 }; }
    const kStiff = stiffness == null ? 1500 : stiffness;       // Spring.StiffnessMedium
    const zeta = dampingRatio == null ? 1 : dampingRatio;     // Spring.DampingRatioNoBouncy
    const c = 2 * zeta * Math.sqrt(kStiff);
    let left = Math.min(100, dtMs) / 1000;
    while (left > 0) {
      const h = Math.min(left, 1 / 240);
      const a = -kStiff * (s.x - target) - c * s.v;
      s.v += a * h;
      s.x += s.v * h;
      left -= h;
    }
    if (Math.abs(s.x - target) < 1e-4 && Math.abs(s.v) < 1e-3) { s.x = target; s.v = 0; }
    return s.x;
  }

  /**
   * LaunchedEffect(trigger) { value = high; delay(holdMs); value = low } - e.g. the beat pulse.
   * Returns the current target (feed it into springTo / tweenTo like the app does).
   */
  function pulse(mem, key, trigger, high, low, holdMs, nowMs) {
    const k = '_pu_' + key;
    let s = mem[k];
    if (!s) s = mem[k] = { last: false, until: -1 };
    if (trigger && !s.last) s.until = nowMs + holdMs;
    s.last = !!trigger;
    return nowMs < s.until ? high : low;
  }

  /** Something that changes only when its trigger changes (LaunchedEffect + mutable state). */
  function onChange(mem, key, value, fn) {
    const k = '_oc_' + key;
    if (mem[k] !== value) { const prev = mem[k]; mem[k] = value; fn(value, prev); }
  }

  /** Seeded random for reproducible frames (video export). */
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => {
      s ^= s << 13; s >>>= 0;
      s ^= s >>> 17;
      s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }

  window.VPAnim = {
    Easing, inf, loopPhase, trickProgress, tweenTo, springTo, pulse, onChange, rng,
    TRICK_ANIMATION_MS, TRICK_SPIN_MS,
    PET_SIDES: [-1, 1],
  };
})();
