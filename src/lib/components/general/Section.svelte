<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title?: string;
    subtitle?: string;
    children?: Snippet;
  }

  const { title, subtitle, children }: Props = $props();
</script>

<div class="section" id={title?.toLocaleLowerCase()}>
  {#if title}
    <h1>{title}</h1>
  {/if}
  {#if subtitle}
    <p class="subtitle">{subtitle}</p>
  {/if}
  {@render children?.()}
</div>

<style>
  .section {
    margin-top: 15rem;
    margin-bottom: 15rem;
  }

  .subtitle {
    font-weight: 400;
    font-size: 2.5rem;
    line-height: 1.3;
    margin-bottom: 2rem;
  }

  @media (max-width: 800px) {
    .section {
      margin-top: 10rem;
      margin-bottom: 10rem;
    }
  }
</style>
