<script lang="ts">
  interface Props {
    lightEmoji: string;
    darkEmoji: string;
  }

  let { lightEmoji, darkEmoji }: Props = $props();

  let isDark = $state(false);

  function updateTheme(e?: MediaQueryListEvent) {
    isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // Set initial value
  $effect.pre(() => {
    if (typeof window !== "undefined") {
      updateTheme();
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateTheme);
    }
  });
</script>

{#if isDark}
  {darkEmoji}
{:else}
  {lightEmoji}
{/if}
