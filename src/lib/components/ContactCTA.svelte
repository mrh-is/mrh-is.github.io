<script lang="ts">
  import Section from "$lib/components/general/Section.svelte";
  import Button from "$lib/components/general/Button.svelte";
  import EmojiSwitcher from "$lib/components/general/EmojiSwitcher.svelte";

  interface Props {
    leadIn?: string;
  }

  const { leadIn = undefined }: Props = $props();
</script>

<Section>
  {#if leadIn}
    <p class="lead-in">{leadIn}</p>
  {/if}
  <div class="centerer">
    <Button href="mailto:me@mrh.is?subject=Let's%20work%20together!"
      >Let’s talk! <EmojiSwitcher lightEmoji="💌" darkEmoji="📬" /></Button
    >
  </div>
</Section>

<style>
  .lead-in {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .centerer {
    display: flex;
    justify-content: center;
  }
</style>
