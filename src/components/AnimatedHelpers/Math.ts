export const bin = (value: boolean): 0 | 1 => (value ? 1 : 0);

export const mix = (value, x, y) => {
  "worklet";
  return x + value * (y - x);
};

export const clamp = (value, lowerBound, upperBound) => {
  "worklet";
  return Math.min(Math.max(lowerBound, value), upperBound);
};
