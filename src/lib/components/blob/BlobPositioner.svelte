<script lang="ts">
  import Blob from "./Blob.svelte";

  interface Props {
    seed: string;
    top: number;
    left: number;
  }

  let { seed, top, left }: Props = $props();

  const size = 600;
</script>

<div class="y" style:margin-top="{top}rem" style:height="{size}px">
  <div class="x" style:left="{left}%">
    <Blob {seed} {size} />
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
