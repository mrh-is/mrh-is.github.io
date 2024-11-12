<script lang="ts">
  export let lightEmoji: string;
  export let darkEmoji: string;

  let isDark = false;

  function updateTheme(e?: MediaQueryListEvent) {
    isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // Set initial value
  $: if (typeof window !== "undefined") {
    updateTheme();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateTheme);
  }
</script>

{#if isDark}
  {darkEmoji}
{:else}
  {lightEmoji}
{/if}
