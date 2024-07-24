import type { Point, Rect } from "$lib/geometryHelpers";
import { blobPath, type Blob } from "./BlobPathGeometry";
import { svgCurvePath } from "./SVGPath";

const MS_PER_S = 1000;

export type BlobWagglerCallback = (svgPath: string) => void;

export class BlobWaggler {
  private readonly waggleSize: number;
  private readonly wagglePeriod = 2.5 * MS_PER_S;

  private readonly points: Blob.Path
  private readonly offsets: Blob.Path

  private readonly startTime = Date.now();

  private handle = 0;
  private readonly callback: BlobWagglerCallback;

  private waggleAmount(offset: number): number {
    const now = Date.now();
    return Math.sin((now - this.startTime) / this.wagglePeriod + offset);
  }

  private waggledPoint(point: Point, offset: Point): Point {
    return {
      x: point.x + this.waggleSize * this.waggleAmount(offset.x),
      y: point.y + this.waggleSize * this.waggleAmount(offset.y),
    };
  }

  waggle() {
    const waggledPath: Blob.Path = {
      start: this.waggledPoint(this.points.start, this.offsets.start),
      control: this.waggledPoint(this.points.control, this.offsets.control),
      end: this.waggledPoint(this.points.end, this.offsets.end),
    };
    const svgPath = svgCurvePath(waggledPath.start, waggledPath.control, waggledPath.end);
    this.callback(svgPath);
    this.handle = requestAnimationFrame(() => this.waggle());
  }

  constructor(safeAreaRect: Rect, waggleSize: number, seed: string, callback: BlobWagglerCallback) {
    this.waggleSize = waggleSize;
    this.points = blobPath(safeAreaRect, seed);
    this.offsets = {
      start: { x: Math.random() * MS_PER_S, y: Math.random() * MS_PER_S },
      control: { x: Math.random() * MS_PER_S, y: Math.random() * MS_PER_S },
      end: { x: Math.random() * MS_PER_S, y: Math.random() * MS_PER_S },
    };

    this.callback = callback;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.handle = requestAnimationFrame(() => this.waggle());
    }
  }

  stop() {
    cancelAnimationFrame(this.handle);
  }
}