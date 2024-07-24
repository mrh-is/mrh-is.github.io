import { Range } from "./mathHelpers";

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: Range;
  y: Range;
}

export function fittingInside(source: Rect, dest: Rect): Rect {
  const sourceAspect = source.x.size() / source.y.size();
  const destAspect = dest.x.size() / dest.y.size();
  const scaleFactor: number =
    sourceAspect >= destAspect
      ? dest.x.size() / source.x.size()
      : dest.y.size() / source.y.size();

  const targetWidth = source.x.size() * scaleFactor;
  const targetHeight = source.y.size() * scaleFactor;
  const targetLeft = dest.x.min + (dest.x.size() - targetWidth) / 2;
  const targetTop = dest.y.min + (dest.y.size() - targetHeight) / 2;

  return {
    x: new Range(targetLeft, targetLeft + targetWidth),
    y: new Range(targetTop, targetTop + targetHeight),
  };
}
