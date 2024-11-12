<script lang="ts">
  import Self from "./ContentBlock.svelte";
  import Section from "$lib/components/general/Section.svelte";
  import ImageCarousel from "./ImageCarousel.svelte";
  import ListBlock from "./ListBlock.svelte";
  import TextBlock from "./TextBlock.svelte";
  import TitleBlock from "./TitleBlock.svelte";
  import type { ContentBlock } from "$lib/types/Project";

  interface Props {
    content: ContentBlock;
  }

  let { content }: Props = $props();
</script>

{#if content.kind === "text"}
  <TextBlock {...content} />
{:else if content.kind === "title"}
  <TitleBlock {...content} />
{:else if content.kind === "list"}
  <ListBlock {...content} />
{:else if content.kind === "carousel"}
  <ImageCarousel {...content} />
{:else if content.kind === "subsection"}
  <Section>
    {#each content.content as subblock}
      <Self content={subblock} />
    {/each}
  </Section>
{:else}
  <!-- eslint-disable svelte/no-at-debug-tags -->
  {@debug content}
{/if}
