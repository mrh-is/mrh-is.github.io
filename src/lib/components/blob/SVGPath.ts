import type { Point } from "$lib/geometryHelpers";

function svgStringify(point: Point): string {
  return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
}
export function svgMoveTo(point: Point): string {
  return `M${svgStringify(point)}`;
}
export function svgCurve(control: Point, end: Point): string {
  return `Q${svgStringify(control)} ${svgStringify(end)}`;
}

export function svgCurvePath(start: Point, control: Point, end: Point): string {
  let path = svgMoveTo(start);
  path += svgCurve(control, end);
  return path;
}
