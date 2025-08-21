<script lang="ts">
  import { KnownQueries, watchMediaQuery } from "$lib/MediaQueryWatcher";

  interface Props {
    lightEmoji: string;
    darkEmoji: string;
  }

  const { lightEmoji, darkEmoji }: Props = $props();

  let isDark = $state(false);

  $effect.pre(() => {
    return watchMediaQuery(KnownQueries.DarkMode, (matches) => {
      isDark = matches;
    });
  });
</script>

{#if isDark}
  {darkEmoji}
{:else}
  {lightEmoji}
{/if}
