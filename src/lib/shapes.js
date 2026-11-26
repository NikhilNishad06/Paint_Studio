import { mkGrad } from './gradient.js';

export const SHAPES = [
  ['line', 'Line'],
  ['arrow', 'Arrow line'],
  ['darrow', 'Double arrow line'],
  ['rect', 'Rectangle / Cube'],
  ['round', 'Rounded rectangle / 3D Block'],
  ['ellipse', 'Circle / Cylinder'],
  ['tri', 'Triangle / Cone'],
  ['rtri', 'Right triangle / Wedge'],
  ['diamond', 'Diamond / Octahedron'],
  ['pent', 'Pentagon / 3D Prism'],
  ['hex', 'Hexagon / 3D Hex-Prism'],
  ['octagon', 'Octagon / 3D Oct-Prism'],
  ['para', 'Parallelogram / 3D Oblique Box'],
  ['trap', 'Trapezoid / 3D Frustum'],
  ['cross', 'Plus / 3D Cross'],
  ['star', 'Star (5 points) / 3D Star'],
  ['star4', 'Star (4 points) / 3D Star'],
  ['star6', 'Star (6 points) / 3D Star'],
  ['heart', 'Heart / 3D Heart'],
  ['cloud', 'Cloud / 3D Cloud'],
  ['bolt', 'Lightning / 3D Bolt'],
  ['callout', 'Speech bubble / 3D Bubble'],
  ['arR', 'Arrow right / 3D Arrow'],
  ['arL', 'Arrow left / 3D Arrow'],
  ['arU', 'Arrow up / 3D Arrow'],
  ['arD', 'Arrow down / 3D Arrow'],
];

export const PG = {
  para: [
    [0.2, 0],
    [1, 0],
    [0.8, 1],
    [0, 1],
  ],
  trap: [
    [0.2, 0],
    [0.8, 0],
    [1, 1],
    [0, 1],
  ],
  cross: [
    [0.35, 0],
    [0.65, 0],
    [0.65, 0.35],
    [1, 0.35],
    [1, 0.65],
    [0.65, 0.65],
    [0.65, 1],
    [0.35, 1],
    [0.35, 0.65],
    [0, 0.65],
    [0, 0.35],
    [0.35, 0.35],
  ],
  octagon: [
    [0.3, 0],
    [0.7, 0],
    [1, 0.3],
    [1, 0.7],
    [0.7, 1],
    [0.3, 1],
    [0, 0.7],
    [0, 0.3],
  ],
  bolt: [
    [0.6, 0],
    [0.15, 0.55],
    [0.45, 0.55],
    [0.35, 1],
    [0.85, 0.4],
    [0.55, 0.4],
  ],
  arR: [
    [0, 0.3],
    [0.6, 0.3],
    [0.6, 0],
    [1, 0.5],
    [0.6, 1],
    [0.6, 0.7],
    [0, 0.7],
  ],
  arL: [
    [1, 0.3],
    [0.4, 0.3],
    [0.4, 0],
    [0, 0.5],
    [0.4, 1],
    [0.4, 0.7],
    [1, 0.7],
  ],
  arU: [
    [0.3, 1],
    [0.3, 0.4],
    [0, 0.4],
    [0.5, 0],
    [1, 0.4],
    [0.7, 0.4],
    [0.7, 1],
  ],
  arD: [
    [0.3, 0],
    [0.3, 0.6],
    [0, 0.6],
    [0.5, 1],
    [1, 0.6],
    [0.7, 0.6],
    [0.7, 0],
  ],
};

