<!-- src/lib/components/blob/BlobLayer.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { checkMediaQuery, KnownQueries } from "$lib/MediaQueryWatcher";
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

    if (transitionTimer) {clearTimeout(transitionTimer);}
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
    if (!isMounted || currentSeed === prevSeed) {return;}
    prevSeed = currentSeed;
    startTransition(currentSeed, lightBlobColor, sets);
  });

  onMount(() => {
    isMounted = true;
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
      if (transitionTimer) {clearTimeout(transitionTimer);}
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
