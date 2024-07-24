<script lang="ts" context="module">
  export interface BlobPositionParams {
    seed: string;
    top: number;
    left: number;
  }
</script>

<script lang="ts">
  import Blob from "./Blob.svelte";

  export let params: BlobPositionParams;

  const size = 600;
</script>

<div class="y" style:margin-top="{params.top}rem" style:height="{size}px">
  <div class="x" style:left="{params.left}%">
    <Blob seed={params.seed} {size} />
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
