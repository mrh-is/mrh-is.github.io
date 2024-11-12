<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";

  export let href: HTMLAnchorAttributes["href"];
</script>

<a {href} target="_blank">
  <slot /> ↗
</a>
