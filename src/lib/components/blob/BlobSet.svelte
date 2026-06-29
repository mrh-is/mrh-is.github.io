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

<div
  class="blob-set"
  style="--blob-light-color: {lightColor}; --blob-dark-color: {darkColor};"
>
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
