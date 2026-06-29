// src/lib/components/blob/blobFunctions.ts
import type { Point, Rect } from "$lib/geometryHelpers";
import { Range } from "$lib/mathHelpers";
import { DeterministicVendor } from "$lib/DeterministicVendor";
import { blobPath, type BlobPath } from "./BlobPathGeometry";
import { svgCurvePath } from "./SVGPath";
import type { BlobConfig } from "./types";

const MS_PER_S = 1000;
const WAGGLE_PERIOD = 2.5 * MS_PER_S;
const BLOB_SIZE = 600;
const BLOB_WIDTH = BLOB_SIZE / 2;
const WAGGLE_SIZE = BLOB_SIZE * 0.03;

function makeSafeAreaRect(): Rect {
  const margin = WAGGLE_SIZE + BLOB_WIDTH / 2;
  return {
    x: new Range(margin, BLOB_SIZE - margin),
    y: new Range(margin, BLOB_SIZE - margin),
  };
}

export function generateBlobConfigs(seed: string, color: string): BlobConfig[] {
  const rand = new DeterministicVendor(seed);
  const safeArea = makeSafeAreaRect();

  return Array.from({ length: 7 }, () => {
    const top = rand.nextBetween(2, 12);
    const left = rand.nextBetween(10, 90);
    const shapePoints = blobPath(safeArea, () => rand.next());
    const waggleOffsets: BlobPath = {
      start: { x: rand.next() * MS_PER_S, y: rand.next() * MS_PER_S },
      control: { x: rand.next() * MS_PER_S, y: rand.next() * MS_PER_S },
      end: { x: rand.next() * MS_PER_S, y: rand.next() * MS_PER_S },
    };

    return { position: { top, left }, shapePoints, waggleOffsets, color };
  });
}

export function computeWagglePoint(
  point: Point,
  offset: Point,
  time: number,
  waggleSize: number,
  wagglePeriod: number,
): Point {
  return {
    x: point.x + waggleSize * Math.sin(time / wagglePeriod + offset.x),
    y: point.y + waggleSize * Math.sin(time / wagglePeriod + offset.y),
  };
}

export function computeBlobPath(
  config: BlobConfig,
  time: number,
  waggleSize: number,
): string {
  const { shapePoints, waggleOffsets } = config;
  const start = computeWagglePoint(
    shapePoints.start,
    waggleOffsets.start,
    time,
    waggleSize,
    WAGGLE_PERIOD,
  );
  const control = computeWagglePoint(
    shapePoints.control,
    waggleOffsets.control,
    time,
    waggleSize,
    WAGGLE_PERIOD,
  );
  const end = computeWagglePoint(
    shapePoints.end,
    waggleOffsets.end,
    time,
    waggleSize,
    WAGGLE_PERIOD,
  );
  return svgCurvePath(start, control, end);
}

export function computeDriftVectors(
  oldConfigs: BlobConfig[],
  newConfigs: BlobConfig[],
): { dx: number; dy: number }[] {
  return oldConfigs.map((old, i) => {
    const nw = newConfigs[i];
    const rawDx = nw.position.left - old.position.left;
    const rawDy = nw.position.top - old.position.top;
    const magnitude = Math.sqrt(rawDx * rawDx + rawDy * rawDy);
    if (magnitude === 0) {return { dx: 0, dy: 0 };}
    const scale = magnitude * 0.4;
    return {
      dx: (rawDx / magnitude) * scale,
      dy: (rawDy / magnitude) * scale,
    };
  });
}

export function generateStaggerDelays(seed: string, count: number): number[] {
  const rand = new DeterministicVendor(seed + "__stagger");
  return Array.from({ length: count }, () => rand.next() * 150);
}
