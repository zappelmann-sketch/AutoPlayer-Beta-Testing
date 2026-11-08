/* Vumikio Pets on the web - a small stand-in for Jetpack Compose's DrawScope on a 2D canvas.
   The pet renderers of the app (presentation/components/pet/*Renderer.kt) are ported almost
   line by line on top of this, so shapes, colours and stroke widths stay those of the app.

   Coordinates are DEVICE PIXELS of the app (pet size in dp x DENSITY), exactly like Compose
   draws them; the stage scales the result down to CSS pixels. Stroke(3f) is therefore 3 device
   pixels, as on the phone.

   Call style: Kotlin positional arguments stay positional, named-only extras go into a trailing
   options object:  drawCircle(color, radius, center, { style: Stroke(3) })
   or the whole call as one object:  drawCircle({ brush, radius, center }). */
(function () {
  'use strict';

  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

  class Color {
    constructor(r, g, b, a) { this.r = r; this.g = g; this.b = b; this.a = a; }
    /** Kotlin: Color(0xAARRGGBB) */
    static of(argb) {
      return new Color(Math.floor(argb / 0x10000) % 256, Math.floor(argb / 0x100) % 256, argb % 256,
        Math.floor(argb / 0x1000000) % 256 / 255);
    }
    /** Kotlin: color.copy(alpha = x) - sets the alpha, it does not multiply. */
    copy(alpha) { return new Color(this.r, this.g, this.b, clamp01(alpha)); }
    css(mul) {
      const a = clamp01(this.a * (mul == null ? 1 : mul));
      return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + a.toFixed(4) + ')';
    }
  }
  Color.White = new Color(255, 255, 255, 1);
  Color.Black = new Color(0, 0, 0, 1);
  Color.Transparent = new Color(0, 0, 0, 0);
  Color.Red = new Color(255, 0, 0, 1);
  Color.Yellow = new Color(255, 255, 0, 1);
  Color.Gray = new Color(136, 136, 136, 1);
  Color.Cyan = new Color(0, 255, 255, 1);
  Color.Magenta = new Color(255, 0, 255, 1);
  /** Kotlin: lerp(start, stop, fraction) for colours (straight sRGB mix, as on the phone). */
  Color.lerp = (a, b, t) => new Color(
    Math.round(a.r + (b.r - a.r) * t), Math.round(a.g + (b.g - a.g) * t),
    Math.round(a.b + (b.b - a.b) * t), a.a + (b.a - a.a) * t);
  /** Kotlin: Color(red = 0.2f, green = ..., blue = ..., alpha = ...) with floats 0..1 */
  Color.rgbF = (r, g, b, a) => new Color(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a == null ? 1 : a);

  class Offset {
    constructor(x, y) { this.x = x; this.y = y; }
    plus(o) { return new Offset(this.x + o.x, this.y + o.y); }
    minus(o) { return new Offset(this.x - o.x, this.y - o.y); }
    times(s) { return new Offset(this.x * s, this.y * s); }
  }
  Offset.Zero = new Offset(0, 0);

  class Size {
    constructor(w, h) { this.width = w; this.height = h; }
    get minDimension() { return Math.min(this.width, this.height); }
  }

  /** Kotlin: Stroke(width, cap = StrokeCap.Butt, join = StrokeJoin.Miter). Width 0 = hairline. */
  class StrokeStyle { constructor(o) { this.width = o.width || 0; this.cap = o.cap || 'butt'; this.join = o.join || 'miter'; } }
  function Stroke(width, cap, join) {
    if (typeof width === 'object') return new StrokeStyle(width);
    return new StrokeStyle({ width, cap, join });
  }
  const StrokeCap = { Round: 'round', Butt: 'butt', Square: 'square' };
  const StrokeJoin = { Round: 'round', Miter: 'miter', Bevel: 'bevel' };
  const Fill = null;

  class Brush {
    constructor(kind, o) { this.kind = kind; this.o = o; }
    /** stops: [Color...] spread evenly, or [[0.0, Color], [0.5, Color] ...] */
    static stops(list) {
      if (list.length && Array.isArray(list[0])) return list;
      return list.map((c, i) => [list.length === 1 ? 0 : i / (list.length - 1), c]);
    }
    static radialGradient(colors, center, radius) {
      if (!Array.isArray(colors)) return new Brush('radial', colors);
      return new Brush('radial', { colors, center, radius });
    }
    static linearGradient(colors, start, end) {
      if (!Array.isArray(colors)) return new Brush('linear', colors);
      return new Brush('linear', { colors, start, end });
    }
    static verticalGradient(colors, startY, endY) {
      if (!Array.isArray(colors)) return new Brush('vertical', colors);
      return new Brush('vertical', { colors, startY, endY });
    }
    static horizontalGradient(colors, startX, endX) {
      if (!Array.isArray(colors)) return new Brush('horizontal', colors);
      return new Brush('horizontal', { colors, startX, endX });
    }
    static sweepGradient(colors, center) {
      if (!Array.isArray(colors)) return new Brush('sweep', colors);
      return new Brush('sweep', { colors, center });
    }
    /** Compose resolves unspecified centres/ends against the size of the DrawScope. */
    toCanvas(ctx, size) {
      const o = this.o;
      let g;
      if (this.kind === 'radial') {
        const c = o.center || new Offset(size.width / 2, size.height / 2);
        const r = o.radius == null || !isFinite(o.radius) ? size.minDimension / 2 : Math.max(0.0001, o.radius);
        g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
      } else if (this.kind === 'vertical') {
        g = ctx.createLinearGradient(0, o.startY || 0, 0, o.endY == null || !isFinite(o.endY) ? size.height : o.endY);
      } else if (this.kind === 'horizontal') {
        g = ctx.createLinearGradient(o.startX || 0, 0, o.endX == null || !isFinite(o.endX) ? size.width : o.endX, 0);
      } else if (this.kind === 'sweep') {
        const c = o.center || new Offset(size.width / 2, size.height / 2);
        g = ctx.createConicGradient(0, c.x, c.y);
      } else {
        const s = o.start || Offset.Zero;
        const e = o.end || new Offset(size.width, size.height);
        g = ctx.createLinearGradient(s.x, s.y, isFinite(e.x) ? e.x : size.width, isFinite(e.y) ? e.y : size.height);
      }
      Brush.stops(o.colors).forEach(([pos, col]) => g.addColorStop(clamp01(pos), col.css()));
      return g;
    }
  }

  class Path {
    constructor() { this.p = new Path2D(); this.empty = true; }
    moveTo(x, y) { this.p.moveTo(x, y); this.empty = false; return this; }
    lineTo(x, y) { this.p.lineTo(x, y); return this; }
    cubicTo(x1, y1, x2, y2, x3, y3) { this.p.bezierCurveTo(x1, y1, x2, y2, x3, y3); return this; }
    quadraticBezierTo(x1, y1, x2, y2) { this.p.quadraticCurveTo(x1, y1, x2, y2); return this; }
    quadraticTo(x1, y1, x2, y2) { this.p.quadraticCurveTo(x1, y1, x2, y2); return this; }
    close() { this.p.closePath(); return this; }
    /** Kotlin: addOval(Rect(left, top, right, bottom)) */
    addOval(l, t, r, b) {
      this.p.ellipse((l + r) / 2, (t + b) / 2, Math.abs(r - l) / 2, Math.abs(b - t) / 2, 0, 0, Math.PI * 2);
      this.empty = false;
      return this;
    }
    /** Kotlin: arcTo(Rect(l,t,r,b), startAngleDegrees, sweepAngleDegrees, forceMoveTo) */
    arcTo(l, t, r, b, startDeg, sweepDeg) {
      const rad = Math.PI / 180;
      this.p.ellipse((l + r) / 2, (t + b) / 2, Math.abs(r - l) / 2, Math.abs(b - t) / 2, 0,
        startDeg * rad, (startDeg + sweepDeg) * rad, sweepDeg < 0);
      this.empty = false;
      return this;
    }
  }

  const isOpts = (v) => v != null && typeof v === 'object' && v.constructor === Object;

  /** One DrawScope per frame and pet canvas. */
  class DrawScope {
    constructor(ctx, width, height) {
      this.ctx = ctx;
      this.size = new Size(width, height);
      this.center = new Offset(width / 2, height / 2);
    }

    paint(paintArg, opts, shape) {
      const ctx = this.ctx;
      const style = opts && opts.style;
      const alpha = opts && opts.alpha != null ? opts.alpha : 1;
      let fill;
      if (paintArg instanceof Brush) { fill = paintArg.toCanvas(ctx, this.size); ctx.globalAlpha = clamp01(alpha); }
      else { fill = (paintArg || Color.Black).css(alpha); ctx.globalAlpha = 1; }
      if (style) {
        ctx.strokeStyle = fill;
        ctx.lineWidth = style.width > 0 ? style.width : 1;
        ctx.lineCap = style.cap;
        ctx.lineJoin = style.join;
        shape(true);
      } else {
        ctx.fillStyle = fill;
        shape(false);
      }
      ctx.globalAlpha = 1;
    }

    /** drawCircle(color|brush, radius = minDimension / 2, center = this.center, opts) */
    drawCircle(a, radius, center, opts) {
      if (isOpts(a)) { opts = a; a = a.color || a.brush; radius = opts.radius; center = opts.center; }
      const r = radius == null ? this.size.minDimension / 2 : radius;
      if (!(r > 0)) return;
      const c = center || this.center;
      this.paint(a, opts, (stroke) => {
        this.ctx.beginPath();
        this.ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
        if (stroke) this.ctx.stroke(); else this.ctx.fill();
      });
    }

    /** drawOval(color|brush, topLeft = Offset.Zero, size = this.size, opts) */
    drawOval(a, topLeft, size, opts) {
      if (isOpts(a)) { opts = a; a = a.color || a.brush; topLeft = opts.topLeft; size = opts.size; }
      const tl = topLeft || Offset.Zero;
      const s = size || this.size;
      if (!(Math.abs(s.width) > 0 && Math.abs(s.height) > 0)) return;
      this.paint(a, opts, (stroke) => {
        this.ctx.beginPath();
        this.ctx.ellipse(tl.x + s.width / 2, tl.y + s.height / 2, Math.abs(s.width / 2), Math.abs(s.height / 2), 0, 0, Math.PI * 2);
        if (stroke) this.ctx.stroke(); else this.ctx.fill();
      });
    }

    /** drawRect(color|brush, topLeft = Offset.Zero, size = this.size, opts) */
    drawRect(a, topLeft, size, opts) {
      if (isOpts(a)) { opts = a; a = a.color || a.brush; topLeft = opts.topLeft; size = opts.size; }
      const tl = topLeft || Offset.Zero;
      const s = size || this.size;
      this.paint(a, opts, (stroke) => {
        if (stroke) this.ctx.strokeRect(tl.x, tl.y, s.width, s.height);
        else this.ctx.fillRect(tl.x, tl.y, s.width, s.height);
      });
    }

    /** drawRoundRect(color|brush, topLeft, size, cornerRadius, opts) - cornerRadius as a number */
    drawRoundRect(a, topLeft, size, corner, opts) {
      if (isOpts(a)) { opts = a; a = a.color || a.brush; topLeft = opts.topLeft; size = opts.size; corner = opts.cornerRadius; }
      const tl = topLeft || Offset.Zero;
      const s = size || this.size;
      this.paint(a, opts, (stroke) => {
        this.ctx.beginPath();
        this.ctx.roundRect(tl.x, tl.y, s.width, s.height, corner || 0);
        if (stroke) this.ctx.stroke(); else this.ctx.fill();
      });
    }

    /** drawLine(color|brush, start, end, opts{ strokeWidth = 0 (hairline), cap = Butt, alpha }) */
    drawLine(a, start, end, opts) {
      if (isOpts(a)) { opts = a; a = a.color || a.brush; start = opts.start; end = opts.end; }
      const o = opts || {};
      const w = o.strokeWidth > 0 ? o.strokeWidth : 0;
      this.paint(a, { alpha: o.alpha, style: new StrokeStyle({ width: w, cap: o.cap || 'butt' }) }, () => {
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
      });
    }

    /** drawPath(path, color|brush, opts{ alpha, style }) */
    drawPath(path, a, opts) {
      if (isOpts(path)) { opts = path; path = opts.path; a = opts.color || opts.brush; }
      if (isOpts(a)) { opts = a; a = a.color || a.brush; }
      if (!path || path.empty) return;
      this.paint(a, opts, (stroke) => { if (stroke) this.ctx.stroke(path.p); else this.ctx.fill(path.p); });
    }

    /** drawArc(color|brush, startAngle, sweepAngle, useCenter, topLeft, size, opts) - degrees */
    drawArc(a, startAngle, sweepAngle, useCenter, topLeft, size, opts) {
      if (isOpts(a)) {
        opts = a; a = a.color || a.brush; startAngle = opts.startAngle; sweepAngle = opts.sweepAngle;
        useCenter = opts.useCenter; topLeft = opts.topLeft; size = opts.size;
      }
      const tl = topLeft || Offset.Zero;
      const s = size || this.size;
      const rad = Math.PI / 180;
      const cx = tl.x + s.width / 2;
      const cy = tl.y + s.height / 2;
      this.paint(a, opts, (stroke) => {
        const ctx = this.ctx;
        ctx.beginPath();
        if (useCenter) ctx.moveTo(cx, cy);
        ctx.ellipse(cx, cy, Math.abs(s.width / 2), Math.abs(s.height / 2), 0, startAngle * rad,
          (startAngle + sweepAngle) * rad, sweepAngle < 0);
        if (useCenter) ctx.closePath();
        if (stroke) ctx.stroke(); else ctx.fill();
      });
    }

    /** Stand-in for nativeCanvas.drawText(text, x, y, paint): baseline at y, like Android. */
    drawText(text, x, y, o) {
      const ctx = this.ctx;
      ctx.font = (o.bold ? 'bold ' : '') + (o.size || 14) + 'px sans-serif';
      ctx.textAlign = o.align || 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = o.color.css();
      ctx.fillText(text, x, y);
    }

    /** rotate(degrees, pivot = center, block) */
    rotate(deg, pivot, block) {
      if (typeof pivot === 'function') { block = pivot; pivot = this.center; }
      const p = pivot || this.center;
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(deg * Math.PI / 180);
      ctx.translate(-p.x, -p.y);
      block(this);
      ctx.restore();
    }

    /** scale(scale, pivot, block) | scale(scaleX, scaleY, pivot, block) | scale(sx, sy, block) */
    scale(sx, a, b, c) {
      let sy = sx;
      let pivot = this.center;
      let block;
      if (typeof a === 'function') block = a;
      else if (a instanceof Offset) { pivot = a; block = b; }
      else { sy = a; if (typeof b === 'function') block = b; else { pivot = b || this.center; block = c; } }
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(pivot.x, pivot.y);
      ctx.scale(sx, sy);
      ctx.translate(-pivot.x, -pivot.y);
      block(this);
      ctx.restore();
    }

    /** translate(left = 0, top = 0, block) */
    translate(left, top, block) {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(left || 0, top || 0);
      block(this);
      ctx.restore();
    }
  }

  window.VPCompose = {
    Color, Offset, Size, Stroke, StrokeCap, StrokeJoin, Fill, Brush, Path, DrawScope,
    C: Color.of,
    O: (x, y) => new Offset(x, y),
    S: (w, h) => new Size(w, h),
  };
})();
