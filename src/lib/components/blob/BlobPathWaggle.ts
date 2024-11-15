import type { Point, Rect } from "$lib/geometryHelpers";
import { checkMediaQuery, KnownQueries } from "$lib/MediaQueryWatcher";
import { blobPath, type BlobPath } from "./BlobPathGeometry";
import { svgCurvePath } from "./SVGPath";

const MS_PER_S = 1000;

export type BlobWagglerCallback = (svgPath: string) => void;

export class BlobWaggler {
  private readonly waggleSize: number;
  private readonly wagglePeriod = 2.5 * MS_PER_S;

  private readonly points: BlobPath;
  private readonly offsets: BlobPath;

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
    const waggledPath: BlobPath = {
      start: this.waggledPoint(this.points.start, this.offsets.start),
      control: this.waggledPoint(this.points.control, this.offsets.control),
      end: this.waggledPoint(this.points.end, this.offsets.end),
    };
    const svgPath = svgCurvePath(
      waggledPath.start,
      waggledPath.control,
      waggledPath.end,
    );
    this.callback(svgPath);
    if (!checkMediaQuery(KnownQueries.ReducedMotion)) {
      this.handle = safeRequestAnimationFrame(() => this.waggle()) ?? 0;
    }
  }

  constructor(
    safeAreaRect: Rect,
    waggleSize: number,
    randGen: () => number,
    callback: BlobWagglerCallback,
  ) {
    this.waggleSize = waggleSize;
    this.points = blobPath(safeAreaRect, randGen);
    this.offsets = {
      start: { x: randGen() * MS_PER_S, y: randGen() * MS_PER_S },
      control: { x: randGen() * MS_PER_S, y: randGen() * MS_PER_S },
      end: { x: randGen() * MS_PER_S, y: randGen() * MS_PER_S },
    };

    this.callback = callback;
    this.waggle();
  }

  stop() {
    safeCancelAnimationFrame(this.handle);
  }
}

function safeRequestAnimationFrame(callback: () => void): number | undefined {
  if (typeof window !== "undefined") {
    return requestAnimationFrame(callback);
  }
}

function safeCancelAnimationFrame(handle: number) {
  if (typeof window !== "undefined") {
    return cancelAnimationFrame(handle);
  }
}
