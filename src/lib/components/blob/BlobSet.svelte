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

  const TRANSITION_DURATION = 2200;
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

  // svelte-ignore state_referenced_locally
  const initPhase = phase;
  // svelte-ignore state_referenced_locally
  const blobStyles = configs.map((_, index) => {
    const drift = driftVectors?.[index];
    const delay = staggerDelays?.[index] ?? 0;
    const duration = reducedMotion
      ? REDUCED_MOTION_DURATION
      : TRANSITION_DURATION;

    const parts: string[] = [
      `--blob-delay: ${delay}ms`,
      `--blob-duration: ${duration}ms`,
    ];

    if (drift) {
      if (initPhase === "exiting") {
        parts.push(`--blob-dx: ${drift.dx}%`);
        parts.push(`--blob-dy: ${drift.dy}rem`);
      } else {
        parts.push(`--blob-dx: ${-drift.dx}%`);
        parts.push(`--blob-dy: ${-drift.dy}rem`);
      }
    }

    return parts.join("; ");
  });
</script>

<div
  class="blob-set"
  style="--blob-light-color: {lightColor}; --blob-dark-color: {darkColor};"
>
  {#each configs as config, index (index)}
    <div
      class="blob-position"
      style:margin-top="{config.position.top}rem"
      style:height="600px"
    >
      <div
        class="blob-wrapper"
        class:entering={phase === "entering"}
        class:exiting={phase === "exiting"}
        style:left="{config.position.left}%"
        style={blobStyles[index]}
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
    opacity: 0.4;
    transform: translate(-50%, 0) scale(1);
    filter: blur(0px);
    transition:
      opacity var(--blob-duration, 800ms) cubic-bezier(0.22, 0.6, 0.1, 1)
        var(--blob-delay, 0ms),
      transform var(--blob-duration, 800ms) cubic-bezier(0.22, 0.6, 0.1, 1)
        var(--blob-delay, 0ms),
      filter var(--blob-duration, 800ms) cubic-bezier(0.22, 0.6, 0.1, 1)
        var(--blob-delay, 0ms);
    --blob-stroke-color: var(--blob-light-color);
  }

  .blob-wrapper.entering,
  .blob-wrapper.exiting {
    opacity: 0;
    transform: translate(calc(-50% + var(--blob-dx, 0%)), var(--blob-dy, 0rem))
      scale(0.92);
    filter: blur(4px);
  }

  @media (prefers-color-scheme: dark) {
    .blob-wrapper {
      --blob-stroke-color: var(--blob-dark-color);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .blob-wrapper.entering,
    .blob-wrapper.exiting {
      transform: translate(-50%, 0) scale(1);
      filter: blur(0px);
    }
  }
</style>
