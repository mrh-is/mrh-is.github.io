<script lang="ts">
  import { onDestroy } from "svelte";
  import type { Rect } from "$lib/geometryHelpers";
  import { Range } from "$lib/mathHelpers";
  import { BlobWaggler } from "./BlobPathWaggle";

  interface Props {
    randGen: () => number;
    size?: number;
  }

  const { randGen, size = 600 }: Props = $props();

  let pathElement: SVGPathElement | undefined = $state();
  let waggler: BlobWaggler;

  const blobWidth = size / 2;
  const waggleSize = size * 0.03;

  const margin = waggleSize + blobWidth / 2;
  const safeAreaRect: Rect = {
    x: new Range(margin, size - margin),
    y: new Range(margin, size - margin),
  };

  let path = $state("");

  waggler = new BlobWaggler(safeAreaRect, waggleSize, randGen, (svgPath) => {
    path = svgPath;
  });

  onDestroy(() => waggler.stop());
</script>

<svg style="width: {size}px; height: {size}px">
  <path bind:this={pathElement} style="stroke-width: {blobWidth}" d={path} />
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
