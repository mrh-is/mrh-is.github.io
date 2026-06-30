# Blob System v2: Transitions & Architecture — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the blob background to smoothly transition between pages with drift/fade/blur/scale effects, fix bottom-of-page clipping, and consolidate animation into a single RAF loop with pure functions and flat data.

**Architecture:** Replace the class-based `BlobWaggler` and per-blob RAF loops with pure functions (`generateBlobConfigs`, `computeWagglePoint`, `computeBlobPath`, `computeDriftVectors`) and a three-tier component stack (`BlobLayer` → `BlobSet` → `BlobRenderer`). `BlobLayer` lives permanently in the layout, watches `$page.url.pathname` for seed changes, and orchestrates transitions by maintaining up to two `BlobSetState` objects simultaneously. CSS transitions handle drift/fade/blur/scale; the single RAF loop handles waggle only.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, TypeScript, Playwright (e2e)

## Global Constraints

- Svelte 5 runes mode (`$props()`, `$derived()`, `$state()`, `$effect()`) — no legacy syntax
- All pure functions must be unit-testable without DOM/browser APIs
- `BlobPathGeometry.ts` and `SVGPath.ts` are unchanged — import from them, don't modify
- `DeterministicVendor` is unchanged — import from `$lib/DeterministicVendor`
- 7 blobs per set, SVG size 600px, positions top 2–12rem / left 10–90%
- `prefers-reduced-motion: reduce` → no waggle, no drift/blur/scale, opacity-only 200ms transition
- Existing Playwright e2e tests must continue to pass

---

### Task 1: Types — `src/lib/components/blob/types.ts`

**Files:**

- Create: `src/lib/components/blob/types.ts`
- Test: `src/lib/components/blob/__tests__/types.test.ts`

**Interfaces:**

- Consumes: `BlobPath` from `./BlobPathGeometry`, `Point` from `$lib/geometryHelpers`
- Produces: `BlobConfig`, `BlobSetState`, `BlobSetPhase` — used by every subsequent task

- [ ] **Step 1: Write the type file**

```ts
// src/lib/components/blob/types.ts
import type { BlobPath } from "./BlobPathGeometry";

export type BlobSetPhase = "entering" | "visible" | "exiting" | "gone";

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
```

- [ ] **Step 2: Write a type-checking test**

Create `src/lib/components/blob/__tests__/types.test.ts`:

```ts
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
      "entering" | "visible" | "exiting" | "gone"
    >();
  });
});
```

- [ ] **Step 3: Set up Vitest (if not already configured)**

Check if Vitest is installed. If not:

```bash
npm install -D vitest
```

Add to `package.json` scripts (if not present):

```json
"test:unit": "vitest run"
```

Add `vitest.config.ts` at project root (if not present):

```ts
import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ["src/**/__tests__/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Run the type test**

```bash
npx vitest run src/lib/components/blob/__tests__/types.test.ts
```

Expected: PASS — all type assertions hold.

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/blob/types.ts src/lib/components/blob/__tests__/types.test.ts vitest.config.ts
git commit -m "feat(blob): add BlobConfig and BlobSetState types"
```

---

### Task 2: Pure functions — `src/lib/components/blob/blobFunctions.ts`

**Files:**

- Create: `src/lib/components/blob/blobFunctions.ts`
- Test: `src/lib/components/blob/__tests__/blobFunctions.test.ts`

**Interfaces:**

- Consumes: `BlobConfig` from `./types`, `DeterministicVendor` from `$lib/DeterministicVendor`, `blobPath` from `./BlobPathGeometry`, `svgCurvePath` from `./SVGPath`, `Range` from `$lib/mathHelpers`, `Point`/`Rect` from `$lib/geometryHelpers`
- Produces:
  - `generateBlobConfigs(seed: string, color: string): BlobConfig[]`
  - `computeWagglePoint(point: Point, offset: Point, time: number, waggleSize: number, wagglePeriod: number): Point`
  - `computeBlobPath(config: BlobConfig, time: number, waggleSize: number): string`
  - `computeDriftVectors(oldConfigs: BlobConfig[], newConfigs: BlobConfig[]): { dx: number; dy: number }[]`
  - `generateStaggerDelays(seed: string, count: number): number[]`

