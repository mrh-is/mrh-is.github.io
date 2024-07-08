<script lang="ts">
  import { page } from "$app/stores";
  import { styleStringFromScheme } from "$lib/types/Colors";
  import NavBar from "$lib/components/NavBar.svelte";

  export let data;

  import "$lib/assets/normalize.css";
  import "$lib/assets/styles.css";
</script>

<svelte:head>
  <link rel="preconnect" href="https://rsms.me/" />
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

  <title>{$page.data.title}</title>
</svelte:head>

<div style={styleStringFromScheme($page.data.colorScheme)}>
  <NavBar projects={data.projects} />

  <div class="content">
    <div class="container">
      <slot />
    </div>
  </div>
</div>

<style>
  .content {
    min-height: 80vh;
    margin: 0 10vw 10vh;
  }

  .container {
    max-width: var(--max-width);
    margin-left: auto;
    margin-right: auto;
  }
</style>
