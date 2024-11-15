<script lang="ts" module>
  export interface Props {
    randGen: () => number;
    top: number;
    left: number;
  }
</script>

<script lang="ts">
  import Blob from "./Blob.svelte";

  let { randGen, top, left }: Props = $props();

  const size = 600;
</script>

<div class="y" style:margin-top="{top}rem" style:height="{size}px">
  <div class="x" style:left="{left}%">
    <Blob {randGen} {size} />
  </div>
</div>

<style>
  .y {
    position: relative;
  }

  .x {
    position: absolute;
    transform: translate(-50%, 0);
  }
</style>
