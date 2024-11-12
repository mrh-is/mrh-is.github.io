<script lang="ts">
  import { onMount } from "svelte";
  import type { Rect } from "$lib/geometryHelpers";
  import { Range } from "$lib/mathHelpers";
  import { BlobWaggler } from "./BlobPathWaggle";
  import { fade } from "svelte/transition";

  interface Props {
    seed: string;
    size?: number;
  }

  let { seed, size = 600 }: Props = $props();

  let pathElement: SVGPathElement | undefined = $state();
  let waggler: BlobWaggler;

  const blobWidth = size / 2;
  const waggleSize = size * 0.03;

  onMount(() => {
    const margin = waggleSize + blobWidth / 2;
    const safeAreaRect: Rect = {
      x: new Range(margin, size - margin),
      y: new Range(margin, size - margin),
    };

    waggler = new BlobWaggler(safeAreaRect, waggleSize, seed, (svgPath) => {
      pathElement?.setAttribute("d", svgPath);
    });
    return () => waggler.stop();
  });
</script>

<svg
  style="width: {size}px; height: {size}px"
  transition:fade={{ duration: 200 }}
>
  <path bind:this={pathElement} style="stroke-width: {blobWidth}" />
</svg>

<style>
  path {
    fill: none;
    stroke: var(--color-light-blob, transparent);
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0.4;
  }

  @media (prefers-color-scheme: dark) {
    path {
      stroke: var(--color-dark-blob, transparent);
    }
  }
</style>
