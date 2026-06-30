<script lang="ts">
  import Section from "$lib/components/general/Section.svelte";

  import parque from "$lib/assets/Parque.jpg?enhanced";
  import ProjectTileList from "$lib/components/projects/ProjectTileList.svelte";
  import ContactCTA from "$lib/components/ContactCTA.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  const { data }: Props = $props();
</script>

<svelte:head>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Michael Helmbrecht",
      "url": "https://mrh.is",
      "jobTitle": "Product designer & developer",
      "sameAs": [
        "https://github.com/mrh-is",
        "https://www.instagram.com/mrh_is/",
        "https://www.linkedin.com/in/michaelhelmbrecht/"
      ]
    }
  </script>
</svelte:head>

<Section>
  <div class="main-stack">
    <div class="title-container">
      <h1>Hi! I’m Michael 👋🏻</h1>
      <p class="subtitle">
        I’m a product designer & developer based in Pittsburgh, PA.
      </p>
    </div>
    <div class="portrait">
      <enhanced:img
        fetchpriority="high"
        src={parque}
        alt="Me!"
        sizes="(max-width: 400px) 100vw, (max-width: 1000px) 80vw, 320px"
      />
    </div>
  </div>
  <p>I have a decade of experience helping startups build great products.</p>
  <p>
    I’ve been a designer, a developer (web & iOS), a product manager, & even a
    marketer. A real jack of all trades, tbh pretty good at most of them! But
    the synthesis is where the real magic happens.
  </p>
  <p>I’d love to help your team make amazing things.</p>
</Section>

<Section title="Call me if you:">
  <ul>
    <li>Want to build The Right Thing™, The Right Way™, the first time</li>
    <li>Want to work with one person who can do it all</li>
    <li>
      Like easy, clear communication and enjoy puns (you’re getting them either
      way)
    </li>
  </ul>
</Section>

<ContactCTA />

<Section>
  <p>Have a look at some of my work:</p>
  <ProjectTileList projects={data.projects} />
</Section>

<style>
  .main-stack {
    column-gap: 5rem;
    justify-content: space-between;
    align-items: center;
    margin-top: -1rem;
    margin-bottom: 2rem;
    display: flex;
  }

  .title-container {
    margin-top: -1rem;
    margin-bottom: -1rem;
  }

  .subtitle {
    margin-top: 2rem;
    font-size: 2rem;
    font-weight: 500;
  }

  .portrait {
    flex: none;
    width: 20rem;
    height: 20rem;
    border-radius: 100%;
    overflow: hidden;
  }

  .portrait :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 1000px) {
    .main-stack {
      flex-direction: column;
      row-gap: 3rem;
      margin-bottom: 5rem;
    }

    .portrait {
      width: 80%;
      height: auto;
      aspect-ratio: 1;
    }
  }

  @media (max-width: 400px) {
    .portrait {
      width: 100%;
    }
  }
</style>
