<script lang="ts">
  import { page } from "$app/stores";
  import { PUBLIC_ORIGIN } from "$env/static/public";
  import { styleStringFromScheme } from "$lib/types/Colors";
  import BlobLayer from "$lib/components/blob/BlobLayer.svelte";
  import NavBar from "$lib/components/NavBar.svelte";

  import "$lib/assets/normalize.css";
  import "$lib/assets/styles.css";

  import { type Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import Favicons from "$lib/components/Favicons.svelte";
  import { onMount } from "svelte";

  interface Props {
    data: LayoutData;
    children: Snippet;
  }

  const { data, children }: Props = $props();

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-underline");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    // Observe all h2/h3 elements
    document.querySelectorAll("h2, h3").forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      observer.disconnect();
    };
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

  <title>
    {($page.data.title ?? "Michael Helmbrecht").replace(/\u00AD/g, "")}
  </title>
  <meta
    name="description"
    content={$page.data.description ??
      "Michael Helmbrecht \u2014 product designer & developer."}
  />
  <link rel="canonical" href="{PUBLIC_ORIGIN}{$page.url.pathname}" />

  <Favicons />
</svelte:head>

<div class="page" style={styleStringFromScheme($page.data.colorScheme)}>
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <BlobLayer seed={$page.url.pathname} />

  <NavBar projects={data.projects} />

  <main class="content" id="main-content">
    <div class="container">
      {@render children()}
    </div>
  </main>
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

  .skip-link {
    position: absolute;
    top: -100%;
    left: 1rem;
    z-index: 10;
    padding: 0.5rem 1.5rem;
    background: var(--background-color);
    border-radius: 0.5rem;
  }

  .skip-link:focus-visible {
    top: 1rem;
    outline: 3px solid var(--color-light-link);
    outline-offset: 3px;
  }
</style>
