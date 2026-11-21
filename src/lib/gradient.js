export const PRESETS = [
  ['Sunset', ['#ff512f', '#f09819', '#ffe259']],
  ['Ocean', ['#2193b0', '#6dd5ed']],
  ['Rainbow', ['#ff0000', '#ffa500', '#ffee00', '#22b14c', '#00a2e8', '#8a2be2']],
  ['Berry', ['#7f00ff', '#e100ff']],
  ['Mint', ['#11998e', '#38ef7d']],
  ['Fire', ['#f12711', '#f5af19']],
  ['Candy', ['#ff5d7a', '#ffb84d', '#3fd6a0', '#3a8bff']],
  ['Night', ['#0f2027', '#2c5364', '#8e9eab']],
];

export function cssGrad(grad) {
  const st = grad.stops.join(',');
  return grad.type === 'radial'
    ? 'radial-gradient(circle,' + st + ')'
    : 'linear-gradient(' + (grad.angle + 90) + 'deg,' + st + ')';
}

export function mkGrad(c, x0, y0, x1, y1, grad) {
  const w = x1 - x0,
    h = y1 - y0,
    cx = x0 + w / 2,
    cy = y0 + h / 2;
  let g;
  if (grad.type === 'radial') {
    g = c.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, Math.hypot(w, h) / 2));
  } else {
    const a = (grad.angle * Math.PI) / 180,
      dx = Math.cos(a),
      dy = Math.sin(a),
      half = (Math.abs(w * dx) + Math.abs(h * dy)) / 2 || 1;
    g = c.createLinearGradient(cx - dx * half, cy - dy * half, cx + dx * half, cy + dy * half);
  }
  const n = grad.stops.length;
  grad.stops.forEach((k, i) => g.addColorStop(n === 1 ? 0 : i / (n - 1), k));
  return g;
}
