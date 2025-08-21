<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes } from "svelte/elements";

  interface Props {
    href: HTMLAnchorAttributes["href"];
    children: Snippet;
  }

  const { href, children }: Props = $props();
</script>

<a {href} target="_blank">
  {@render children()} ↗
</a>
