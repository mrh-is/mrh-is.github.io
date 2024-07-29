<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";

  export let href: HTMLAnchorAttributes["href"];
</script>

<a href={href} target="_blank">
  <slot /> ↗
</a>