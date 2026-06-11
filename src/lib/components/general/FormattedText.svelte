<script lang="ts">
  import { parseInlineMarkdown } from "$lib/utils/markdown";

  interface Props {
    text: string;
  }

  const { text }: Props = $props();
  const segments = $derived(parseInlineMarkdown(text));
</script>

{#each segments as segment, index (index)}
  {#if typeof segment === "string"}
    {segment}
  {:else if segment.href.startsWith("/")}
    <a href={segment.href}>{segment.text}</a>
  {:else}
    <a href={segment.href} target="_blank" rel="noopener noreferrer"
      >{segment.text}</a
    >
  {/if}
{/each}
