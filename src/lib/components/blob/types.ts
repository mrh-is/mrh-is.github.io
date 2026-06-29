import type { BlobPath } from "./BlobPathGeometry";

export type BlobSetPhase = "entering" | "visible" | "exiting";

export interface BlobConfig {
  position: { top: number; left: number };
  shapePoints: BlobPath;
  waggleOffsets: BlobPath;
  color: string;
}

export interface BlobSetState {
  configs: BlobConfig[];
  seed: string;
  phase: BlobSetPhase;
  startTime: number;
  driftVectors?: { dx: number; dy: number }[];
  staggerDelays?: number[];
}