function getPolygonPoints(t, l, tp, r, b, cx, cy, rx, ry, X, Y) {
  if (t === 'rect') {
    return [[l, tp], [r, tp], [r, b], [l, b]];
  }
  if (t === 'round') {
    return [[l, tp], [r, tp], [r, b], [l, b]];
  }
  if (t === 'tri') {
    return [[cx, tp], [r, b], [l, b]];
  }
  if (t === 'rtri') {
    return [[l, tp], [r, b], [l, b]];
  }
  if (t === 'diamond') {
    return [[cx, tp], [r, cy], [cx, b], [l, cy]];
  }
  if (t === 'pent' || t === 'hex' || t === 'star' || t === 'star4' || t === 'star6') {
    const n = t === 'pent' ? 5 : t === 'hex' || t === 'star6' ? 6 : t === 'star4' ? 4 : 5;
    const inner = t === 'star' ? 0.45 : t === 'star4' ? 0.38 : t === 'star6' ? 0.55 : 0;
    const p = inner ? n * 2 : n;
    const pts = [];
    for (let i = 0; i < p; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / p;
      const k = inner && i % 2 ? inner : 1;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return pts;
  }
  if (PG[t]) {
    return PG[t].map(([u, v]) => [X(u), Y(v)]);
  }
  return null;
}

export function drawShape(ctx, t, x0, y0, x1, y1, { col, oth, fm, size, grad, is3d }) {
  const stroke = col,
    fillc = fm === 'both' ? oth : col;
  ctx.lineWidth = size;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fillc;
  ctx.beginPath();
  const l = Math.min(x0, x1),
    r = Math.max(x0, x1),
    tp = Math.min(y0, y1),
    b = Math.max(y0, y1),
    cx = (l + r) / 2,
    cy = (tp + b) / 2,
    rx = (r - l) / 2,
    ry = (b - tp) / 2;
  const X = (u) => l + u * (r - l),
    Y = (v) => tp + v * (b - tp);

  if (grad.on) {
    const G = mkGrad(ctx, l, tp, r, b, grad),
      ln = t === 'line' || t === 'arrow' || t === 'darrow';
    if (ln || fm === 'outline') ctx.strokeStyle = G;
    else ctx.fillStyle = G;
  }

  // ------------------------- 3D MODE -------------------------
  if (is3d) {
    // 1. 3D Line / Arrows (3D Tube Bar)
    if (t === 'line' || t === 'arrow' || t === 'darrow') {
      const angle = Math.atan2(y1 - y0, x1 - x0);
      const perp = angle + Math.PI / 2;
      const w = Math.max(4, size * 2);
      const ox = Math.cos(perp) * w;
      const oy = Math.sin(perp) * w;

      ctx.beginPath();
      ctx.moveTo(x0 - ox, y0 - oy);
      ctx.lineTo(x1 - ox, y1 - oy);
      ctx.lineTo(x1 + ox, y1 + oy);
      ctx.lineTo(x0 + ox, y0 + oy);
      ctx.closePath();
      if (fm !== 'outline') ctx.fill();
      ctx.stroke();

      // Caps
      ctx.beginPath();
      ctx.ellipse(x0, y0, w, w * 0.5, angle, 0, Math.PI * 2);
      ctx.ellipse(x1, y1, w, w * 0.5, angle, 0, Math.PI * 2);
      ctx.stroke();

      if (t === 'arrow' || t === 'darrow') {
        const h = Math.max(14, size * 4.5);
        const hd = (ax, ay, bx, by) => {
          const a = Math.atan2(by - ay, bx - ax);
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx - h * Math.cos(a - 0.45), by - h * Math.sin(a - 0.45));
          ctx.lineTo(bx - h * Math.cos(a + 0.45), by - h * Math.sin(a + 0.45));
          ctx.closePath();
          if (fm !== 'outline') ctx.fill();
          ctx.stroke();
        };
        hd(x0, y0, x1, y1);
        if (t === 'darrow') hd(x1, y1, x0, y0);
      }
      return;
    }

    // 2. 3D Cylinder (from Circle / Ellipse)
    if (t === 'ellipse') {
      const ey = Math.max(4, (b - tp) * 0.16);
      const topY = tp + ey;
      const botY = b - ey;

      // Solid body fill
      if (fm !== 'outline') {
        ctx.beginPath();
        ctx.ellipse(cx, topY, rx, ey, 0, Math.PI, 0, false);
        ctx.lineTo(r, botY);
        ctx.ellipse(cx, botY, rx, ey, 0, 0, Math.PI, false);
        ctx.lineTo(l, topY);
        ctx.closePath();
        ctx.fill();
      }

      // Top Lid
      ctx.beginPath();
      ctx.ellipse(cx, topY, rx, ey, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Side Wall Lines
      ctx.beginPath();
      ctx.moveTo(l, topY);
      ctx.lineTo(l, botY);
      ctx.moveTo(r, topY);
      ctx.lineTo(r, botY);
      // Bottom Front Visible Arc
      ctx.ellipse(cx, botY, rx, ey, 0, 0, Math.PI, false);
      ctx.stroke();

      // Bottom Back Dashed Contour
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.ellipse(cx, botY, rx, ey, 0, Math.PI, Math.PI * 2, false);
      ctx.stroke();
      ctx.restore();
      return;
    }

    // 3. 3D Cone (from Triangle)
    if (t === 'tri' || t === 'rtri') {
      const ey = Math.max(4, (b - tp) * 0.16);
      const botY = b - ey;
      const apexX = t === 'rtri' ? l : cx;

      if (fm !== 'outline') {
        ctx.beginPath();
        ctx.moveTo(apexX, tp);
        ctx.lineTo(r, botY);
        ctx.ellipse(cx, botY, rx, ey, 0, 0, Math.PI, false);
        ctx.lineTo(l, botY);
        ctx.closePath();
        ctx.fill();
      }

      // Side Lines
      ctx.beginPath();
      ctx.moveTo(apexX, tp);
      ctx.lineTo(l, botY);
      ctx.moveTo(apexX, tp);
      ctx.lineTo(r, botY);
      // Front Base Arc
      ctx.ellipse(cx, botY, rx, ey, 0, 0, Math.PI, false);
      ctx.stroke();

      // Back Base Dashed Arc
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.ellipse(cx, botY, rx, ey, 0, Math.PI, Math.PI * 2, false);
      ctx.stroke();
      ctx.restore();
      return;
    }

    // 4. 3D Cube / Cuboid (from Rectangle)
    if (t === 'rect') {
      const dx = Math.round((r - l) * 0.25);
      const dy = Math.round((b - tp) * 0.25);
      const fx = l, fy = tp + dy, fw = (r - l) - dx, fh = (b - tp) - dy;

      if (fm !== 'outline') {
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(fx + dx, fy - dy);
        ctx.lineTo(fx + fw + dx, fy - dy);
        ctx.lineTo(fx + fw + dx, fy + fh - dy);
        ctx.lineTo(fx + fw, fy + fh);
        ctx.lineTo(fx, fy + fh);
        ctx.closePath();
        ctx.fill();
      }

      // Front Face
      ctx.beginPath();
      ctx.rect(fx, fy, fw, fh);
      ctx.stroke();

      // Top Face & Right Face
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + dx, fy - dy);
      ctx.lineTo(fx + fw + dx, fy - dy);
      ctx.lineTo(fx + fw, fy);

      ctx.moveTo(fx + fw + dx, fy - dy);
      ctx.lineTo(fx + fw + dx, fy + fh - dy);
      ctx.lineTo(fx + fw, fy + fh);
      ctx.stroke();

      // Dashed Back Edges (Geometry visualization)
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(fx, fy + fh);
      ctx.lineTo(fx + dx, fy + fh - dy);
      ctx.lineTo(fx + fw + dx, fy + fh - dy);
      ctx.moveTo(fx + dx, fy + fh - dy);
      ctx.lineTo(fx + dx, fy - dy);
      ctx.stroke();
      ctx.restore();
      return;
    }

    // 5. General True 3D Prism Extrusion for all polygons & shapes (Diamond, Hexagon, Octagon, Star, Heart, Cloud, etc.)
    const pts = getPolygonPoints(t, l, tp, r, b, cx, cy, rx, ry, X, Y);
    if (pts && pts.length >= 3) {
      const dx = Math.round(Math.max(8, (r - l) * 0.2));
      const dy = Math.round(Math.max(8, (b - tp) * 0.2));

      // 1) Fill total body if fill mode active
      if (fm !== 'outline') {
        ctx.beginPath();
        pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px + dx, py - dy) : ctx.lineTo(px + dx, py - dy)));
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
        ctx.closePath();
        ctx.fill();
      }

      // 2) Back Face
      ctx.beginPath();
      pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px + dx, py - dy) : ctx.lineTo(px + dx, py - dy)));
      ctx.closePath();
      ctx.stroke();

      // 3) Connecting Depth Corner Edges
      ctx.beginPath();
      pts.forEach(([px, py]) => {
        ctx.moveTo(px, py);
        ctx.lineTo(px + dx, py - dy);
      });
      ctx.stroke();

      // 4) Front Face
      ctx.beginPath();
      pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
      ctx.closePath();
      ctx.stroke();
      return;
    }

    // Fallback for curves (heart, cloud, callout) in 3D
    const dx = Math.round(Math.max(6, (r - l) * 0.15));
    const dy = Math.round(Math.max(6, (b - tp) * 0.15));

    ctx.save();
    ctx.translate(dx, -dy);
    ctx.beginPath();
    drawBaseShape(ctx, t, l, tp, r, b, cx, cy, rx, ry, X, Y);
    if (fm !== 'outline') ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    drawBaseShape(ctx, t, l, tp, r, b, cx, cy, rx, ry, X, Y);
    if (fm !== 'outline') ctx.fill();
    ctx.stroke();
    return;
  }

  // ------------------------- NORMAL 2D MODE -------------------------
  let line = false;
  if (t === 'line' || t === 'arrow' || t === 'darrow') {
    line = true;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    if (t === 'arrow' || t === 'darrow') {
      const h = Math.max(12, size * 4),
        hd = (ax, ay, bx, by) => {
          const a = Math.atan2(by - ay, bx - ax);
          [-0.45, 0.45].forEach((d) => {
            ctx.moveTo(bx, by);
            ctx.lineTo(bx - h * Math.cos(a + d), by - h * Math.sin(a + d));
          });
        };
      hd(x0, y0, x1, y1);
      if (t === 'darrow') hd(x1, y1, x0, y0);
    }
  } else {
    drawBaseShape(ctx, t, l, tp, r, b, cx, cy, rx, ry, X, Y);
  }

  if (!line && fm !== 'outline') ctx.fill();
  if (line || fm !== 'fill') ctx.stroke();
}

