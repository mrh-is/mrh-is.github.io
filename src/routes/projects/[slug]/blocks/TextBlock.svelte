<script lang="ts">
  interface Props {
    title?: string;
    text: string;
  }

  let { title, text }: Props = $props();
</script>

<p>
  {#if title}
    <span class="title">{title}:</span>
  {/if}

  <!-- Only I'm providing this data, should be safe -->
  <!-- eslint-disable svelte/no-at-html-tags -->
  {@html text}
</p>

<style>
  .title {
    font-weight: 400;
  }
</style>
