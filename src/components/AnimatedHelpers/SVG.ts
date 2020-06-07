import parseSVG from "parse-svg-path";
import absSVG from "abs-svg-path";
import normalizeSVG from "normalize-svg-path";
import { interpolate, Extrapolate } from "react-native-reanimated";

import cubicBezierLength from "./bezier/CubicBezierLength";
import { Vector } from "./Vector";
import { cubicBezier } from "./Math";

type SVGMove = ["M", number, number];
type SVGCurve = ["C", number, number, number, number, number, number];
type SVGPath = [SVGMove, ...SVGCurve[]];

export interface Path {
  curves: BezierCurve[];
  length: number;
}

export interface BezierCurve {
  from: Vector;
  to: Vector;
  c1: Vector;
  c2: Vector;
  start: number;
  end: number;
}

export const exhaustiveCheck = (command: never): never => {
  throw new TypeError(`Unknown SVG Command: ${command}`);
};

export const parsePath = (d: string): Path => {
  let length = 0;
  const [move, ...rawCurves]: SVGPath = normalizeSVG(absSVG(parseSVG(d)));
  const curves: BezierCurve[] = rawCurves.map((curve, index) => {
    const prevCurve = rawCurves[index - 1];
    const from =
      index === 0
        ? { x: move[1], y: move[2] }
        : { x: prevCurve[5], y: prevCurve[6] };
    const c1 = { x: curve[1], y: curve[2] };
    const c2 = { x: curve[3], y: curve[4] };
    const to = { x: curve[5], y: curve[6] };
    const start = length;
    length += cubicBezierLength(from, c1, c2, to);
    const end = length;
    return {
      from,
      c1,
      c2,
      to,
      start,
      end,
    };
  });
  return {
    length,
    curves,
  };
};

export const getPointAtLength = (path, length) => {
  "worklet";
  const { start, end, from, to, c1, c2 } = path.curves.find(
    (c) => length >= c.start && length <= c.end
  );
  const t = interpolate(length, [start, end], [0, 1]);
  return {
    x: cubicBezier(t, from.x, c1.x, c2.x, to.x),
    y: cubicBezier(t, from.y, c1.y, c2.y, to.y),
  };
};
