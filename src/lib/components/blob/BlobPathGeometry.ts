import { fittingInside, type Point, type Rect } from "$lib/geometryHelpers";
import { Range, scale } from "$lib/mathHelpers";
import { DeterministicVendor } from "../../DeterministicVendor";

export interface BlobPath {
  start: Point;
  control: Point;
  end: Point;
}

class Path {
  private points: Point[] = [];
  private boundingBox: Rect = {
    x: new Range(Number.MAX_VALUE, Number.MIN_VALUE),
    y: new Range(Number.MAX_VALUE, Number.MIN_VALUE),
  };

  append(point: Point) {
    this.points.push(point);
    this.boundingBox.x.min = Math.min(this.boundingBox.x.min, point.x);
    this.boundingBox.x.max = Math.max(this.boundingBox.x.max, point.x);
    this.boundingBox.y.min = Math.min(this.boundingBox.y.min, point.y);
    this.boundingBox.y.max = Math.max(this.boundingBox.y.max, point.y);
  }

  pathInside(rect: Rect): Point[] {
    const targetRect = fittingInside(this.boundingBox, rect);
    return this.points.map((point: Point) => {
      return {
        x: scale(point.x, this.boundingBox.x, targetRect.x),
        y: scale(point.y, this.boundingBox.y, targetRect.y),
      };
    });
  }
}

function pointByAddingVector(
  startPoint: Point,
  direction: number,
  length: number,
): Point {
  return {
    x: startPoint.x + Math.cos((direction / 180) * Math.PI) * length,
    y: startPoint.y - Math.sin((direction / 180) * Math.PI) * length,
  };
}

export function blobPath(rect: Rect, seed: string): BlobPath {
  const sideLength = new Range(50, 100);
  const deflection = new Range(30, 90);
  const deflectionRange = deflection.max - deflection.min;

  const rand = new DeterministicVendor(seed);
  const path = new Path();
  let point = { x: 0, y: 0 } as Point;
  path.append(point);

  let direction = rand.nextBetween(0, 360);
  const initialLength = rand.nextIn(sideLength);
  point = pointByAddingVector(point, direction, initialLength);
  path.append(point);

  let pointDeflection = rand.nextBetween(-deflectionRange, deflectionRange);
  pointDeflection += Math.sign(pointDeflection) * deflection.min;
  direction += pointDeflection;
  const length = rand.nextIn(sideLength);
  path.append(pointByAddingVector(point, direction, length));

  const scaledPath = path.pathInside(rect);

  return {
    start: scaledPath[0],
    control: scaledPath[1],
    end: scaledPath[2],
  };
}
