<script lang="ts">
  import { DeterministicVendor } from "$lib/DeterministicVendor";
  import BlobPositioner, {
    type BlobPositionParams,
  } from "./BlobPositioner.svelte";

  interface Props {
    seed: string;
  }

  let { seed }: Props = $props();

  let blobData: BlobPositionParams[] = $derived(generateBlobs(seed));

  const rand = new DeterministicVendor(seed);

  function generateBlobs(seed: string): BlobPositionParams[] {
    let data: BlobPositionParams[] = [];
    const blobCount = 7;
    for (let i = 1; i <= blobCount; i++) {
      data.push({
        seed: seed.repeat(i),
        top: rand.nextBetween(2, 12),
        left: rand.nextBetween(10, 90),
      });
    }
    return data;
  }
</script>

<div>
  {#each blobData as blob}
    <BlobPositioner params={blob} />
  {/each}
</div>

<style>
  div {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    z-index: -1;
    overflow-y: hidden;
  }
</style>