- [ ] **Step 1: Write failing tests for `generateBlobConfigs`**

Create `src/lib/components/blob/__tests__/blobFunctions.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/lib/components/blob/__tests__/blobFunctions.test.ts
```

Expected: FAIL — module `../blobFunctions` not found.

- [ ] **Step 3: Implement `blobFunctions.ts`**

```ts
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
    if (magnitude === 0) return { dx: 0, dy: 0 };
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/lib/components/blob/__tests__/blobFunctions.test.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/blob/blobFunctions.ts src/lib/components/blob/__tests__/blobFunctions.test.ts
git commit -m "feat(blob): add pure functions for blob generation, waggle, drift, and stagger"
```

---

### Task 3: `BlobRenderer.svelte` — minimal SVG renderer

**Files:**

- Create: `src/lib/components/blob/BlobRenderer.svelte`

**Interfaces:**

- Consumes: `path: string` (SVG path data), `strokeWidth: number`, `size: number`
- Produces: Renders a single `<svg>` with a `<path>`. No animation logic.

- [ ] **Step 1: Create `BlobRenderer.svelte`**

```svelte
<!-- src/lib/components/blob/BlobRenderer.svelte -->
<script lang="ts">
  interface Props {
    path: string;
    strokeWidth?: number;
    size?: number;
  }

  const { path, strokeWidth = 300, size = 600 }: Props = $props();
</script>

<svg style="width: {size}px; height: {size}px">
  <path style="stroke-width: {strokeWidth}" d={path} />
</svg>

<style>
  path {
    fill: none;
    stroke: inherit;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
```

Note: `stroke: inherit` — the parent `BlobSet` will set the stroke color.

- [ ] **Step 2: Verify with `svelte-check`**

```bash
npx svelte-check --threshold error
```

Expected: no errors mentioning BlobRenderer.

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/blob/BlobRenderer.svelte
git commit -m "feat(blob): add BlobRenderer presentational component"
```

---

### Task 4: `BlobSet.svelte` — transition CSS + blob group

**Files:**

- Create: `src/lib/components/blob/BlobSet.svelte`

**Interfaces:**

- Consumes: `BlobConfig[]`, `BlobSetPhase`, `driftVectors`, `staggerDelays`, `paths: string[]` (pre-computed by BlobLayer's RAF loop), `lightColor: string`, `darkColor: string`
- Produces: Renders 7 positioned `BlobRenderer` components. Fires `onexit` callback when exit transition completes. Applies CSS transitions for entering/exiting phases.

- [ ] **Step 1: Create `BlobSet.svelte`**

```svelte
<!-- src/lib/components/blob/BlobSet.svelte -->
<script lang="ts">
  import BlobRenderer from "./BlobRenderer.svelte";
  import type { BlobConfig, BlobSetPhase } from "./types";

  interface Props {
    configs: BlobConfig[];
    phase: BlobSetPhase;
    paths: string[];
    driftVectors?: { dx: number; dy: number }[];
    staggerDelays?: number[];
    lightColor: string;
    darkColor: string;
    reducedMotion: boolean;
    onexit?: () => void;
  }

  const {
    configs,
    phase,
    paths,
    driftVectors,
    staggerDelays,
    lightColor,
    darkColor,
    reducedMotion,
    onexit,
  }: Props = $props();

  const BLOB_SIZE = 600;
  const TRANSITION_DURATION = 800;
  const REDUCED_MOTION_DURATION = 200;

  function transitionEndHandler(event: TransitionEvent, index: number) {
    if (
      event.propertyName === "opacity" &&
      phase === "exiting" &&
      index === 0
    ) {
      onexit?.();
    }
  }

  function blobStyle(index: number): string {
    const config = configs[index];
    const drift = driftVectors?.[index];
    const delay = staggerDelays?.[index] ?? 0;
    const duration = reducedMotion
      ? REDUCED_MOTION_DURATION
      : TRANSITION_DURATION;

    let transform = "translate(-50%, 0)";
    let opacity = "0.4";
    let filter = "blur(0px)";
    let scale = "1";

    if (phase === "entering") {
      if (reducedMotion) {
        opacity = "0";
      } else {
        opacity = "0";
        scale = "0.92";
        filter = "blur(4px)";
        if (drift) {
          transform = `translate(calc(-50% + ${-drift.dx}%), ${-drift.dy}rem)`;
        }
      }
    } else if (phase === "exiting") {
      if (reducedMotion) {
        opacity = "0";
      } else {
        opacity = "0";
        scale = "0.92";
        filter = "blur(4px)";
        if (drift) {
          transform = `translate(calc(-50% + ${drift.dx}%), ${drift.dy}rem)`;
        }
      }
    }

    const transitionProps = reducedMotion
      ? "opacity"
      : "opacity, transform, filter";

    return [
      `--blob-opacity: ${opacity}`,
      `--blob-transform: ${transform} scale(${scale})`,
      `--blob-filter: ${filter}`,
      `transition: ${transitionProps} ${duration}ms ease-out`,
      `transition-delay: ${delay}ms`,
    ].join("; ");
  }
