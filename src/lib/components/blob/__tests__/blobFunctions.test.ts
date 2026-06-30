import { describe, it, expect } from "vitest";
import {
  generateBlobConfigs,
  computeWagglePoint,
  computeBlobPath,
  computeDriftVectors,
  generateStaggerDelays,
} from "../blobFunctions";

describe("generateBlobConfigs", () => {
  it("returns 7 blob configs", () => {
    const configs = generateBlobConfigs("/", "#EAC9D9");
    expect(configs).toHaveLength(7);
  });

  it("each config has position in expected ranges", () => {
    const configs = generateBlobConfigs("/projects/test", "#EAC9D9");
    for (const config of configs) {
      expect(config.position.top).toBeGreaterThanOrEqual(2);
      expect(config.position.top).toBeLessThanOrEqual(12);
      expect(config.position.left).toBeGreaterThanOrEqual(10);
      expect(config.position.left).toBeLessThanOrEqual(90);
    }
  });

  it("each config stores the provided color", () => {
    const configs = generateBlobConfigs("/", "#684054");
    for (const config of configs) {
      expect(config.color).toBe("#684054");
    }
  });

  it("is deterministic — same seed produces same configs", () => {
    const a = generateBlobConfigs("/test", "#AAA");
    const b = generateBlobConfigs("/test", "#AAA");
    expect(a).toEqual(b);
  });

  it("different seeds produce different configs", () => {
    const a = generateBlobConfigs("/a", "#AAA");
    const b = generateBlobConfigs("/b", "#AAA");
    expect(a).not.toEqual(b);
  });

  it("each config has shapePoints and waggleOffsets", () => {
    const configs = generateBlobConfigs("/", "#AAA");
    for (const config of configs) {
      expect(config.shapePoints).toHaveProperty("start");
      expect(config.shapePoints).toHaveProperty("control");
      expect(config.shapePoints).toHaveProperty("end");
      expect(config.waggleOffsets).toHaveProperty("start");
      expect(config.waggleOffsets).toHaveProperty("control");
      expect(config.waggleOffsets).toHaveProperty("end");
    }
  });
});

describe("computeWagglePoint", () => {
  it("returns the base point when waggleSize is 0", () => {
    const point = { x: 100, y: 200 };
    const offset = { x: 0, y: 0 };
    const result = computeWagglePoint(point, offset, 1000, 0, 2500);
    expect(result).toEqual(point);
  });

  it("offsets the point by at most waggleSize in each axis", () => {
    const point = { x: 100, y: 200 };
    const offset = { x: 500, y: 700 };
    for (let t = 0; t < 5000; t += 100) {
      const result = computeWagglePoint(point, offset, t, 18, 2500);
      expect(Math.abs(result.x - point.x)).toBeLessThanOrEqual(18);
      expect(Math.abs(result.y - point.y)).toBeLessThanOrEqual(18);
    }
  });

  it("is deterministic for the same inputs", () => {
    const point = { x: 50, y: 75 };
    const offset = { x: 300, y: 400 };
    const a = computeWagglePoint(point, offset, 1234, 10, 2500);
    const b = computeWagglePoint(point, offset, 1234, 10, 2500);
    expect(a).toEqual(b);
  });
});

describe("computeBlobPath", () => {
  it("returns a non-empty SVG path string starting with M", () => {
    const configs = generateBlobConfigs("/test", "#AAA");
    const path = computeBlobPath(configs[0], 0, 18);
    expect(path.length).toBeGreaterThan(0);
    expect(path).toMatch(/^M/);
  });

  it("returns different paths at different times (when waggle > 0)", () => {
    const configs = generateBlobConfigs("/test", "#AAA");
    const pathA = computeBlobPath(configs[0], 0, 18);
    const pathB = computeBlobPath(configs[0], 1250, 18);
    expect(pathA).not.toBe(pathB);
  });
});

describe("computeDriftVectors", () => {
  it("returns one vector per blob", () => {
    const old = generateBlobConfigs("/a", "#AAA");
    const nw = generateBlobConfigs("/b", "#BBB");
    const vectors = computeDriftVectors(old, nw);
    expect(vectors).toHaveLength(7);
  });

  it("each vector has dx and dy", () => {
    const old = generateBlobConfigs("/a", "#AAA");
    const nw = generateBlobConfigs("/b", "#BBB");
    const vectors = computeDriftVectors(old, nw);
    for (const v of vectors) {
      expect(v).toHaveProperty("dx");
      expect(v).toHaveProperty("dy");
      expect(typeof v.dx).toBe("number");
      expect(typeof v.dy).toBe("number");
    }
  });

  it("vectors are zero when configs are the same", () => {
    const configs = generateBlobConfigs("/same", "#AAA");
    const vectors = computeDriftVectors(configs, configs);
    for (const v of vectors) {
      expect(v.dx).toBe(0);
      expect(v.dy).toBe(0);
    }
  });
});

describe("generateStaggerDelays", () => {
  it("returns count delays", () => {
    const delays = generateStaggerDelays("/test", 7);
    expect(delays).toHaveLength(7);
  });

  it("all delays are between 0 and 150", () => {
    const delays = generateStaggerDelays("/test", 7);
    for (const d of delays) {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(150);
    }
  });

  it("is deterministic", () => {
    const a = generateStaggerDelays("/test", 7);
    const b = generateStaggerDelays("/test", 7);
    expect(a).toEqual(b);
  });
});
