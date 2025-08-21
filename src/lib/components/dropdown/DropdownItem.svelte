<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<li>
  {@render children()}
</li>

<style>
  li {
    margin: 1rem 1.5rem;
  }

  li :global(*) {
    hyphens: none;
  }
</style>
