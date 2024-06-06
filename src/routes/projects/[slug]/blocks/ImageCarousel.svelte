<script lang="ts">
  import type { ImageCarouselSlide } from "$lib/types/Project";

  export let slides: ImageCarouselSlide[];
</script>

<ul>
{#each slides as slide}
  <li>{slide.src}</li>
{/each}
</ul>

<p class="instructions">Click the image above to embiggen & see notes.</p>

<style>
  .instructions {
    opacity: 60%;
    margin-top: 0.25rem;
    font-size: 1rem;
    font-style: italic;
    font-weight: 200;
    line-height: 150%;
  }
</style>