</script>

<div class="blob-set">
  {#each configs as config, index (index)}
    <div
      class="blob-position"
      style:margin-top="{config.position.top}rem"
      style:height="{BLOB_SIZE}px"
    >
      <div
        class="blob-wrapper"
        style:left="{config.position.left}%"
        style={blobStyle(index)}
        ontransitionend={(e) => transitionEndHandler(e, index)}
      >
        <BlobRenderer path={paths[index] ?? ""} />
      </div>
    </div>
  {/each}
</div>

<style>
  .blob-set {
    position: absolute;
    width: 100%;
    top: 0;
    pointer-events: none;
  }

  .blob-position {
    position: relative;
  }

  .blob-wrapper {
    position: absolute;
    transform: var(--blob-transform, translate(-50%, 0));
    opacity: var(--blob-opacity, 0.4);
    filter: var(--blob-filter, none);
    color: var(--blob-light-color);
  }

  @media (prefers-color-scheme: dark) {
    .blob-wrapper {
      color: var(--blob-dark-color);
    }
  }
</style>
```

Wait — the `stroke: inherit` on BlobRenderer needs to match. Let's use a CSS custom property set on the blob-set container instead. Update the `.blob-wrapper` approach: set `color` as a CSS property, and use `stroke: currentColor` in BlobRenderer.

- [ ] **Step 2: Update `BlobRenderer.svelte` to use `currentColor`**

Change in `BlobRenderer.svelte`:

```svelte
<style>
  path {
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
```

- [ ] **Step 3: Set the color CSS custom properties on the blob-set**

Update the `<div class="blob-set">` in `BlobSet.svelte` to set colors:

```svelte
<div
  class="blob-set"
  style="--blob-light-color: {lightColor}; --blob-dark-color: {darkColor};"
>
```

And update `.blob-wrapper`:

```css
.blob-wrapper {
  position: absolute;
  transform: var(--blob-transform, translate(-50%, 0));
  opacity: var(--blob-opacity, 0.4);
  filter: var(--blob-filter, none);
  color: var(--blob-light-color);
}

@media (prefers-color-scheme: dark) {
  .blob-wrapper {
    color: var(--blob-dark-color);
  }
}
```

- [ ] **Step 4: Verify with `svelte-check`**

```bash
npx svelte-check --threshold error
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/blob/BlobSet.svelte src/lib/components/blob/BlobRenderer.svelte
git commit -m "feat(blob): add BlobSet with transition CSS and BlobRenderer color wiring"
```

---

### Task 5: `BlobLayer.svelte` — orchestration rewrite

**Files:**

- Rewrite: `src/lib/components/blob/BlobLayer.svelte`
- Modify: `src/routes/+layout.svelte` (pass `colorScheme` prop)

**Interfaces:**

- Consumes: `seed: string`, `colorScheme: ColorScheme` (from `$lib/types/Colors`), `generateBlobConfigs`/`computeBlobPath`/`computeDriftVectors`/`generateStaggerDelays` from `./blobFunctions`, `checkMediaQuery`/`KnownQueries` from `$lib/MediaQueryWatcher`
- Produces: Renders 1–2 `BlobSet` components, runs single RAF loop, handles transitions on seed change

- [ ] **Step 1: Rewrite `BlobLayer.svelte`**

```svelte
<!-- src/lib/components/blob/BlobLayer.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { checkMediaQuery, KnownQueries } from "$lib/MediaQueryWatcher";
  import type { ColorScheme } from "$lib/types/Colors";
  import BlobSet from "./BlobSet.svelte";
  import type { BlobConfig, BlobSetState } from "./types";
  import {
    generateBlobConfigs,
    computeBlobPath,
    computeDriftVectors,
    generateStaggerDelays,
  } from "./blobFunctions";

  interface Props {
    seed: string;
    colorScheme: ColorScheme;
  }

  const { seed, colorScheme }: Props = $props();

  const WAGGLE_SIZE = 600 * 0.03;
  const TRANSITION_DURATION = 950; // slightly longer than CSS 800ms + max stagger 150ms

  let sets = $state<BlobSetState[]>([]);
  let pathsBySet = $state<string[][]>([]);
  let rafHandle = 0;
  let transitionTimer: ReturnType<typeof setTimeout> | undefined;

  function computeAllPaths(time: number): string[][] {
    return sets.map((set) =>
      set.configs.map((config) => computeBlobPath(config, time, WAGGLE_SIZE)),
    );
  }

  function rafLoop() {
    const reducedMotion = checkMediaQuery(KnownQueries.ReducedMotion);
    if (!reducedMotion) {
      pathsBySet = computeAllPaths(Date.now());
    }
    rafHandle = requestAnimationFrame(rafLoop);
  }

  function startTransition(
    newSeed: string,
    newColor: string,
    oldSets: BlobSetState[],
  ) {
    const currentSet = oldSets.find(
      (s) => s.phase === "visible" || s.phase === "entering",
    );

    const newConfigs = generateBlobConfigs(newSeed, newColor);
    const now = Date.now();

    if (currentSet) {
      const driftVectors = computeDriftVectors(currentSet.configs, newConfigs);
      const reverseDrift = driftVectors.map((v) => ({
        dx: -v.dx,
        dy: -v.dy,
      }));

      currentSet.phase = "exiting";
      currentSet.startTime = now;
      currentSet.driftVectors = driftVectors;
      currentSet.staggerDelays = generateStaggerDelays(currentSet.seed, 7);

      sets = [
        currentSet,
        {
          configs: newConfigs,
          seed: newSeed,
          phase: "entering",
          startTime: now,
          driftVectors: reverseDrift,
          staggerDelays: generateStaggerDelays(newSeed, 7),
        },
      ];
    } else {
      sets = [
        {
          configs: newConfigs,
          seed: newSeed,
          phase: "entering",
          startTime: now,
          staggerDelays: generateStaggerDelays(newSeed, 7),
        },
      ];
    }

    pathsBySet = computeAllPaths(Date.now());

    // Use requestAnimationFrame to let the entering styles render before
    // flipping to visible (triggers the CSS transition)
    requestAnimationFrame(() => {
      sets = sets.map((s) =>
        s.phase === "entering" ? { ...s, phase: "visible" } : s,
      );
    });

    if (transitionTimer) clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => {
      sets = sets.filter((s) => s.phase !== "exiting");
    }, TRANSITION_DURATION);
  }

  // Track the current light blob color from colorScheme
  const lightBlobColor = $derived(colorScheme.light.blob);

  // Watch seed changes
  let prevSeed = $state(seed);
  $effect(() => {
    if (seed !== prevSeed) {
      prevSeed = seed;
      startTransition(seed, lightBlobColor, sets);
    }
  });

  onMount(() => {
    // Initial set — skip transition, go straight to visible
    const initialConfigs = generateBlobConfigs(seed, lightBlobColor);
    sets = [
      {
        configs: initialConfigs,
        seed,
        phase: "visible",
        startTime: Date.now(),
      },
    ];
    pathsBySet = computeAllPaths(Date.now());
    prevSeed = seed;

    rafLoop();
    return () => {
      cancelAnimationFrame(rafHandle);
      if (transitionTimer) clearTimeout(transitionTimer);
    };
  });

  const reducedMotion = $derived(
    typeof window !== "undefined"
      ? checkMediaQuery(KnownQueries.ReducedMotion)
      : false,
  );
</script>

<div class="blob-layer">
  {#each sets as set, setIndex (set.seed + set.phase)}
    <BlobSet
      configs={set.configs}
      phase={set.phase}
      paths={pathsBySet[setIndex] ?? []}
      driftVectors={set.driftVectors}
      staggerDelays={set.staggerDelays}
      lightColor={set.configs[0]?.color ?? "transparent"}
      darkColor={colorScheme.dark.blob}
      {reducedMotion}
      onexit={() => {
        sets = sets.filter((s) => s !== set);
      }}
    />
  {/each}
</div>

<style>
  .blob-layer {
    position: absolute;
    width: 100%;
    top: 0;
    z-index: -1;
    overflow-x: clip;
    pointer-events: none;
  }
</style>
```

- [ ] **Step 2: Update `+layout.svelte` to pass `colorScheme`**

In `src/routes/+layout.svelte`, change:

```svelte
<BlobLayer seed={$page.url.pathname} />
```

to:

```svelte
<BlobLayer seed={$page.url.pathname} colorScheme={$page.data.colorScheme} />
```

Also add the import if not already present:

```ts
import type { ColorScheme } from "$lib/types/Colors";
```

(This import is not strictly required since SvelteKit infers the type from the prop, but ensures clarity.)

- [ ] **Step 3: Verify with `svelte-check`**

```bash
npx svelte-check --threshold error
```

Expected: no errors.

- [ ] **Step 4: Run existing e2e tests to check nothing broke**

```bash
npm run test
```

Expected: all existing Playwright tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/components/blob/BlobLayer.svelte src/routes/+layout.svelte
git commit -m "feat(blob): rewrite BlobLayer with transition orchestration and single RAF loop"
```

---

### Task 6: Delete old files and clean up

**Files:**

- Delete: `src/lib/components/blob/Blob.svelte`
- Delete: `src/lib/components/blob/BlobPositioner.svelte`
- Rewrite: `src/lib/components/blob/BlobPathWaggle.ts` → delete (logic moved to `blobFunctions.ts`)

**Interfaces:**

- Consumes: nothing — cleanup only
- Produces: nothing — removes dead code

- [ ] **Step 1: Verify no imports of old files remain**

```bash
grep -rn "BlobPositioner\|from.*Blob.svelte\|from.*BlobPathWaggle" src/ --include="*.ts" --include="*.svelte" | grep -v node_modules | grep -v __tests__
```

Expected: no results (BlobLayer no longer imports these).

- [ ] **Step 2: Delete the old files**

```bash
git rm src/lib/components/blob/Blob.svelte
git rm src/lib/components/blob/BlobPositioner.svelte
git rm src/lib/components/blob/BlobPathWaggle.ts
```

- [ ] **Step 3: Run `svelte-check` and tests**

```bash
npx svelte-check --threshold error && npm run test
```

Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git commit -m "refactor(blob): remove Blob, BlobPositioner, and BlobPathWaggle (replaced by v2 architecture)"
```

---

### Task 7: Visual QA and transition tuning

**Files:**

- Possibly modify: `src/lib/components/blob/BlobSet.svelte` (timing values)
- Possibly modify: `src/lib/components/blob/BlobLayer.svelte` (transition duration)

**Interfaces:**

- Consumes: the full blob system from Tasks 1–6
- Produces: tuned transition that looks and feels right

This task is manual — it requires running the dev server and navigating between pages to assess the transition quality.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Open the site and navigate between pages**

Navigate between `/`, `/timeline`, and several `/projects/[slug]` pages. Watch for:

1. **Transition fires:** Do old blobs fade/drift out and new blobs fade/drift in?
2. **Color correctness:** Does each set keep its own page color during the transition?
3. **No clipping:** Do blobs near the bottom of the page extend past the footer area?
4. **Waggle works:** Do blobs gently oscillate in steady state?
5. **Reduced motion:** Enable `prefers-reduced-motion: reduce` in browser devtools. Transitions should be opacity-only, 200ms, no waggle.
6. **No horizontal scrollbar:** Blobs near edges should not cause horizontal overflow.

- [ ] **Step 3: Tune timing values if needed**

Adjust in `BlobSet.svelte`:

- `TRANSITION_DURATION` (CSS, currently 800ms)
- Scale range (currently 0.92)
- Blur range (currently 4px)
- Stagger max (currently 150ms in `generateStaggerDelays`)

Adjust in `BlobLayer.svelte`:

- `TRANSITION_DURATION` (cleanup timeout, currently 950ms — should be CSS duration + max stagger)

- [ ] **Step 4: Run full test suite**

```bash
npm run check && npm run lint && npm run test
```

Expected: all pass.

- [ ] **Step 5: Commit any tuning changes**

```bash
git add -A src/lib/components/blob/
git commit -m "fix(blob): tune transition timing and visual parameters"
```

---

### Task 8: Playwright test for blob transitions

**Files:**

- Create: `tests/blob-transitions.spec.ts`

**Interfaces:**

- Consumes: the full running site
- Produces: e2e test confirming blobs render and transition on navigation

- [ ] **Step 1: Write the test**

```ts
// tests/blob-transitions.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Blob transitions", () => {
  test("blobs render on the home page", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const blobs = page.locator(".blob-layer svg");
    await expect(blobs).toHaveCount(7);
  });

  test("blobs transition when navigating to a project", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const initialBlobCount = await page.locator(".blob-layer svg").count();
    expect(initialBlobCount).toBe(7);

    // Navigate to a project page
    await page.locator("nav a").first().click();
    await page.waitForURL(/\/projects\//);

    // During transition, there may be up to 14 blobs (two sets)
    // After transition completes, should be back to 7
    await page.waitForTimeout(1200);
    const finalBlobCount = await page.locator(".blob-layer svg").count();
    expect(finalBlobCount).toBe(7);
  });

  test("blob layer does not cause horizontal scrollbar", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const hasHorizontalScroll = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test("blobs extend past page content (no bottom clipping)", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const blobLayerHasNoBottom = await page.evaluate(() => {
      const layer = document.querySelector(".blob-layer") as HTMLElement;
      if (!layer) return false;
      const style = getComputedStyle(layer);
      return style.bottom === "auto" || style.bottom === "";
    });
    expect(blobLayerHasNoBottom).toBe(true);
  });
});
```

- [ ] **Step 2: Run the blob transition tests**

```bash
npx playwright test tests/blob-transitions.spec.ts
```

Expected: all pass.

- [ ] **Step 3: Run the full test suite to confirm no regressions**

```bash
npm run test
```

Expected: all pass (including existing tests).

- [ ] **Step 4: Commit**

```bash
git add tests/blob-transitions.spec.ts
git commit -m "test(blob): add Playwright tests for blob transitions and overflow fix"
```
