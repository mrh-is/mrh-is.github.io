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
    generateRandomDrift,
    generateStaggerDelays,
  } from "./blobFunctions";

  interface Props {
    seed: string;
    colorScheme: ColorScheme;
  }

  const { seed, colorScheme }: Props = $props();

  const WAGGLE_SIZE = 600 * 0.03;
  const PHASE_DURATION = 2200;
  let enterDelayTimer: ReturnType<typeof setTimeout> | undefined;

  let sets = $state<BlobSetState[]>([]);
  let pathsBySeed = $state<Record<string, string[]>>({});
  let rafHandle = 0;
  let oneshotRaf: number | undefined;
  let transitionTimer: ReturnType<typeof setTimeout> | undefined;
  let rafPauseOffset = 0;
  let rafPausedAt = 0;

  let reducedMotion = $state(false);

  const reducedMotionQuery =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

  function waggleTime(): number {
    return Date.now() - rafPauseOffset;
  }

  function computeAllPaths(time: number): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    for (const set of sets) {
      result[set.seed] = set.configs.map((config) =>
        computeBlobPath(config, time, WAGGLE_SIZE),
      );
    }
    return result;
  }

  function rafLoop() {
    pathsBySeed = computeAllPaths(waggleTime());
    rafHandle = requestAnimationFrame(rafLoop);
  }

  function startRaf() {
    if (rafHandle) {
      return;
    }
    if (rafPausedAt) {
      rafPauseOffset += Date.now() - rafPausedAt;
      rafPausedAt = 0;
    }
    rafLoop();
  }

  function stopRaf() {
    if (rafHandle) {
      cancelAnimationFrame(rafHandle);
      rafHandle = 0;
      rafPausedAt = Date.now();
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

    pathsBySeed = computeAllPaths(waggleTime());

    if (enterDelayTimer) {
      clearTimeout(enterDelayTimer);
    }
    if (transitionTimer) {
      clearTimeout(transitionTimer);
    }

    if (currentSet) {
      const enterDelay = PHASE_DURATION * 0.3;

      enterDelayTimer = setTimeout(() => {
        oneshotRaf = requestAnimationFrame(() => {
          oneshotRaf = requestAnimationFrame(() => {
            sets = sets.map((s) =>
              s.phase === "entering" ? { ...s, phase: "visible" } : s,
            );
          });
        });
      }, enterDelay);

      transitionTimer = setTimeout(
        () => {
          sets = sets.filter(
            (s) => s.phase !== "exiting" && s.phase !== "entering",
          );
        },
        enterDelay + PHASE_DURATION + 200,
      );
    } else {
      oneshotRaf = requestAnimationFrame(() => {
        oneshotRaf = requestAnimationFrame(() => {
          sets = sets.map((s) =>
            s.phase === "entering" ? { ...s, phase: "visible" } : s,
          );
        });
      });

      transitionTimer = setTimeout(() => {
        sets = sets.filter((s) => s.phase !== "entering");
      }, PHASE_DURATION + 200);
    }
  }

  const lightBlobColor = $derived(colorScheme.light.blob);

  let prevSeed = $state("");
  let isMounted = false;
  $effect(() => {
    const currentSeed = seed;
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

    const initialConfigs = generateBlobConfigs(seed, lightBlobColor);
    sets = [
      {
        configs: initialConfigs,
        seed,
        phase: "entering",
        startTime: Date.now(),
        driftVectors: generateRandomDrift(seed, 7),
        staggerDelays: generateStaggerDelays(seed, 7),
      },
    ];
    pathsBySeed = computeAllPaths(Date.now());
    prevSeed = seed;

    oneshotRaf = requestAnimationFrame(() => {
      oneshotRaf = requestAnimationFrame(() => {
        sets = sets.map((s) =>
          s.phase === "entering" ? { ...s, phase: "visible" } : s,
        );
      });
    });

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
      if (enterDelayTimer) {
        clearTimeout(enterDelayTimer);
      }
      reducedMotionQuery?.removeEventListener("change", motionHandler);
    };
  });
</script>

<div class="blob-layer">
  {#each sets as set (set.seed)}
    <BlobSet
      configs={set.configs}
      phase={set.phase}
      paths={pathsBySeed[set.seed] ?? []}
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
