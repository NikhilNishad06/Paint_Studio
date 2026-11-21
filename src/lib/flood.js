import { mkGrad } from './gradient.js';

function hex2(c) {
  return [1, 3, 5].map((i) => parseInt(c.substr(i, 2), 16));
}

export function flood(ctx, x, y, c, W, H, grad) {
  x |= 0;
  y |= 0;
  const img = ctx.getImageData(0, 0, W, H),
    d = img.data,
    [r, g, b] = hex2(c),
    i0 = (y * W + x) * 4,
    tr = d[i0],
    tg = d[i0 + 1],
    tb = d[i0 + 2];
  const G = grad.on;
  if (!G && tr === r && tg === g && tb === b) return;
  const seen = new Uint8Array(W * H),
    m = (px, py) => {
      const i = (py * W + px) * 4;
      return (
        !seen[py * W + px] &&
        Math.abs(d[i] - tr) + Math.abs(d[i + 1] - tg) + Math.abs(d[i + 2] - tb) <= 60
      );
    };
  const st = [x, y];
  while (st.length) {
    const yy = st.pop(),
      xx = st.pop();
    if (!m(xx, yy)) continue;
    let a = xx,
      z = xx;
    while (a > 0 && m(a - 1, yy)) a--;
    while (z < W - 1 && m(z + 1, yy)) z++;
    for (let k = a; k <= z; k++) {
      seen[yy * W + k] = 1;
      if (!G) {
        const i = (yy * W + k) * 4;
        d[i] = r;
        d[i + 1] = g;
        d[i + 2] = b;
        d[i + 3] = 255;
      }
    }
    for (const ny of [yy - 1, yy + 1]) {
      if (ny < 0 || ny >= H) continue;
      let on = false;
      for (let k = a; k <= z; k++) {
        const ok = m(k, ny);
        if (ok && !on) st.push(k, ny);
        on = ok;
      }
    }
  }
  if (G) {
    let x0 = W,
      y0 = H,
      x1 = 0,
      y1 = 0;
    for (let yy = 0; yy < H; yy++)
      for (let xx = 0; xx < W; xx++)
        if (seen[yy * W + xx]) {
          if (xx < x0) x0 = xx;
          if (xx > x1) x1 = xx;
          if (yy < y0) y0 = yy;
          if (yy > y1) y1 = yy;
        }
    const bw = x1 - x0 + 1,
      bh = y1 - y0 + 1,
      oc = document.createElement('canvas');
    oc.width = bw;
    oc.height = bh;
    const o = oc.getContext('2d');
    o.fillStyle = mkGrad(o, 0, 0, bw, bh, grad);
    o.fillRect(0, 0, bw, bh);
    const gd = o.getImageData(0, 0, bw, bh).data;
    for (let yy = y0; yy <= y1; yy++)
      for (let xx = x0; xx <= x1; xx++)
        if (seen[yy * W + xx]) {
          const i = (yy * W + xx) * 4,
            j = ((yy - y0) * bw + (xx - x0)) * 4;
          d[i] = gd[j];
          d[i + 1] = gd[j + 1];
          d[i + 2] = gd[j + 2];
          d[i + 3] = 255;
        }
  }
  ctx.putImageData(img, 0, 0);
}
