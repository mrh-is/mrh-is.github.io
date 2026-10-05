<script lang="ts">
  import { onMount } from "svelte";
  import Section from "#lib/components/general/Section.svelte";
  import Button from "#lib/components/general/Button.svelte";
  import EmojiSwitcher from "#lib/components/general/EmojiSwitcher.svelte";
  import { mailtoHref } from "#lib/utils/email.js";

  interface Props {
    leadIn?: string;
  }

  const { leadIn = undefined }: Props = $props();

  let emailHref = $state<string>();
  onMount(() => {
    emailHref = mailtoHref("Let’s work together!");
  });
</script>

<Section>
  {#if leadIn}
    <p class="lead-in">{leadIn}</p>
  {/if}
  <div class="centerer">
    <Button href={emailHref}
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
