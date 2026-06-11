<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title?: string;
    subtitle?: string;
    headingLevel?: 1 | 2;
    children?: Snippet;
  }

  const { title, subtitle, headingLevel = 2, children }: Props = $props();
</script>

<div class="section" id={title?.toLocaleLowerCase()}>
  {#if title}
    <svelte:element this={`h${headingLevel}`} class="section-title header-font">
      {title}
    </svelte:element>
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

  /* Section titles keep the page-title look at any heading level,
     and opt out of the global h2 underline animation. */
  .section-title {
    display: block;
    position: static;
    margin-top: 1rem;
    margin-bottom: 4rem;
    font-weight: bold;
    line-height: 1.1;
    font-size: 6rem;
    hyphens: none;
  }

  .section-title::after {
    content: none;
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

    .section-title {
      font-size: 4rem;
      hyphens: auto;
    }
  }
</style>
