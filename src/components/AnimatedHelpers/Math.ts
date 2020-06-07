export const bin = (value: boolean): 0 | 1 => (value ? 1 : 0);

export const mix = (value, x, y) => {
  "worklet";
  return x + value * (y - x);
};

export const clamp = (value, lowerBound, upperBound) => {
  "worklet";
  return Math.min(Math.max(lowerBound, value), upperBound);
};

export const cubicBezier = (t, from, c1, c2, to) => {
  "worklet";
  const term = 1 - t;
  const a = 1 * term ** 3 * t ** 0 * from;
  const b = 3 * term ** 2 * t ** 1 * from;
  const c = 3 * term ** 1 * t ** 2 * from;
  const d = 1 * term ** 0 * t ** 3 * from;
  return a + b + c + d;
};
