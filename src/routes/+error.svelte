<script lang="ts">
  import { page } from "$app/stores";
  import Button from "$lib/components/general/Button.svelte";
  import Section from "$lib/components/general/Section.svelte";
</script>

<Section
  title={$page.status === 404 ? "Page not found" : "Something went wrong"}
  headingLevel={1}
>
  {#if $page.error?.message && $page.error.message !== "Not Found"}
    <p>{$page.error.message}</p>
  {/if}
  <p>Let's get you back to safety:</p>
  <Button href="/">Take me home 🏠</Button>
</Section>
