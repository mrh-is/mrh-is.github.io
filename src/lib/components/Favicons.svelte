<script lang="ts">
  import { asset } from "$app/paths";
  import { watchMediaQuery, KnownQueries } from "#lib/MediaQueryWatcher.js";
  import { onMount } from "svelte";

  type ColorScheme = "light" | "dark";
  const sizes = [196, 128, 96, 32, 16] as const;
  let schemes = $state<ColorScheme[]>(["light", "dark"]);

  onMount(() => {
    return watchMediaQuery(KnownQueries.DarkMode, (matches) => {
      schemes = matches ? ["dark"] : ["light"];
    });
  });
</script>

{#snippet icon(scheme: ColorScheme, size: (typeof sizes)[number])}
  <link
    rel="icon"
    type="image/png"
    href={asset(
      `favicon/${scheme}/favicon-${size}x${size}.png` as Parameters<
        typeof asset
      >[0],
    )}
    sizes="{size}x{size}"
    media="(prefers-color-scheme: {scheme})"
  />
{/snippet}

{#key schemes}
  {#each schemes as scheme (scheme)}
    {#each sizes as size (size)}
      {@render icon(scheme, size)}
    {/each}
  {/each}
{/key}
