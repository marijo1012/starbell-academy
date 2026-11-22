import { fit, sparkle, cycle, TAU, WHITE } from "../../core/index.js";
import { STARLIT, lv, bigSparkle } from "./_lib.js";

export const meta = {
  name: "Upgrade glow: staff",
  desc: "Upgrade glow for staffs and wands: grip (a), head (b). A pulsing orb with a turning ring and orbiting sparks; light climbs the shaft.",
  tags: ["starbell", "upgrade", "glow", "staff", "wand", "loop"],
  size: [128, 128], origin: [64, 64], duration: 1.5, loop: true, fps: 12, bg: "dark",
  options: { palette: STARLIT, seed: 5, level: 2, a: [0, 0], b: [12, -40], orb: 1 },
};

export function draw(p, t, o) {
  const C = fit(o.palette, 7), k = lv(o), T = meta.duration, ph = (t / T) * TAU;
  const s = [0.55, 0.8, 1][k - 1], pulse = 0.5 + 0.5 * Math.sin(ph * 2);
  const [ax, ay] = o.a, [hx, hy] = o.b, L = Math.hypot(hx - ax, hy - ay), dx = (hx - ax) / L, dy = (hy - ay) / L;
  for (let j = -6; j < L - 4; j++) {     // light climbing the shaft
    const u = (j + 6) / (L + 2), r = Math.exp(-(((u - ((t / T) * 2) % 1) * 7) ** 2));
    const x = ax + dx * j, y = ay + dy * j;
    if (r > 0.15 || k === 3) for (const sd of [-2, 2]) p.blend(x - dy * sd, y + dx * sd, r > 0.6 ? C[6] : C[4], Math.min(1, (0.15 + r) * s * (sd > 0 ? 1 : 0.6)));
    p.light(x, y, C[4], r * 0.2 * s);
  }
  const R0 = (2 + k * 0.7 + pulse * 0.9) * o.orb;
  p.glow(hx, hy, 9 + 3 * k + pulse * 3, C[3], 0.4 * s);
  p.disc(hx, hy, R0 + 3, C[4], 0.25 * s);
  p.circle(hx, hy, R0, C[4]);
  p.circle(hx - 0.5, hy - 0.5, R0 * 0.55, C[6]);
  p.px(hx - 1, hy - 1, WHITE);
  const RX = 6 + k, RY = 2.2;
  for (let i = 0, n = 56; i < n; i++) {
    const g = (i / n) * TAU + ph, x = hx + Math.cos(g) * RX, y = hy + Math.sin(g) * RY - Math.cos(g) * 1.2;
    const front = Math.sin(g) > -0.2;
    if (!front && Math.hypot(x - hx, y - hy) < R0 + 0.5) continue;
    const hot = Math.cos(g - ph * 2) > 0.92;
    p.blend(x, y, hot ? WHITE : C[5], Math.min(1, (front ? 0.85 : 0.4) * s + (hot ? 0.3 : 0)));
  }
  const nS = [1, 2, 5][k - 1];
  for (let j = 0; j < nS; j++) {
    const g = ph * 1.5 + (j * TAU) / nS;
    sparkle(p, hx + Math.cos(g) * (RX + 3), hy + Math.sin(g) * (RY + 3), 1 + (k >= 2 ? 1.5 : 0.5) * (0.5 + 0.5 * Math.sin(ph * 4 + j)), WHITE, C[5], 0.45 * s);
  }
  cycle(t, T, [3, 6, 10][k - 1], o.seed, (R) => R.range(0.5, 1.0), (age, life, R) => {
    const u = age / life, x = hx + R.range(-5, 5), y = hy - R0 - u * R.range(4, 10), a = Math.sin(u * Math.PI);
    p.dot(x + Math.sin(u * 6 + x) * 1.2, y, a > 0.8 ? WHITE : C[5], a);
    p.light(x, y, C[4], 0.3 * a);
  });
  if (k === 3) {
    bigSparkle(p, t, T, o, C, () => [hx, hy], 11, 9);
    sparkle(p, hx, hy, 4 + 3 * pulse, WHITE, C[5], 0.35 + 0.35 * pulse);   // the orb flares as it pulses
  }
}
