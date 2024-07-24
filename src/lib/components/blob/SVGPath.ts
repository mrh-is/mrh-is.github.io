import type { Point } from "$lib/geometryHelpers";

namespace SVGInstructions {
  function stringify(point: Point): string {
    return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
  }
  export function moveTo(point: Point): string {
    return `M${stringify(point)}`;
  }
  export function curve(control: Point, end: Point): string {
    return `Q${stringify(control)} ${stringify(end)}`;
  }
}

export function svgCurvePath(start: Point, control: Point, end: Point): string {
  let path = SVGInstructions.moveTo(start);
  path += SVGInstructions.curve(control, end);
  return path;
}
