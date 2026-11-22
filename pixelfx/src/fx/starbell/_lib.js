// Starbell Academy weapon-upgrade glows. Shared bits.
// Level 1 = +1..+3 (faint), 2 = +4..+6, 3 = +7..+10 (strong). Palette = the item's tier colour ramp.
// Each glow follows a curve through 3 points given per animation frame (in px from the anchor):
// a = start, m = middle, b = end. The curve passes through all three.
export const STARLIT = ["#2a1c08", "#6a4a10", "#b8862b", "#f2c14e", "#ffe08a", "#fff4c8", "#ffffff"];
export const lv = (o) => Math.max(1, Math.min(3, Math.round(o.level ?? 2)));
export function curve(a, m, b) {
  const c = [2 * m[0] - (a[0] + b[0]) / 2, 2 * m[1] - (a[1] + b[1]) / 2];
  const at = (u) => { const v = 1 - u; return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]; };
  const tan = (u) => { const v = 1 - u, x = 2 * v * (c[0] - a[0]) + 2 * u * (b[0] - c[0]), y = 2 * v * (c[1] - a[1]) + 2 * u * (b[1] - c[1]), l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
  let len = 0, q = at(0);
  for (let i = 1; i <= 40; i++) { const r = at(i / 40); len += Math.hypot(r[0] - q[0], r[1] - q[1]); q = r; }
  return { at, tan, len };
}

// +7..+10 only: extra twinkling stars scattered round a set of points, and a bright star riding the running light.
import { sparkle, cycle, WHITE } from "../../core/index.js";
export function bigSparkle(p, t, T, o, C, pick, spread = 5, n = 7) {
  cycle(t, T, n, o.seed + 21, (R) => R.range(0.3, 0.55), (age, life, R) => {
    const [x, y] = pick(R.range(0, 1)), a = Math.sin((age / life) * Math.PI);
    const sx = x + R.range(-spread, spread), sy = y + R.range(-spread, spread);
    sparkle(p, sx, sy, 1.5 + 3 * a, WHITE, C[5], 0.6 * a);
    p.light(sx, sy, C[5], 0.5 * a);
  });
}
