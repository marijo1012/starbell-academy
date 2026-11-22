import { fit, sparkle, cycle, TAU, WHITE } from "../../core/index.js";
import { STARLIT, lv, curve, bigSparkle } from "./_lib.js";

export const meta = {
  name: "Upgrade glow: sword",
  desc: "Upgrade glow for blades: follows guard (a), middle (m), tip (b), so curved sabres work. Light runs up both edges, the tip glints, motes drift off.",
  tags: ["starbell", "upgrade", "glow", "sword", "loop"],
  size: [128, 128], origin: [64, 64], duration: 1.5, loop: true, fps: 12, bg: "dark",
  options: { palette: STARLIT, seed: 3, level: 2, a: [0, 0], m: [16, -20], b: [26, -42], width: 3 },
};

export function draw(p, t, o) {
  const C = fit(o.palette, 7), k = lv(o), T = meta.duration, ph = (t / T) * TAU, cv = curve(o.a, o.m, o.b);
  const s = [0.55, 0.8, 1][k - 1], w = o.width, n = Math.ceil(cv.len * 1.5), run0 = (t / T) % 1;
  for (let i = 0; i <= n; i++) {
    const u = i / n, [x, y] = cv.at(u), [tx, ty] = cv.tan(u), nx = -ty, ny = tx;
    const run = Math.exp(-(((u - run0) * 6) ** 2)), a = (0.3 + 0.5 * u) * s + run * 0.8;
    // soft halo hugging the blade
    for (const d of [w + 1, -(w + 1)]) p.blend(x + nx * d, y + ny * d, C[3], 0.25 * s + run * 0.25);
    // bright edges
    p.blend(x + nx * w, y + ny * w, run > 0.5 ? WHITE : C[5], Math.min(1, a));
    p.blend(x - nx * w, y - ny * w, run > 0.5 ? C[6] : C[4], Math.min(1, a * (k >= 2 ? 0.8 : 0.45)));
    p.light(x, y, C[4], 0.1 * s + run * 0.25);
  }
  const [bx, by] = cv.at(1), g = Math.max(0, Math.sin(ph * 2));
  sparkle(p, bx, by, 1.5 + (1.5 + k) * g ** 3, WHITE, C[5], 0.55 * g + 0.1);
  p.glow(bx, by, 6 + 2 * k, C[4], 0.3 * s);
  cycle(t, T, [3, 6, 10][k - 1], o.seed, (R) => R.range(0.5, 1.0), (age, life, R) => {
    const u = age / life, v = R.range(0.15, 1), [x, y] = cv.at(v), [tx, ty] = cv.tan(v), side = R.range(0, 1) < 0.5 ? -1 : 1;
    const d = side * (w + 1 + u * R.range(3, 7)), a = Math.sin(u * Math.PI);
    p.dot(x - ty * d, y + tx * d - u * 2, a > 0.8 ? WHITE : C[5], a);
    p.light(x, y, C[4], 0.3 * a);
  });
  if (k === 3) {
    bigSparkle(p, t, T, o, C, (v) => cv.at(0.2 + 0.8 * v), 6, 8);
    const [rx, ry] = cv.at(Math.min(1, Math.max(0, run0)));          // a star riding the running light
    sparkle(p, rx, ry, 2.5, WHITE, C[5], 0.6);
    sparkle(p, bx, by, 4 + 3 * g ** 2, WHITE, C[5], 0.35 + 0.4 * g);  // bigger tip flare
  }
}
