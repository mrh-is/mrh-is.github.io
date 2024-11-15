<script lang="ts">
  import { DeterministicVendor } from "$lib/DeterministicVendor";
  import BlobPositioner, {
    type Props as BlobPositionerProps,
  } from "./BlobPositioner.svelte";

  interface Props {
    seed: string;
  }

  let { seed }: Props = $props();

  const rand = $derived(new DeterministicVendor(seed));
  let blobData: BlobPositionerProps[] = $derived(generateBlobs(rand));

  function generateBlobs(rand: DeterministicVendor): BlobPositionerProps[] {
    return Array(7)
      .fill(null)
      .map(() => ({
        randGen: () => rand.next(),
        top: rand.nextBetween(2, 12),
        left: rand.nextBetween(10, 90),
      }));
  }
</script>

<div>
  {#each blobData as blob}
    <BlobPositioner {...blob} />
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
