import { fit, sparkle, cycle, TAU, WHITE } from "../../core/index.js";
import { STARLIT, lv, curve, bigSparkle } from "./_lib.js";

export const meta = {
  name: "Upgrade glow: bow",
  desc: "Upgrade glow for bows: follows top tip (a), grip (m), bottom tip (b). Light runs tip to tip, the string hums, the tips glint in turn.",
  tags: ["starbell", "upgrade", "glow", "bow", "loop"],
  size: [112, 112], origin: [56, 56], duration: 1.5, loop: true, fps: 12, bg: "dark",
  options: { palette: STARLIT, seed: 4, level: 2, a: [8, -26], m: [0, 0], b: [-18, 25], width: 2, string: true },
};

export function draw(p, t, o) {
  const C = fit(o.palette, 7), k = lv(o), T = meta.duration, ph = (t / T) * TAU, cv = curve(o.a, o.m, o.b);
  const s = [0.55, 0.8, 1][k - 1], w = o.width, n = Math.ceil(cv.len * 1.5), run0 = ((t / T) * 2) % 2 - 0.5;
  // which side is "outside" the bend: away from the string (the straight line a..b)
  const [mx, my] = cv.at(0.5), sx = (o.a[0] + o.b[0]) / 2, sy = (o.a[1] + o.b[1]) / 2;
  for (let i = 0; i <= n; i++) {
    const u = i / n, [x, y] = cv.at(u), [tx, ty] = cv.tan(u);
    let nx = -ty, ny = tx; if (nx * (mx - sx) + ny * (my - sy) < 0) (nx = -nx, ny = -ny);
    const run = Math.exp(-(((u - run0) * 4) ** 2)), edge = Math.abs(u - 0.5) * 2, a = (0.35 + 0.3 * edge) * s + run * 0.8;
    p.blend(x + nx * (w + 1), y + ny * (w + 1), C[3], 0.25 * s + run * 0.2);
    p.blend(x + nx * w, y + ny * w, run > 0.5 ? WHITE : C[5], Math.min(1, a));
    if (k >= 2) p.blend(x - nx * w, y - ny * w, C[4], Math.min(1, a * 0.5));
    p.light(x, y, C[4], 0.1 * s + run * 0.25);
  }
  if (o.string) {   // a flicker running along the string
    const L = Math.hypot(o.b[0] - o.a[0], o.b[1] - o.a[1]);
    for (let j = 1; j < L; j++) {
      const u = j / L, x = o.a[0] + (o.b[0] - o.a[0]) * u, y = o.a[1] + (o.b[1] - o.a[1]) * u, on = Math.sin(j * 0.9 - ph * 6) > 0.6;
      if (on || k === 3) p.blend(x, y, on ? C[6] : C[4], (on ? 0.6 : 0.2) * s);
    }
  }
  for (const [u, off] of [[0, 0], [1, Math.PI]]) {
    const g = Math.max(0, Math.sin(ph + off)), [x, y] = cv.at(u);
    sparkle(p, x, y, 1.5 + (1 + k) * g ** 3, WHITE, C[5], 0.55 * g + 0.1);
    p.glow(x, y, 4 + k, C[4], 0.25 * s);
  }
  cycle(t, T, [3, 6, 10][k - 1], o.seed, (R) => R.range(0.5, 1.0), (age, life, R) => {
    const u = age / life, [x, y] = cv.at(R.range(0, 1)), a = Math.sin(u * Math.PI);
    p.dot(x + u * R.range(2, 5), y - u * 3, a > 0.8 ? WHITE : C[5], a);
    p.light(x, y, C[4], 0.3 * a);
  });
  if (k === 3) {
    bigSparkle(p, t, T, o, C, (v) => cv.at(v), 6, 8);
    const ru = run0 < 0 || run0 > 1 ? null : run0;
    if (ru !== null) { const [rx, ry] = cv.at(ru); sparkle(p, rx, ry, 2.5, WHITE, C[5], 0.6); }
    for (const [u, off] of [[0, 0], [1, Math.PI]]) { const g = Math.max(0, Math.sin(ph + off)), [x, y] = cv.at(u); sparkle(p, x, y, 3 + 3 * g ** 2, WHITE, C[5], 0.3 + 0.4 * g); }
  }
}
