export const mix = (value, x, y) => {
  "worklet";
  return x + value * (y - x);
};

export const clamp = (value, lowerBound, upperBound) => {
  "worklet";
  return Math.min(Math.max(lowerBound, value), upperBound);
};
