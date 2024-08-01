<script lang="ts">
  import Section from "$lib/components/Section.svelte";
  import ProjectTile from "../lib/components/ProjectTile.svelte";

  import parque from "$lib/assets/Parque.jpg";

  export let data;
</script>

<Section>
  <div class="main-stack">
    <div class="title-container">
      <h1>Hi! I'm Michael 👋🏻</h1>
      <p class="subtitle">I'm a product designer based in Pittsburgh, PA.</p>
    </div>
    <img fetchpriority="high" src={parque} alt="Me!" />
  </div>
  <p>
    I've worked as a designer, a developer, a product manager, & even a
    marketer.
  </p>
  <p>
    My superpower is bringing all of these perspectives to every problem I
    tackle. I'd love to help your team make amazing things.
  </p>
</Section>

<Section>
  <p>Have a look at some of my work:</p>
  <div class="project-tiles">
    {#each data.projects as project}
      <ProjectTile {project} size="large" />
    {/each}
  </div>
</Section>

<Section>
  <p>
    For more details on my history, check out <a href="/timeline">my timeline</a
    >.
  </p>
  <p>My inbox is always open at <a href="mailto:me@mrh.is">me@mrh.is</a>!</p>
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

  .project-tiles {
    row-gap: 5rem;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem;
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
