<script lang="ts">
  import Section from "$lib/components/general/Section.svelte";

  import parque from "$lib/assets/Parque.jpg";
  import Icon from "$lib/components/general/Icon.svelte";
  import Button from "$lib/components/general/Button.svelte";
  import EmojiSwitcher from "$lib/components/general/EmojiSwitcher.svelte";
  import ProjectTileList from "$lib/components/projects/ProjectTileList.svelte";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  const { data }: Props = $props();
</script>

<Section>
  <div class="main-stack">
    <div class="title-container">
      <h1>Hi! I’m Michael 👋🏻</h1>
      <p class="subtitle">
        I’m a product designer & developer based in Pittsburgh, PA.
      </p>
    </div>
    <img fetchpriority="high" src={parque} alt="Me!" />
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

<Section>
  <div class="centerer">
    <Button href="mailto:me@mrh.is?subject=Let’s%20work%20together!"
      >Let’s talk! <EmojiSwitcher lightEmoji="💌" darkEmoji="📬" /></Button
    >
  </div>
</Section>

<Section>
  <p>Have a look at some of my work:</p>
  <ProjectTileList projects={data.projects} />
</Section>

<Section>
  <div class="icon-set">
    <a href="https://github.com/mrh-is">
      <Icon name="GitHub" size={40} />
    </a>
    <a href="https://www.instagram.com/mrh_is/">
      <Icon name="Instagram" size={40} />
    </a>
    <a href="https://www.linkedin.com/in/michaelhelmbrecht/">
      <Icon name="LinkedIn" size={40} />
    </a>
  </div>
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

  img {
    border-radius: 100%;
    flex: none;
    width: 20rem;
    height: 20rem;
  }

  .centerer {
    justify-content: center;
    display: flex;
  }

  .icon-set {
    column-gap: 2rem;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    display: flex;
  }

  @media (max-width: 1000px) {
    .main-stack {
      flex-direction: column;
      row-gap: 3rem;
      margin-bottom: 5rem;
    }

    img {
      width: 80%;
      height: 80%;
    }
  }

  @media (max-width: 400px) {
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