function drawBaseShape(ctx, t, l, tp, r, b, cx, cy, rx, ry, X, Y) {
  if (t === 'rect') {
    ctx.rect(l, tp, r - l, b - tp);
  } else if (t === 'round') {
    const q = Math.min(r - l, b - tp) * 0.2;
    if (ctx.roundRect) ctx.roundRect(l, tp, r - l, b - tp, q);
    else ctx.rect(l, tp, r - l, b - tp);
  } else if (t === 'ellipse') {
    ctx.ellipse(cx, cy, rx, ry, 0, 0, 7);
  } else if (t === 'tri') {
    ctx.moveTo(cx, tp);
    ctx.lineTo(r, b);
    ctx.lineTo(l, b);
    ctx.closePath();
  } else if (t === 'rtri') {
    ctx.moveTo(l, tp);
    ctx.lineTo(l, b);
    ctx.lineTo(r, b);
    ctx.closePath();
  } else if (t === 'diamond') {
    ctx.moveTo(cx, tp);
    ctx.lineTo(r, cy);
    ctx.lineTo(cx, b);
    ctx.lineTo(l, cy);
    ctx.closePath();
  } else if (t === 'pent') {
    poly(ctx, cx, cy, rx, ry, 5, 0);
  } else if (t === 'hex') {
    poly(ctx, cx, cy, rx, ry, 6, 0);
  } else if (t === 'star') {
    poly(ctx, cx, cy, rx, ry, 5, 0.45);
  } else if (t === 'star4') {
    poly(ctx, cx, cy, rx, ry, 4, 0.38);
  } else if (t === 'star6') {
    poly(ctx, cx, cy, rx, ry, 6, 0.55);
  } else if (PG[t]) {
    PG[t].forEach(([u, v], i) => (i ? ctx.lineTo(X(u), Y(v)) : ctx.moveTo(X(u), Y(v))));
    ctx.closePath();
  } else if (t === 'heart') {
    const m = ctx.moveTo.bind(ctx),
      c = (a, b, c1, d, e, f) => ctx.bezierCurveTo(X(a), Y(b), X(c1), Y(d), X(e), Y(f));
    m(X(0.5), Y(0.95));
    c(0.1, 0.65, 0, 0.45, 0, 0.28);
    c(0, 0.1, 0.15, 0, 0.3, 0);
    c(0.4, 0, 0.47, 0.06, 0.5, 0.15);
    c(0.53, 0.06, 0.6, 0, 0.7, 0);
    c(0.85, 0, 1, 0.1, 1, 0.28);
    c(1, 0.45, 0.9, 0.65, 0.5, 0.95);
    ctx.closePath();
  } else if (t === 'cloud') {
    const c = (a, b, c1, d, e, f) => ctx.bezierCurveTo(X(a), Y(b), X(c1), Y(d), X(e), Y(f));
    ctx.moveTo(X(0.25), Y(0.85));
    c(0.05, 0.85, 0, 0.55, 0.18, 0.5);
    c(0.12, 0.25, 0.38, 0.15, 0.48, 0.3);
    c(0.58, 0.05, 0.88, 0.15, 0.82, 0.42);
    c(1.02, 0.45, 1, 0.85, 0.78, 0.85);
    ctx.closePath();
  } else if (t === 'callout') {
    const q = (a, b, c1, d) => ctx.quadraticCurveTo(X(a), Y(b), X(c1), Y(d)),
      n = (u, v) => ctx.lineTo(X(u), Y(v));
    ctx.moveTo(X(0.08), Y(0));
    n(0.92, 0);
    q(1, 0, 1, 0.1);
    n(1, 0.62);
    q(1, 0.72, 0.92, 0.72);
    n(0.45, 0.72);
    n(0.22, 1);
    n(0.28, 0.72);
    n(0.08, 0.72);
    q(0, 0.72, 0, 0.62);
    n(0, 0.1);
    q(0, 0, 0.08, 0);
    ctx.closePath();
  }
}

function poly(ctx, cx, cy, rx, ry, n, inner) {
  const p = inner ? n * 2 : n;
  for (let i = 0; i < p; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / p,
      k = inner && i % 2 ? inner : 1,
      x = cx + Math.cos(a) * rx * k,
      y = cy + Math.sin(a) * ry * k;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
}
