<script lang="ts">
  import FormattedText from "$lib/components/general/FormattedText.svelte";

  interface Props {
    title?: string;
    text: string;
  }

  const { title, text }: Props = $props();
</script>

<p>
  {#if title}
    <span class="title">{title}:</span>
  {/if}

  <FormattedText {text} />
</p>

<style>
  .title {
    font-weight: 600;
  }
</style>
