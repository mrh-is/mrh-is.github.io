import { describe, it, expectTypeOf } from "vitest";
import type { BlobConfig, BlobSetState, BlobSetPhase } from "../types";

describe("blob types", () => {
  it("BlobConfig has required fields", () => {
    expectTypeOf<BlobConfig>().toHaveProperty("position");
    expectTypeOf<BlobConfig>().toHaveProperty("shapePoints");
    expectTypeOf<BlobConfig>().toHaveProperty("waggleOffsets");
    expectTypeOf<BlobConfig>().toHaveProperty("color");
  });

  it("BlobSetState has required fields", () => {
    expectTypeOf<BlobSetState>().toHaveProperty("configs");
    expectTypeOf<BlobSetState>().toHaveProperty("seed");
    expectTypeOf<BlobSetState>().toHaveProperty("phase");
    expectTypeOf<BlobSetState>().toHaveProperty("startTime");
  });

  it("BlobSetPhase is a string union", () => {
    expectTypeOf<BlobSetPhase>().toEqualTypeOf<
      "entering" | "visible" | "exiting"
    >();
  });
});
