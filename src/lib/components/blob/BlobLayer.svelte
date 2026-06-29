<!-- src/lib/components/blob/BlobLayer.svelte -->
<script lang="ts">
  import { onMount, untrack } from "svelte";
  import type { ColorScheme } from "$lib/types/Colors";
  import BlobSet from "./BlobSet.svelte";
  import type { BlobSetState } from "./types";
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
  let oneshotRaf: number | undefined;
  let transitionTimer: ReturnType<typeof setTimeout> | undefined;

  let reducedMotion = $state(false);

  const reducedMotionQuery =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

  function computeAllPaths(time: number): string[][] {
    return sets.map((set) =>
      set.configs.map((config) => computeBlobPath(config, time, WAGGLE_SIZE)),
    );
  }

  function rafLoop() {
    pathsBySet = computeAllPaths(Date.now());
    rafHandle = requestAnimationFrame(rafLoop);
  }

  function startRaf() {
    if (rafHandle) {
      return;
    }
    rafLoop();
  }

  function stopRaf() {
    if (rafHandle) {
      cancelAnimationFrame(rafHandle);
      rafHandle = 0;
    }
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

    // Double-rAF: first frame paints "entering" styles, second frame flips
    // to "visible" so the browser transitions from the painted initial state
    oneshotRaf = requestAnimationFrame(() => {
      oneshotRaf = requestAnimationFrame(() => {
        sets = sets.map((s) =>
          s.phase === "entering" ? { ...s, phase: "visible" } : s,
        );
      });
    });

    if (transitionTimer) {
      clearTimeout(transitionTimer);
    }
    transitionTimer = setTimeout(() => {
      sets = sets.filter((s) => s.phase !== "exiting");
    }, TRANSITION_DURATION);
  }

  // Track the current light blob color from colorScheme
  const lightBlobColor = $derived(colorScheme.light.blob);

  // Watch seed changes — initialize to "" so $state() doesn't capture a reactive prop value.
  // onMount sets prevSeed = seed before effects can trigger a false transition.
  let prevSeed = $state("");
  let isMounted = false;
  $effect(() => {
    const currentSeed = seed; // track reactive dependency
    if (!isMounted || currentSeed === prevSeed) {
      return;
    }
    prevSeed = currentSeed;
    startTransition(
      currentSeed,
      untrack(() => lightBlobColor),
      untrack(() => sets),
    );
  });

  onMount(() => {
    isMounted = true;
    reducedMotion = reducedMotionQuery?.matches ?? false;

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

    if (!reducedMotion) {
      startRaf();
    }

    const motionHandler = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      if (e.matches) {
        stopRaf();
      } else {
        startRaf();
      }
    };
    reducedMotionQuery?.addEventListener("change", motionHandler);

    return () => {
      stopRaf();
      if (oneshotRaf !== undefined) {
        cancelAnimationFrame(oneshotRaf);
      }
      if (transitionTimer) {
        clearTimeout(transitionTimer);
      }
      reducedMotionQuery?.removeEventListener("change", motionHandler);
    };
  });
</script>

<div class="blob-layer">
  {#each sets as set, setIndex (set.seed)}
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
    bottom: 0;
    z-index: -1;
    overflow: clip;
    pointer-events: none;
  }
</style>
