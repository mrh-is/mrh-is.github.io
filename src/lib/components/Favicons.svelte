<script lang="ts">
  import { assets } from "$app/paths";
  import { watchMediaQuery, KnownQueries } from "$lib/MediaQueryWatcher";
  import { onMount } from "svelte";

  type ColorScheme = "light" | "dark";
  let schemes = $state<ColorScheme[]>(["light", "dark"]);

  onMount(() => {
    return watchMediaQuery(KnownQueries.DarkMode, (matches) => {
      schemes = matches ? ["dark"] : ["light"];
    });
  });
</script>

{#snippet icon(scheme: ColorScheme, size: number)}
  <link
    rel="icon"
    type="image/png"
    href="{assets}/favicon/{scheme}/favicon-{size}x{size}.png"
    sizes="{size}x{size}"
    media="(prefers-color-scheme: {scheme})"
  />
{/snippet}

{#key schemes}
  {#each schemes as scheme}
    {#each [196, 128, 96, 32, 16] as size}
      {@render icon(scheme, size)}
    {/each}
  {/each}
{/key}
