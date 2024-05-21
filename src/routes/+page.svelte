<script lang="ts">
  import Section from "$lib/components/Section.svelte";
  import ProjectTile from './ProjectTile.svelte';
	
	export let data;
</script>

<Section>
  <div class="h-stack">
    <div class="title-container">
      <h1>
        Hi! I'm Michael 👋🏻
      </h1>
      <p class="subtitle">
        I'm a product designer based in Pittsburgh, PA.
      </p>
    </div>
    <img
      src="https://assets-global.website-files.com/644f069ff64cdc5300138063/6452b610f49a380e813264ee_Moi.jpg"
      loading="eager"
      sizes="(max-width: 479px) 80vw, 320px"
      srcset="https://assets-global.website-files.com/644f069ff64cdc5300138063/6452b610f49a380e813264ee_Moi-p-500.jpg 500w, https://assets-global.website-files.com/644f069ff64cdc5300138063/6452b610f49a380e813264ee_Moi.jpg 640w"
      alt="Me!"
      class="me-photo"
    >
  </div>
  <p>
    I've worked as a designer, a developer, a product manager, & even a marketer. My superpower is bringing all of these perspectives to every problem I tackle. I'd love to help your team make amazing things.
  </p>
</Section>

<Section>
  <p>Have a look at some of my work:</p>
  <div class="project-tiles">
    {#each data.projects as project}
      <ProjectTile {project} />
    {/each}
  </div>
</Section>

<Section>
  <p>For more details on my history, check out <a href="/timeline">my timeline</a>.</p>
  <p>My inbox is always open at <a href="mailto:me@mrh.is">me@mrh.is</a>!</p>
</Section>

<style>
  :root {
    --link-color: #970049;
  }

  .h-stack {
    grid-column-gap: 5rem;
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
    line-height: 150%;
  }

  img {
    border-radius: 100%;
    flex: none;
    width: 20rem;
    height: 20rem;
  }

  .project-tiles {
    grid-row-gap: 5rem;
    flex-direction: column;
    align-items: center;
    margin-top: 3rem;
    display: flex;
  }
</style>
