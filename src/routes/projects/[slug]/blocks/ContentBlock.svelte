<script lang="ts">
  import Self from "./ContentBlock.svelte";
  import Section from "$lib/components/general/Section.svelte";
  import ImageCarousel from "./ImageCarousel.svelte";
  import SingleImage from "./SingleImage.svelte";
  import ListBlock from "./ListBlock.svelte";
  import TextBlock from "./TextBlock.svelte";
  import TitleBlock from "./TitleBlock.svelte";
  import type { ContentBlock } from "$lib/types/Project";

  interface Props {
    content: ContentBlock;
    /** True for the first content block on the page — its image is the LCP candidate */
    hero?: boolean;
  }

  const { content, hero = false }: Props = $props();
</script>

{#if content.kind === "text"}
  <TextBlock {...content} />
{:else if content.kind === "title"}
  <TitleBlock {...content} />
{:else if content.kind === "list"}
  <ListBlock {...content} />
{:else if content.kind === "carousel"}
  <ImageCarousel {...content} {hero} />
{:else if content.kind === "image"}
  <SingleImage {...content} {hero} />
{:else if content.kind === "subsection"}
  <Section>
    {#each content.content as subblock, index (index)}
      <Self content={subblock} hero={hero && index === 0} />
    {/each}
  </Section>
{:else}
  <!-- eslint-disable svelte/no-at-debug-tags -->
  {@debug content}
{/if}
