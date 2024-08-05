<script lang="ts">
  import { page } from "$app/stores";
  import { PUBLIC_ORIGIN } from "$env/static/public";
  import { styleStringFromScheme } from "$lib/types/Colors";
  import BlobLayer from "$lib/components/blob/BlobLayer.svelte";
  import NavBar from "$lib/components/NavBar.svelte";

  export let data;

  import "$lib/assets/normalize.css";
  import "$lib/assets/styles.css";

  import { onMount } from "svelte";
  import watchForColorSchemeChanges from "$lib/faviconWatcher";

  onMount(() => {
    watchForColorSchemeChanges();
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://rsms.me/" />
  <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Sniglet:wght@400;800&display=swap"
    rel="stylesheet"
  />

  <title>{$page.data.title}</title>
  <link rel="canonical" href="{PUBLIC_ORIGIN}{$page.url.pathname}" />
</svelte:head>

<div class="page" style={styleStringFromScheme($page.data.colorScheme)}>
  <BlobLayer seed={$page.url.pathname} />

  <NavBar projects={data.projects} />

  <div class="content">
    <div class="container">
      <slot />
    </div>
  </div>
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
    position: relative;
  }

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
