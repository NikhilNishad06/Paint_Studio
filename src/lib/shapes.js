import { mkGrad } from './gradient.js';

export const SHAPES = [
  ['line', 'Line'],
  ['arrow', 'Arrow line'],
  ['darrow', 'Double arrow line'],
  ['rect', 'Rectangle'],
  ['round', 'Rounded rectangle'],
  ['ellipse', 'Ellipse / circle'],
  ['tri', 'Triangle'],
  ['rtri', 'Right triangle'],
  ['diamond', 'Diamond'],
  ['pent', 'Pentagon'],
  ['hex', 'Hexagon'],
  ['octagon', 'Octagon'],
  ['para', 'Parallelogram'],
  ['trap', 'Trapezoid'],
  ['cross', 'Plus / cross'],
  ['star', 'Star (5 points)'],
  ['star4', 'Star (4 points)'],
  ['star6', 'Star (6 points)'],
  ['heart', 'Heart'],
  ['cloud', 'Cloud'],
  ['bolt', 'Lightning'],
  ['callout', 'Speech bubble'],
  ['cyl', 'Cylinder / database'],
  ['arR', 'Arrow right'],
  ['arL', 'Arrow left'],
  ['arU', 'Arrow up'],
  ['arD', 'Arrow down'],
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

export function poly(ctx, cx, cy, rx, ry, n, inner) {
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

export function drawShape(ctx, t, x0, y0, x1, y1, { col, oth, fm, size, grad }) {
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
  let line = false;
  const X = (u) => l + u * (r - l),
    Y = (v) => tp + v * (b - tp);

  if (grad.on) {
    const G = mkGrad(ctx, l, tp, r, b, grad),
      ln = t === 'line' || t === 'arrow' || t === 'darrow';
    if (ln || fm === 'outline') ctx.strokeStyle = G;
    else ctx.fillStyle = G;
  }

  if (t === 'line') {
    line = true;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
  } else if (t === 'arrow' || t === 'darrow') {
    line = true;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
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
  } else if (t === 'rect') {
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
  } else if (t === 'cyl') {
    const ey = Math.max(2, (b - tp) * 0.15);
    ctx.moveTo(l, tp + ey);
    ctx.lineTo(l, b - ey);
    ctx.ellipse(cx, b - ey, rx, ey, 0, Math.PI, 0, true);
    ctx.lineTo(r, tp + ey);
    ctx.ellipse(cx, tp + ey, rx, ey, 0, 0, Math.PI, true);
    ctx.closePath();
    ctx.moveTo(l, tp + ey);
    ctx.ellipse(cx, tp + ey, rx, ey, 0, Math.PI, 0, true);
  }
  if (!line && fm !== 'outline') ctx.fill();
  if (line || fm !== 'fill') ctx.stroke();
}
