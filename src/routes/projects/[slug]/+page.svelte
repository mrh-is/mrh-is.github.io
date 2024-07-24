<script lang="ts">
  import Section from "$lib/components/Section.svelte";
  import type { Project } from "$lib/types/Project";
  import ProjectTile from "../../ProjectTile.svelte";
  import ContentBlock from "./blocks/ContentBlock.svelte";

  export let data;
  let project: Project;

  $: project = data.project;
</script>

<Section title={project.title} subtitle={project.tagline}>
  {#each project.content as block}
    <ContentBlock content={block} />
  {/each}
</Section>

<Section>
  <p>While you're here, check out some other projects:</p>
  <div class="project-tiles">
    {#each data.otherProjects as otherProject}
      <ProjectTile project={otherProject} size="small" />
    {/each}
  </div>
</Section>

<style>
  .project-tiles {
    display: flex;
    column-gap: 5rem;
    justify-content: center;
    margin-top: 3rem;
  }
</style>
