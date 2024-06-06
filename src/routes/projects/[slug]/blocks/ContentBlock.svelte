<script lang="ts">
  import Section from "$lib/components/Section.svelte";
  import ImageCarousel from "./ImageCarousel.svelte";
  import ListBlock from "./ListBlock.svelte";
  import TextBlock from "./TextBlock.svelte";
  import TitleBlock from "./TitleBlock.svelte";
  import type { ContentBlock } from "$lib/types/Project";

  export let content: ContentBlock;
</script>

{#if content.kind === "text"}
  <TextBlock {...content} />
{:else if content.kind === "title"}
  <TitleBlock {...content} />
{:else if content.kind === "list"}
  <ListBlock {...content} />
{:else if content.kind === "image"}
  <ImageCarousel {...content} />
{:else if content.kind === "subsection"}
  <Section>
    {#each content.content as subblock}
      <svelte:self content={subblock} />
    {/each}
  </Section>
{:else}
  {@debug content}
{/if}
